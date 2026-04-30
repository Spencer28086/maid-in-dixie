import React from "react";

export default function PoliciesPage() {
    return (
        <div className="bg-[#fff7f8] min-h-screen py-16 px-6 md:px-12 lg:px-20">
            <div className="max-w-5xl mx-auto">

                {/* PAGE HEADER */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif text-[#2a2a2a]">
                        Our Policies
                    </h1>
                    <p className="mt-4 text-gray-600 text-lg">
                        Please review our policies before booking. These ensure a smooth and professional experience for every client.
                    </p>
                </div>

                {/* SECTION WRAPPER */}
                <div className="space-y-14">

                    {/* BOOKING POLICIES */}
                    <section className="bg-white/70 backdrop-blur-md border border-[#f3d1d8] rounded-[2rem] p-8 shadow-lg">
                        <h2 className="text-2xl font-serif text-[#d95f91] mb-6">
                            Booking Policies
                        </h2>

                        <ul className="space-y-3 text-gray-700 leading-relaxed">
                            <li>• All bookings are subject to approval before confirmation.</li>
                            <li>• No same-day bookings are accepted.</li>
                            <li>• Available dates and time slots are shown during booking.</li>
                            <li>• Weekend bookings require approval and may include an additional fee.</li>
                            <li>• Clients must complete all required information before submitting a request.</li>
                            <li>• Agreement to our policies is required before booking submission.</li>
                        </ul>
                    </section>

                    {/* CANCELLATION & RESCHEDULING */}
                    <section className="bg-white/70 backdrop-blur-md border border-[#f3d1d8] rounded-[2rem] p-8 shadow-lg">
                        <h2 className="text-2xl font-serif text-[#d95f91] mb-6">
                            Cancellation & Rescheduling
                        </h2>

                        <ul className="space-y-3 text-gray-700 leading-relaxed">
                            <li>• At least 24-hour notice is required for cancellations or rescheduling.</li>
                            <li>• Late cancellations may result in loss of deposit.</li>
                            <li>• No-shows will forfeit any deposit paid.</li>
                            <li>• Rescheduling is subject to availability.</li>
                        </ul>
                    </section>

                    {/* PAYMENT POLICIES */}
                    <section className="bg-white/70 backdrop-blur-md border border-[#f3d1d8] rounded-[2rem] p-8 shadow-lg">
                        <h2 className="text-2xl font-serif text-[#d95f91] mb-6">
                            Payment Policies
                        </h2>

                        <ul className="space-y-3 text-gray-700 leading-relaxed">
                            <li>• A 50% non-refundable deposit is required for all first-time clients and deep cleans.</li>
                            <li>• Bookings are NOT confirmed until the deposit is paid.</li>
                            <li>• Remaining balance is due upon completion of service.</li>
                            <li>• Payments are processed securely through Square.</li>
                            <li>• Additional payment methods such as Venmo and Zelle may be available.</li>
                            <li>• Digital receipts will be provided after payment.</li>
                        </ul>
                    </section>

                    {/* ADDITIONAL POLICIES */}
                    <section className="bg-white/70 backdrop-blur-md border border-[#f3d1d8] rounded-[2rem] p-8 shadow-lg">
                        <h2 className="text-2xl font-serif text-[#d95f91] mb-6">
                            Additional Policies
                        </h2>

                        <ul className="space-y-3 text-gray-700 leading-relaxed">
                            <li>• Pricing may vary depending on the condition and size of the home.</li>
                            <li>• Clients are responsible for providing accurate booking details.</li>
                            <li>• Maid in Dixie reserves the right to refuse service if conditions are unsafe.</li>
                            <li>• Add-on services must be selected at the time of booking.</li>
                            <li>• Client-provided photos may be requested for accurate estimates (if applicable).</li>
                        </ul>
                    </section>

                </div>

            </div>
        </div>
    );
}