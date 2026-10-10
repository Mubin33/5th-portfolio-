"use client";

import React, { useRef } from "react";
import { Paper, Stroke } from "./types";
import { gsap } from "@/lib/gsap";

interface PaperThumbProps {
  paper: Paper;
  index: number;
  total: number;
  onClick: (paperId: string) => void;
  onStartDrag?: (
    paperId: string,
    e: React.PointerEvent,
    meta: {
      grabOffsetX: number;
      grabOffsetY: number;
      initialRect: DOMRect;
      rotation: number;
    }
  ) => void;
  isPile?: boolean;
  isJustPlaced?: boolean;
  isBeingDragged?: boolean;
}

// Convert stroke points to crisp, resolution-independent SVG paths
function renderStrokeToSvg(stroke: Stroke, index: number) {
  if (!stroke.points || stroke.points.length === 0) return null;
  const color = stroke.color || "#000000";
  // Bold, prominent line width (in 100x133.33 coordinate space)
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

export default function PaperThumb({
  paper,
  index,
  total,
  onClick,
  onStartDrag,
  isPile = false,
  isJustPlaced = false,
  isBeingDragged = false,
}: PaperThumbProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const hasTriggeredDragRef = useRef(false);

  // Pushpin pop-in settle animation when newly placed
  React.useEffect(() => {
    if (isJustPlaced && pinRef.current) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReduced) {
        gsap.fromTo(
          pinRef.current,
          { scale: 1.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.5)", delay: 0.05 }
        );
      }
    }
  }, [isJustPlaced]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    hasTriggeredDragRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragStartRef.current || hasTriggeredDragRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 6) {
      hasTriggeredDragRef.current = true;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const grabOffsetX = e.clientX - centerX;
      const grabOffsetY = e.clientY - centerY;

      onStartDrag?.(paper.id, e, {
        grabOffsetX,
        grabOffsetY,
        initialRect: rect,
        rotation: paper.rotation || 0,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    if (dragStartRef.current && !hasTriggeredDragRef.current) {
      onClick(paper.id);
    }
    dragStartRef.current = null;
    hasTriggeredDragRef.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(paper.id);
    }
  };

  // If paper is currently being dragged, show a subtle dashed placeholder where it used to be
  if (isBeingDragged) {
    return (
      <div
        className="w-full aspect-[3/4] border-2 border-dashed border-white/30 bg-white/5 rounded-none pointer-events-none select-none transition-opacity"
        style={{
          transform: `rotate(${paper.rotation}deg)`,
        }}
      />
    );
  }

  const hasStrokes = paper.strokes && paper.strokes.length > 0;

  return (
    <button
      ref={containerRef}
      type="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={`group relative w-full aspect-[3/4] bg-white border border-neutral-300 rounded-none select-none text-left focus:outline-none focus:ring-2 focus:ring-white/80 transition-all duration-200 ${
        isPile
          ? "shadow-md hover:shadow-lg cursor-pointer"
          : "shadow-[0_8px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.85)] cursor-grab active:cursor-grabbing hover:scale-[1.38] hover:z-[90]"
      }`}
      style={{
        zIndex: paper.z,
        transform: isPile ? undefined : `rotate(${paper.rotation}deg)`,
      }}
      aria-label={
        isPile
          ? "Blank paper sheet from pile. Click to draw."
          : `Note ${index + 1} of ${total}. Click to inspect or drag to reposition.`
      }
    >
      {/* Pushpin indicator on placed board papers */}
      {!isPile && (
        <div
          ref={pinRef}
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-neutral-900 shadow-[0_2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-neutral-900" />
          </div>
        </div>
      )}

      {/* Note page identifier badge at top left */}
      {!isPile && (
        <div className="absolute top-1.5 left-2 font-sans font-medium text-[10px] text-neutral-400 select-none tracking-normal pointer-events-none group-hover:text-neutral-900 transition-colors">
          #{index + 1}
        </div>
      )}

      {/* Vector drawing container rendering SVG strokes with 100% reliability & infinite sharpness */}
      <div className="w-full h-full p-2.5 sm:p-3 overflow-hidden pointer-events-none relative flex items-center justify-center">
        {hasStrokes ? (
          <svg
            viewBox="0 0 100 133.33"
            className="w-full h-full block pointer-events-none overflow-visible"
            preserveAspectRatio="none"
          >
            {paper.strokes.map((stroke, i) => renderStrokeToSvg(stroke, i))}
          </svg>
        ) : (
          !isPile && (
            <div className="w-full h-full flex flex-col items-center justify-center font-sans text-xs text-neutral-400 font-normal">
              <span>Blank note</span>
              <span className="text-[10px] text-neutral-400/70 mt-0.5">Click to draw</span>
            </div>
          )
        )}
      </div>

      {/* Hover peek indicator hint */}
      {!isPile && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 border border-white/20 text-white font-sans text-[10px] font-medium tracking-normal px-2.5 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap z-50 flex items-center gap-1.5">
          <span>Click to view & edit</span>
          {/* <span className="text-neutral-400">✍︎</span> */}
        </div>
      )}

      {/* Subtle paper hover highlight */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors pointer-events-none" />
    </button>
  );
}
