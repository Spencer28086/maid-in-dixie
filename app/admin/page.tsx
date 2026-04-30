"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const cards = [
  {
    title: "Services",
    description: "Edit service offerings and descriptions",
    href: "/admin/services",
  },
  {
    title: "Pricing",
    description: "Update pricing tiers and details",
    href: "/admin/pricing",
  },
  {
    title: "Gallery",
    description: "Manage before & after photos",
    href: "/admin/gallery",
  },
  {
    title: "Calendar",
    description: "Manage availability and time slots",
    href: "/admin/calendar",
  },
  {
    title: "Bookings",
    description: "Review and approve booking requests",
    href: "/admin/bookings",
  },
  {
    title: "Quotes",
    description: "View and manage quote requests",
    href: "/admin/quotes",
  },
  {
    title: "Site Content",
    description: "Update homepage text and sections",
    href: "/admin/content",
  },
  {
    title: "Testimonials",
    description: "Approve, deny, and manage testimonials",
    href: "/admin/testimonials",
  },
  {
    title: "TikTok",
    description: "Manage homepage TikTok videos",
    href: "/admin/tiktok",
  },
];

export default function AdminPage() {
  async function handleLogout() {
    await fetch("/api/admin-logout", {
      method: "POST",
    });

    window.location.href = "/";
  }
  const [pendingTestimonials, setPendingTestimonials] = useState(0);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        const pending = (data.data || []).filter(
          (t: any) => t.status === "pending"
        ).length;

        setPendingTestimonials(pending);
      })
      .catch((err) => {
        console.error("Failed to load testimonial count:", err);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#fff7f8] px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-serif text-[#2b1c1f]">
            Admin Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-[#2b1c1f] text-white text-sm hover:bg-black transition"
          >
            Logout
          </button>
        </div>

        <p className="text-[#76545d] mb-10">
          Manage your content, services, and customer experience.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => {
            const isTestimonials = card.title === "Testimonials";

            return (
              <Link
                key={i}
                href={card.href}
                className="group relative rounded-[2rem] border border-[#f3d1d8]/70 bg-white/70 backdrop-blur p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* 🔔 BADGE */}
                {isTestimonials && pendingTestimonials > 0 && (
                  <div className="absolute top-4 right-4 bg-[#d95f91] text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                    {pendingTestimonials}
                  </div>
                )}

                <h2 className="text-lg font-serif text-[#2b1c1f] mb-2">
                  {card.title}
                </h2>

                <p className="text-sm text-[#76545d] mb-4">
                  {card.description}
                </p>

                <span className="text-sm text-[#d95f91] font-medium group-hover:underline">
                  Open →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}