import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const SITE_CONTENT_FILE = path.join(
  process.cwd(),
  "data",
  "site-content.json"
);

function readSiteContent() {
  try {
    return JSON.parse(fs.readFileSync(SITE_CONTENT_FILE, "utf-8"));
  } catch {
    return {};
  }
}


export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { ok: false, message: "Missing bookingId" },
        { status: 400 }
      );
    }



    const site = readSiteContent();

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

    // ⚠️ ALLOW RECEIPT EVEN IF WRITE HASN'T PROPAGATED YET
    if (booking.paymentStatus !== "PAID") {
      console.warn("⚠️ Payment not marked PAID yet, continuing anyway...");
    }

    // 🧾 RECEIPT VALUES
    const total = booking.totalEstimate || 0;
    const deposit = booking.depositAmount || 0;
    const remaining = total - deposit;

    await sendEmail({
      to: booking.email,
      subject: "Your Payment Receipt - Maid in Dixie",
      html: `
      <div style="font-family: Arial, sans-serif; background:#fff7f8; padding:30px;">
        <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:16px;border:1px solid #eee;">

          <h2 style="color:#28a745;margin-bottom:10px;">
            Payment Received
          </h2>

          <p style="margin-bottom:15px;">
            Hi ${booking.name},
          </p>

          <p style="margin-bottom:20px;">
            Your deposit has been successfully received. Your appointment is now secured.
          </p>

          <div style="background:#f0fff4;padding:15px;border-radius:10px;margin-bottom:20px;">
            <p style="margin:0;font-size:14px;color:#555;">Deposit Paid</p>
            <p style="margin:0;font-size:24px;font-weight:bold;color:#28a745;">
              $${booking.depositAmount}
            </p>
          </div>

          <div style="margin-bottom:20px;">
            <p style="margin:5px 0;"><strong>Date:</strong> ${booking.selectedDate}</p>
            <p style="margin:5px 0;"><strong>Time:</strong> ${booking.selectedSlot}</p>
          </div>

          ${booking.totalEstimate && booking.depositAmount
          ? `
              <div style="background:#fff0f5;padding:15px;border-radius:10px;">
                <p style="margin:0;font-size:14px;color:#555;">Remaining Balance</p>
                <p style="margin:0;font-size:20px;font-weight:bold;color:#d95f91;">
                  $${booking.totalEstimate - booking.depositAmount}
                </p>
              </div>
              `
          : ""
        }

          <p style="margin-top:20px;font-size:13px;color:#777;">
            The remaining balance will be due after your service is completed.
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
      message: "Receipt sent",
    });

  } catch (err) {
    console.error("❌ SEND RECEIPT ERROR:", err);

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to send receipt",
      },
      { status: 500 }
    );
  }
}