"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ServicesSection() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        console.log("PRICING API:", data);

        // 🔥 CORRECT STRUCTURE
        setServices(Array.isArray(data.data) ? data.data : []);
      })
      .catch((err) => {
        console.error("Services load error:", err);
      });
  }, []);

  const getServiceImage = (name: string) => {
    const n = name?.toLowerCase() || "";

    if (n.includes("standard")) return "/images/services/standard-cleaning.jpg";
    if (n.includes("deep")) return "/images/services/deep-cleaning.jpg";
    if (n.includes("move")) return "/images/services/move-cleaning.jpg";
    if (n.includes("rv")) return "/images/services/rv-cleaning.jpg";

    return "/images/services/standard-cleaning.jpg";
  };

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[#fff1f4]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-20 items-center">

        {/* LEFT */}
        <div>
          <h2 className="mt-4 font-serif text-4xl lg:text-5xl text-[#4b332c] leading-tight">
            Cleaning Designed Around Your Life
          </h2>

          <p className="mt-6 text-[#7a6259] max-w-md leading-relaxed">
            From routine upkeep to deep transformations, Maid in Dixie offers
            cleaning services tailored to your home, your schedule, and your needs.
          </p>

          <Link
            href="/services"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-[#e8aab5] px-8 py-4 text-sm font-semibold text-white"
          >
            View All Services
          </Link>
        </div>

        {/* RIGHT */}
        <div className="grid gap-8 sm:grid-cols-2">
          {services.length === 0 && (
            <div className="col-span-2 text-center text-gray-500">
              No services found. Check /api/pricing.
            </div>
          )}

          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >

              {/* IMAGE (SAFE VERSION) */}
              <div className="h-64 w-full bg-gray-100">
                <img
                  src={service.image || getServiceImage(service.name)}
                  alt={service.name || "Service"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">

                <h3 className="text-xl font-serif text-[#4b332c]">
                  {service.name}
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  {service.description}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}