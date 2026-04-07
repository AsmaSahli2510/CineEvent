const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

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

const sendTicketEmail = async ({
  to,
  guestName,
  eventTitle,
  eventDate,
  bookingReference,
  selectedSeats,
  totalAmount,
  bookingLink,
}) => {
  const transport = buildTransport();

  const appName = "CineEvent";
  const fromAddress =
    process.env.SMTP_FROM ||
    process.env.EMAIL_FROM ||
    process.env.SMTP_USER ||
    process.env.EMAIL_USER;

  const seatsList = Array.isArray(selectedSeats)
    ? selectedSeats.join(", ")
    : selectedSeats || "N/A";

  const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Generate QR code as buffer for email attachment
  const qrData = JSON.stringify({
    bookingRef: bookingReference,
    event: eventTitle,
    date: eventDate,
    seats: seatsList,
    amount: totalAmount.toFixed(2),
  });

  let qrCodeBuffer = null;
  const attachments = [];

  try {
    qrCodeBuffer = await QRCode.toBuffer(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    attachments.push({
      filename: "qr-code.png",
      content: qrCodeBuffer,
      cid: "qrcode@cineevent.com", // Content ID for embedding
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
  }

  await transport.sendMail({
    from: fromAddress,
    to,
    subject: `Your ${appName} Ticket - ${eventTitle}`,
    text: `Hi ${guestName || "there"},\n\nThank you for booking with ${appName}!\n\n=== BOOKING CONFIRMATION ===\nEvent: ${eventTitle}\nDate: ${formattedDate}\nSeats: ${seatsList}\nBooking Reference: ${bookingReference}\nTotal Amount Paid: ${totalAmount.toFixed(2)} TND\n\nKeep this email for your records. Your booking reference is required for admission.\n\nSee you at the cinema!\n\n${appName} Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #000; margin: 0;">🎬 ${appName} Ticket</h1>
          <p style="color: #333; margin: 5px 0 0 0;">Your booking is confirmed!</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${guestName || "there"},</p>
          
          <p style="font-size: 14px; color: #666; margin-bottom: 25px;">Thank you for booking with ${appName}! Here are your ticket details:</p>
          
          <div style="background: white; border-left: 4px solid #ffd700; padding: 15px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong>Event:</strong> ${eventTitle}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0;"><strong>Seats:</strong> ${seatsList}</p>
            <p style="margin: 8px 0;"><strong>Booking Reference:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${bookingReference}</code></p>
            <p style="margin: 8px 0;"><strong>Total Amount Paid:</strong> <span style="color: #ffd700; font-size: 18px; font-weight: bold;">${totalAmount.toFixed(2)} TND</span></p>
          </div>
          
          ${
            qrCodeBuffer
              ? `
          <div style="text-align: center; margin-bottom: 25px;">
            <p style="font-size: 13px; color: #666; margin-bottom: 10px;"><strong>Your QR Code:</strong></p>
            <img src="cid:qrcode@cineevent.com" alt="Booking QR Code" style="width: 200px; height: 200px; border: 2px solid #ffd700; padding: 5px; background: white; border-radius: 6px;" />
            <p style="font-size: 12px; color: #999; margin-top: 8px;">Scan this code at admission</p>
          </div>
          `
              : ""
          }
          
          <div style="background: #fffacd; border: 1px solid #ffd700; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 13px;"><strong>📌 Important:</strong> Keep your booking reference for admission. You'll need to show it or scan the QR code at the cinema.</p>
          </div>
          
          <p style="font-size: 13px; color: #666; margin-bottom: 10px;">Questions? Contact our support team for more information.</p>
          
          <p style="font-size: 12px; color: #999; margin-top: 25px; padding-top: 15px; border-top: 1px solid #ddd;">See you at the cinema!<br/>${appName} Team</p>
        </div>
      </div>
    `,
    attachments,
  });
};

module.exports = {
  sendPasswordResetEmail,
  sendOrganizerApprovalEmail,
  sendOrganizerRejectionEmail,
  sendTicketEmail,
};
