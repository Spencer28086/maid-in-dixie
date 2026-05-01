import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files.length) {
            return NextResponse.json({ ok: false, error: "No files" });
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            const blob = await put(file.name, file, {
                access: "public",
                addRandomSuffix: true, // 🔥 FIXES DUPLICATE FILE ERROR
            });

            uploadedUrls.push(blob.url);
        }

        return NextResponse.json({
            ok: true,
            files: uploadedUrls,
        });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ ok: false });
    }
}