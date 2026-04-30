import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { ok: false, message: "Missing bookingId" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { ok: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    if (!booking.email) {
      return NextResponse.json(
        { ok: false, message: "Booking missing email" },
        { status: 400 }
      );
    }

    if (!booking.depositAmount) {
      return NextResponse.json(
        { ok: false, message: "Deposit not set" },
        { status: 400 }
      );
    }

    const paymentLink = `https://www.maidindixiecleaningservices.com/booking/payment/${booking.id}`;

    console.log("📧 Sending deposit email to:", booking.email);
    console.log("💰 Deposit:", booking.depositAmount);

    await sendEmail({
      to: booking.email,
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
      { ok: false, message: "Email failed to send" },
      { status: 500 }
    );
  }
}