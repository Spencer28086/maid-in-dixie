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
    const [addons, setAddons] = useState<string[]>([]);

    useEffect(() => {
        fetch("/api/pricing")
            .then((res) => res.json())
            .then((data) => {
                setCore(data.data?.services || []);
                setAddons(data.data?.addons || []); // ✅ NEW
            });
    }, []);

    return (
        <main className="min-h-screen bg-[#fff7f8] px-6 py-16">
            <div className="max-w-7xl mx-auto space-y-24">

                {/* HEADER */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-serif text-[#2b1c1f]">
                        Our Services
                    </h1>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Every home is different. That’s why we offer flexible cleaning
                        services designed around your needs, schedule, and lifestyle.
                    </p>
                </div>

                {/* CORE SERVICES */}
                <section className="space-y-10">
                    <h2 className="text-3xl font-serif text-[#4b332c] text-center">
                        Core Cleaning Services
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {core.map((service, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-lg border border-[#f3d1d8] overflow-hidden hover:shadow-xl transition"
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

                                    <h3 className="text-lg font-serif text-[#2b1c1f]">
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

                {/* RECURRING */}
                <section className="space-y-10">
                    <h2 className="text-3xl font-serif text-[#4b332c] text-center">
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
                                className="bg-white p-6 rounded-xl border shadow-md text-center space-y-3 hover:shadow-lg transition"
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

                {/* ADD-ONS (DYNAMIC) */}
                <section className="space-y-10">
                    <h2 className="text-3xl font-serif text-[#4b332c] text-center">
                        Add-On Services
                    </h2>

                    <div className="flex flex-wrap justify-center gap-4">

                        {addons.map((addon: any, i) => {
                            const isObject = typeof addon === "object";

                            return (
                                <div
                                    key={i}
                                    className="bg-white border border-[#f3d1d8] px-5 py-3 rounded-full shadow-sm text-sm text-[#2b1c1f] hover:shadow-md transition flex items-center gap-2"
                                >
                                    <span>{isObject ? addon.name : addon}</span>

                                    {isObject && addon.price && (
                                        <span className="text-[#d95f91] font-semibold">
                                            {typeof addon.price === "number"
                                                ? `$${addon.price}`
                                                : addon.price?.toString().startsWith("$")
                                                    ? addon.price
                                                    : `$${addon.price}`}
                                        </span>
                                    )}
                                </div>
                            );
                        })}

                    </div>
                </section>

                {/* DISCLAIMER */}
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