"use client";

import { useEffect, useState } from "react";

export default function ContentAdminPage() {
    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/site-content")
            .then((res) => res.json())
            .then((data) => {
                setForm(data.data);
                setLoading(false);
            });
    }, []);

    function handleChange(e: any) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSave() {
        const res = await fetch("/api/site-content", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (data.ok) {
            alert("Saved successfully");
        } else {
            alert("Failed to save");
        }
    }

    if (loading || !form) {
        return (
            <div className="p-10 text-gray-600">
                Loading...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#fff7f8] p-10">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-[#f3d1d8] space-y-6">

                <h1 className="text-2xl font-serif text-[#2b1c1f]">
                    Site Content
                </h1>

                {Object.keys(form).map((key) => (
                    <div key={key} className="space-y-1">
                        <label className="text-sm text-[#76545d] capitalize">
                            {key}
                        </label>

                        <input
                            name={key}
                            value={form[key]}
                            onChange={handleChange}
                            className="w-full border border-[#f3d1d8] rounded-xl px-4 py-2"
                        />
                    </div>
                ))}

                <button
                    onClick={handleSave}
                    className="w-full bg-[#d95f91] text-white py-3 rounded-xl font-semibold hover:bg-[#c94f82]"
                >
                    Save Changes
                </button>

            </div>
        </main>
    );
}