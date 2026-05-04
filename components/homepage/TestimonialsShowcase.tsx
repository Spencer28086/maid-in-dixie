"use client";

import { useEffect, useState } from "react";

export default function TestimonialsShowcase() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  // LOAD APPROVED TESTIMONIALS
  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        const approved = (data.data || []).filter(
          (t: any) => t.status === "approved"
        );
        setTestimonials(approved);
      })
      .catch((err) => {
        console.error("Testimonials load error:", err);
      });
  }, []);

  // AUTO ROTATE
  useEffect(() => {
    if (!testimonials.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials]);

  const current = testimonials.length ? testimonials[index] : null;

  return (
    <section className="relative bg-[#fff1f4] py-32 px-6 overflow-hidden">

      {/* COWGIRL */}
      <img
        src="/cowgirl.png"
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-[300px] opacity-80 hidden lg:block"
        alt=""
      />

      <div className="absolute -top-24 right-0 w-[400px] h-[400px] bg-[#f7d6dc]/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#e8cfc3]/30 rounded-full blur-3xl" />

      {/* Decorative */}
      <div className="pointer-events-none absolute top-12 right-12 opacity-60">
        <img src="/decor/feather.png" className="w-[120px] rotate-12" alt="" />
      </div>

      <div className="pointer-events-none absolute bottom-12 left-12 opacity-60">
        <img src="/decor/spray.png" className="w-[140px] -rotate-12" alt="" />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-[0.45] bg-[url('/decor/sparkles.png')] bg-repeat" />

      <div className="relative max-w-5xl mx-auto text-center">

        <p className="text-[#e8aab5] tracking-[0.4em] uppercase text-sm mb-3">
          Kind Words
        </p>

        <h2 className="text-4xl sm:text-5xl font-serif text-[#4b332c]">
          Trusted by Happy Homes
        </h2>

        <p className="mt-4 text-[#e8aab5] italic text-lg">
          Real experiences from real clients
        </p>

        {/* TESTIMONIAL DISPLAY */}
        <div className="relative mt-20">
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-12 border shadow-xl">

            {current ? (
              <>
                <p className="text-[#7a6259] text-lg leading-8 max-w-2xl mx-auto">
                  {current.text}
                </p>

                <p className="mt-10 font-semibold text-[#4b332c] text-lg">
                  — {current.name}
                </p>
              </>
            ) : (
              <p className="text-gray-500">No testimonials yet.</p>
            )}

          </div>
        </div>

        {/* DOT NAV */}
        {testimonials.length > 0 && (
          <div className="mt-12 flex justify-center gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full ${i === index ? "bg-[#e8aab5]" : "bg-[#f3c9d2]"
                  }`}
              />
            ))}
          </div>
        )}

        {/* SUBMIT FORM */}
        <div className="mt-16 max-w-xl mx-auto bg-white p-6 rounded-2xl shadow border">
          <h3 className="text-lg font-serif mb-4">
            Leave a Testimonial
          </h3>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const form = e.currentTarget as any;
              const text = form.text.value;
              const name = form.name.value;

              const res = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, name }),
              });

              const data = await res.json();

              if (data.ok) {
                alert("Thank you! Awaiting approval.");
                form.reset();
              } else {
                alert("Submission failed.");
              }
            }}
            className="space-y-3"
          >
            <textarea
              name="text"
              required
              placeholder="Your experience..."
              className="w-full border p-2 rounded"
            />

            <input
              name="name"
              required
              placeholder="Your name"
              className="w-full border p-2 rounded"
            />

            <button
              type="submit"
              className="w-full bg-[#d95f91] text-white py-2 rounded"
            >
              Submit
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}