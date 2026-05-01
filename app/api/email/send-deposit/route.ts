import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const SQUARE_LINK = "https://square.link/u/ERNQ5DGs";

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

    console.log("📧 Sending deposit email to:", booking.email);
    console.log("💰 Deposit:", booking.depositAmount);

    await sendEmail({
      to: booking.email,
      subject: "Your Maid in Dixie Deposit is Ready",
      html: `
      <div style="font-family: Arial, sans-serif; background:#fff7f8; padding:30px;">
        <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:16px;border:1px solid #eee;">

          <h2 style="color:#d95f91;margin-bottom:10px;">
            Deposit Required
          </h2>

          <p style="margin-bottom:15px;">
            Hi ${booking.name},
          </p>

          <p style="margin-bottom:20px;">
            Your cleaning request has been reviewed and your appointment is ready to be secured.
          </p>

          <div style="background:#fff0f5;padding:15px;border-radius:10px;margin-bottom:20px;">
            <p style="margin:0;font-size:14px;color:#555;">Deposit Due</p>
            <p style="margin:0;font-size:24px;font-weight:bold;color:#d95f91;">
              $${booking.depositAmount}
            </p>
          </div>

          <a href="https://maidindixiecleaningservices.com/booking/payment/${booking.id}"
            style="display:block;text-align:center;padding:14px;background:#d95f91;color:white;text-decoration:none;border-radius:10px;font-weight:bold;">
            Pay Your Deposit
          </a>

          <p style="margin-top:20px;font-size:13px;color:#777;">
            You’ll be guided through secure payment and confirmation on the next page.
          </p>

          <hr style="margin:25px 0;border:none;border-top:1px solid #eee;" />

          <p style="font-size:12px;color:#999;">
            Maid in Dixie Cleaning Services
          </p>

        </div>
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