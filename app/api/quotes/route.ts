import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sendEmail } from "@/lib/email";

const dataFile = path.join(process.cwd(), "data/quotes.json");

function ensureFile() {
  const dir = path.dirname(dataFile);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]");
  }
}

export async function GET() {
  try {
    ensureFile();

    const quotes = JSON.parse(fs.readFileSync(dataFile, "utf-8"));

    return NextResponse.json({
      success: true,
      quotes: [...quotes].reverse(),
    });
  } catch (error) {
    console.error("QUOTE GET ERROR:", error);

    return NextResponse.json(
      { success: false, quotes: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    ensureFile();

    const formData = await req.formData();

    const newQuote = {
      id: Date.now().toString(),
      name: formData.get("name"),
      email: formData.get("email"),
      cleaningType: formData.get("cleaningType"),
      bedrooms: formData.get("bedrooms"),
      bathrooms: formData.get("bathrooms"),
      sqft: formData.get("sqft"),
      condition: formData.get("condition"),
      message: formData.get("message"),
      status: "NEW",
      estimate: null,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    existing.push(newQuote);

    fs.writeFileSync(dataFile, JSON.stringify(existing, null, 2));

    return NextResponse.json({ success: true, quote: newQuote });
  } catch (error) {
    console.error("QUOTE POST ERROR:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    ensureFile();

    const { id, status, estimate } = await req.json();

    const quotes = JSON.parse(fs.readFileSync(dataFile, "utf-8"));

    let updatedQuote: any = null;

    const updated = quotes.map((q: any) => {
      if (q.id === id) {
        updatedQuote = {
          ...q,
          status,
          estimate: estimate ?? q.estimate,
        };

        return updatedQuote;
      }

      return q;
    });

    fs.writeFileSync(dataFile, JSON.stringify(updated, null, 2));

    if (status === "APPROVED" && updatedQuote) {
      await sendEmail({
        to: updatedQuote.email,
        subject: "Your Maid in Dixie Quote Is Ready",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color:#d95f91;">Your Quote Is Ready ✨</h2>

            <p>Hi ${updatedQuote.name},</p>

            <p>We’ve reviewed your request and prepared your estimate:</p>

            <p style="font-size:22px; font-weight:bold; color:#2c2c2c;">
              $${updatedQuote.estimate}
            </p>

            <p>
              If you'd like to move forward, please complete your booking request to secure your appointment.
            </p>

            <a href="http://localhost:3002/booking"
               style="display:inline-block; margin-top:20px; padding:14px 22px; background:#d95f91; color:white; text-decoration:none; border-radius:8px; font-weight:bold;">
               Book Your Cleaning
            </a>

            <p style="margin-top:30px; font-size:14px; color:#777;">
              Once your booking is submitted, you will receive a deposit payment link to lock in your date.
            </p>

            <p style="margin-top:20px; font-size:14px; color:#777;">
              We look forward to making your home shine ✨
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, quote: updatedQuote });
  } catch (error) {
    console.error("QUOTE PATCH ERROR:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    ensureFile();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing quote id." },
        { status: 400 }
      );
    }

    const quotes = JSON.parse(fs.readFileSync(dataFile, "utf-8"));

    const updated = quotes.filter((q: any) => q.id !== id);

    fs.writeFileSync(dataFile, JSON.stringify(updated, null, 2));

    return NextResponse.json({
      success: true,
      deletedId: id,
    });
  } catch (error) {
    console.error("QUOTE DELETE ERROR:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}