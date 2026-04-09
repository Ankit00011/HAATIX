import sgMail from "@sendgrid/mail";
import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOTPMail = async (otp, email) => {
  const msg = {
    to: email,
    from: process.env.MAIL_USER || "noreply@haatix.com", // Use verified sender
    subject: "Password Reset OTP",
    html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`,
  };

  try {
    const result = await sgMail.send(msg);
    console.log("OTP Email Sent Successfully via SendGrid", result[0].statusCode);
    return result;
  } catch (error) {
    console.error("Error sending OTP email via SendGrid:", error);
    throw error;
  }
};
