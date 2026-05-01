import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET SITE CONTENT
export async function GET() {
    try {
        const content = await prisma.siteContent.findUnique({
            where: { id: "main" },
        });

        return NextResponse.json({
            ok: true,
            data: content,
        });
    } catch (err) {
        console.error("❌ FETCH CONTENT ERROR:", err);

        return NextResponse.json(
            { ok: false },
            { status: 500 }
        );
    }
}

// SAVE SITE CONTENT
export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("📥 RECEIVED CONTENT UPDATE:", body);

        const updated = await prisma.siteContent.upsert({
            where: { id: "main" },
            update: body,
            create: {
                id: "main",
                ...body,
            },
        });

        console.log("✅ DB WRITE SUCCESS");

        return NextResponse.json({
            ok: true,
            message: "Content updated",
            data: updated,
        });

    } catch (err) {
        console.error("❌ SITE CONTENT ERROR:", err);

        return NextResponse.json(
            { ok: false, message: "Failed to update content" },
            { status: 500 }
        );
    }
}