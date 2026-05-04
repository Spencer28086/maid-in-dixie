"use client";

import { useEffect, useState, useRef } from "react";

type ServiceFormItem = {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    price: string;
    image: string;
};

type AddonItem = {
    name: string;
    price: string;
};

function normalizeService(item: any): ServiceFormItem {
    return {
        title: item?.title || item?.name || "",
        subtitle: item?.subtitle || "",
        description: item?.description || item?.desc || "",
        features: Array.isArray(item?.features) ? item.features : [""],
        price:
            item?.price === null || item?.price === undefined
                ? ""
                : String(item.price),
        image: item?.image || "",
    };
}

export default function ServicesAdminPage() {
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [services, setServices] = useState<ServiceFormItem[]>([]);
    const [addons, setAddons] = useState<AddonItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [servicesRes, pricingRes] = await Promise.all([
                    fetch("/api/services", { cache: "no-store" }),
                    fetch("/api/pricing", { cache: "no-store" }),
                ]);

                const servicesJson = await servicesRes.json();
                const pricingJson = await pricingRes.json();

                const loadedServices = Array.isArray(servicesJson.data)
                    ? servicesJson.data.map(normalizeService)
                    : [];

                const loadedAddons = Array.isArray(pricingJson.data?.addons)
                    ? pricingJson.data.addons.map((a: any) => ({
                        name: a.name || "",
                        price: a.price || "",
                    }))
                    : [];

                setServices(loadedServices);
                setAddons(loadedAddons);

            } catch (err) {
                console.error("Load error:", err);
                alert("Failed to load data.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    function updateAddon(index: number, field: keyof AddonItem, value: string) {
        setAddons((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }

    function addAddon() {
        setAddons((prev) => [...prev, { name: "", price: "" }]);
    }

    function deleteAddon(index: number) {
        setAddons((prev) => prev.filter((_, i) => i !== index));
    }

    async function save() {
        try {
            setSaving(true);

            // Save services
            await fetch("/api/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    services.map((s) => ({
                        title: s.title,
                        subtitle: s.subtitle,
                        description: s.description,
                        features: s.features.filter((f) => f.trim() !== ""),
                        price: s.price,
                        image: s.image,
                    }))
                ),
            });

            // Save addons
            await fetch("/api/pricing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    services: [], // not used here
                    addons,
                }),
            });

            alert("Saved successfully");
        } catch (err) {
            console.error("Save error:", err);
            alert("Failed to save");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <main className="min-h-screen bg-[#fff7f8] p-10">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-xl border space-y-10">

                <h1 className="text-2xl font-serif">Services Manager</h1>

                {/* SERVICES (unchanged) */}
                {services.map((service, i) => (
                    <div key={i} className="border p-6 rounded-2xl space-y-4">
                        <input
                            value={service.title}
                            onChange={(e) =>
                                setServices((prev) => {
                                    const updated = [...prev];
                                    updated[i].title = e.target.value;
                                    return updated;
                                })
                            }
                            placeholder="Title"
                            className="w-full border p-2 rounded"
                        />

                        <input
                            value={service.price}
                            onChange={(e) =>
                                setServices((prev) => {
                                    const updated = [...prev];
                                    updated[i].price = e.target.value;
                                    return updated;
                                })
                            }
                            placeholder="Price"
                            className="w-full border p-2 rounded"
                        />
                    </div>
                ))}

                {/* ADD-ONS SECTION */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Add-On Services</h2>

                    {addons.map((addon, i) => (
                        <div key={i} className="flex gap-4">
                            <input
                                value={addon.name}
                                onChange={(e) => updateAddon(i, "name", e.target.value)}
                                placeholder="Name"
                                className="flex-1 border p-2 rounded"
                            />

                            <input
                                value={addon.price}
                                onChange={(e) => updateAddon(i, "price", e.target.value)}
                                placeholder="Price (e.g. 25+)"
                                className="w-32 border p-2 rounded"
                            />

                            <button
                                onClick={() => deleteAddon(i)}
                                className="text-red-500"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={addAddon}
                        className="text-pink-600 font-semibold"
                    >
                        + Add Add-On
                    </button>
                </div>

                <button
                    onClick={save}
                    disabled={saving}
                    className="w-full bg-[#d95f91] text-white py-3 rounded-xl"
                >
                    {saving ? "Saving..." : "Save All"}
                </button>

            </div>
        </main>
    );
}