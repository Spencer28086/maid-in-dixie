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
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, percent)));
  };

  return (
    <div
      className="relative w-full aspect-[4/5] overflow-hidden rounded-xl cursor-ew-resize select-none"
      onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
      onClick={handleMove}
    >
      {/* AFTER (bottom layer) */}
      {afterSrc && (
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          className="object-cover"
        />
      )}

      {/* BEFORE (top clipped layer) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        {beforeSrc && (
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-lg"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-8 h-8 shadow-md flex items-center justify-center"
        style={{ left: `${position}%`, transform: "translate(-50%, -50%)" }}
      >
        <span className="text-xs font-bold text-gray-700">↔</span>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
        Before
      </span>
      <span className="absolute top-3 right-3 bg-[#b76e79] text-white text-xs px-3 py-1 rounded-full">
        After
      </span>
    </div>
  );
}