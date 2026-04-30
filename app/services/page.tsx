"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Service = {
    name: string;
    description?: string;
    features?: string[];
    price?: number;
    customQuote?: boolean;
    image?: string;
};

export default function ServicesPage() {
    const [core, setCore] = useState<Service[]>([]);

    useEffect(() => {
        fetch("/api/pricing")
            .then((res) => res.json())
            .then((data) => {
                setCore(data.data?.services || []);
            });
    }, []);

    return (
        <main className="min-h-screen bg-[#fff7f8] px-6 py-16">
            <div className="max-w-6xl mx-auto space-y-20">

                {/* HEADER */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-serif text-[#2b1c1f]">
                        Our Services
                    </h1>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Every home is different. That’s why we offer flexible cleaning
                        services designed around your needs, schedule, and lifestyle.
                    </p>
                </div>

                {/* CORE SERVICES */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-serif text-[#4b332c]">
                        Core Cleaning Services
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {core.map((service, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-lg border border-[#f3d1d8] overflow-hidden"
                            >
                                {service.image && (
                                    <img
                                        src={service.image}
                                        className="h-48 w-full object-cover"
                                    />
                                )}

                                <div className="p-6 space-y-4">
                                    <div className="text-sm text-[#d95f91] font-semibold">
                                        {service.customQuote
                                            ? "Custom Quote Required"
                                            : `Starting at $${service.price}+`}
                                    </div>

                                    <h3 className="text-xl font-serif text-[#2b1c1f]">
                                        {service.name}
                                    </h3>

                                    <p className="text-sm text-gray-600">
                                        {service.description}
                                    </p>

                                    <ul className="text-sm text-gray-700 space-y-1">
                                        {service.features?.map((f, j) => (
                                            <li key={j}>• {f}</li>
                                        ))}
                                    </ul>

                                    <Link
                                        href="/booking"
                                        className="block mt-4 text-center bg-[#d95f91] text-white py-2 rounded-lg font-semibold hover:bg-[#c94f82]"
                                    >
                                        Book This Service
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* RECURRING SERVICES */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-serif text-[#4b332c]">
                        Recurring Cleaning Plans
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">

                        {[
                            {
                                name: "Weekly Cleaning",
                                price: "Starting at $100+",
                                desc: "Keep your home consistently fresh with weekly maintenance cleaning.",
                            },
                            {
                                name: "Bi-Weekly Cleaning",
                                price: "Starting at $120+",
                                desc: "A balance between upkeep and deep refreshes.",
                            },
                            {
                                name: "Monthly Cleaning",
                                price: "Starting at $180+",
                                desc: "Perfect for maintaining homes that need occasional attention.",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white p-6 rounded-xl border shadow-md text-center space-y-3"
                            >
                                <h3 className="font-serif text-lg text-[#2b1c1f]">
                                    {item.name}
                                </h3>

                                <div className="text-[#d95f91] font-semibold">
                                    {item.price}
                                </div>

                                <p className="text-sm text-gray-600">
                                    {item.desc}
                                </p>

                                <Link
                                    href="/booking"
                                    className="inline-block mt-3 bg-[#d95f91] text-white px-4 py-2 rounded-lg"
                                >
                                    Book Now
                                </Link>
                            </div>
                        ))}

                    </div>
                </section>

                {/* ADD-ONS */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-serif text-[#4b332c]">
                        Add-On Services
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">

                        {[
                            "Inside Oven Cleaning: $25–$50",
                            "Steam Clean Oven: $50+",
                            "Inside Refrigerator: $25–$40",
                            "Steam Refrigerator: $40+",
                            "Dishes: $15+",
                            "Laundry (3 loads): $25+",
                            "Extra Laundry Load: $7",
                            "Animal Crate Cleaning: $20+",
                            "Interior Windows: $5 per window",
                            "Baseboards Deep Clean: $25+",
                            "Blind Cleaning: $20+",
                            "Organization: $30/hr (2hr min)",
                            "Holiday Decor Setup: $50+",
                            "Holiday Decor Takedown: $50+",
                            "Christmas Tree Setup: $75+",
                            "Date Night Setup: $80+",
                        ].map((addon, i) => (
                            <div
                                key={i}
                                className="bg-white p-4 rounded-lg border shadow-sm"
                            >
                                {addon}
                            </div>
                        ))}

                    </div>
                </section>

                {/* PRICING DISCLAIMER */}
                <section className="bg-white border border-[#f3d1d8] p-6 rounded-xl text-sm text-gray-600">
                    <strong className="text-[#2b1c1f]">
                        Pricing Notice:
                    </strong>
                    <p className="mt-2">
                        All pricing listed are starting estimates only. Final pricing
                        depends on square footage, number of bedrooms and bathrooms,
                        condition of the home, and any add-on services requested.
                    </p>
                </section>

            </div>
        </main>
    );
}