import "dotenv/config";
import { sendMail } from "../utils/mailer.js";

export const verifyEmail = async (token, email) => {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    process.env.PRODUCTION_FRONTEND_URL ||
    "http://localhost:5173";

  const verificationLink = `${frontendUrl.replace(/\/$/, "")}/verify/${token}`;
  const from = process.env.MAIL_FROM?.trim() || process.env.MAIL_USER?.trim();

  return sendMail({
    from,
    to: email,
    subject: "Email Verification",
    text: `Hi there,\n\nPlease click the link below to verify your email address:\n${verificationLink}\n\nThanks!`,
    html: `<p>Hi there,</p><p>Please click the link below to verify your email address:</p><p><a href="${verificationLink}">${verificationLink}</a></p><p>Thanks!</p>`,
  });
};
