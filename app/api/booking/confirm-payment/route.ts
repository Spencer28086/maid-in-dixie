import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const { bookingId } = await req.json();

        if (!bookingId) {
            return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
        }

        // ✅ Get booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // ✅ Prevent duplicate processing
        if (booking.paymentStatus === "PAID") {
            return NextResponse.json({ success: true, message: "Already processed" });
        }

        // ✅ Update booking
        const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                paymentStatus: "PAID",
                status: "NEW",
            },
        });

        // =========================
        // 📧 EMAIL SETUP
        // =========================
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // =========================
        // 📧 CUSTOMER EMAIL
        // =========================
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
        <br/>
        <p>We look forward to serving you!</p>
        <p><strong>Maid in Dixie Cleaning Services</strong></p>
      `,
        });

        // =========================
        // 📧 BUSINESS EMAIL
        // =========================
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

    } catch (error) {
        console.error("CONFIRM PAYMENT ERROR:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}