import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface NoticePayloadItem {
  id: string;
  index: number;
  strokeCount?: number;
  createdAt?: number;
  imageData?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { papers, clientTimestamp } = body as {
      papers?: NoticePayloadItem[];
      clientTimestamp?: string;
    };

    if (!papers || !Array.isArray(papers) || papers.length === 0) {
      return NextResponse.json(
        { error: "No notice papers provided." },
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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: recipientEmail,
        pass: appPassword,
      },
    });

    const dhakaTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const attachments: Array<{
      filename: string;
      content: Buffer;
      cid: string;
    }> = [];

    const noticeCardsHtml: string[] = [];

    papers.forEach((paper, i) => {
      const idx = paper.index || i + 1;
      const strokeCount = paper.strokeCount ?? 0;
      const cid = `notice_image_${idx}_${Date.now()}`;

      let imageTag = "";

      if (paper.imageData && paper.imageData.startsWith("data:image/")) {
        const base64Data = paper.imageData.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        attachments.push({
          filename: `Notice_${idx}.png`,
          content: buffer,
          cid: cid,
        });

        imageTag = `
          <div style="background-color: #ffffff; padding: 10px; border-radius: 4px; box-shadow: 0 4px 16px rgba(0,0,0,0.5); display: inline-block; max-width: 100%;">
            <img src="cid:${cid}" alt="Notice ${idx}" width="280" style="display: block; width: 100%; max-width: 280px; height: auto; border: 1px solid #e5e7eb;" />
          </div>
        `;
      } else {
        imageTag = `
          <div style="background-color: #1e1e1e; border: 1px dashed #444444; padding: 24px; color: #888888; font-size: 13px;">
            [Blank Note / No Drawing]
          </div>
        `;
      }

      noticeCardsHtml.push(`
        <div style="margin-bottom: 24px; background-color: #111111; border: 1px solid #222222; border-radius: 6px; padding: 18px; text-align: center;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222222; padding-bottom: 10px; margin-bottom: 14px; text-align: left;">
            <div>
              <span style="font-weight: 700; font-size: 14px; color: #ffffff; letter-spacing: -0.01em;">Notice #${idx}</span>
            </div>
            <div>
              <span style="font-size: 11px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">
                ${strokeCount} ${strokeCount === 1 ? "stroke" : "strokes"} drawn
              </span>
            </div>
          </div>
          ${imageTag}
        </div>
      `);
    });

    const plainText = `
[NEW TRANSMISSION FROM PORTFOLIO NOTICE BOARD]

Total Pinned Notices: ${papers.length}
Received: ${dhakaTime} (Dhaka Time)

Summary:
----------------------------------------
A visitor has packaged and transmitted ${papers.length} notice ${papers.length === 1 ? "sketch" : "sketches"} directly from your interactive Notice Board.
All sketches and drawings have been attached as PNG images to this email.
----------------------------------------
Client Timestamp: ${clientTimestamp || "N/A"}
`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #000000;
      color: #f1f1f1;
      margin: 0;
      padding: 30px 15px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #0a0a0a;
      border: 1px solid #222222;
      border-radius: 8px;
      padding: 32px 24px;
    }
    .header {
      border-bottom: 1px solid #222222;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .tag {
      font-size: 10px;
      letter-spacing: 0.15em;
      color: #34d399;
      font-weight: 700;
      text-transform: uppercase;
      display: inline-block;
      margin-bottom: 8px;
    }
    .title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      color: #ffffff;
      margin: 0 0 6px 0;
    }
    .subtitle {
      font-size: 12px;
      color: #888888;
      margin: 0;
    }
    .stat-bar {
      background-color: #121212;
      border: 1px solid #222222;
      border-radius: 6px;
      padding: 14px 18px;
      margin-bottom: 24px;
    }
    .stat-label {
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #777777;
    }
    .stat-val {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      margin-top: 2px;
    }
    .footer {
      margin-top: 32px;
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
      <span class="tag">[NOTICE BOARD TRANSMISSION]</span>
      <h1 class="title">${papers.length} Pinned ${papers.length === 1 ? "Notice" : "Notices"} Received</h1>
      <p class="subtitle">// Transmission from your interactive portfolio Notice Board</p>
    </div>

    <div class="stat-bar">
      <div class="stat-label">Total Attached Sketches</div>
      <div class="stat-val">${papers.length} ${papers.length === 1 ? "Sheet" : "Sheets"}</div>
      <div style="font-size: 11px; color: #888888; margin-top: 4px;">Time: ${dhakaTime} (Dhaka Time)</div>
    </div>

    <div>
      ${noticeCardsHtml.join("")}
    </div>

    <div class="footer">
      TRANSMITTED VIA MD. YASIN ARAFAT MUBIN PORTFOLIO • NOTICE BOARD
    </div>
  </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"Portfolio Notice Board" <${recipientEmail}>`,
      to: recipientEmail,
      subject: `[NOTICE BOARD] ${papers.length} New ${papers.length === 1 ? "Notice" : "Notices"} Received from Visitor`,
      text: plainText,
      html: htmlContent,
      attachments: attachments,
    });

    return NextResponse.json(
      { success: true, message: "Notices transmitted successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("NoticeBoard API error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to transmit notices.";
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
