import "dotenv/config";
import { sendMail } from "../utils/mailer.js";

export const sendOTPMail = async (otp, email) => {
  const from = process.env.MAIL_FROM?.trim() || process.env.MAIL_USER?.trim();

  return sendMail({
    from,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
    html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`,
  });
};
