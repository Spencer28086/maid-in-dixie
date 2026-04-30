"use client";

import { useEffect, useState } from "react";

export default function ServicesAdminPage() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // LOAD SERVICES
    useEffect(() => {
        fetch("/api/services")
            .then((res) => res.json())
            .then((data) => {
                setServices(data.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load services:", err);
                setLoading(false);
            });
    }, []);

    // UPDATE FIELD
    function updateField(index: number, field: string, value: any) {
        const updated = [...services];
        updated[index][field] = value;
        setServices(updated);
    }

    // UPDATE FEATURE
    function updateFeature(serviceIndex: number, featureIndex: number, value: string) {
        const updated = [...services];
        updated[serviceIndex].features[featureIndex] = value;
        setServices(updated);
    }

    // ADD FEATURE
    function addFeature(serviceIndex: number) {
        const updated = [...services];
        updated[serviceIndex].features.push("");
        setServices(updated);
    }

    // REMOVE FEATURE
    function removeFeature(serviceIndex: number, featureIndex: number) {
        const updated = [...services];
        updated[serviceIndex].features.splice(featureIndex, 1);
        setServices(updated);
    }

    // ADD SERVICE
    function addService() {
        setServices([
            ...services,
            {
                title: "",
                subtitle: "",
                desc: "",
                features: [""],
                price: "",
                image: "",
            },
        ]);
    }

    // DELETE SERVICE
    function deleteService(index: number) {
        const updated = [...services];
        updated.splice(index, 1);
        setServices(updated);
    }

    // SAVE
    async function save() {
        const res = await fetch("/api/services", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(services),
        });

        const data = await res.json();

        if (data.ok) {
            alert("Services saved successfully");
        } else {
            alert("Failed to save services");
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
                            value={service.desc}
                            onChange={(e) => updateField(i, "desc", e.target.value)}
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

                        {/* FEATURES */}
                        <div>
                            <p className="font-semibold mb-2">Features</p>

                            {service.features.map((f: string, fi: number) => (
                                <div key={fi} className="flex gap-2 mb-2">
                                    <input
                                        value={f}
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

                <button
                    onClick={addService}
                    className="text-pink-600 font-semibold"
                >
                    + Add New Service
                </button>

                <button
                    onClick={save}
                    className="w-full bg-[#d95f91] text-white py-3 rounded-xl font-semibold"
                >
                    Save Services
                </button>

            </div>
        </main>
    );
}