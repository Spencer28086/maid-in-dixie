export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

type BookingStatus =
  | "PENDING_PAYMENT"
  | "NEW"
  | "APPROVED"
  | "DECLINED"
  | "PENDING_REVIEW";

type PaymentStatus = "UNPAID" | "PAID";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  console.log("📦 GET BOOKINGS:", bookings);

  return NextResponse.json({
    ok: true,
    bookings,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("🔥 INCOMING BOOKING BODY:", body);

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
      console.log("❌ VALIDATION FAILED");
      return NextResponse.json(
        { ok: false, message: "Missing required booking information." },
        { status: 400 }
      );
    }

    console.log("🧠 ATTEMPTING TO SAVE BOOKING...");

    let booking;

    try {
      booking = await prisma.booking.create({
        data: {
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

          status: "PENDING_REVIEW",
          paymentStatus: "UNPAID",

          totalEstimate: null,
          depositAmount: null,
        },
      });

      console.log("✅ BOOKING SAVED SUCCESSFULLY:", booking);
    } catch (dbErr) {
      console.error("❌ PRISMA CREATE FAILED:", dbErr);

      return NextResponse.json(
        { ok: false, message: "Database save failed." },
        { status: 500 }
      );
    }

    try {
      // ==========================
      // 1. CUSTOMER EMAIL
      // ==========================
      await sendEmail({
        to: booking.email,
        subject: "We Received Your Booking Request – Maid in Dixie",
        html: `
    <div style="font-family: Arial; padding:20px;">
      <h2 style="color:#d95f91;">You're Booked (Almost 😉)</h2>

      <p>Hi ${booking.name},</p>

      <p>We received your cleaning request and it's currently under review.</p>

      <p><strong>Date:</strong> ${booking.selectedDate}</p>
      <p><strong>Time:</strong> ${booking.selectedSlot}</p>

      <p>We’ll review your request shortly and send over your deposit link.</p>

      <p style="margin-top:20px;">— Maid in Dixie Cleaning Services</p>
    </div>
  `,
      });


      // ==========================
      // 2. BUSINESS EMAIL (YOUR CLIENT)
      // ==========================
      await sendEmail({
        to: "maidindixiecleaningservices@gmail.com",
        subject: "🚨 New Booking Request",
        html: `
    <div style="font-family: Arial; padding:20px;">
      <h2>New Booking Request</h2>

      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>

      <p><strong>Date:</strong> ${booking.selectedDate}</p>
      <p><strong>Time:</strong> ${booking.selectedSlot}</p>

      <p><strong>Address:</strong> ${booking.address || "N/A"}</p>
      <p><strong>Notes:</strong> ${booking.notes || "None"}</p>

      <p><strong>Add-ons:</strong><br/>
        ${(booking.addOns || []).join("<br/>")}
      </p>

      <p style="margin-top:20px;">— System Notification</p>
    </div>
  `,
      });

      console.log("📧 EMAILS SENT (CLIENT + BUSINESS)");
    } catch (err) {
      console.error("⚠️ Email failed but booking saved:", err);
    }

    return NextResponse.json({
      ok: true,
      message: "Booking request submitted.",
      booking,
    });
  } catch (err) {
    console.error("💥 POST ROUTE CRASH:", err);

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

    console.log("✏️ PATCH REQUEST:", body);

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { ok: false, message: "Booking request not found." },
        { status: 404 }
      );
    }

    if (paymentStatus === "PAID") {
      const updated = await prisma.booking.update({
        where: { id },
        data: {
          paymentStatus: "PAID",
          status: "NEW",
        },
      });

      await sendEmail({
        to: booking.email,
        subject: "Payment Received",
        html: `<p>Deposit received for ${booking.selectedDate}</p>`,
      });

      return NextResponse.json({
        ok: true,
        message: "Payment recorded.",
        booking: updated,
      });
    }

    if (status === "DECLINED") {
      await prisma.booking.delete({
        where: { id },
      });

      return NextResponse.json({
        ok: true,
        message: "Booking removed.",
      });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: status || booking.status,
        totalEstimate:
          typeof totalEstimate === "number"
            ? totalEstimate
            : booking.totalEstimate,
        depositAmount:
          typeof depositAmount === "number"
            ? depositAmount
            : booking.depositAmount,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Booking updated.",
      booking: updated,
    });
  } catch (err) {
    console.error("💥 PATCH ERROR:", err);

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

    console.log("🗑️ DELETE REQUEST:", id);

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({
      ok: true,
      message: "Booking deleted.",
    });
  } catch (err) {
    console.error("💥 DELETE ERROR:", err);

    return NextResponse.json(
      { ok: false, message: "Unable to delete booking." },
      { status: 500 }
    );
  }
}