import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "availability.json");

function readData() {
  try {
    const json = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(json || "{}");
  } catch {
    return {};
  }
}

function writeData(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET → return availability
export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

// 🔥 UPDATED POST (NOW SUPPORTS SLOTS)
export async function POST(req: Request) {
  const body = await req.json();
  const { date, status, slots } = body;

  const data = readData();

  data[date] = {
    status,
    slots: slots || [],
  };

  writeData(data);

  return NextResponse.json({ success: true });
}