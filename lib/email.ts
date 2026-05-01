import nodemailer from "nodemailer";

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

        console.log("EMAIL SENT:", info.messageId);

        return { ok: true };
    } catch (error) {
        console.error("EMAIL ERROR:", error);

        return { ok: false };
    }
}