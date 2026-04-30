import { Resend } from "resend";

function getResend() {
    const key = process.env.RESEND_API_KEY;

    if (!key) {
        throw new Error("Missing RESEND_API_KEY");
    }

    return new Resend(key);
}

export async function sendEmail({
    to,
    subject,
    html,
    bcc,
}: {
    to: string;
    subject: string;
    html: string;
    bcc?: string[]; // ✅ ADDED
}) {
    const resend = getResend();

    return resend.emails.send({
        from: "Maid in Dixie Cleaning Services <onboarding@resend.dev>",
        to,
        subject,
        html,
        replyTo: "maidindixiecleaningservices@gmail.com",
        ...(bcc ? { bcc } : {}), // ✅ ADDED
    });
}