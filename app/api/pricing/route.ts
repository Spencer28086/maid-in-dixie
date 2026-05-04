import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET → return pricing in SAME SHAPE your UI expects
export async function GET() {
    try {
        const data = await prisma.pricing.findMany({
            orderBy: { order: "asc" },
        });

        const services = data
            .filter((item) => item.type === "service")
            .map((item) => ({
                name: item.name,
                price: item.price,
            }));

        const addons = data
            .filter((item) => item.type === "addon")
            .map((item) => ({
                name: item.name,
                price: item.price,
            }));

        return NextResponse.json({
            ok: true,
            data: { services, addons },
        });

    } catch (err) {
        console.error("❌ FETCH PRICING ERROR:", err);

        return NextResponse.json(
            { ok: false },
            { status: 500 }
        );
    }
}

// POST → save pricing
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { services, addons } = body;

        // 🔥 CLEAR OLD DATA
        await prisma.pricing.deleteMany();

        // 🔥 REBUILD WITH ORDER
        const serviceData = services.map((s: any, index: number) => ({
            type: "service",
            name: s.name,
            price: s.price,
            order: index,
        }));

        const addonData = addons.map((a: any, index: number) => ({
            type: "addon",
            name: a.name,
            price: a.price,
            order: index,
        }));

        await prisma.pricing.createMany({
            data: [...serviceData, ...addonData],
        });

        return NextResponse.json({
            ok: true,
            message: "Pricing updated",
        });

    } catch (err) {
        console.error("❌ SAVE PRICING ERROR:", err);

        return NextResponse.json(
            { ok: false, message: "Failed to update pricing" },
            { status: 500 }
        );
    }
}