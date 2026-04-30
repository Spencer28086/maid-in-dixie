import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "gallery.json");

// 🔹 READ
export async function GET() {
    try {
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ data: [] });
        }

        const raw = fs.readFileSync(filePath, "utf-8");
        const json = JSON.parse(raw);

        return NextResponse.json(json);
    } catch (err) {
        console.error("GET gallery error:", err);
        return NextResponse.json({ data: [] });
    }
}

// 🔹 WRITE
export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body || !body.data) {
            return NextResponse.json({ ok: false, error: "Invalid payload" });
        }

        // ensure folder exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(
            filePath,
            JSON.stringify({ data: body.data }, null, 2),
            "utf-8"
        );

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("POST gallery error:", err);
        return NextResponse.json({ ok: false });
    }
}