import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 GET gallery (RETURN GROUPED STRUCTURE)
export async function GET() {
    try {
        const items = await prisma.galleryItem.findMany({
            orderBy: { position: "asc" },
        });

        // 🔥 GROUP INTO SECTIONS (WHAT FRONTEND EXPECTS)
        const grouped: Record<string, any[]> = {};

        items.forEach((item) => {
            if (!grouped[item.category]) {
                grouped[item.category] = [];
            }

            grouped[item.category].push({
                type: item.type,
                image: item.imageUrl, // 🔥 map DB -> frontend
            });
        });

        const sections = Object.keys(grouped).map((category) => ({
            category,
            items: grouped[category],
        }));

        return NextResponse.json({
            data: sections,
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

        // 🔥 CLEAR OLD DATA
        await prisma.galleryItem.deleteMany();

        // 🔥 FLATTEN SECTIONS INTO DB FORMAT
        let position = 0;

        const formatted = items.flatMap((section: any) =>
            (section.items || []).map((item: any) => {
                const record = {
                    imageUrl: item.image || item.after || item.beforeAfter || "", // 🔥 FIX MAPPING
                    category: section.category || "general",
                    type: item.type || "single",
                    position: position++,
                };

                return record;
            })
        );

        // 🔥 FILTER OUT EMPTY IMAGES (VERY IMPORTANT)
        const cleaned = formatted.filter((item) => item.imageUrl);

        await prisma.galleryItem.createMany({
            data: cleaned,
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("POST gallery error:", err);
        return NextResponse.json({ ok: false });
    }
}