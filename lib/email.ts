import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailArgs = {
    to: string;
    subject: string;
    html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailArgs) {
    try {
        const response = await resend.emails.send({
            from: process.env.EMAIL_FROM as string,

            // 🔥 FORCE ALL EMAILS TO YOUR VERIFIED EMAIL (DEV MODE FIX)
            to: "spencertechnologygroup@gmail.com",

            subject,
            html,
        });

        console.log("📧 Email sent:", response);
    } catch (err) {
        console.error("❌ Email error:", err);
    }
}