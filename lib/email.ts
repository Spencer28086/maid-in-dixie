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
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const resend = getResend();

    return resend.emails.send({
        from: "Maid in Dixie <onboarding@resend.dev>",
        to,
        subject,
        html,

        // 🔥 THIS IS THE KEY LINE
        replyTo: "maidindixiecleaningservices@gmail.com",
    });
}