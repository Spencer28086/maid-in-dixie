import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sendEmail } from "@/lib/email";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "booking-requests.json");

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
    status: string;
    paymentStatus: "UNPAID" | "PAID";
    totalEstimate: number | null;
    depositAmount: number | null;
    reminderSent?: boolean;
    createdAt: string;
    updatedAt: string;
};

function ensureStorage() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(BOOKINGS_FILE)) fs.writeFileSync(BOOKINGS_FILE, "[]");
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

function getBookingDateTime(selectedDate: string, selectedSlot: string) {
    return new Date(`${selectedDate} ${selectedSlot}`);
}

export async function GET() {
    try {
        const bookings = readBookings();
        const now = new Date();

        let sentCount = 0;
        let skippedCount = 0;

        for (const booking of bookings) {
            if (booking.status !== "APPROVED") {
                skippedCount++;
                continue;
            }

            if (booking.reminderSent) {
                skippedCount++;
                continue;
            }

            const bookingDateTime = getBookingDateTime(
                booking.selectedDate,
                booking.selectedSlot,
            );

            if (Number.isNaN(bookingDateTime.getTime())) {
                console.log("Invalid booking date/time:", {
                    id: booking.id,
                    selectedDate: booking.selectedDate,
                    selectedSlot: booking.selectedSlot,
                });

                skippedCount++;
                continue;
            }

            const diffHours =
                (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

            if (diffHours <= 48 && diffHours > 0) {
                await sendEmail({
                    to: booking.email,
                    subject: "Reminder: Your Cleaning Appointment is Coming Up",
                    html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color:#d95f91;">Appointment Reminder</h2>

              <p>Hi ${booking.name},</p>

              <p>This is a friendly reminder that your cleaning appointment is coming up soon.</p>

              <h3>Appointment Details:</h3>
              <ul>
                <li><strong>Date:</strong> ${booking.selectedDate}</li>
                <li><strong>Time:</strong> ${booking.selectedSlot}</li>
              </ul>

              <p>We look forward to serving you!</p>

              <p style="margin-top:20px;">— Maid in Dixie Cleaning Services</p>
            </div>
          `,
                });

                booking.reminderSent = true;
                booking.updatedAt = new Date().toISOString();
                sentCount++;
            } else {
                skippedCount++;
            }
        }

        writeBookings(bookings);

        return NextResponse.json({
            ok: true,
            sent: sentCount,
            skipped: skippedCount,
            checked: bookings.length,
        });
    } catch (err) {
        console.error("Reminder email error:", err);

        return NextResponse.json(
            {
                ok: false,
                sent: 0,
                skipped: 0,
                checked: 0,
                message: "Unable to send reminder emails.",
            },
            { status: 500 },
        );
    }
}