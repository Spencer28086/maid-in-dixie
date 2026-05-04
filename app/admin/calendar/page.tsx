"use client";

import { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";

export default function AdminCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availability, setAvailability] = useState<any>({});
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDayBookings, setSelectedDayBookings] = useState<any[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  async function loadData() {
    const [availabilityRes, bookingRes] = await Promise.all([
      fetch("/api/availability", { cache: "no-store" }),
      fetch("/api/booking", { cache: "no-store" }),
    ]);

    const availabilityData = await availabilityRes.json();
    const bookingData = await bookingRes.json();

    setAvailability(availabilityData.availability || availabilityData);
    setBookings(bookingData.bookings || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  function selectDay(date: Date) {
    const key = format(date, "yyyy-MM-dd");
    setSelectedDate(key);

    const day = availability[key];
    setSlots(day?.slots || []);

    const dayBookings = bookings.filter((b) => b.selectedDate === key);
    setSelectedDayBookings(dayBookings);
  }

  function addSlot() {
    if (!newSlot) return;
    if (slots.includes(newSlot)) return;

    setSlots([...slots, newSlot].sort());
    setNewSlot("");
  }

  function removeSlot(slot: string) {
    setSlots(slots.filter((s) => s !== slot));
  }

  async function saveSlots() {
    if (!selectedDate) return;

    await fetch("/api/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: selectedDate,
        status: "available",
        slots: slots,
      }),
    });

    await loadData();
    alert("Saved!");
  }

  async function updateBookingStatus(id: string, status: string) {
    await fetch("/api/booking", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    await loadData();

    if (selectedDate) {
      const res = await fetch("/api/booking", { cache: "no-store" });
      const data = await res.json();

      const dayBookings = (data.bookings || []).filter(
        (b: any) => b.selectedDate === selectedDate,
      );

      setSelectedDayBookings(dayBookings);
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-serif mb-6">Calendar Availability</h1>

      {/* MONTH NAV */}
      <div className="flex justify-between mb-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          ←
        </button>
        <h2 className="font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          →
        </button>
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const isSelected = selectedDate === key;

          const dayData = availability[key];
          const slotCount = dayData?.slots?.length || 0;

          const dayBookings = bookings.filter((b) => b.selectedDate === key);

          const hasApproved = dayBookings.some((b) => b.status === "APPROVED");
          const hasPending = dayBookings.some((b) => b.status === "NEW");

          const isBooked = dayData?.status === "booked";

          const isUnavailable = slotCount === 0;

          let bg = "bg-white text-gray-800";

          if (hasApproved) bg = "bg-red-300 text-red-900";
          else if (hasPending) bg = "bg-yellow-200 text-yellow-900";
          else if (slotCount > 0) bg = "bg-green-100 text-green-800";

          if (isSelected) bg = "bg-pink-500 text-white";

          return (
            <button
              key={key}
              onClick={() => !isBooked && selectDay(day)}
              disabled={isBooked}
              className={`
                relative py-2 rounded-lg border
                ${bg}
                ${isBooked ? "bg-red-400 text-white cursor-not-allowed opacity-70" : "hover:shadow"}
                ${isUnavailable && !isSelected ? "opacity-50" : ""}
              `}
            >
              {format(day, "d")}

              {/* SLOT COUNT */}
              {slotCount > 0 && !isSelected && (
                <span className="absolute bottom-1 right-1 text-xs bg-white px-1 rounded">
                  {slotCount}
                </span>
              )}

              {/* UNAVAILABLE LABEL */}
              {isUnavailable && !isSelected && !isBooked && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-gray-200 text-gray-600 px-1 rounded">
                  Unavailable
                </span>
              )}

              {/* LOCK ICON */}
              {isBooked && (
                <span className="absolute top-1 right-1 text-xs">🔒</span>
              )}
            </button>
          );
        })}
      </div>

      {/* DAY EDITOR */}
      {selectedDate && availability[selectedDate]?.status !== "booked" && (
        <div className="border p-6 rounded-xl bg-white shadow">
          <h2 className="mb-4 font-bold">{selectedDate}</h2>

          {/* SLOTS */}
          <div className="flex flex-wrap gap-2 mb-4">
            {slots.map((slot) => (
              <div
                key={slot}
                className="px-3 py-1 bg-pink-100 rounded-full flex gap-2"
              >
                {slot}
                <button onClick={() => removeSlot(slot)}>✕</button>
              </div>
            ))}
          </div>

          {/* ADD SLOT */}
          <div className="flex gap-2 mb-4">
            <select
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="">Select time</option>
              {generateTimeOptions().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>

            <button
              onClick={addSlot}
              disabled={!newSlot || slots.includes(newSlot)}
              className="bg-pink-500 text-white px-4 rounded disabled:opacity-50"
            >
              Add
            </button>
          </div>

          <button
            onClick={saveSlots}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Save Changes
          </button>

          {/* BOOKINGS */}
          {selectedDayBookings.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold mb-3">Bookings</h3>

              {selectedDayBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3 border rounded-lg flex justify-between mb-2"
                >
                  <div>
                    {b.name} — {b.selectedSlot}
                    <div className="text-xs">{b.status}</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateBookingStatus(b.id, "APPROVED")}
                      className="bg-green-500 text-white px-2 rounded"
                    >
                      ✔
                    </button>

                    <button
                      onClick={() => updateBookingStatus(b.id, "DECLINED")}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

function generateTimeOptions() {
  const times: string[] = [];

  for (let hour = 8; hour <= 18; hour++) {
    for (let min of [0, 30]) {
      const h = hour > 12 ? hour - 12 : hour;
      const suffix = hour >= 12 ? "PM" : "AM";
      const m = min === 0 ? "00" : "30";

      times.push(`${h}:${m} ${suffix}`);
    }
  }

  return times;
}