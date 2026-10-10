"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Paper, Stroke, PenColor, PenSize } from "./types";
import DrawingCanvas from "./DrawingCanvas";
import { gsap } from "@/lib/gsap";

interface PaperModalProps {
  paper: Paper;
  mode: "new" | "edit";
  onClose: () => void;
  onSaveStrokes: (strokes: Stroke[]) => void;
  onStartDrag: (paperId: string, e: React.PointerEvent) => void;
  onPinAuto: (paperId: string) => void;
  originRect?: DOMRect | null;
}

const COLORS: { label: string; value: PenColor; bg: string }[] = [
  { label: "Black", value: "#000000", bg: "bg-black" },
  { label: "Blue", value: "#2563eb", bg: "bg-blue-600" },
  { label: "Red", value: "#dc2626", bg: "bg-red-600" },
  { label: "Green", value: "#16a34a", bg: "bg-green-600" },
];

const SIZES: { label: string; value: PenSize; dotSize: string }[] = [
  { label: "Fine", value: 2, dotSize: "w-1 h-1" },
  { label: "Medium", value: 4, dotSize: "w-2 h-2" },
  { label: "Bold", value: 8, dotSize: "w-3 h-3" },
];

export default function PaperModal({
  paper,
  mode,
  onClose,
  onSaveStrokes,
  onStartDrag,
  onPinAuto,
  originRect,
}: PaperModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const paperCardRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const [activeColor, setActiveColor] = useState<PenColor>("#000000");
  const [activeSize, setActiveSize] = useState<PenSize>(4);
  const [strokes, setStrokes] = useState<Stroke[]>(paper.strokes);

  const grabStartRef = useRef<{ x: number; y: number } | null>(null);
  const hasTriggeredDragRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync strokes changes
  const handleStrokesChange = useCallback(
    (newStrokes: Stroke[]) => {
      setStrokes(newStrokes);
      onSaveStrokes(newStrokes);
    },
    [onSaveStrokes]
  );

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const next = strokes.slice(0, -1);
    setStrokes(next);
    onSaveStrokes(next);
  };

  const handleClear = () => {
    if (strokes.length === 0) return;
    setStrokes([]);
    onSaveStrokes([]);
  };

  const handlePinAutoClick = () => {
    onSaveStrokes(strokes);
    onPinAuto(paper.id);
  };

  // FLIP animation from originRect to center modal
  useEffect(() => {
    if (!mounted) return;
    const card = paperCardRef.current;
    const backdrop = backdropRef.current;
    if (!card || !backdrop) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    if (originRect) {
      const targetRect = card.getBoundingClientRect();
      if (targetRect.width > 0 && targetRect.height > 0) {
        const dx = originRect.left + originRect.width / 2 - (targetRect.left + targetRect.width / 2);
        const dy = originRect.top + originRect.height / 2 - (targetRect.top + targetRect.height / 2);
        const scaleX = originRect.width / targetRect.width;
        const scaleY = originRect.height / targetRect.height;

        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
        gsap.fromTo(
          card,
          {
            x: dx,
            y: dy,
            scaleX,
            scaleY,
            rotation: -4,
          },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            duration: 0.38,
            ease: "power3.out",
          }
        );
        return;
      }
    }

    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(card, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out" });
  }, [mounted, originRect]);

  // Lock smooth scroll with Lenis while modal is open, without touching body overflow to prevent scrollbar jump
  useEffect(() => {
    const win = window as unknown as { __lenis?: { stop: () => void; start: () => void } };
    win.__lenis?.stop();

    return () => {
      win.__lenis?.start();
    };
  }, []);

  // Escape key to close modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Grab zone pointer tracking (distinguish grab-drag from stationary clicks)
  const handleGrabPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    grabStartRef.current = { x: e.clientX, y: e.clientY };
    hasTriggeredDragRef.current = false;

    // Attach temporary window listeners so dragging starts seamlessly across DOM bounds
    const onWindowMove = (ev: PointerEvent) => {
      if (!grabStartRef.current || hasTriggeredDragRef.current) return;
      const dist = Math.hypot(ev.clientX - grabStartRef.current.x, ev.clientY - grabStartRef.current.y);

      if (dist > 6) {
        hasTriggeredDragRef.current = true;
        cleanupListeners();
        // Save current strokes before initiating drag
        onSaveStrokes(strokes);
        onStartDrag(paper.id, ev as unknown as React.PointerEvent);
      }
    };

    const onWindowUp = () => {
      cleanupListeners();
      grabStartRef.current = null;
      hasTriggeredDragRef.current = false;
    };

    const cleanupListeners = () => {
      window.removeEventListener("pointermove", onWindowMove);
      window.removeEventListener("pointerup", onWindowUp);
      window.removeEventListener("pointercancel", onWindowUp);
    };

    window.addEventListener("pointermove", onWindowMove);
    window.addEventListener("pointerup", onWindowUp);
    window.addEventListener("pointercancel", onWindowUp);
  };

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Draw on notice paper"
      className="fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none"
    >
      {/* Full-screen Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity z-0"
      />

      {/* Centered Modal Container */}
      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center my-auto">
        {/* Paper Sheet */}
        <div
          ref={paperCardRef}
          className="relative w-full aspect-[3/4] bg-white border border-neutral-300 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col z-10"
          style={{ willChange: "transform" }}
        >
          {/* Top Tape Strip */}
          <div
            onPointerDown={handleGrabPointerDown}
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-white/70 border border-neutral-300 shadow-sm z-30 cursor-grab active:cursor-grabbing flex items-center justify-center group"
            title="Drag here to move paper onto the board"
          >
            <span className="font-mono-tech text-[9px] uppercase tracking-widest text-neutral-500 group-hover:text-black">
              ::: DRAG :::
            </span>
          </div>

          {/* Grab Zone Border Margins */}
          {/* <div
            onPointerDown={handleGrabPointerDown}
            className="w-full h-7 cursor-grab active:cursor-grabbing hover:bg-neutral-100/60 transition-colors flex items-center justify-between px-3 text-neutral-400 font-mono-tech text-[10px]"
          >
            <span className="uppercase tracking-wider">PAPER #{paper.id.slice(-4)}</span>
            <span className="text-[9px] tracking-widest text-neutral-400">EDGE = GRAB</span>
          </div> */}

          {/* Middle Row: Left Grab + Canvas + Right Grab */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left grab bar */}
            <div
              onPointerDown={handleGrabPointerDown}
              className="w-7 h-full cursor-grab active:cursor-grabbing hover:bg-neutral-100/60 transition-colors flex-shrink-0"
            />

            {/* Inner DRAW Zone (Canvas) */}
            <div className="flex-1 h-full bg-[#fdfdfd] border border-neutral-200/80 relative cursor-crosshair overflow-hidden">
              <DrawingCanvas
                initialStrokes={strokes}
                activeColor={activeColor}
                activeSize={activeSize}
                onStrokesChange={handleStrokesChange}
              />
            </div>

            {/* Right grab bar */}
            <div
              onPointerDown={handleGrabPointerDown}
              className="w-7 h-full cursor-grab active:cursor-grabbing hover:bg-neutral-100/60 transition-colors flex-shrink-0"
            />
          </div>

          {/* Bottom Grab Margin */}
          {/* <div
            onPointerDown={handleGrabPointerDown}
            className="w-full h-7 cursor-grab active:cursor-grabbing hover:bg-neutral-100/60 transition-colors flex items-center justify-center font-mono-tech text-[10px] text-neutral-400 uppercase tracking-widest"
          >
            ↕ DRAG EDGE TO PIN ↕
          </div> */}
        </div>

        {/* Helpful User Hint */}
        {/* <p className="mt-3.5 text-center font-mono-tech text-xs text-neutral-400 tracking-wider">
          Draw on the paper. Drag its edge or click PIN to place on the board.
        </p> */}

        {/* Bottom Toolbar */}
        <div className="mt-4 w-full bg-neutral-950 border border-white/15 p-3 sm:p-4 flex flex-col gap-3 font-mono-tech z-10">
          {/* Top Toolbar Row: Colors & Sizes */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            {/* Colors */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500 uppercase mr-1">INK:</span>
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setActiveColor(c.value)}
                  className={`w-7 h-7 rounded-full ${c.bg} border-2 transition-transform ${
                    activeColor === c.value
                      ? "border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                      : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                  aria-label={`Select ${c.label} pen color`}
                />
              ))}
            </div>

            {/* Sizes */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-neutral-500 uppercase mr-1">SIZE:</span>
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setActiveSize(s.value)}
                  className={`w-7 h-7 flex items-center justify-center border transition-colors ${
                    activeSize === s.value
                      ? "border-white bg-white text-black font-bold"
                      : "border-white/20 text-neutral-400 hover:border-white/50"
                  }`}
                  aria-label={`Select ${s.label} brush size`}
                >
                  <div
                    className={`${s.dotSize} rounded-full ${
                      activeSize === s.value ? "bg-black" : "bg-neutral-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Toolbar Row: Actions (Undo, Clear, Pin, Close) */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="px-3 py-1.5 border border-white/20 text-xs text-neutral-300 hover:text-white hover:border-white/50 disabled:opacity-30 disabled:pointer-events-none transition-colors uppercase tracking-wider"
                aria-label="Undo last stroke"
              >
                UNDO ↺
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={strokes.length === 0}
                className="px-3 py-1.5 border border-white/20 text-xs text-neutral-300 hover:text-white hover:border-white/50 disabled:opacity-30 disabled:pointer-events-none transition-colors uppercase tracking-wider"
                aria-label="Clear all strokes"
              >
                CLEAR ✕
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePinAutoClick}
                className="px-3.5 py-1.5 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-sm"
                aria-label="Pin paper to board automatically"
              >
                <span>PIN TO BOARD</span>
                <span>📌</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-white/20 text-xs text-neutral-400 hover:text-white hover:border-white/50 transition-colors uppercase tracking-wider"
                aria-label="Close modal without pinning"
              >
                CLOSE [×]
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
