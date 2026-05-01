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

        // clear existing
        await prisma.serviceItem.deleteMany();

        const formatted = body.map((item: any, index: number) => ({
            name: item.title || "", // 🔥 FIXED
            description: item.description || "",
            price: item.price ? parseFloat(item.price) : null,
            position: index,
        }));

        await prisma.serviceItem.createMany({
            data: formatted,
        });

        return NextResponse.json({ ok: true });

    } catch (err) {
        console.error("SERVICES POST ERROR:", err);

        return NextResponse.json(
            { ok: false },
            { status: 500 }
        );
    }
}