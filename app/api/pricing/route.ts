import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(
    process.cwd(),
    "data",
    "pricing.json"
);

function readData() {
    try {
        return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    } catch {
        return { services: [], addons: [] };
    }
}

function writeData(data: any) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
    const data = readData();
    return NextResponse.json({ ok: true, data });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        writeData(body);

        return NextResponse.json({
            ok: true,
            message: "Pricing updated",
        });
    } catch (err) {
        console.error("❌ PRICING ERROR:", err);

        return NextResponse.json(
            { ok: false, message: "Failed to update pricing" },
            { status: 500 }
        );
    }
}