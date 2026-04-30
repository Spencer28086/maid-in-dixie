"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SiteContent = {
  businessName: string;
  phone: string;
  email: string;
  city: string;
};

export default function Footer() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    fetch("/api/site-content")
      .then((res) => res.json())
      .then((data) => setContent(data.data))
      .catch((err) => console.error("Footer load error:", err));
  }, []);

  return (
    <footer className="w-full border-t border-[#f3d1d8] bg-[#fff8f5]/80 backdrop-blur-sm mt-24">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center">

        {/* Main Text */}
        <p className="text-sm text-[#7a6259] tracking-wide">
          © {new Date().getFullYear()}{" "}
          {content?.businessName || "Maid in Dixie Cleaning Services"}
        </p>

        {/* Contact Info (NEW - dynamic) */}
        {content && (
          <div className="mt-2 text-xs text-[#a38a82] space-y-1">
            <p>{content.city}</p>
            <p>Phone: {content.phone}</p>
            <p>Email: {content.email}</p>
          </div>
        )}

        {/* Divider */}
        <div className="my-4 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[#f3d1d8] to-transparent" />

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-[#7a6259] mt-4">
          <Link href="/" className="hover:text-[#d95f91] transition">Home</Link>
          <Link href="/#services" className="hover:text-[#d95f91] transition">Services</Link>
          <Link href="/#pricing" className="hover:text-[#d95f91] transition">Pricing</Link>
          <Link href="/#gallery" className="hover:text-[#d95f91] transition">Gallery</Link>
          <Link href="/policies" className="hover:text-[#d95f91] transition">Policies</Link>
          <Link href="/contact" className="hover:text-[#d95f91] transition">Contact</Link>
        </div>

        {/* Credit Line (UNCHANGED - PROTECTED) */}
        <p className="text-xs text-[#a38a82]">
          Designed & Developed by{" "}
          <a
            href="https://spencertechgroup.org"
            target="_blank"
            rel="noopener noreferrer"
            className="relative font-medium text-[#4b332c] transition-all duration-300 hover:text-[#e8aab5]"
          >
            <span className="underline underline-offset-4 decoration-[#f3d1d8] hover:decoration-[#e8aab5]">
              Spencer Technology Group
            </span>

            {/* Subtle glow on hover */}
            <span className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-300 blur-md bg-[#f7d6dc]/40 rounded-md -z-10" />
          </a>
        </p>

      </div>
    </footer>
  );
}