"use client";

import { useEffect, useState } from "react";

type BookingStatus =
  | "NEW"
  | "APPROVED"
  | "DECLINED"
  | "PENDING_PAYMENT"
  | "PENDING_REVIEW";

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  selectedDate: string;
  selectedSlot: string;
  addOns?: string[];
  status: BookingStatus;
  totalEstimate?: number | null;
  depositAmount?: number | null;
  paymentStatus?: "UNPAID" | "PAID";
  reminderSent?: boolean;
  createdAt?: string;
  photos?: string[];
};

type Availability = Record<string, { status: string; slots: string[] }>;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availability, setAvailability] = useState<Availability>({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<
    "ALL" | "NEW" | "APPROVED" | "DECLINED" | "PENDING_PAYMENT" | "PENDING_REVIEW"
  >("ALL");

  async function loadData() {
    try {
      const [bookingRes, availabilityRes] = await Promise.all([
        fetch("/api/booking", { cache: "no-store" }),
        fetch("/api/availability", { cache: "no-store" }),
      ]);

      const bookingData = await bookingRes.json();
      const availabilityData = await availabilityRes.json();

      setBookings(bookingData.bookings || []);
      setAvailability(availabilityData.availability || {});
    } catch {
      alert("Failed to load booking requests.");
    } finally {
      setLoading(false);
    }
  }

  async function sendReminders() {
    try {
      const res = await fetch("/api/send-reminders", {
        cache: "no-store",
      });

      const data = await res.json();

      alert(
        `Reminders sent: ${data.sent ?? 0}\nChecked: ${data.checked ?? 0}\nSkipped: ${data.skipped ?? 0}`,
      );

      await loadData();
    } catch {
      alert("Failed to send reminders.");
    }
  }

  async function updateStatus(id: string, status: BookingStatus) {
    setUpdatingId(id);

    try {
      const res = await fetch("/api/booking", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();

      if (!data.ok) {
        alert(data.message || "Failed to update booking.");
        return;
      }

      await loadData();
    } catch {
      alert("Error updating booking.");
    } finally {
      setUpdatingId(null);
    }
  }

  function handlePriceChange(id: string, value: string) {
    setPrices((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  }

  async function sendDepositRequest(id: string) {
    const booking = bookings.find((b) => b.id === id);
    const total = prices[id] ?? booking?.totalEstimate ?? 0;

    if (!total || total <= 0) {
      alert("Enter a valid price first.");
      return;
    }

    const deposit = Math.round(total * 0.5);

    const res = await fetch("/api/booking", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        totalEstimate: total,
        depositAmount: deposit,
        status: "PENDING_PAYMENT",
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.message || "Failed to save deposit request.");
      return;
    }

    const emailRes = await fetch("/api/email/send-deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId: id,
      }),
    });

    const emailData = await emailRes.json();

    if (!emailData.ok) {
      alert(emailData.message || "Deposit saved, but email failed to send.");
      await loadData();
      return;
    }

    alert("Deposit request sent!");
    await loadData();
  }

  useEffect(() => {
    loadData();

    const timer = setInterval(loadData, 15000);
    return () => clearInterval(timer);
  }, []);

  const filteredBookings =
    filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <main className="min-h-screen bg-[#fff7f8] p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-serif mb-6">Booking Requests</h1>

        <div className="mb-6">
          <button
            onClick={sendReminders}
            className="px-4 py-2 bg-[#d95f91] text-white rounded-lg font-semibold"
          >
            Send 48hr Reminders
          </button>
        </div>

        <div className="mb-6 flex gap-2 flex-wrap">
          {[
            "ALL",
            "PENDING_REVIEW",
            "NEW",
            "APPROVED",
            "DECLINED",
            "PENDING_PAYMENT",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold ${filter === item
                ? "bg-[#d95f91] text-white"
                : "bg-white border"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-sm bg-white rounded-xl overflow-hidden">
            <thead className="bg-[#fff0f5] text-left">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => {
                const isUpdating = updatingId === booking.id;
                const currentTotal =
                  prices[booking.id] ?? booking.totalEstimate ?? "";

                return (
                  <tr key={booking.id} className="border-t">
                    <td className="p-4 align-top">
                      <div className="font-bold">{booking.name}</div>
                      <div className="text-xs">{booking.email}</div>

                      {/* CLIENT PHOTOS */}
                      {booking.photos && booking.photos.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">
                            Client Photos
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {booking.photos.map((src: string, i: number) => (
                              <a
                                key={i}
                                href={src}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={src}
                                  alt="client upload"
                                  className="w-16 h-16 object-cover rounded-lg border hover:scale-105 transition"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="p-4">{booking.selectedDate}</td>
                    <td className="p-4">{booking.selectedSlot}</td>

                    <td className="p-4">
                      <span className="text-xs font-bold">
                        {booking.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap mb-3">
                        <button
                          onClick={() => updateStatus(booking.id, "APPROVED")}
                          disabled={
                            isUpdating ||
                            booking.status === "APPROVED" ||
                            booking.paymentStatus !== "PAID"
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded-full text-xs disabled:opacity-50"
                        >
                          {booking.paymentStatus !== "PAID" ? "Awaiting Payment" : "Approve"}
                        </button>

                        <button
                          onClick={() => updateStatus(booking.id, "DECLINED")}
                          disabled={isUpdating || booking.status === "DECLINED"}
                          className="bg-red-500 text-white px-3 py-1 rounded-full text-xs disabled:opacity-50"
                        >
                          Decline
                        </button>

                        <button
                          onClick={() => updateStatus(booking.id, "NEW")}
                          disabled={isUpdating}
                          className="border px-3 py-1 rounded-full text-xs disabled:opacity-50"
                        >
                          Reset
                        </button>
                      </div>
                      <div className="mt-4">
                        <input
                          type="number"
                          placeholder="Total Price ($)"
                          className="mb-2 w-full border rounded-lg p-2 text-sm"
                          value={currentTotal}
                          disabled={
                            booking.status === "PENDING_PAYMENT" ||
                            booking.paymentStatus === "PAID"
                          }
                          onChange={(e) =>
                            handlePriceChange(booking.id, e.target.value)
                          }
                        />

                        {booking.paymentStatus === "PAID" && (
                          <div className="text-xs text-green-600 font-semibold">
                            Deposit already paid — pricing locked
                          </div>
                        )}

                        {booking.status === "PENDING_PAYMENT" &&
                          booking.paymentStatus !== "PAID" && (
                            <div className="text-xs text-blue-600 font-semibold">
                              Waiting for client to pay deposit
                            </div>
                          )}

                        {currentTotal !== "" && (
                          <div className="text-xs text-gray-600 mb-2">
                            Deposit: $
                            {Math.round(Number(currentTotal) * 0.5)}
                          </div>
                        )}

                        <button
                          onClick={() => sendDepositRequest(booking.id)}
                          disabled={
                            booking.status === "PENDING_PAYMENT" ||
                            booking.paymentStatus === "PAID"
                          }
                          className={`w-full py-2 rounded-full text-xs font-bold ${booking.status === "PENDING_PAYMENT"
                            ? "bg-blue-400 text-white cursor-not-allowed"
                            : booking.paymentStatus === "PAID"
                              ? "bg-green-500 text-white cursor-not-allowed"
                              : "bg-[#d95f91] text-white hover:bg-[#c94f82]"
                            }`}
                        >
                          {booking.paymentStatus === "PAID"
                            ? "Deposit Paid"
                            : booking.status === "PENDING_PAYMENT"
                              ? "Deposit Sent"
                              : "Send Deposit Request"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}