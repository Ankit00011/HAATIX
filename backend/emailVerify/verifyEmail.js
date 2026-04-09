import sgMail from "@sendgrid/mail";
import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const verifyEmail = async (token, email) => {
  const frontendUrl = process.env.FRONTEND_URL || process.env.PRODUCTION_FRONTEND_URL || "http://localhost:5173";
  const verificationLink = `${frontendUrl.replace(/\/$/, "")}/verify/${token}`;

  const msg = {
    to: email,
    from: process.env.MAIL_USER || "noreply@haatix.com", // Use verified sender
    subject: "Email Verification",
    text: `Hi there,\n\nPlease click the link below to verify your email address:\n${verificationLink}\n\nThanks!`,
    html: `<p>Hi there,</p><p>Please click the link below to verify your email address:</p><p><a href="${verificationLink}">${verificationLink}</a></p><p>Thanks!</p>`,
  };

  try {
    const result = await sgMail.send(msg);
    console.log("Email Sent Successfully via SendGrid", result[0].statusCode);
    return result;
  } catch (error) {
    console.error("Error sending email via SendGrid:", error);
    throw error;
  }
};
