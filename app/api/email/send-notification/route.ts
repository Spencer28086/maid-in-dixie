import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const { to, subject, html } = await req.json();

        if (!to || !subject || !html) {
            return NextResponse.json(
                { ok: false, message: "Missing fields" },
                { status: 400 }
            );
        }

        console.log("📧 Sending notification email to:", to);

        await sendEmail({
            to,
            subject,
            html,
        });

        return NextResponse.json({
            ok: true,
            message: "Notification email sent",
        });

    } catch (err) {
        console.error("❌ NOTIFICATION EMAIL ERROR:", err);

        return NextResponse.json(
            { ok: false, message: "Email failed" },
            { status: 500 }
        );
    }
}