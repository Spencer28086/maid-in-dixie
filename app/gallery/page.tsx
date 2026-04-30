"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

type GalleryItem = {
    before?: string;
    after?: string;
    beforeAfter?: string;
    image?: string;
};

type Category = {
    category: string;
    items: GalleryItem[];
};

export default function GalleryPage() {
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
    });

    // 🔥 AUTOPLAY
    useEffect(() => {
        if (!emblaApi) return;

        const autoplay = setInterval(() => {
            if (emblaApi.canScrollNext()) {
                emblaApi.scrollNext();
            } else {
                emblaApi.scrollTo(0);
            }
        }, 3500); // speed

        return () => clearInterval(autoplay);
    }, [emblaApi]);

    useEffect(() => {
        fetch("/api/gallery")
            .then((res) => res.json())
            .then((res) => {
                setData(res.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading gallery...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#fff7f8] px-6 py-16">
            <div className="max-w-6xl mx-auto space-y-12">

                <h1 className="text-4xl font-serif text-center">
                    Our Work
                </h1>

                {data.map((section, idx) => (
                    <div key={idx} className="space-y-6">

                        <h2 className="text-2xl font-serif text-[#2b1c1f]">
                            {section.category}
                        </h2>

                        <div className="relative">

                            {/* ⬅️ LEFT ARROW */}
                            <button
                                onClick={() => emblaApi?.scrollPrev()}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur px-3 py-2 rounded-full shadow hover:bg-white"
                            >
                                ←
                            </button>

                            {/* SLIDER */}
                            <div className="overflow-hidden" ref={emblaRef}>
                                <div className="flex gap-6">

                                    {section.items.map((item, i) => (
                                        <div
                                            key={i}
                                            className="min-w-[80%] md:min-w-[40%]"
                                        >

                                            {item.before && item.after && (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <img src={item.before} className="h-64 w-full object-cover rounded-lg border" />
                                                    <img src={item.after} className="h-64 w-full object-cover rounded-lg border" />
                                                </div>
                                            )}

                                            {item.beforeAfter && (
                                                <img src={item.beforeAfter} className="h-64 w-full object-cover rounded-lg border" />
                                            )}

                                            {item.image && (
                                                <img src={item.image} className="h-64 w-full object-cover rounded-lg border" />
                                            )}

                                        </div>
                                    ))}

                                </div>
                            </div>

                            {/* ➡️ RIGHT ARROW */}
                            <button
                                onClick={() => emblaApi?.scrollNext()}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur px-3 py-2 rounded-full shadow hover:bg-white"
                            >
                                →
                            </button>

                        </div>

                    </div>
                ))}

            </div>
        </main>
    );
}