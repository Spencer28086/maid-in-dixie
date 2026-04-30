"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PricingPreview() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        const services = data.data.services || [];

        const mapped = services.map((s: any, i: number) => ({
          name: s.name,
          price: s.customQuote ? "Custom Quote" : `$${s.price}+`,
          description: s.customQuote
            ? "Pricing depends on your home and cleaning needs."
            : "Professional cleaning tailored to your home.",
          features: s.customQuote
            ? [
              "Based on bedrooms & bathrooms",
              "Square footage considered",
              "Home condition evaluated",
              "Photos reviewed before quote",
            ]
            : ["Custom service based on your needs"],
          highlight: i === 1,
        }));

        setPlans(mapped);
      })
      .catch((err) => {
        console.error("Pricing load error:", err);
      });
  }, []);

  return (
    <section className="relative py-24 px-6">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#fff1f5] via-white to-white" />

      <div className="max-w-7xl mx-auto text-center">
        {/* HEADER */}
        <h2 className="text-4xl md:text-5xl font-serif text-[#2b1c1f] mb-4">
          Simple, Elegant Pricing
        </h2>
        <p className="text-[#6b4b52] max-w-2xl mx-auto mb-16">
          Choose the level of care your home deserves. Every service is designed
          with detail, comfort, and quality in mind.
        </p>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-10">
          {plans.length > 0 &&
            plans.map((plan, i) => (
              <div
                key={i}
                className={`group relative rounded-[2.5rem] p-8 text-left transition-all duration-300 
                ${plan.highlight
                    ? "bg-white/70 backdrop-blur-xl border border-[#f3d1d8] shadow-2xl scale-[1.02]"
                    : "bg-white/60 backdrop-blur-lg border border-[#f5d9de] shadow-lg hover:shadow-2xl hover:-translate-y-1"
                  }`}
              >
                {/* SOFT GLOW */}
                <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#ffdce6]/40 to-transparent opacity-0 group-hover:opacity-100 transition" />

                {/* PLAN NAME */}
                <h3 className="relative z-10 text-2xl font-serif text-[#2b1c1f] mb-2">
                  {plan.name}
                </h3>

                {/* PRICE */}
                <div className="relative z-10 text-3xl font-semibold text-[#b76e79] mb-4">
                  {plan.price}
                </div>

                {/* DESCRIPTION */}
                <p className="relative z-10 text-[#6b4b52] mb-6">
                  {plan.description}
                </p>

                {/* FEATURES */}
                <ul className="relative z-10 space-y-2 mb-8">
                  {plan.features.map((feature: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-sm text-[#5a3f45] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4a5ad]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/quote"
                  className={`relative z-10 block w-full py-3 rounded-full text-center text-sm font-medium transition-all duration-300
                    ${plan.highlight
                      ? "bg-[#b76e79] text-white shadow-md hover:bg-[#a45d68]"
                      : "bg-white border border-[#e7c3c9] text-[#6b4b52] hover:bg-[#fff1f5]"
                    }`}
                >
                  Get a Quote
                </Link>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}