"use client";

import { useEffect, useState } from "react";

export default function TikTokAdminPage() {
    const [videos, setVideos] = useState<string[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        fetch("/api/tiktok")
            .then((res) => res.json())
            .then((data) => {
                setVideos(data.videos || []);
            });
    }, []);

    function addVideo() {
        if (!input.trim()) return;

        const id = input.split("/").pop()?.split("?")[0];
        if (!id) return;

        setVideos([...videos, id]);
        setInput("");
    }

    function removeVideo(index: number) {
        setVideos(videos.filter((_, i) => i !== index));
    }

    function save() {
        fetch("/api/tiktok", {
            method: "POST",
            body: JSON.stringify({ videos }),
        });
    }

    return (
        <main className="p-10 max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-serif">TikTok Manager</h1>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste TikTok link..."
                className="w-full border p-3 rounded"
            />

            <button onClick={addVideo} className="bg-pink-500 text-white px-4 py-2 rounded">
                Add Video
            </button>

            <div className="space-y-2">
                {videos.map((v, i) => (
                    <div key={i} className="flex justify-between border p-2 rounded">
                        <span>{v}</span>
                        <button onClick={() => removeVideo(i)}>Remove</button>
                    </div>
                ))}
            </div>

            <button onClick={save} className="bg-black text-white px-6 py-2 rounded">
                Save Changes
            </button>
        </main>
    );
}