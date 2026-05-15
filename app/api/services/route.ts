import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET services
export async function GET() {
    try {
        const data = await prisma.serviceItem.findMany({
            orderBy: { position: "asc" },
        });

        return NextResponse.json({
            ok: true,
            data,
        });

    } catch (err) {
        console.error("SERVICES GET ERROR:", err);

        return NextResponse.json(
            { ok: false, data: [] },
            { status: 500 }
        );
    }
}

// SAVE services
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // CLEAR EXISTING
        await prisma.serviceItem.deleteMany();

        const formatted = body.map((item: any, index: number) => ({
            name: item.title || item.name || "",
            subtitle: item.subtitle || null,
            description: item.description || "",
            features: Array.isArray(item.features)
                ? item.features.filter((f: string) => f.trim() !== "")
                : [],
            image: item.image || null,
            customQuote: Boolean(item.customQuote),

            // KEEP STRING SUPPORT
            // allows:
            // "120+"
            // "$180+"
            // null
            // custom quote services
            price:
                item.price === null ||
                    item.price === undefined ||
                    item.price === ""
                    ? null
                    : String(item.price),

            position: index,
        }));

        await prisma.serviceItem.createMany({
            data: formatted,
        });

        return NextResponse.json({
            ok: true,
        });

    } catch (err) {
        console.error("SERVICES POST ERROR:", err);

        return NextResponse.json(
            { ok: false },
            { status: 500 }
        );
    }
}