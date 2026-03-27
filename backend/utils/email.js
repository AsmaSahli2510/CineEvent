const nodemailer = require("nodemailer");

const buildTransport = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "Email service is not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS (or EMAIL_HOST/EMAIL_PORT/EMAIL_USER/EMAIL_PASS).",
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const transport = buildTransport();

  const appName = "CineEvent";
  const fromAddress =
    process.env.SMTP_FROM ||
    process.env.EMAIL_FROM ||
    process.env.SMTP_USER ||
    process.env.EMAIL_USER;

  await transport.sendMail({
    from: fromAddress,
    to,
    subject: `${appName} password reset`,
    text: `Hi ${name || "there"},\n\nUse this one-time link to reset your password:\n${resetUrl}\n\nThis link expires in 15 minutes and can only be used once.\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <p>Hi ${name || "there"},</p>
      <p>Use this one-time link to reset your password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link expires in <strong>15 minutes</strong> and can only be used once.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
};

module.exports = { sendPasswordResetEmail };
