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
  <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:30px;">
    
    <div style="max-width:700px;margin:0 auto;background:#ffffff;border:1px solid #eee;border-radius:10px;padding:30px;">
      
      <!-- HEADER -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <h2 style="margin:0;color:#d95f91;">
            ${site.businessName || "Maid in Dixie Cleaning Services"}
          </h2>

          <p style="margin:4px 0;font-size:13px;color:#666;">
            ${site.city || ""}<br/>
            Phone: ${site.phone || ""}<br/>
            Email: ${site.email || ""}
          </p>
        </div>

        <div style="text-align:right;">
          <h3 style="margin:0;color:#333;">INVOICE</h3>
          <p style="font-size:12px;color:#777;margin-top:5px;">
            Date: ${new Date().toLocaleDateString()}<br/>
            Invoice ID: ${booking.id}
          </p>
        </div>
      </div>

      <hr style="margin:20px 0;" />

      <!-- CLIENT INFO -->
      <div style="margin-bottom:20px;">
        <h4 style="margin-bottom:8px;color:#333;">Billed To:</h4>
        <p style="margin:0;font-size:14px;color:#555;">
          ${booking.name}<br/>
          ${booking.email}<br/>
          ${booking.address || ""}
        </p>
      </div>

      <!-- BOOKING DETAILS -->
      <div style="margin-bottom:20px;">
        <h4 style="margin-bottom:8px;color:#333;">Service Details:</h4>
        <p style="margin:0;font-size:14px;color:#555;">
          Date: ${booking.selectedDate}<br/>
          Time: ${booking.selectedSlot}
        </p>
      </div>

      <!-- ADD-ONS TABLE -->
      <div style="margin-bottom:20px;">
        <h4 style="margin-bottom:10px;color:#333;">Services</h4>

        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="background:#f3f3f3;">
              <th style="text-align:left;padding:10px;border:1px solid #eee;">Item</th>
              <th style="text-align:right;padding:10px;border:1px solid #eee;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:10px;border:1px solid #eee;">Cleaning Service</td>
              <td style="padding:10px;border:1px solid #eee;text-align:right;">
                $${booking.totalEstimate || 0}
              </td>
            </tr>

            ${booking.addOns && booking.addOns.length > 0
          ? booking.addOns
            .map(
              (addon: string) => `
              <tr>
                <td style="padding:10px;border:1px solid #eee;">${addon}</td>
                <td style="padding:10px;border:1px solid #eee;text-align:right;">Included</td>
              </tr>
              `
            )
            .join("")
          : ""
        }
          </tbody>
        </table>
      </div>

      <!-- TOTALS -->
      <div style="margin-top:20px;">
        <table style="width:100%;font-size:14px;">
          <tr>
            <td style="padding:6px 0;">Total</td>
            <td style="text-align:right;">$${booking.totalEstimate || 0}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;">Deposit Paid</td>
            <td style="text-align:right;">$${booking.depositAmount || 0}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:bold;">Remaining Balance</td>
            <td style="text-align:right;font-weight:bold;">
              $${remaining}
            </td>
          </tr>
        </table>
      </div>

      <hr style="margin:25px 0;" />

      <!-- FOOTER -->
      <p style="font-size:13px;color:#666;">
        Thank you for choosing Maid in Dixie Cleaning Services.<br/>
        Remaining balance is due upon service completion unless otherwise agreed.
      </p>

      <div style="margin-top:15px;font-size:13px;color:#555;">
        <strong>Accepted Payment Methods:</strong><br/>
        Venmo: ${site.venmo || ""}<br/>
        Zelle: ${site.zelle || ""}
      </div>

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