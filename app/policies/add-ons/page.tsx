import React from "react";

const addOns = [
    {
        name: "Inside Oven",
        price: "$25+",
        desc: "Deep cleaning of interior oven surfaces to remove grease and buildup.",
    },
    {
        name: "Inside Fridge",
        price: "$20+",
        desc: "Full wipe-down and sanitization of shelves and compartments.",
    },
    {
        name: "Interior Cabinets",
        price: "$30+",
        desc: "Cleaning inside cabinets and drawers for a refreshed space.",
    },
    {
        name: "Baseboards",
        price: "$20+",
        desc: "Detailed wipe-down of all baseboards throughout the home.",
    },
    {
        name: "Window Cleaning (Interior)",
        price: "$5/window",
        desc: "Streak-free cleaning of interior glass surfaces.",
    },
    {
        name: "Laundry Service",
        price: "$15/load",
        desc: "Wash, dry, and fold service for added convenience.",
    },
    {
        name: "Deep Bathroom Scrub",
        price: "$25+",
        desc: "Extra attention to tile, grout, and fixtures.",
    },
    {
        name: "Pet Hair Removal",
        price: "$20+",
        desc: "Specialized cleaning to remove stubborn pet hair from surfaces.",
    },
];

export default function AddOnsPage() {
    return (
        <div className="bg-[#fff7f8] min-h-screen py-16 px-6 md:px-12 lg:px-20">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif text-[#2a2a2a]">
                        Add-On Services
                    </h1>
                    <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
                        Customize your cleaning with additional services tailored to your home’s needs.
                    </p>
                </div>

                {/* GRID */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {addOns.map((item, i) => (
                        <div
                            key={i}
                            className="group relative rounded-[2rem] border border-[#f3d1d8]/80 bg-white/70 backdrop-blur shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 rounded-[2rem] bg-[#f7d6dc]/30 blur-xl -z-10" />

                            <h3 className="text-xl font-serif text-[#2a2a2a] mb-2">
                                {item.name}
                            </h3>

                            <p className="text-sm text-[#d95f91] font-semibold mb-3">
                                {item.price}
                            </p>

                            <p className="text-sm text-gray-600 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-20">
                    <a
                        href="/booking"
                        className="inline-block px-10 py-4 rounded-full font-bold uppercase bg-[#d95f91] text-white hover:bg-[#c94f82] transition"
                    >
                        Add to Your Booking
                    </a>
                </div>

            </div>
        </div>
    );
}