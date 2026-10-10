"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Stroke } from "./types";
import { gsap } from "@/lib/gsap";

interface DragGhostProps {
  paperId: string;
  strokes: Stroke[];
  from: "modal" | "board";
  initialWidth: number;
  initialHeight: number;
  targetWidth: number;
  targetHeight: number;
  startPointerX: number;
  startPointerY: number;
  grabOffsetX: number;
  grabOffsetY: number;
  initialRotation: number;
  boardRef: React.RefObject<HTMLDivElement | null>;
  onDrop: (normX: number, normY: number) => void;
  onCancel: () => void;
}

// Convert stroke points to crisp SVG paths
function renderStrokeToSvg(stroke: Stroke, index: number) {
  if (!stroke.points || stroke.points.length === 0) return null;
  const color = stroke.color || "#000000";
  const strokeWidth = Math.max(2.8, (stroke.size || 4) * 0.95);

  if (stroke.points.length === 1) {
    const [px, py] = stroke.points[0];
    const r = strokeWidth / 2;
    return (
      <circle
        key={index}
        cx={px * 100}
        cy={py * 133.33}
        r={r}
        fill={color}
      />
    );
  }

  const pts = stroke.points;
  let d = `M ${(pts[0][0] * 100).toFixed(2)} ${(pts[0][1] * 133.33).toFixed(2)}`;

  for (let i = 1; i < pts.length - 1; i++) {
    const midX = (((pts[i][0] + pts[i + 1][0]) / 2) * 100).toFixed(2);
    const midY = (((pts[i][1] + pts[i + 1][1]) / 2) * 133.33).toFixed(2);
    d += ` Q ${(pts[i][0] * 100).toFixed(2)} ${(pts[i][1] * 133.33).toFixed(2)} ${midX} ${midY}`;
  }

  const last = pts[pts.length - 1];
  d += ` L ${(last[0] * 100).toFixed(2)} ${(last[1] * 133.33).toFixed(2)}`;

  return (
    <path
      key={index}
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export default function DragGhost({
  strokes,
  from,
  initialWidth,
  targetWidth,
  targetHeight,
  startPointerX,
  startPointerY,
  grabOffsetX,
  grabOffsetY,
  initialRotation,
  boardRef,
  onDrop,
  onCancel,
}: DragGhostProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Position and velocity refs
  const posRef = useRef({
    x: startPointerX - grabOffsetX,
    y: startPointerY - grabOffsetY,
    prevX: startPointerX,
    prevT: Date.now(),
  });

  const isDroppingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Main GSAP drag & velocity follow logic
  useEffect(() => {
    if (!mounted) return;
    const el = containerRef.current;
    if (!el) return;

    document.body.style.cursor = "grabbing";

    // Prevent wheel and touch scrolling during drag WITHOUT hiding the scrollbar
    const onPreventScroll = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener("wheel", onPreventScroll, { passive: false });
    window.addEventListener("touchmove", onPreventScroll, { passive: false });

    const initialX = startPointerX - grabOffsetX;
    const initialY = startPointerY - grabOffsetY;

    // Immediately set exact position
    gsap.set(el, {
      x: initialX,
      y: initialY,
      xPercent: -50,
      yPercent: -50,
      scale: from === "modal" ? initialWidth / targetWidth : 1.05,
      rotation: initialRotation,
    });

    // Animate scale down if dragged out from modal
    if (from === "modal") {
      gsap.to(el, {
        scale: 1.05,
        duration: 0.22,
        ease: "power2.out",
      });
    }

    // Ultra-responsive quickTo interpolators (0.06s) - feels instantaneous, zero latency
    const quickX = gsap.quickTo(el, "x", { duration: 0.06, ease: "power1.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 0.06, ease: "power1.out" });
    const quickRot = gsap.quickTo(el, "rotation", { duration: 0.18, ease: "power2.out" });

    // Smooth window pointer listeners
    const onPointerMove = (e: PointerEvent) => {
      if (isDroppingRef.current) return;

      const curTargetX = e.clientX - grabOffsetX;
      const curTargetY = e.clientY - grabOffsetY;

      posRef.current.x = curTargetX;
      posRef.current.y = curTargetY;

      quickX(curTargetX);
      quickY(curTargetY);

      // Compute horizontal velocity for natural tilt
      const now = Date.now();
      const dt = Math.max(16, now - posRef.current.prevT);
      const vx = (e.clientX - posRef.current.prevX) / (dt / 16);

      const tilt = Math.max(-14, Math.min(14, initialRotation + vx * 0.4));
      quickRot(tilt);

      posRef.current.prevX = e.clientX;
      posRef.current.prevT = now;
    };

    const cleanupScrollAndEvents = () => {
      document.body.style.cursor = "";
      window.removeEventListener("wheel", onPreventScroll);
      window.removeEventListener("touchmove", onPreventScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDroppingRef.current) return;
      isDroppingRef.current = true;

      cleanupScrollAndEvents();

      const currentPaperX = posRef.current.x;
      const currentPaperY = posRef.current.y;

      let normX = 0.5;
      let normY = 0.5;
      let targetClientX = currentPaperX;
      let targetClientY = currentPaperY;

      const boardEl = boardRef.current;
      if (boardEl) {
        const boardRect = boardEl.getBoundingClientRect();

        // Calculate normalized coordinate of paper center relative to board
        normX = (currentPaperX - boardRect.left) / boardRect.width;
        normY = (currentPaperY - boardRect.top) / boardRect.height;

        // Clamp so the whole paper stays fully inside board boundaries
        normX = Math.max(0.12, Math.min(0.88, normX));
        normY = Math.max(0.15, Math.min(0.85, normY));

        targetClientX = boardRect.left + normX * boardRect.width;
        targetClientY = boardRect.top + normY * boardRect.height;
      }

      const settleRotation = Math.round((Math.random() * 10 - 5) * 10) / 10;

      // Smooth settle animation to board surface (0.18s) - no sudden snapping
      gsap.to(el, {
        x: targetClientX,
        y: targetClientY,
        scale: 1,
        rotation: settleRotation,
        duration: 0.18,
        ease: "power2.out",
        onComplete: () => {
          onDrop(normX, normY);
        },
      });
    };

    const onPointerCancel = () => {
      if (isDroppingRef.current) return;
      cleanupScrollAndEvents();
      onCancel();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);

    return () => {
      cleanupScrollAndEvents();
    };
  }, [
    mounted,
    from,
    initialWidth,
    targetWidth,
    startPointerX,
    startPointerY,
    grabOffsetX,
    grabOffsetY,
    initialRotation,
    boardRef,
    onDrop,
    onCancel,
  ]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={containerRef}
      className="fixed top-0 left-0 z-[99999] pointer-events-none select-none will-change-transform"
      style={{
        width: `${targetWidth}px`,
        height: `${targetHeight}px`,
      }}
    >
      <div className="relative w-full h-full bg-white border border-neutral-300 shadow-[0_24px_50px_rgba(0,0,0,0.65)] flex flex-col p-2.5">
        {/* Pushpin at the top */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20">
          <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-neutral-900 shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-neutral-900" />
          </div>
        </div>

        {/* Vector SVG drawing */}
        <div className="w-full h-full overflow-hidden flex items-center justify-center">
          <svg
            viewBox="0 0 100 133.33"
            className="w-full h-full block pointer-events-none overflow-visible"
            preserveAspectRatio="none"
          >
            {strokes.map((stroke, i) => renderStrokeToSvg(stroke, i))}
          </svg>
        </div>
      </div>
    </div>,
    document.body
  );
}
