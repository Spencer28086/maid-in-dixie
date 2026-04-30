"use client";

import { useState } from "react";

export default function AdminLogin() {
    const [password, setPassword] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/admin-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
        });

        if (res.ok) {
            window.location.href = "/admin";
        } else {
            alert("Incorrect password");
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#fff8f6]">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-xl shadow-lg border border-[#f3d1d8]"
            >
                <h1 className="text-2xl font-serif mb-4 text-center">
                    Admin Login
                </h1>

                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border px-4 py-2 rounded mb-4"
                />

                <button
                    type="submit"
                    className="w-full bg-[#d95f91] text-white py-2 rounded"
                >
                    Login
                </button>
            </form>
        </main>
    );
}