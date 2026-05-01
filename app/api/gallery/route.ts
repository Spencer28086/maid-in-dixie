import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 GET gallery
export async function GET() {
    try {
        const items = await prisma.galleryItem.findMany({
            orderBy: { position: "asc" },
        });

        return NextResponse.json({
            data: items,
        });

    } catch (err) {
        console.error("GET gallery error:", err);

        return NextResponse.json({ data: [] });
    }
}

// 🔹 SAVE gallery
export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body || !body.data) {
            return NextResponse.json({
                ok: false,
                error: "Invalid payload",
            });
        }

        const items = body.data;

        // 🔥 clear existing
        await prisma.galleryItem.deleteMany();

        // 🔥 rebuild
        const formatted = items.map((item: any, index: number) => ({
            imageUrl: item.imageUrl,
            category: item.category || "general",
            type: item.type || "single",
            position: index,
        }));

        await prisma.galleryItem.createMany({
            data: formatted,
        });

        return NextResponse.json({ ok: true });

    } catch (err) {
        console.error("POST gallery error:", err);

        return NextResponse.json({ ok: false });
    }
}