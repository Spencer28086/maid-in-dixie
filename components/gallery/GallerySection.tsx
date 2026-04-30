"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { galleryCategories, galleryImages } from "./galleryData";

type GalleryCategory = string;

type GalleryImage = {
  src: string;
  alt: string;
  title: string;
  category: string;
};

type BeforeAfterPair = {
  id: string;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  title: string;
  description: string;
};

const beforeAfterPairs: BeforeAfterPair[] = [];

type LightboxImage = {
  src: string;
  alt: string;
  title: string;
};

type PreviewHandler = (image: LightboxImage) => void;

export default function GallerySection() {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory>("Before & After");
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  const filteredImages = useMemo(() => {
    if (activeCategory === "Before & After") return [];

    return galleryImages.filter(
      (image: GalleryImage) => image.category === activeCategory
    );
  }, [activeCategory]);

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-[#fff8f5] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="absolute -left-24 top-12 h-80 w-80 rounded-full bg-[#f7d6dc]/55 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-[#e8cfc3]/45 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#e8aab5]">
            Our Work
          </p>

          <h2 className="mt-4 font-serif text-4xl text-[#4b332c] sm:text-5xl lg:text-6xl">
            See the Difference
          </h2>

          <p className="mt-4 text-xl italic text-[#e8aab5]">
            Cleaning with southern charm
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#7a6259]">
            Real homes, real details, and real results from Maid in Dixie
            Cleaning Services.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
          {galleryCategories.map((category: GalleryCategory) => {
            const active = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={[
                  "rounded-full border px-5 py-3 text-sm font-semibold shadow-sm transition duration-300",
                  active
                    ? "border-[#e8aab5] bg-[#e8aab5] text-white shadow-[#e8aab5]/30"
                    : "border-[#f0cbd3] bg-white/75 text-[#7a6259] hover:-translate-y-0.5 hover:bg-[#fff1f4]",
                ].join(" ")}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-14">
          {activeCategory === "Before & After" ? (
            <BeforeAfterGallery onPreview={setLightboxImage} />
          ) : (
            <ImageGrid images={filteredImages} onPreview={setLightboxImage} />
          )}
        </div>
      </div>

      {lightboxImage && (
        <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}
    </section>
  );
}

function BeforeAfterGallery({ onPreview }: { onPreview: PreviewHandler }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {beforeAfterPairs.map((pair) => (
        <article
          key={pair.id}
          className="group overflow-hidden rounded-[2rem] border border-[#f3d1d8] bg-white/85 shadow-xl shadow-[#b76e79]/10 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#b76e79]/15"
        >
          <div className="relative p-3">
            <BeforeAfterSlider
              beforeSrc={pair.beforeSrc}
              afterSrc={pair.afterSrc}
              beforeAlt={pair.beforeAlt}
              afterAlt={pair.afterAlt}
            />
          </div>

          <div className="border-t border-[#f3d1d8]/70 bg-gradient-to-br from-white to-[#fff1f4] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8aab5]">
              Before & After
            </p>

            <h3 className="mt-2 font-serif text-2xl text-[#4b332c]">
              {pair.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#7a6259]">
              {pair.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

function ImageGrid({
  images,
  onPreview,
}: {
  images: GalleryImage[];
  onPreview: PreviewHandler;
}) {
  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <button
          key={image.src}
          type="button"
          onClick={() =>
            onPreview({
              src: image.src,
              alt: image.alt,
              title: image.title,
            })
          }
          className="group overflow-hidden rounded-[2rem] border border-[#f3d1d8] bg-white/85 text-left shadow-lg shadow-[#b76e79]/10 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#b76e79]/15"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#4b332c]/45 via-transparent to-transparent opacity-80" />

            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b76e79] shadow-md">
              {image.category}
            </span>
          </div>

          <div className="p-6">
            <h3 className="font-serif text-2xl text-[#4b332c]">
              {image.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#7a6259]">
              Thoughtfully cleaned with care, polish, and attention to the
              little things.
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

function Lightbox({
  image,
  onClose,
}: {
  image: LightboxImage;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d19]/80 px-4 py-8 backdrop-blur-md"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#f3d1d8] bg-[#fff8f5] p-3 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 rounded-full bg-white/90 px-5 py-2 text-sm font-bold text-[#4b332c] shadow-lg transition hover:bg-[#fff1f4]"
        >
          Close
        </button>

        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-white">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="90vw"
            className="object-contain"
          />
        </div>

        <div className="px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8aab5]">
            Maid in Dixie
          </p>

          <h3 className="mt-2 font-serif text-2xl text-[#4b332c]">
            {image.title}
          </h3>

          <p className="mt-1 text-sm text-[#7a6259]">{image.alt}</p>
        </div>
      </div>
    </div>
  );
}