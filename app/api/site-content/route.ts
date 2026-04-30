import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(
    process.cwd(),
    "data",
    "site-content.json"
);

function readData() {
    try {
        return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    } catch {
        return {};
    }
}

function writeData(data: any) {
    try {
        console.log("💾 WRITING SITE CONTENT TO:", FILE_PATH);
        console.log("📦 DATA:", data);

        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");

        console.log("✅ WRITE SUCCESS");
    } catch (err) {
        console.error("❌ WRITE FAILED:", err);
        throw err;
    }
}

export async function GET() {
    const data = readData();
    return NextResponse.json({ ok: true, data });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("📥 RECEIVED CONTENT UPDATE:", body);

        writeData(body);

        return NextResponse.json({
            ok: true,
            message: "Content updated",
            data: body,
        });
    } catch (err) {
        console.error("❌ SITE CONTENT ERROR:", err);

        return NextResponse.json(
            { ok: false, message: "Failed to update content" },
            { status: 500 }
        );
    }
}