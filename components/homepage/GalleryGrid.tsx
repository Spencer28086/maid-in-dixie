"use client";

import Image from "next/image";

const images = [
  "/gallery/bathtub-before-after-deep-clean-soap-scum-removal-maid-in-dixie.jpg",
  "/gallery/fridge-before-after-deep-cleaning-transformation-maid-in-dixie.jpg",
  "/gallery/kitchen-after-cleaning-modern-island-organized-space-maid-in-dixie.jpg",
  "/gallery/bathroom-after-cleaning-clean-sink-tub-floor-maid-in-dixie.jpg",
  "/gallery/living-room-after-cleaning-organized-modern-space-maid-in-dixie.jpg",
  "/gallery/dining-room-after-cleaning-clean-floor-empty-space-maid-in-dixie.jpg",
];

export default function GalleryGrid() {
  return (
    <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

      {images.map((src, i) => (
        <div
          key={i}
          className="group relative overflow-hidden rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        >
          <Image
            src={src}
            alt="Cleaning result"
            width={600}
            height={600}
            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
          />

          {/* overlay glow */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.25),transparent_40%)] opacity-0 group-hover:opacity-100 transition" />

          {/* label */}
          <span className="absolute bottom-4 left-4 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
            View Result
          </span>
        </div>
      ))}

    </div>
  );
}