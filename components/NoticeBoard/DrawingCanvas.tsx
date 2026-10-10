"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { Stroke, PenColor, PenSize } from "./types";

interface DrawingCanvasProps {
  initialStrokes: Stroke[];
  activeColor: PenColor;
  activeSize: PenSize;
  onStrokesChange: (strokes: Stroke[]) => void;
  className?: string;
  readOnly?: boolean;
}

// Ramer-Douglas-Peucker line simplification
function rdp(points: [number, number][], epsilon = 0.002): [number, number][] {
  if (points.length <= 2) return points;

  let maxDist = 0;
  let index = 0;
  const [x1, y1] = points[0];
  const [x2, y2] = points[points.length - 1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;

  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    let dist = 0;
    if (lenSq === 0) {
      dist = Math.hypot(px - x1, py - y1);
    } else {
      const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
      const projX = x1 + t * dx;
      const projY = y1 + t * dy;
      dist = Math.hypot(px - projX, py - projY);
    }

    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }

  if (maxDist > epsilon) {
    const left = rdp(points.slice(0, index + 1), epsilon);
    const right = rdp(points.slice(index), epsilon);
    return left.slice(0, -1).concat(right);
  } else {
    return [points[0], points[points.length - 1]];
  }
}

function roundPoint([x, y]: [number, number]): [number, number] {
  return [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000];
}

export default function DrawingCanvas({
  initialStrokes,
  activeColor,
  activeSize,
  onStrokesChange,
  className = "",
  readOnly = false,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>(initialStrokes);
  const currentStrokeRef = useRef<[number, number][] | null>(null);
  const isDrawingRef = useRef(false);

  // Sync internal ref when initialStrokes change externally
  useEffect(() => {
    strokesRef.current = initialStrokes;
    redrawAll();
  }, [initialStrokes]);

  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    for (const stroke of strokesRef.current) {
      if (!stroke.points || stroke.points.length < 1) continue;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.fillStyle = stroke.color;
      ctx.lineWidth = Math.max(1.5, stroke.size * dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (stroke.points.length === 1) {
        const [px, py] = stroke.points[0];
        ctx.arc(px * w, py * h, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }

      // Smooth path using midpoints
      const pts = stroke.points;
      ctx.moveTo(pts[0][0] * w, pts[0][1] * h);

      for (let i = 1; i < pts.length - 1; i++) {
        const midX = ((pts[i][0] + pts[i + 1][0]) / 2) * w;
        const midY = ((pts[i][1] + pts[i + 1][1]) / 2) * h;
        ctx.quadraticCurveTo(pts[i][0] * w, pts[i][1] * h, midX, midY);
      }

      const last = pts[pts.length - 1];
      ctx.lineTo(last[0] * w, last[1] * h);
      ctx.stroke();
    }
  }, []);

  // Resize canvas according to container dimensions and devicePixelRatio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        redrawAll();
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => ro.disconnect();
  }, [redrawAll]);

  const getNormalizedPoint = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const canvas = canvasRef.current;
    if (!canvas) return [0, 0];
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    return roundPoint([x, y]);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    if (e.button !== 0) return; // left click or touch only
    e.currentTarget.setPointerCapture(e.pointerId);

    const pt = getNormalizedPoint(e);
    currentStrokeRef.current = [pt];
    isDrawingRef.current = true;

    // Draw single point immediately
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const dpr = window.devicePixelRatio || 1;
        ctx.fillStyle = activeColor;
        ctx.beginPath();
        ctx.arc(
          pt[0] * canvas.width,
          pt[1] * canvas.height,
          Math.max(1.5, activeSize * dpr) / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use coalesced events if available for high-frequency precision
    const nativeEvt = e.nativeEvent as PointerEvent;
    const events: (PointerEvent | React.PointerEvent<HTMLCanvasElement>)[] =
      typeof nativeEvt?.getCoalescedEvents === "function"
        ? nativeEvt.getCoalescedEvents()
        : [e];
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width;
    const h = canvas.height;

    ctx.strokeStyle = activeColor;
    ctx.lineWidth = Math.max(1.5, activeSize * dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const evt of events) {
      const nx = Math.max(0, Math.min(1, (evt.clientX - rect.left) / rect.width));
      const ny = Math.max(0, Math.min(1, (evt.clientY - rect.top) / rect.height));
      const pt: [number, number] = roundPoint([nx, ny]);

      const prev = currentStrokeRef.current[currentStrokeRef.current.length - 1];
      if (prev && Math.abs(prev[0] - pt[0]) < 0.001 && Math.abs(prev[1] - pt[1]) < 0.001) {
        continue;
      }

      currentStrokeRef.current.push(pt);

      // Incremental curve drawing
      const pts = currentStrokeRef.current;
      if (pts.length > 2) {
        const p1 = pts[pts.length - 3];
        const p2 = pts[pts.length - 2];
        const p3 = pts[pts.length - 1];

        const mid1X = ((p1[0] + p2[0]) / 2) * w;
        const mid1Y = ((p1[1] + p2[1]) / 2) * h;
        const mid2X = ((p2[0] + p3[0]) / 2) * w;
        const mid2Y = ((p2[1] + p3[1]) / 2) * h;

        ctx.beginPath();
        ctx.moveTo(mid1X, mid1Y);
        ctx.quadraticCurveTo(p2[0] * w, p2[1] * h, mid2X, mid2Y);
        ctx.stroke();
      } else if (pts.length === 2) {
        ctx.beginPath();
        ctx.moveTo(pts[0][0] * w, pts[0][1] * h);
        ctx.lineTo(pts[1][0] * w, pts[1][1] * h);
        ctx.stroke();
      }
    }
  };

  const endStroke = () => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    isDrawingRef.current = false;

    const rawPoints = currentStrokeRef.current;
    currentStrokeRef.current = null;

    if (rawPoints.length === 0) return;

    // Simplify points using RDP algorithm
    const simplified = rdp(rawPoints, 0.002).map(roundPoint);

    const newStroke: Stroke = {
      color: activeColor,
      size: activeSize,
      points: simplified,
    };

    const nextStrokes = [...strokesRef.current, newStroke];
    strokesRef.current = nextStrokes;
    onStrokesChange(nextStrokes);
    redrawAll();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    endStroke();
  };

  const handlePointerCancel = () => {
    endStroke();
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`w-full h-full block touch-none select-none ${className}`}
      style={{ touchAction: "none" }}
    />
  );
}
