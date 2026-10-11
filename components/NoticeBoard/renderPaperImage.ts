import { Paper } from "./types";

/**
 * Renders a paper note and its sketch strokes to a crisp, high-resolution PNG data URL.
 * Renders on a 600x800 off-screen canvas with paper borders and pushpin.
 */
export function renderPaperToDataUrl(paper: Paper, width = 600, height = 800): string {
  if (typeof document === "undefined") return "";

  try {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // 1. Draw clean white paper background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle light gray paper border
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);

    // 3. Top pushpin badge
    ctx.fillStyle = "#171717";
    ctx.beginPath();
    ctx.arc(width / 2, 24, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 4. If empty or blank note, draw note placeholder
    if (!paper.strokes || paper.strokes.length === 0) {
      ctx.fillStyle = "#9ca3af";
      ctx.font = "italic 22px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("[Empty Note / No Drawing]", width / 2, height / 2);
      return canvas.toDataURL("image/png");
    }

    // 5. Draw all sketch strokes
    for (const stroke of paper.strokes) {
      if (!stroke.points || stroke.points.length === 0) continue;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color || "#000000";
      ctx.fillStyle = stroke.color || "#000000";
      const lineWidth = Math.max(3.2, (stroke.size || 4) * (width / 220));
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (stroke.points.length === 1) {
        const [px, py] = stroke.points[0];
        ctx.arc(px * width, py * height, lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }

      const pts = stroke.points;
      ctx.moveTo(pts[0][0] * width, pts[0][1] * height);

      for (let i = 1; i < pts.length - 1; i++) {
        const midX = ((pts[i][0] + pts[i + 1][0]) / 2) * width;
        const midY = ((pts[i][1] + pts[i + 1][1]) / 2) * height;
        ctx.quadraticCurveTo(pts[i][0] * width, pts[i][1] * height, midX, midY);
      }

      const last = pts[pts.length - 1];
      ctx.lineTo(last[0] * width, last[1] * height);
      ctx.stroke();
    }

    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("renderPaperToDataUrl error:", err);
    return "";
  }
}
