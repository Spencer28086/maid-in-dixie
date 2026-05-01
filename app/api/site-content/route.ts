import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET SITE CONTENT
export async function GET() {
    try {
        let content = await prisma.siteContent.findUnique({
            where: { id: "main" },
        });

        // 🔥 AUTO CREATE IF MISSING
        if (!content) {
            content = await prisma.siteContent.create({
                data: {
                    id: "main",
                    businessName: "Maid in Dixie Cleaning Services",
                    phone: "",
                    email: "",
                    venmo: "",
                    zelle: "",
                    city: "",
                },
            });
        }

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
            data: updated,
        });

    } catch (err) {
        console.error("❌ SITE CONTENT ERROR:", err);

        return NextResponse.json(
            { ok: false, message: "Failed to save content" },
            { status: 500 }
        );
    }
}