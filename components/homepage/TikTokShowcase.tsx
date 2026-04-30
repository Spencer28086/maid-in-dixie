"use client";

import { useEffect, useState } from "react";

export default function TikTokShowcase() {
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/tiktok")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.videos || []);
      })
      .catch((err) => {
        console.error("TikTok load error:", err);
      });
  }, []);

  return (
    <section className="bg-[#fbe4eb] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 text-center">

        {/* HEADER */}
        <div className="mb-14">
          <p className="text-sm uppercase tracking-[0.25em] text-[#c77b95]">
            Real Results
          </p>

          <h2 className="mt-3 font-serif text-4xl lg:text-5xl text-[#2f2928]">
            See the Magic in Action
          </h2>

          <p className="mt-4 max-w-xl mx-auto text-[#6b5e5a]">
            Real homes. Real transformations. A little Southern charm in every clean.
          </p>
        </div>

        {/* VIDEOS */}
        <div className="flex flex-wrap justify-center gap-10">

          {videos.map((id, i) => (
            <iframe
              key={i}
              src={`https://www.tiktok.com/embed/v2/${id}`}
              width="325"
              height="575"
              className="rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(0,0,0,0.12)]"
            />
          ))}

        </div>

        {/* CTA */}
        <div className="mt-14">
          <a
            href="https://www.tiktok.com/@maid.in.dixie"
            target="_blank"
            className="inline-flex items-center justify-center rounded-md border border-[#e7d3d8] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#7a5c63] shadow-sm transition hover:border-[#d95f91] hover:text-[#d95f91]"
          >
            Follow on TikTok
          </a>
        </div>

      </div>
    </section>
  );
}