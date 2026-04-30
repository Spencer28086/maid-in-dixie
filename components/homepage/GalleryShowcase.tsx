"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

type Slide = {
  src: string;
  cat: string;
};

export default function GalleryShowcase() {
  const [images, setImages] = useState<Slide[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // 🔥 LOAD + MAP DATA (FIXED LOCATION)
  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        const mapped = (data.data || []).flatMap((section: any) =>
          (section.items || [])
            .map((item: any) => {
              if (item.type === "pair" && item.after) {
                return { src: item.after, cat: section.category };
              }

              if (item.type === "combined" && item.beforeAfter) {
                return { src: item.beforeAfter, cat: section.category };
              }

              if (item.type === "single" && item.image) {
                return { src: item.image, cat: section.category };
              }

              return null;
            })
            .filter(Boolean)
        );

        setImages(mapped);
      })
      .catch((err) => console.error("Gallery load error:", err));
  }, []);

  // 🔥 AUTOPLAY
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  const categories = ["All", ...new Set(images.map((img) => img.cat))];

  const filtered =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.cat === activeCategory);

  return (
    <section className="py-20 bg-[#fff7f8]">
      <div className="max-w-6xl mx-auto space-y-10">

        <h2 className="text-3xl font-serif text-center">
          Our Work
        </h2>

        {/* CATEGORY FILTER */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full border ${activeCategory === cat
                  ? "bg-[#d95f91] text-white"
                  : "bg-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SLIDER */}
        <div className="relative">

          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white px-3 py-2 shadow rounded-full"
          >
            ←
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {filtered.map((img, i) => (
                <div
                  key={i}
                  className="min-w-[80%] md:min-w-[40%]"
                >
                  <img
                    src={img.src}
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white px-3 py-2 shadow rounded-full"
          >
            →
          </button>

        </div>

      </div>
    </section>
  );
}