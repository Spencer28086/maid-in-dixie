import nodemailer from "nodemailer";

console.log("ENV CHECK:", {
    EMAIL_USER: process.env.EMAIL_USER,
    HAS_PASS: !!process.env.EMAIL_PASS,
});
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendEmail({
    to,
    subject,
    html,
    bcc,
}: {
    to: string;
    subject: string;
    html: string;
    bcc?: string[];
}) {
    try {
        const info = await transporter.sendMail({
            from: `"Maid in Dixie Cleaning Services" <${process.env.EMAIL_USER}>`,
            to,
            bcc,
            subject,
            html,
            replyTo: "maidindixiecleaningservices@gmail.com",
        });

        console.log("EMAIL SENT:");
        console.log("   TO:", to);
        if (bcc) console.log("   BCC:", bcc);
        console.log("   ID:", info.messageId);

        return { ok: true };
    } catch (error) {
        console.error("EMAIL ERROR:", error);

        return { ok: false };
    }
}