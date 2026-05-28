import nodemailer from "nodemailer";
import "dotenv/config";

const parseBoolean = (value, fallback = false) => {
    if (value === undefined) return fallback;
    return String(value).toLowerCase() === "true";
}; 

const getTransportConfig = () => {
    const mailUser = process.env.MAIL_USER?.trim();
    const mailPass = process.env.MAIL_PASS?.trim();

    if (!mailUser || !mailPass) {
        throw new Error("Email credentials are not configured on the server.");
    }

    const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = parseBoolean(process.env.SMTP_SECURE, port === 465);

    return {
        host,
        port,
        secure,
        auth: {
            user: mailUser,
            pass: mailPass,
        },
        connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 20000),
        greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT || 15000),
        socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 20000),
    };
};

export const createMailerTransport = () => {
    return nodemailer.createTransport(getTransportConfig());
};

export const sendMail = async (mailOptions) => {
    const transporter = createMailerTransport();

    try {
        if (!parseBoolean(process.env.SMTP_SKIP_VERIFY, false)) {
            await transporter.verify();
        }
    } catch (error) {
        console.error("Email transporter verification failed:", error);
        if (error.code === "ETIMEDOUT") {
            throw new Error(
                "SMTP connection timed out. Check SMTP_HOST, SMTP_PORT, SMTP_SECURE, and whether your email provider allows outbound SMTP from the server."
            );
        }
        throw error;
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        if (error.code === "ETIMEDOUT") {
            throw new Error(
                "SMTP connection timed out while sending email. Check your SMTP configuration and provider network access."
            );
        }
        throw error;
    }
};
