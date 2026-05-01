import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const SQUARE_SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!;

function verifySignature(body: string, signature: string, url: string) {
    const hmac = crypto.createHmac("sha256", SQUARE_SIGNATURE_KEY);
    hmac.update(url + body);
    const expected = hmac.digest("base64");
    return expected === signature;
}

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-square-hmacsha256-signature") || "";
        const url = process.env.SQUARE_WEBHOOK_URL!;

        // ✅ VERIFY SIGNATURE
        if (!verifySignature(rawBody, signature, url)) {
            console.error("Invalid webhook signature");
            return new NextResponse("Invalid signature", { status: 403 });
        }

        const body = JSON.parse(rawBody);

        // ✅ ONLY HANDLE PAYMENT EVENTS
        if (body.type !== "payment.created") {
            return NextResponse.json({ ignored: true });
        }

        const payment = body.data?.object?.payment;

        if (!payment) {
            return NextResponse.json({ ignored: true });
        }

        // ✅ ONLY SUCCESSFUL PAYMENTS
        if (payment.status !== "COMPLETED") {
            return NextResponse.json({ ignored: true });
        }

        // =========================
        // 🔑 GET BOOKING ID
        // =========================
        // We expect bookingId stored in note
        const note: string = payment.note || "";

        const bookingId = note.replace("bookingId:", "").trim();

        if (!bookingId) {
            console.error("No bookingId in payment note");
            return NextResponse.json({ ignored: true });
        }

        // =========================
        // 🧾 FIND BOOKING
        // =========================
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            console.error("Booking not found:", bookingId);
            return NextResponse.json({ ignored: true });
        }

        // ✅ PREVENT DUPLICATES
        if (booking.paymentStatus === "PAID") {
            return NextResponse.json({ alreadyProcessed: true });
        }

        // =========================
        // 💾 UPDATE BOOKING
        // =========================
        const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                paymentStatus: "PAID",
                status: "NEW",
            },
        });

        // =========================
        // 📧 EMAILS
        // =========================
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // CUSTOMER
        await transporter.sendMail({
            from: `"Maid in Dixie" <${process.env.EMAIL_USER}>`,
            to: updated.email,
            subject: "Deposit Received - Booking Confirmed",
            html: `
        <h2>Your booking is confirmed 🎉</h2>
        <p>Hi ${updated.name},</p>
        <p>We received your deposit successfully.</p>
        <p><strong>Date:</strong> ${updated.selectedDate}</p>
        <p><strong>Time:</strong> ${updated.selectedSlot}</p>
        <p>We look forward to serving you!</p>
      `,
        });

        // BUSINESS
        await transporter.sendMail({
            from: `"Maid in Dixie System" <${process.env.EMAIL_USER}>`,
            to: process.env.BUSINESS_EMAIL,
            subject: "Deposit Paid - Booking Ready",
            html: `
        <h2>Deposit Paid ✅</h2>
        <p><strong>Name:</strong> ${updated.name}</p>
        <p><strong>Email:</strong> ${updated.email}</p>
        <p><strong>Date:</strong> ${updated.selectedDate}</p>
        <p><strong>Time:</strong> ${updated.selectedSlot}</p>
        <p><strong>Deposit:</strong> $${updated.depositAmount}</p>
      `,
        });

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error("WEBHOOK ERROR:", err);
        return new NextResponse("Server error", { status: 500 });
    }
}