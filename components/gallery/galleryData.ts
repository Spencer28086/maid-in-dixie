export type GalleryCategory =
  | "Before & After"
  | "Kitchen Cleaning"
  | "Bathroom Cleaning"
  | "Living Spaces"
  | "Deep Cleaning";

export type GalleryImage = {
  src: string;
  alt: string;
  title: string;
  category: Exclude<GalleryCategory, "Before & After">;
};

export const galleryCategories: GalleryCategory[] = [
  "Kitchen Cleaning",
  "Bathroom Cleaning",
  "Living Spaces",
  "Deep Cleaning",
];

export const galleryImages: GalleryImage[] = [
  // 🧼 Kitchen Cleaning
  {
    src: "/gallery/maid-in-dixie-modern-kitchen-clean-wide.jpg",
    alt: "Modern kitchen cleaned",
    title: "Modern Kitchen Shine",
    category: "Kitchen Cleaning",
  },
  {
    src: "/gallery/maid-in-dixie-white-kitchen-clean-detail.jpg",
    alt: "White kitchen detail cleaned",
    title: "White Kitchen Detail",
    category: "Kitchen Cleaning",
  },
  {
    src: "/gallery/maid-in-dixie-kitchen-clean-farmhouse-sink.jpg",
    alt: "Farmhouse sink cleaned",
    title: "Farmhouse Sink Finish",
    category: "Kitchen Cleaning",
  },
  {
    src: "/gallery/kitchen-after-cleaning-clean-counters-clear-floor-maid-in-dixie.jpg",
    alt: "Kitchen counters and floor cleaned",
    title: "Clean Countertops & Floors",
    category: "Kitchen Cleaning",
  },

  // 🚿 Bathroom Cleaning
  {
    src: "/gallery/maid-in-dixie-bathroom-clean-modern-shower.jpg",
    alt: "Modern shower cleaned",
    title: "Modern Shower Clean",
    category: "Bathroom Cleaning",
  },
  {
    src: "/gallery/maid-in-dixie-double-vanity-bathroom-clean.jpg",
    alt: "Double vanity cleaned",
    title: "Double Vanity Polish",
    category: "Bathroom Cleaning",
  },
  {
    src: "/gallery/bathroom-after-cleaning-clean-sink-tub-floor-maid-in-dixie.jpg",
    alt: "Bathroom cleaned sink tub and floor",
    title: "Full Bathroom Refresh",
    category: "Bathroom Cleaning",
  },

  // 🛋 Living Spaces
  {
    src: "/gallery/maid-in-dixie-living-room-clean-natural-light.jpg",
    alt: "Living room cleaned",
    title: "Fresh Living Room",
    category: "Living Spaces",
  },
  {
    src: "/gallery/maid-in-dixie-dining-room-clean-staged.jpg",
    alt: "Dining room cleaned",
    title: "Dining Room Reset",
    category: "Living Spaces",
  },
  {
    src: "/gallery/dining-room-after-cleaning-clean-floor-empty-space-maid-in-dixie.jpg",
    alt: "Dining room floor cleaned",
    title: "Open, Clean Dining Space",
    category: "Living Spaces",
  },

  // ✨ Deep Cleaning
  {
    src: "/gallery/fridge-before-after-deep-cleaning-transformation-maid-in-dixie.jpg",
    alt: "Fridge before and after deep cleaning",
    title: "Fridge Transformation",
    category: "Deep Cleaning",
  },
  {
    src: "/gallery/bathtub-before-after-deep-clean-soap-scum-removal-maid-in-dixie.jpg",
    alt: "Bathtub before and after cleaning",
    title: "Bathtub Deep Clean",
    category: "Deep Cleaning",
  },
  {
    src: "/gallery/shower-corner-before-after-mold-grime-removal-deep-clean-maid-in-dixie.jpg",
    alt: "Shower corner before and after deep clean",
    title: "Shower Detail Work",
    category: "Deep Cleaning",
  },
];