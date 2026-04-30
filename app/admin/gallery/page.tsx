"use client";

import { useEffect, useState } from "react";

type GalleryItem = {
    type?: "single" | "pair" | "combined";
    image?: string;
    before?: string;
    after?: string;
    beforeAfter?: string;
};

type GallerySection = {
    category: string;
    items: GalleryItem[];
};

export default function GalleryAdminPage() {
    const [sections, setSections] = useState<GallerySection[]>([]);
    const [newCategory, setNewCategory] = useState("");

    // LOAD
    useEffect(() => {
        fetch("/api/gallery")
            .then((res) => res.json())
            .then((data) => {
                const normalized = (data.data || []).map((s: any) => ({
                    category: s.category || "Uncategorized",
                    items: Array.isArray(s.items) ? s.items : [],
                }));
                setSections(normalized);
            });
    }, []);

    // SAVE
    async function save() {
        await fetch("/api/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: sections }),
        });
        alert("Saved");
    }

    // CATEGORY ACTIONS
    function addCategory() {
        if (!newCategory.trim()) return;
        setSections([...sections, { category: newCategory, items: [] }]);
        setNewCategory("");
    }

    function deleteCategory(index: number) {
        const updated = [...sections];
        updated.splice(index, 1);
        setSections(updated);
    }

    function renameCategory(index: number, value: string) {
        const updated = [...sections];
        updated[index].category = value;
        setSections(updated);
    }

    // ITEM ACTIONS
    function addItem(sectionIndex: number) {
        const updated = [...sections];
        updated[sectionIndex].items.push({ type: "single" });
        setSections(updated);
    }

    function deleteItem(sectionIndex: number, itemIndex: number) {
        const updated = [...sections];
        updated[sectionIndex].items.splice(itemIndex, 1);
        setSections(updated);
    }

    function moveItem(sectionIndex: number, itemIndex: number, dir: number) {
        const updated = [...sections];
        const items = updated[sectionIndex].items;
        const target = itemIndex + dir;

        if (target < 0 || target >= items.length) return;

        [items[itemIndex], items[target]] = [items[target], items[itemIndex]];
        setSections(updated);
    }

    function changeType(
        sectionIndex: number,
        itemIndex: number,
        type: "single" | "pair" | "combined"
    ) {
        const updated = [...sections];
        updated[sectionIndex].items[itemIndex] = {
            ...updated[sectionIndex].items[itemIndex],
            type,
        };
        setSections(updated);
    }

    // UPLOAD
    async function upload(sectionIndex: number, itemIndex: number, field: string, file: File) {
        const fd = new FormData();
        fd.append("files", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: fd,
        });

        const data = await res.json();
        if (!data.ok) return alert("Upload failed");

        const updated = [...sections];
        updated[sectionIndex].items[itemIndex][field] = data.files[0];
        setSections(updated);
    }

    return (
        <main className="p-10 bg-[#fff7f8] min-h-screen">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-xl space-y-8">

                <h1 className="text-2xl font-serif">Gallery Manager</h1>

                {/* ADD CATEGORY */}
                <div className="flex gap-2">
                    <input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category"
                        className="border px-3 py-2 rounded"
                    />
                    <button onClick={addCategory} className="bg-pink-500 text-white px-4 rounded">
                        Add
                    </button>
                </div>

                {sections.map((section, i) => (
                    <div key={i} className="space-y-4 border p-4 rounded-xl">

                        {/* CATEGORY HEADER */}
                        <div className="flex justify-between items-center">
                            <input
                                value={section.category}
                                onChange={(e) => renameCategory(i, e.target.value)}
                                className="text-lg font-semibold border-b"
                            />

                            <button
                                onClick={() => deleteCategory(i)}
                                className="text-red-500 text-sm"
                            >
                                Delete Category
                            </button>
                        </div>

                        {/* ITEMS */}
                        <div className="grid md:grid-cols-2 gap-4">

                            {section.items.map((item, j) => (
                                <div key={j} className="border p-3 rounded space-y-2">

                                    {/* TYPE SELECT */}
                                    <select
                                        value={item.type || "single"}
                                        onChange={(e) =>
                                            changeType(
                                                i,
                                                j,
                                                e.target.value as "single" | "pair" | "combined"
                                            )
                                        }
                                        className="border p-1 w-full"
                                    >
                                        <option value="single">Single Image</option>
                                        <option value="pair">Before / After</option>
                                        <option value="combined">Combined</option>
                                    </select>

                                    {/* SINGLE */}
                                    {item.type === "single" && (
                                        <>
                                            {item.image && <img src={item.image} className="h-32 w-full object-cover" />}
                                            <input type="file" onChange={(e) => e.target.files && upload(i, j, "image", e.target.files[0])} />
                                        </>
                                    )}

                                    {/* PAIR */}
                                    {item.type === "pair" && (
                                        <>
                                            <div className="grid grid-cols-2 gap-2">
                                                {item.before && <img src={item.before} className="h-24 object-cover" />}
                                                {item.after && <img src={item.after} className="h-24 object-cover" />}
                                            </div>

                                            <input type="file" onChange={(e) => e.target.files && upload(i, j, "before", e.target.files[0])} />
                                            <input type="file" onChange={(e) => e.target.files && upload(i, j, "after", e.target.files[0])} />
                                        </>
                                    )}

                                    {/* COMBINED */}
                                    {item.type === "combined" && (
                                        <>
                                            {item.beforeAfter && <img src={item.beforeAfter} className="h-32 w-full object-cover" />}
                                            <input type="file" onChange={(e) => e.target.files && upload(i, j, "beforeAfter", e.target.files[0])} />
                                        </>
                                    )}

                                    {/* CONTROLS */}
                                    <div className="flex justify-between text-sm">
                                        <button onClick={() => moveItem(i, j, -1)}>↑</button>
                                        <button onClick={() => moveItem(i, j, 1)}>↓</button>
                                        <button onClick={() => deleteItem(i, j)} className="text-red-500">
                                            Delete
                                        </button>
                                    </div>

                                </div>
                            ))}

                        </div>

                        <button
                            onClick={() => addItem(i)}
                            className="text-pink-600 font-semibold"
                        >
                            + Add Image
                        </button>

                    </div>
                ))}

                <button
                    onClick={save}
                    className="w-full bg-[#d95f91] text-white py-3 rounded-xl font-semibold"
                >
                    Save Gallery
                </button>

            </div>
        </main>
    );
}