"use client";

import { useState } from "react";

export default function QuoteForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        e.currentTarget.reset();
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white/70 backdrop-blur border border-[#f3d1d8] rounded-[2rem] p-8 shadow-xl"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2 text-[#444]">Full Name</label>
          <input
            name="name"
            required
            className="w-full rounded-xl border border-[#e8cfd5] px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-[#444]">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-xl border border-[#e8cfd5] px-4 py-3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2 text-[#444]">Type of Cleaning</label>
        <select name="cleaningType" required className="w-full rounded-xl border border-[#e8cfd5] px-4 py-3">
          <option value="">Select a service</option>
          <option>Basic Cleaning</option>
          <option>Deep Cleaning</option>
          <option>Move-In / Move-Out</option>
          <option>RV / Camper Cleaning</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <input name="bedrooms" type="number" placeholder="Bedrooms" required className="rounded-xl border px-4 py-3" />
        <input name="bathrooms" type="number" placeholder="Bathrooms" required className="rounded-xl border px-4 py-3" />
        <input name="sqft" type="number" placeholder="Square Footage" required className="rounded-xl border px-4 py-3" />
      </div>

      <div>
        <label className="block text-sm mb-2 text-[#444]">Condition</label>
        <select name="condition" required className="w-full rounded-xl border px-4 py-3">
          <option value="">Select condition</option>
          <option>Light / Well Maintained</option>
          <option>Moderate Buildup</option>
          <option>Heavy Buildup</option>
        </select>
      </div>

      <div>
        <textarea name="message" rows={4} placeholder="Additional details..." className="w-full rounded-xl border px-4 py-3" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#e8cfd5] py-3"
      >
        {loading ? "Submitting..." : "Request Quote"}
      </button>

      {success && (
        <p className="text-green-600 text-center">
          Quote request submitted successfully.
        </p>
      )}
    </form>
  );
}