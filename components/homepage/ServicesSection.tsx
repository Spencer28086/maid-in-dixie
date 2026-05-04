"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ServicesSection() {
  const [services, setServices] = useState<any[]>([]);
  const [showAllMobile, setShowAllMobile] = useState(false);

  const MAX_HOME_SERVICES = 8;

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
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

  const limitedServices = services.slice(0, MAX_HOME_SERVICES);

  const mobileServices = useMemo(() => {
    return showAllMobile
      ? limitedServices
      : limitedServices.slice(0, 4);
  }, [limitedServices, showAllMobile]);

  const renderServiceCard = (service: any, i: number) => (
    <div
      key={`${service.id || service.name || "service"}-${i}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="aspect-[4/2] w-full bg-gray-100">
        <img
          src={service.image || getServiceImage(service.name)}
          alt={service.name || "Service"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-base font-serif text-[#4b332c]">
          {service.name}
        </h3>

        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
          {service.description}
        </p>
      </div>
    </div>
  );

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[#fff1f4]" />

      <img
        src="/cowgirl.png"
        className="pointer-events-none absolute left-[-40px] top-1/2 -translate-y-1/2 w-[280px] opacity-90"
        alt=""
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

        {/* MOBILE */}
        <div className="lg:hidden">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-3xl text-[#4b332c] leading-tight">
              Cleaning Designed Around Your Life
            </h2>

            <p className="mt-4 text-[#7a6259] text-sm leading-relaxed">
              From routine upkeep to deep transformations, Maid in Dixie offers
              cleaning services tailored to your home, your schedule, and your needs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {mobileServices.map(renderServiceCard)}
          </div>

          {limitedServices.length > 4 && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setShowAllMobile((v) => !v)}
                className="inline-flex items-center justify-center rounded-full bg-[#e8aab5] px-7 py-3 text-sm font-semibold text-white shadow-md"
              >
                {showAllMobile ? "Show Fewer Services" : "Show All Services"}
              </button>
            </div>
          )}
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:grid gap-6 lg:grid-cols-4 xl:grid-cols-4">

          {limitedServices.map(renderServiceCard)}

        </div>

        {/* CTA BELOW GRID (DESKTOP ONLY) */}
        <div className="hidden lg:block mt-12 text-center">
          <h2 className="font-serif text-3xl text-[#4b332c]">
            Cleaning Designed Around Your Life
          </h2>

          <p className="mt-4 text-[#7a6259] max-w-xl mx-auto">
            From routine upkeep to deep transformations, Maid in Dixie offers
            cleaning services tailored to your home, your schedule, and your needs.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#e8aab5] px-8 py-4 text-sm font-semibold text-white shadow-md"
          >
            View All Services
          </Link>
        </div>

      </div>
    </section>
  );
}