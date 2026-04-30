"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
};

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: Props) {
  const [position, setPosition] = useState(50);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, percent)));
  };

  return (
    <div
      className="relative w-full aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] cursor-ew-resize"
      onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
      onClick={handleMove}
    >
      {/* AFTER */}
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />

      {/* BEFORE */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-[3px] bg-white shadow-lg"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
        style={{ left: `${position}%`, transform: "translate(-50%, -50%)" }}
      >
        <span className="text-[#d95f91] font-bold text-sm">↔</span>
      </div>

      {/* Labels */}
      <span className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
        Before
      </span>

      <span className="absolute top-4 right-4 bg-[#d95f91] text-white text-xs px-3 py-1 rounded-full">
        After
      </span>
    </div>
  );
}