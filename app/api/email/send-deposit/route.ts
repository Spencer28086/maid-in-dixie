import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sendEmail } from "@/lib/email";

const BOOKINGS_FILE = path.join(
  process.cwd(),
  "data",
  "booking-requests.json",
);

function readBookings() {
  try {
    return JSON.parse(fs.readFileSync(BOOKINGS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { ok: false, message: "Missing bookingId" },
        { status: 400 },
      );
    }

    const bookings = readBookings();
    const booking = bookings.find((b: any) => b.id === bookingId);

    if (!booking) {
      return NextResponse.json(
        { ok: false, message: "Booking not found" },
        { status: 404 },
      );
    }

    if (!booking.depositAmount) {
      return NextResponse.json(
        { ok: false, message: "Deposit not set" },
        { status: 400 },
      );
    }

    const paymentLink = `http://localhost:3002/booking/payment/${booking.id}`;

    // ✅ DEBUG LOG (IMPORTANT)
    console.log("📧 Sending deposit email to:", booking.email);
    console.log("💰 Deposit:", booking.depositAmount);
    console.log("🔗 Link:", paymentLink);

    await sendEmail({
      to: booking.email, // ⚠️ STILL WILL ROUTE TO YOUR RESEND EMAIL (DEV MODE)
      subject: "Your Maid in Dixie Deposit is Ready",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color:#d95f91;">Deposit Required</h2>

          <p>Hi ${booking.name},</p>

          <p>Your cleaning request has been reviewed.</p>

          <p><strong>Deposit Due:</strong> $${booking.depositAmount}</p>

          <a href="${paymentLink}" 
             style="display:inline-block;padding:12px 20px;background:#d95f91;color:#fff;text-decoration:none;border-radius:6px;margin-top:15px;">
            Pay Deposit
          </a>

          <p style="margin-top:20px;">— Maid in Dixie Cleaning Services</p>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: "Deposit email sent",
    });
  } catch (err) {
    console.error("❌ SEND DEPOSIT ERROR:", err);

    return NextResponse.json(
      {
        ok: false,
        message: "Email failed to send",
      },
      { status: 500 },
    );
  }
}