import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "tiktok.json");

export async function GET() {
    try {
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ videos: [] });
        }

        const raw = fs.readFileSync(filePath, "utf-8");
        const json = JSON.parse(raw);

        return NextResponse.json(json);
    } catch (err) {
        console.error("TikTok GET error:", err);
        return NextResponse.json({ videos: [] });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        fs.writeFileSync(filePath, JSON.stringify(body, null, 2));

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("TikTok POST error:", err);
        return NextResponse.json({ ok: false });
    }
}