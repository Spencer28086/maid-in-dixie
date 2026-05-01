import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

// GET → fetch quotes
export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      quotes,
    });
  } catch (error) {
    console.error("QUOTE GET ERROR:", error);

    return NextResponse.json(
      { success: false, quotes: [] },
      { status: 500 }
    );
  }
}

// POST → create quote
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const newQuote = await prisma.quote.create({
      data: {
        name: String(formData.get("name")),
        email: String(formData.get("email")),
        cleaningType: String(formData.get("cleaningType") || ""),
        bedrooms: String(formData.get("bedrooms") || ""),
        bathrooms: String(formData.get("bathrooms") || ""),
        sqft: String(formData.get("sqft") || ""),
        condition: String(formData.get("condition") || ""),
        message: String(formData.get("message") || ""),
        status: "NEW",
        estimate: null,
      },
    });

    return NextResponse.json({
      success: true,
      quote: newQuote,
    });
  } catch (error) {
    console.error("QUOTE POST ERROR:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

// PATCH → update quote
export async function PATCH(req: Request) {
  try {
    const { id, status, estimate } = await req.json();

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        status,
        estimate: estimate ?? undefined,
      },
    });

    // 🔥 SEND EMAIL ON APPROVAL
    if (status === "APPROVED") {
      await sendEmail({
        to: updatedQuote.email,
        subject: "Your Maid in Dixie Quote Is Ready",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color:#d95f91;">Your Quote Is Ready ✨</h2>

            <p>Hi ${updatedQuote.name},</p>

            <p>We’ve reviewed your request and prepared your estimate:</p>

            <p style="font-size:22px; font-weight:bold;">
              $${updatedQuote.estimate}
            </p>

            <a href="https://maidindixiecleaningservices.com/booking"
               style="display:inline-block;margin-top:20px;padding:14px 22px;background:#d95f91;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
               Book Your Cleaning
            </a>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      quote: updatedQuote,
    });
  } catch (error) {
    console.error("QUOTE PATCH ERROR:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

// DELETE → remove quote
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.quote.delete({
      where: { id },
    });

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