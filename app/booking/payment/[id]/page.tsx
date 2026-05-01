"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Booking = {
    id: string;
    name: string;
    email: string;
    selectedDate: string;
    selectedSlot: string;
    addOns: string[];
    totalEstimate: number | null;
    depositAmount: number | null;
    paymentStatus?: string;
};

const SQUARE_LINK = "https://square.link/u/ERNQ5DGs";

export default function PaymentPage() {
    const params = useParams();
    const bookingId = params.id as string;

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBooking() {
            const res = await fetch("/api/booking", { cache: "no-store" });
            const data = await res.json();

            const bookingsArray = Array.isArray(data)
                ? data
                : data.bookings;

            const found = bookingsArray.find(
                (b: Booking) => b.id === bookingId
            );

            setBooking(found || null);
            setLoading(false);
        }

        if (bookingId) fetchBooking();
    }, [bookingId]);

    // 🔄 AUTO POLL FOR PAYMENT UPDATE
    useEffect(() => {
        if (!bookingId) return;

        const interval = setInterval(async () => {
            const res = await fetch("/api/booking", { cache: "no-store" });
            const data = await res.json();

            const bookingsArray = Array.isArray(data)
                ? data
                : data.bookings;

            const updated = bookingsArray.find(
                (b: Booking) => b.id === bookingId
            );

            if (updated) {
                setBooking(updated);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Booking not found.
            </div>
        );
    }

    const remaining =
        booking.totalEstimate && booking.depositAmount
            ? booking.totalEstimate - booking.depositAmount
            : null;

    const isPaid = booking.paymentStatus === "PAID";

    return (
        <section className="min-h-screen bg-[#fff7f8] py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="text-center">
                    <h1 className="text-3xl font-serif text-[#2d1b21]">
                        Complete Your Payment
                    </h1>
                    <p className="text-[#7a4b57] mt-2">
                        Secure your appointment to lock in your date
                    </p>
                </div>

                {/* BOOKING DETAILS */}
                <div className="bg-white rounded-3xl shadow-xl border p-6 space-y-3">
                    <p><strong>Name:</strong> {booking.name}</p>
                    <p><strong>Date:</strong> {booking.selectedDate}</p>
                    <p><strong>Time:</strong> {booking.selectedSlot}</p>
                </div>

                {/* PRICING */}
                <div className="bg-white rounded-3xl shadow-xl border p-6 space-y-2">
                    <p><strong>Total:</strong> ${booking.totalEstimate}</p>
                    <p className="text-[#d95f91] font-bold">
                        Deposit (50%): ${booking.depositAmount}
                    </p>

                    {remaining !== null && (
                        <p className="text-gray-600">
                            Remaining Balance: ${remaining}
                        </p>
                    )}
                </div>

                {/* DEPOSIT SECTION */}
                <div className="bg-white rounded-3xl shadow-xl border p-6 space-y-4">
                    <h2 className="text-xl font-semibold">
                        Pay Deposit
                    </h2>

                    {!isPaid && (
                        <>
                            <p className="text-sm text-gray-600">
                                Please pay your deposit of{" "}
                                <strong>${booking.depositAmount}</strong>.
                            </p>

                            <p className="text-xs text-gray-500">
                                Enter this exact amount on the Square payment page.
                            </p>

                            <a
                                href={SQUARE_LINK}
                                target="_blank"
                                className="block text-center py-3 rounded-xl bg-[#d95f91] text-white font-semibold"
                            >
                                Pay Deposit
                            </a>

                            <p className="text-sm text-gray-500 mt-2">
                                Waiting for payment confirmation...
                            </p>
                        </>
                    )}

                    {isPaid && (
                        <div className="text-green-600 font-semibold text-center">
                            Deposit Paid ✅ Your booking is secured.
                        </div>
                    )}
                </div>

                {/* REMAINING BALANCE */}
                {remaining !== null && (
                    <div className="bg-white rounded-3xl shadow-xl border p-6 space-y-4">
                        <h2 className="text-xl font-semibold">
                            Pay Remaining Balance
                        </h2>

                        <p className="text-sm text-gray-600">
                            Remaining balance: <strong>${remaining}</strong>
                        </p>

                        <a
                            href={SQUARE_LINK}
                            target="_blank"
                            className="block text-center py-3 rounded-xl bg-black text-white font-semibold"
                        >
                            Pay Remaining Balance
                        </a>
                    </div>
                )}

            </div>
        </section>
    );
}