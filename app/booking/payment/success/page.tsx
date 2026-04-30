"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    async function confirmPayment() {
      if (!bookingId) {
        setError("Missing booking ID.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/booking", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: bookingId,
            paymentStatus: "PAID",
          }),
        });

        const data = await res.json();

        if (!data.ok) {
          setError(data.message || "Failed to confirm payment.");
        } else {
          setConfirmed(true);

          // ✅ SEND DIGITAL RECEIPT
          try {
            console.log("🔥 SENDING RECEIPT FOR:", bookingId);

            const res2 = await fetch("/api/email/send-receipt", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                bookingId,
              }),
            });

            const data2 = await res2.json();

            console.log("📧 RECEIPT RESPONSE:", data2);

            if (!data2.ok) {
              console.error("❌ RECEIPT FAILED:", data2.message);
            }
          } catch (err) {
            console.error("❌ RECEIPT ERROR:", err);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while confirming payment.");
      } finally {
        setLoading(false);
      }
    }

    confirmPayment();
  }, [bookingId]);

  return (
    <section className="min-h-screen bg-[#fff7f8] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-[#f3d1d8] p-10 max-w-lg w-full text-center space-y-6">

        <h1 className="text-3xl font-serif text-[#2d1b21]">
          Payment Confirmation
        </h1>

        {loading && (
          <p className="text-gray-500">
            Confirming your payment...
          </p>
        )}

        {!loading && error && (
          <div className="space-y-3">
            <p className="text-red-500 font-semibold">
              {error}
            </p>
            <p className="text-gray-500 text-sm">
              If your payment was completed, please contact us to verify.
            </p>
          </div>
        )}

        {!loading && confirmed && (
          <div className="space-y-4">
            <p className="text-[#4a2b33] text-lg">
              Your deposit has been successfully received.
            </p>

            <p className="text-[#7a4b57]">
              Your booking is now confirmed and we look forward to serving you.
            </p>

            <div className="text-sm text-gray-500 mt-4">
              A confirmation email will be sent shortly.
            </div>
          </div>
        )}

        {!loading && confirmed && (
          <a
            href="/"
            className="inline-block mt-6 px-6 py-3 rounded-full bg-[#d95f91] text-white font-semibold hover:bg-[#c94f82] transition"
          >
            Return Home
          </a>
        )}
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}