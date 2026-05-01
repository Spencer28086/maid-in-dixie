import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

// GET ALL TESTIMONIALS
export async function GET() {
    try {
        const data = await prisma.testimonial.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            ok: true,
            data,
        });
    } catch (err) {
        console.error("GET TESTIMONIALS ERROR:", err);

        return NextResponse.json(
            { ok: false, data: [] },
            { status: 500 }
        );
    }
}

// POST HANDLER
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 🧠 CASE 1: ADMIN SAVE (ARRAY)
        if (Array.isArray(body)) {
            // clear existing
            await prisma.testimonial.deleteMany();

            // rebuild
            const formatted = body.map((item: any) => ({
                name: item.name,
                text: item.text,
                status: item.status || "approved",
            }));

            await prisma.testimonial.createMany({
                data: formatted,
            });

            return NextResponse.json({
                ok: true,
                message: "Testimonials updated",
            });
        }

        // 🧠 CASE 2: CLIENT SUBMISSION
        if (body.text && body.name) {
            const newItem = await prisma.testimonial.create({
                data: {
                    name: body.name,
                    text: body.text,
                    status: "pending",
                },
            });

            // 🔥 SEND EMAIL (FIXED — NO localhost)
            try {
                const site = await prisma.siteContent.findUnique({
                    where: { id: "main" },
                });

                if (site?.email) {
                    await sendEmail({
                        to: site.email,
                        subject: "New Testimonial Submitted",
                        html: `
              <h2>New Testimonial Awaiting Approval</h2>
              <p><strong>Name:</strong> ${newItem.name}</p>
              <p><strong>Message:</strong></p>
              <p>${newItem.text}</p>
              <br/>
              <p>Go to your admin panel to approve or deny this testimonial.</p>
            `,
                    });
                }
            } catch (emailErr) {
                console.error("Email notification failed:", emailErr);
            }

            return NextResponse.json({
                ok: true,
                message: "Testimonial submitted",
            });
        }

        return NextResponse.json(
            { ok: false, message: "Invalid request" },
            { status: 400 }
        );

    } catch (err) {
        console.error("POST TESTIMONIALS ERROR:", err);

        return NextResponse.json(
            { ok: false, message: "Server error" },
            { status: 500 }
        );
    }
}