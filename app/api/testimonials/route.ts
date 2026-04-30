import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(
    process.cwd(),
    "data",
    "testimonials.json"
);

// ✅ SITE CONTENT (for email destination)
const SITE_CONTENT_PATH = path.join(
    process.cwd(),
    "data",
    "site-content.json"
);

function readData() {
    try {
        return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    } catch {
        return [];
    }
}

function writeData(data: any) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function readSiteContent() {
    try {
        return JSON.parse(fs.readFileSync(SITE_CONTENT_PATH, "utf-8"));
    } catch {
        return {};
    }
}

// ✅ GET ALL TESTIMONIALS
export async function GET() {
    try {
        const data = readData();

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

// ✅ POST HANDLER (SMART LOGIC + EMAIL)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const existing = readData();

        // 🧠 CASE 1: ADMIN SAVE (ARRAY)
        if (Array.isArray(body)) {
            writeData(body);

            return NextResponse.json({
                ok: true,
                message: "Testimonials updated",
            });
        }

        // 🧠 CASE 2: CLIENT SUBMISSION (OBJECT)
        if (body.text && body.name) {
            const newItem = {
                text: body.text,
                name: body.name,
                status: "pending",
                createdAt: new Date().toISOString(),
            };

            const updated = [...existing, newItem];

            writeData(updated);

            // 🔥 SEND EMAIL NOTIFICATION
            try {
                const site = readSiteContent();

                await fetch("http://localhost:3002/api/email/send-notification", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
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
                    }),
                });
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