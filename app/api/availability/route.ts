import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET → return availability
export async function GET() {
  try {
    const data = await prisma.availability.findMany();

    // convert array → object like your frontend expects
    const formatted: Record<string, any> = {};

    data.forEach((item) => {
      formatted[item.date] = {
        status: item.status,
        slots: item.slots,
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("❌ FETCH AVAILABILITY ERROR:", err);

    return NextResponse.json({}, { status: 500 });
  }
}

// POST → save availability
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, status, slots } = body;

    await prisma.availability.upsert({
      where: { date },
      update: {
        status,
        slots: slots || [],
      },
      create: {
        date,
        status,
        slots: slots || [],
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ SAVE AVAILABILITY ERROR:", err);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}