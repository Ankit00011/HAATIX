import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = async (token, email) => {
  const frontendUrl = process.env.FRONTEND_URL || process.env.PRODUCTION_FRONTEND_URL || "http://localhost:5173";
  const verificationLink = `${frontendUrl.replace(/\/$/, "")}/verify/${token}`;
  const mailUser = process.env.MAIL_USER?.trim();
  const mailPass = process.env.MAIL_PASS?.trim();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: mailUser,
      pass: mailPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.verify();
  } catch (verifyError) {
    console.error("Email transporter verification failed:", verifyError);
    throw verifyError;
  }

  const mailConfigurations = {
    from: mailUser,
    to: email,
    subject: "Email Verification",
    text: `Hi there,\n\nPlease click the link below to verify your email address:\n${verificationLink}\n\nThanks!`,
    html: `<p>Hi there,</p><p>Please click the link below to verify your email address:</p><p><a href="${verificationLink}">${verificationLink}</a></p><p>Thanks!</p>`,
  };

  try {
    const info = await transporter.sendMail(mailConfigurations);
    console.log("Email Sent Successfully", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
