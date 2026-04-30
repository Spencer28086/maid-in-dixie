import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "services.json");

function read() {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function write(data: any) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
    return NextResponse.json({ ok: true, data: read() });
}

export async function POST(req: Request) {
    const body = await req.json();
    write(body);
    return NextResponse.json({ ok: true });
}