"use client";

import { useEffect, useState } from "react";

type Testimonial = {
    text: string;
    name: string;
    status: "approved" | "pending" | "denied";
};

export default function TestimonialsAdminPage() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    // LOAD
    useEffect(() => {
        fetch("/api/testimonials")
            .then((res) => res.json())
            .then((data) => {
                setItems(data.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Testimonials load error:", err);
                setLoading(false);
            });
    }, []);

    // UPDATE FIELD
    function updateField(index: number, field: keyof Testimonial, value: any) {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    }

    // ADD NEW TESTIMONIAL
    function addItem() {
        setItems([
            ...items,
            {
                text: "",
                name: "",
                status: "pending",
            },
        ]);
    }

    // DELETE
    function deleteItem(index: number) {
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
    }

    // SAVE
    async function save() {
        const res = await fetch("/api/testimonials", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(items),
        });

        const data = await res.json();

        if (data.ok) {
            alert("Testimonials saved");
        } else {
            alert("Failed to save testimonials");
        }
    }

    if (loading) {
        return <div className="p-10">Loading testimonials...</div>;
    }

    return (
        <main className="min-h-screen bg-[#fff7f8] p-10">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-[#f3d1d8] space-y-8">

                <h1 className="text-2xl font-serif">Testimonials Manager</h1>

                {items.map((item, i) => (
                    <div key={i} className="border p-6 rounded-2xl space-y-4">

                        <textarea
                            value={item.text}
                            onChange={(e) => updateField(i, "text", e.target.value)}
                            placeholder="Testimonial text"
                            className="w-full border p-2 rounded"
                        />

                        <input
                            value={item.name}
                            onChange={(e) => updateField(i, "name", e.target.value)}
                            placeholder="Client name"
                            className="w-full border p-2 rounded"
                        />

                        {/* STATUS CONTROL */}
                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={() => updateField(i, "status", "approved")}
                                className={`px-4 py-2 rounded ${item.status === "approved"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200"
                                    }`}
                            >
                                Approve
                            </button>

                            <button
                                type="button"
                                onClick={() => updateField(i, "status", "denied")}
                                className={`px-4 py-2 rounded ${item.status === "denied"
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-200"
                                    }`}
                            >
                                Deny
                            </button>

                            <button
                                type="button"
                                onClick={() => updateField(i, "status", "pending")}
                                className={`px-4 py-2 rounded ${item.status === "pending"
                                        ? "bg-yellow-500 text-white"
                                        : "bg-gray-200"
                                    }`}
                            >
                                Pending
                            </button>

                        </div>

                        <button
                            type="button"
                            onClick={() => deleteItem(i)}
                            className="text-red-600 text-sm"
                        >
                            Delete
                        </button>

                    </div>
                ))}

                <button
                    onClick={addItem}
                    className="text-pink-600 font-semibold"
                >
                    + Add Testimonial
                </button>

                <button
                    onClick={save}
                    className="w-full bg-[#d95f91] text-white py-3 rounded-xl font-semibold"
                >
                    Save Testimonials
                </button>

            </div>
        </main>
    );
}