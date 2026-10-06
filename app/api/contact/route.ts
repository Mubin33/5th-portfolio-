import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, description } = body;

    // Field validations
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    if (!whatsapp || typeof whatsapp !== "string" || !whatsapp.trim()) {
      return NextResponse.json(
        { error: "WhatsApp number is required." },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        { error: "Project description is required." },
        { status: 400 }
      );
    }

    const recipientEmail = (process.env.EMAIL || "mubinulislam14@gmail.com").trim();
    const appPassword = (process.env.APP_PASSWORD || "").replace(/\s+/g, "");

    if (!appPassword) {
      console.error("APP_PASSWORD environment variable is missing.");
      return NextResponse.json(
        { error: "Mail server credentials not configured." },
        { status: 500 }
      );
    }

    // Configure Nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: recipientEmail,
        pass: appPassword,
      },
    });

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanWhatsapp = whatsapp.trim();
    const cleanDescription = description.trim();

    const plainText = `
[NEW TRANSMISSION FROM PORTFOLIO]

Name: ${cleanName}
Email: ${cleanEmail}
WhatsApp: ${cleanWhatsapp}
Date: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })} (Dhaka Time)

Description / Project Scope:
----------------------------------------
${cleanDescription}
----------------------------------------
`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0c0c0c;
      color: #f1f1f1;
      margin: 0;
      padding: 30px 15px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #000000;
      border: 1px solid #2a2a2a;
      padding: 36px;
    }
    .header {
      border-bottom: 1px solid #222222;
      padding-bottom: 20px;
      margin-bottom: 28px;
    }
    .title {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      color: #ffffff;
      margin: 0 0 6px 0;
    }
    .subtitle {
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #888888;
      margin: 0;
    }
    .info-row {
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid #1a1a1a;
    }
    .info-label {
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #777777;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 15px;
      font-weight: 600;
      color: #ffffff;
    }
    .info-value a {
      color: #ffffff;
      text-decoration: underline;
    }
    .message-box {
      margin-top: 24px;
      padding: 20px;
      background-color: #0a0a0a;
      border: 1px solid #222222;
    }
    .message-text {
      font-size: 14px;
      line-height: 1.6;
      color: #cccccc;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .footer {
      margin-top: 30px;
      border-top: 1px solid #222222;
      padding-top: 16px;
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #555555;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">New Client Transmission</h1>
      <p class="subtitle">// DIRECT INQUIRY FROM PORTFOLIO</p>
    </div>

    <div class="info-row">
      <div class="info-label">Sender Name</div>
      <div class="info-value">${cleanName}</div>
    </div>

    <div class="info-row">
      <div class="info-label">Email Address</div>
      <div class="info-value"><a href="mailto:${cleanEmail}">${cleanEmail}</a></div>
    </div>

    <div class="info-row">
      <div class="info-label">WhatsApp Number</div>
      <div class="info-value"><a href="https://wa.me/${cleanWhatsapp.replace(/[^0-9]/g, "")}">${cleanWhatsapp}</a></div>
    </div>

    <div class="info-row" style="border-bottom: none; margin-bottom: 6px;">
      <div class="info-label">Project Scope / Message</div>
    </div>
    <div class="message-box">
      <div class="message-text">${cleanDescription.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    </div>

    <div class="footer">
      TRANSMITTED VIA MD. YASIN ARAFAT MUBIN PORTFOLIO • DHAKA BANGLADESH
    </div>
  </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"Portfolio Transmission" <${recipientEmail}>`,
      to: recipientEmail,
      replyTo: `${cleanName} <${cleanEmail}>`,
      subject: `[PORTFOLIO TRANSMISSION] ${cleanName} — Inquiry`,
      text: plainText,
      html: htmlContent,
    });

    return NextResponse.json(
      { success: true, message: "Transmission received successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Contact API error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to transmit message.";
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
