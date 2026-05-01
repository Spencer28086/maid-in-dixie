import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET videos
export async function GET() {
    try {
        const videos = await prisma.tikTokVideo.findMany({
            orderBy: { position: "asc" },
        });

        return NextResponse.json({
            videos: videos.map((v) => v.url),
        });

    } catch (err) {
        console.error("TikTok GET error:", err);

        return NextResponse.json({ videos: [] });
    }
}

// SAVE videos
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const videos = body.videos || [];

        // clear existing
        await prisma.tikTokVideo.deleteMany();

        // rebuild with order
        const formatted = videos.map((url: string, index: number) => ({
            url,
            position: index,
        }));

        await prisma.tikTokVideo.createMany({
            data: formatted,
        });

        return NextResponse.json({ ok: true });

    } catch (err) {
        console.error("TikTok POST error:", err);

        return NextResponse.json({ ok: false });
    }
}