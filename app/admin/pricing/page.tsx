"use client";

import { useEffect, useState } from "react";

export default function PricingAdminPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/pricing")
            .then((res) => res.json())
            .then((res) => setData(res.data));
    }, []);

    function updateItem(type: "services" | "addons", index: number, field: string, value: any) {
        const updated = { ...data };
        updated[type][index][field] = field === "price" ? Number(value) : value;
        setData(updated);
    }

    function addItem(type: "services" | "addons") {
        const updated = { ...data };
        updated[type].push({ name: "", price: 0 });
        setData(updated);
    }

    async function save() {
        const res = await fetch("/api/pricing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (result.ok) {
            alert("Pricing saved");
        } else {
            alert("Error saving pricing");
        }
    }

    if (!data) return <div className="p-10">Loading...</div>;

    return (
        <main className="min-h-screen bg-[#fff7f8] p-10">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-[#f3d1d8] space-y-8">

                <h1 className="text-2xl font-serif">Pricing Manager</h1>

                {/* SERVICES */}
                <div>
                    <h2 className="font-semibold mb-4">Services</h2>

                    {data.services.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 mb-2">
                            <input
                                value={item.name}
                                onChange={(e) => updateItem("services", i, "name", e.target.value)}
                                className="flex-1 border p-2 rounded"
                                placeholder="Service name"
                            />
                            <input
                                type="number"
                                value={item.price}
                                onChange={(e) => updateItem("services", i, "price", e.target.value)}
                                className="w-32 border p-2 rounded"
                            />
                        </div>
                    ))}

                    <button onClick={() => addItem("services")} className="text-sm text-pink-600 mt-2">
                        + Add Service
                    </button>
                </div>

                {/* ADDONS */}
                <div>
                    <h2 className="font-semibold mb-4">Add-ons</h2>

                    {data.addons.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 mb-2">
                            <input
                                value={item.name}
                                onChange={(e) => updateItem("addons", i, "name", e.target.value)}
                                className="flex-1 border p-2 rounded"
                                placeholder="Add-on name"
                            />
                            <input
                                type="number"
                                value={item.price}
                                onChange={(e) => updateItem("addons", i, "price", e.target.value)}
                                className="w-32 border p-2 rounded"
                            />
                        </div>
                    ))}

                    <button onClick={() => addItem("addons")} className="text-sm text-pink-600 mt-2">
                        + Add Add-on
                    </button>
                </div>

                <button
                    onClick={save}
                    className="w-full bg-[#d95f91] text-white py-3 rounded-xl font-semibold"
                >
                    Save Pricing
                </button>

            </div>
        </main>
    );
}