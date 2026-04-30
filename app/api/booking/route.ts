import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sendEmail } from "@/lib/email";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "booking-requests.json");
const AVAILABILITY_FILE = path.join(process.cwd(), "availability.json");

type BookingStatus = "PENDING_PAYMENT" | "NEW" | "APPROVED" | "DECLINED";

type PaymentStatus = "UNPAID" | "PAID";

type BookingRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  selectedDate: string;
  selectedSlot: string;
  addOns?: string[];
  photos?: string[];

  status: BookingStatus;
  paymentStatus: PaymentStatus;

  totalEstimate: number | null;
  depositAmount: number | null;

  createdAt: string;
  updatedAt: string;

  reminderSent?: boolean;
};

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(BOOKINGS_FILE)) fs.writeFileSync(BOOKINGS_FILE, "[]");
  if (!fs.existsSync(AVAILABILITY_FILE))
    fs.writeFileSync(AVAILABILITY_FILE, "{}");
}

function readBookings(): BookingRequest[] {
  ensureStorage();
  try {
    return JSON.parse(fs.readFileSync(BOOKINGS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeBookings(bookings: BookingRequest[]) {
  ensureStorage();
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

function readAvailability(): Record<
  string,
  { status: string; slots: string[] }
> {
  ensureStorage();
  try {
    return JSON.parse(fs.readFileSync(AVAILABILITY_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeAvailability(
  availability: Record<string, { status: string; slots: string[] }>,
) {
  ensureStorage();
  fs.writeFileSync(AVAILABILITY_FILE, JSON.stringify(availability, null, 2));
}

export async function GET() {
  const bookings = readBookings();

  return NextResponse.json({
    ok: true,
    bookings,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      address,
      notes,
      selectedDate,
      selectedSlot,
      addOns,
      photos,
    } = body;

    if (!name || !email || !phone || !selectedDate || !selectedSlot) {
      return NextResponse.json(
        { ok: false, message: "Missing required booking information." },
        { status: 400 }
      );
    }

    const bookings = readBookings();
    const now = new Date().toISOString();

    const booking: BookingRequest = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      address: address || "",
      notes: notes || "",
      selectedDate,
      selectedSlot,
      addOns: Array.isArray(addOns) ? addOns : [],
      photos: Array.isArray(photos) ? photos : [],
      reminderSent: false,

      status: "PENDING_REVIEW" as BookingStatus,
      paymentStatus: "UNPAID",

      totalEstimate: null,
      depositAmount: null,

      createdAt: now,
      updatedAt: now,
    };

    bookings.unshift(booking);

    try {
      writeBookings(bookings);
    } catch (err) {
      console.error("Write failed (expected on Vercel):", err);
    }

    try {
      await sendEmail({
        to: booking.email,
        subject: "Booking Request Received – Maid in Dixie Cleaning Services",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color:#d95f91;">Booking Request Received</h2>
        <p>Hi ${booking.name},</p>
        <p>We’ve received your cleaning request and it is currently under review.</p>
        <ul>
          <li><strong>Date:</strong> ${booking.selectedDate}</li>
          <li><strong>Time:</strong> ${booking.selectedSlot}</li>
        </ul>
      </div>
    `,
      });

      await sendEmail({
        to: "spencerd892@gmail.com",
        subject: "🚨 New Booking Request - Maid in Dixie",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Date:</strong> ${booking.selectedDate}</p>
        <p><strong>Time:</strong> ${booking.selectedSlot}</p>
      </div>
    `,
      });

    } catch (err) {
      console.error("Email failed but booking saved:", err);
    }

    return NextResponse.json({
      ok: true,
      message: "Booking request submitted.",
      booking,
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to save booking request." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, paymentStatus, totalEstimate, depositAmount } = body;

    const bookings = readBookings();
    const index = bookings.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { ok: false, message: "Booking request not found." },
        { status: 404 }
      );
    }

    const booking = bookings[index];

    if (paymentStatus === "PAID") {
      booking.paymentStatus = "PAID";
      booking.status = "NEW";
      booking.updatedAt = new Date().toISOString();

      try {
        bookings[index] = booking;
        writeBookings(bookings);
      } catch (err) {
        console.error("Write failed (expected on Vercel):", err);
      }

      await sendEmail({
        to: booking.email,
        subject: "Payment Received",
        html: `<p>Deposit received for ${booking.selectedDate}</p>`,
      });

      return NextResponse.json({
        ok: true,
        message: "Payment recorded.",
        booking,
      });
    }

    const normalizedStatus =
      typeof status === "string" ? status.toUpperCase() : null;

    if (
      normalizedStatus &&
      !["NEW", "APPROVED", "DECLINED", "PENDING_PAYMENT", "PENDING_REVIEW"].includes(
        normalizedStatus
      )
    ) {
      return NextResponse.json(
        { ok: false, message: "Invalid booking status." },
        { status: 400 }
      );
    }

    if (normalizedStatus === "APPROVED" && booking.paymentStatus !== "PAID") {
      return NextResponse.json(
        { ok: false, message: "Deposit has not been paid." },
        { status: 400 }
      );
    }

    if (normalizedStatus === "APPROVED" && booking.status !== "APPROVED") {
      const availability = readAvailability();
      const day = availability[booking.selectedDate];

      if (day && Array.isArray(day.slots)) {
        if (day.slots.includes(booking.selectedSlot)) {
          const remainingSlots = day.slots.filter(
            (slot) => slot !== booking.selectedSlot
          );

          availability[booking.selectedDate] = {
            status: remainingSlots.length === 0 ? "booked" : "available",
            slots: remainingSlots,
          };

          writeAvailability(availability);
        }
      }

      await sendEmail({
        to: booking.email,
        subject: "Your Cleaning Appointment is Confirmed ✨",
        html: `...`,
      });
    }

    if (normalizedStatus === "DECLINED") {
      bookings.splice(index, 1);
      writeBookings(bookings);

      return NextResponse.json({
        ok: true,
        message: "Booking removed.",
      });
    }

    if (normalizedStatus) {
      booking.status = normalizedStatus as BookingStatus;
    }

    if (typeof totalEstimate === "number") {
      booking.totalEstimate = totalEstimate;
    }

    if (typeof depositAmount === "number") {
      booking.depositAmount = depositAmount;
    }

    booking.updatedAt = new Date().toISOString();

    try {
      bookings[index] = booking;
      writeBookings(bookings);
    } catch (err) {
      console.error("Write failed (expected on Vercel):", err);
    }

    return NextResponse.json({
      ok: true,
      message: "Booking updated.",
      booking,
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to update booking." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    const bookings = readBookings();
    const updated = bookings.filter((b) => b.id !== id);

    writeBookings(updated);

    return NextResponse.json({
      ok: true,
      message: "Booking deleted.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to delete booking." },
      { status: 500 }
    );
  }
}