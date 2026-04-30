"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type SiteContent = {
    businessName: string;
    phone: string;
    email: string;
    venmo: string;
    zelle: string;
    city: string;
};

export default function ContactPage() {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/site-content")
            .then((res) => res.json())
            .then((data) => {
                setContent(data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load content:", err);
                setLoading(false);
            });
    }, []);

    if (loading || !content) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading contact information...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#fff7f8] px-6 py-16">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 items-center">

                {/* IMAGE (LEFT SIDE) */}
                <div className="flex justify-center">
                    <Image
                        src="/images/cowgirl.png"
                        alt="Maid in Dixie Character"
                        width={400}
                        height={500}
                        className="drop-shadow-xl transition-transform duration-500 hover:-translate-y-1"
                        priority
                    />
                </div>

                {/* CONTENT CARD (RIGHT SIDE) */}
                <div className="bg-white rounded-3xl shadow-xl border border-[#f3d1d8] p-10 space-y-8">

                    {/* HEADER */}
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-serif text-[#2b1c1f]">
                            Contact Us
                        </h1>
                        <p className="text-[#76545d]">
                            We'd love to hear from you
                        </p>
                    </div>

                    {/* BUSINESS INFO */}
                    <div className="space-y-4 text-[#4a2b33]">
                        <div>
                            <p className="font-semibold">Business Name</p>
                            <p>{content.businessName}</p>
                        </div>

                        <div>
                            <p className="font-semibold">Location</p>
                            <p>{content.city}</p>
                        </div>

                        <div>
                            <p className="font-semibold">Phone</p>
                            <p>{content.phone}</p>
                        </div>

                        <div>
                            <p className="font-semibold">Email</p>
                            <p>{content.email}</p>
                        </div>
                    </div>

                    {/* PAYMENT METHODS */}
                    <div className="space-y-4 text-[#4a2b33]">
                        <h2 className="text-xl font-serif text-[#2b1c1f]">
                            Payment Methods
                        </h2>

                        <div>
                            <p className="font-semibold">Venmo</p>
                            <p>{content.venmo}</p>
                        </div>

                        <div>
                            <p className="font-semibold">Zelle</p>
                            <p>{content.zelle}</p>
                        </div>
                    </div>

                </div> {/* END CONTENT CARD */}

            </div> {/* END GRID */}
        </main>
    );
}