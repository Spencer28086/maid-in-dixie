import { NextResponse } from "next/server";
import { squareClient, locationId } from "@/lib/square";
import fs from "fs";
import path from "path";

const BOOKINGS_FILE = path.join(process.cwd(), "data", "booking-requests.json");

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
        { ok: false, message: "Missing booking ID" },
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

    if (booking.paymentStatus === "PAID") {
      return NextResponse.json(
        { ok: false, message: "Already paid" },
        { status: 400 },
      );
    }

    const amountInCents = Math.round(booking.depositAmount * 100);

    // 🚨 DEV MODE BYPASS
    if (!process.env.SQUARE_TOKEN) {
      console.log("⚠️ DEV MODE: Skipping Square");

      return NextResponse.json({
        ok: true,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/payment/success?bookingId=${booking.id}`,
      });
    }

    // ✅ NEW SDK METHOD
    const response = await squareClient.checkout.paymentLinks.create({
      idempotencyKey: crypto.randomUUID(),
      quickPay: {
        name: "Cleaning Deposit",
        priceMoney: {
          amount: amountInCents, // ❌ NO BigInt
          currency: "USD",
        },
        locationId,
      },
      checkoutOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/payment/success?bookingId=${booking.id}`,
      },
    });

    const url = response.paymentLink?.url;

    return NextResponse.json({
      ok: true,
      url,
    });
  } catch (err: any) {
    console.error("🔥 SQUARE ERROR:", err);

    return NextResponse.json(
      {
        ok: false,
        message: err?.message || "Failed to create checkout link",
      },
      { status: 500 },
    );
  }
}
