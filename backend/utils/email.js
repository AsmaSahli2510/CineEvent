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

const sendOrganizerApprovalEmail = async ({
  to,
  name,
  dashboardUrl,
  organizationName,
  internalNote,
  checklist,
}) => {
  const transport = buildTransport();

  const appName = "CineEvent";
  const fromAddress =
    process.env.SMTP_FROM ||
    process.env.EMAIL_FROM ||
    process.env.SMTP_USER ||
    process.env.EMAIL_USER;

  const checklistLines = (checklist || [])
    .map((item) => `- ${item}`)
    .join("\n");
  const checklistHtml = (checklist || [])
    .map((item) => `<li>${item}</li>`)
    .join("");

  await transport.sendMail({
    from: fromAddress,
    to,
    subject: `Welcome to CineEvent - Your organizer account is approved!`,
    text: `Hi ${name || "there"},\n\nGreat news! Your organizer application for "${organizationName}" has been approved by our admin team.\n\nValidation checklist passed:\n${checklistLines || "- All required checks completed"}\n\n${internalNote ? `Admin note:\n${internalNote}\n\n` : ""}You can now access your organizer dashboard using this link:\n${dashboardUrl}\n\nAfter your first login via this link, you'll be able to use your email and password to log in normally.\n\nStart creating amazing cinema events today!\n\nCineEvent Team`,
    html: `
      <p>Hi ${name || "there"},</p>
      <p>Great news! Your organizer application for "<strong>${organizationName}</strong>" has been approved by our admin team.</p>
      <p><strong>Validation checklist passed:</strong></p>
      <ul>${checklistHtml || "<li>All required checks completed</li>"}</ul>
      ${internalNote ? `<p><strong>Admin note:</strong><br/>${internalNote}</p>` : ""}
      <p>You can now access your organizer dashboard:</p>
      <p><a href="${dashboardUrl}" style="display: inline-block; background-color: #ffd700; color: #1a1a1a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Access Your Dashboard</a></p>
      <p>Or copy this link: <a href="${dashboardUrl}">${dashboardUrl}</a></p>
      <p><strong>Important:</strong> After your first login via this link, you'll be able to use your email and password to log in normally.</p>
      <p>Start creating amazing cinema events today!</p>
      <p>CineEvent Team</p>
    `,
  });
};

const sendOrganizerRejectionEmail = async ({
  to,
  name,
  organizationName,
  missingItems,
  internalNote,
}) => {
  const transport = buildTransport();

  const fromAddress =
    process.env.SMTP_FROM ||
    process.env.EMAIL_FROM ||
    process.env.SMTP_USER ||
    process.env.EMAIL_USER;

  const missingItemsLines = (missingItems || [])
    .map((item) => `- ${item}`)
    .join("\n");
  const missingItemsHtml = (missingItems || [])
    .map((item) => `<li>${item}</li>`)
    .join("");

  await transport.sendMail({
    from: fromAddress,
    to,
    subject: "CineEvent organizer application update",
    text: `Hi ${name || "there"},\n\nYour organizer application for "${organizationName}" could not be approved at this time.\n\nRequired items still missing:\n${missingItemsLines || "- Additional review details required"}\n\n${internalNote ? `Admin note:\n${internalNote}\n\n` : ""}Please update your documents/information and submit a new organizer application.\n\nCineEvent Team`,
    html: `
      <p>Hi ${name || "there"},</p>
      <p>Your organizer application for "<strong>${organizationName}</strong>" could not be approved at this time.</p>
      <p><strong>Required items still missing:</strong></p>
      <ul>${missingItemsHtml || "<li>Additional review details required</li>"}</ul>
      ${internalNote ? `<p><strong>Admin note:</strong><br/>${internalNote}</p>` : ""}
      <p>Please update your documents/information and submit a new organizer application.</p>
      <p>CineEvent Team</p>
    `,
  });
};

module.exports = {
  sendPasswordResetEmail,
  sendOrganizerApprovalEmail,
  sendOrganizerRejectionEmail,
};
