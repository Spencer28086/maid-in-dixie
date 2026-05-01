"use client";

import { useEffect, useState } from "react";

type ServiceFormItem = {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    price: string;
    image: string;
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
    const [services, setServices] = useState<ServiceFormItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadServices() {
            try {
                const res = await fetch("/api/services", { cache: "no-store" });
                const json = await res.json();

                const loaded = Array.isArray(json.data)
                    ? json.data.map(normalizeService)
                    : [];

                setServices(loaded);
            } catch (err) {
                console.error("Failed to load services:", err);
                alert("Failed to load services.");
            } finally {
                setLoading(false);
            }
        }

        loadServices();
    }, []);

    function updateField(
        index: number,
        field: keyof ServiceFormItem,
        value: string
    ) {
        setServices((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value,
            };
            return updated;
        });
    }

    function updateFeature(
        serviceIndex: number,
        featureIndex: number,
        value: string
    ) {
        setServices((prev) => {
            const updated = [...prev];
            const features = [...(updated[serviceIndex].features || [])];

            features[featureIndex] = value;

            updated[serviceIndex] = {
                ...updated[serviceIndex],
                features,
            };

            return updated;
        });
    }

    function addFeature(serviceIndex: number) {
        setServices((prev) => {
            const updated = [...prev];

            updated[serviceIndex] = {
                ...updated[serviceIndex],
                features: [...(updated[serviceIndex].features || []), ""],
            };

            return updated;
        });
    }

    function removeFeature(serviceIndex: number, featureIndex: number) {
        setServices((prev) => {
            const updated = [...prev];
            const features = [...(updated[serviceIndex].features || [])];

            features.splice(featureIndex, 1);

            updated[serviceIndex] = {
                ...updated[serviceIndex],
                features: features.length > 0 ? features : [""],
            };

            return updated;
        });
    }

    function addService() {
        setServices((prev) => [
            ...prev,
            {
                title: "",
                subtitle: "",
                description: "",
                features: [""],
                price: "",
                image: "",
            },
        ]);
    }

    function deleteService(index: number) {
        setServices((prev) => prev.filter((_, i) => i !== index));
    }

    async function save() {
        try {
            setSaving(true);

            const payload = services.map((service) => ({
                title: service.title,
                subtitle: service.subtitle,
                description: service.description,
                features: service.features.filter((feature) => feature.trim() !== ""),
                price: service.price,
                image: service.image,
            }));

            const res = await fetch("/api/services", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                alert("Failed to save services");
                return;
            }

            alert("Services saved successfully");
        } catch (err) {
            console.error("Failed to save services:", err);
            alert("Failed to save services");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="p-10">Loading services...</div>;
    }

    return (
        <main className="min-h-screen bg-[#fff7f8] p-10">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-[#f3d1d8] space-y-8">
                <h1 className="text-2xl font-serif">Services Manager</h1>

                {services.map((service, i) => (
                    <div key={i} className="border p-6 rounded-2xl space-y-4">
                        <input
                            value={service.title}
                            onChange={(e) => updateField(i, "title", e.target.value)}
                            placeholder="Title"
                            className="w-full border p-2 rounded"
                        />

                        <input
                            value={service.subtitle}
                            onChange={(e) => updateField(i, "subtitle", e.target.value)}
                            placeholder="Subtitle"
                            className="w-full border p-2 rounded"
                        />

                        <textarea
                            value={service.description}
                            onChange={(e) => updateField(i, "description", e.target.value)}
                            placeholder="Description"
                            className="w-full border p-2 rounded"
                        />

                        <input
                            value={service.price}
                            onChange={(e) => updateField(i, "price", e.target.value)}
                            placeholder="Price (e.g. Starting at $100 or Custom Quote)"
                            className="w-full border p-2 rounded"
                        />

                        <input
                            value={service.image}
                            onChange={(e) => updateField(i, "image", e.target.value)}
                            placeholder="Image path (/images/services/...)"
                            className="w-full border p-2 rounded"
                        />

                        <div>
                            <p className="font-semibold mb-2">Features</p>

                            {(service.features || [""]).map((feature, fi) => (
                                <div key={fi} className="flex gap-2 mb-2">
                                    <input
                                        value={feature}
                                        onChange={(e) => updateFeature(i, fi, e.target.value)}
                                        className="flex-1 border p-2 rounded"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeFeature(i, fi)}
                                        className="text-red-500"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => addFeature(i)}
                                className="text-sm text-pink-600"
                            >
                                + Add Feature
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => deleteService(i)}
                            className="text-red-600 text-sm"
                        >
                            Delete Service
                        </button>
                    </div>
                ))}

                <button onClick={addService} className="text-pink-600 font-semibold">
                    + Add New Service
                </button>

                <button
                    onClick={save}
                    disabled={saving}
                    className="w-full bg-[#d95f91] text-white py-3 rounded-xl font-semibold disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Services"}
                </button>
            </div>
        </main>
    );
}