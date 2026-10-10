"use client";

import React, { useRef } from "react";
import { Paper } from "./types";
import PaperThumb from "./PaperThumb";
import { gsap } from "@/lib/gsap";

interface BoardProps {
  papers: Paper[];
  pilePapers: Paper[];
  isBoardFull: boolean;
  maxPapers: number;
  onOpenModal: (paperId: string, mode: "new" | "edit", targetRect?: DOMRect) => void;
  onStartDrag: (
    paperId: string,
    from: "modal" | "board",
    e: React.PointerEvent,
    meta?: {
      grabOffsetX: number;
      grabOffsetY: number;
      initialRect: DOMRect;
      rotation: number;
    }
  ) => void;
  justPlacedId: string | null;
  draggingPaperId: string | null;
  boardRef: React.RefObject<HTMLDivElement | null>;
  pileTopRef: React.RefObject<HTMLDivElement | null>;
}

export default function Board({
  papers,
  isBoardFull,
  maxPapers,
  onOpenModal,
  onStartDrag,
  justPlacedId,
  draggingPaperId,
  boardRef,
  pileTopRef,
}: BoardProps) {
  const newSheetAnimRef = useRef<HTMLDivElement>(null);

  // Animate new sheet entering the pile
  const handleTopPileClick = () => {
    if (isBoardFull) return;

    let originRect: DOMRect | undefined;
    if (pileTopRef.current) {
      originRect = pileTopRef.current.getBoundingClientRect();
    }

    // Trigger subtle entrance of next sheet on pile
    if (newSheetAnimRef.current) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReduced) {
        gsap.fromTo(
          newSheetAnimRef.current,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.15 }
        );
      }
    }

    onOpenModal("new", "new", originRect);
  };

  const handleBoardPaperClick = (paperId: string, e?: React.PointerEvent | MouseEvent) => {
    let originRect: DOMRect | undefined;
    if (e && e.currentTarget) {
      originRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    }
    onOpenModal(paperId, "edit", originRect);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-stretch gap-6 lg:gap-10">
      {/* 1. Main Dark Pinboard Container */}
      <div className="flex-1 flex flex-col">
        {/* Board Top Header / Status Line */}
        <div className="flex items-center justify-end py-2 px-1 font-mono-tech text-xs tracking-wider text-neutral-400 uppercase">
          {/* <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold">PINBOARD MATRIX</span>
            <span className="text-neutral-500 hidden sm:inline">{"//"} CLICK TO INSPECT / DRAG TO ARRANGE</span>
          </div> */}
          <div>
            <span className={isBoardFull ? "text-amber-400 font-bold" : "text-neutral-300"}>
              {papers.length} / {maxPapers} PINNED
            </span>
          </div>
        </div>

        {/* Board Canvas Area */}
        <div
          ref={boardRef}
          id="notice-board-surface"
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#0d0d0d] border border-white/15 overflow-hidden select-none shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.13) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        >
          {/* Subtle Board Inner Vignette */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.85)] z-0" />

          {/* Placed Papers on the Board */}
          {papers.map((paper, idx) => (
            <div
              key={paper.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${paper.x * 100}%`,
                top: `${paper.y * 100}%`,
                transform: "translate(-50%, -50%)",
                width: "min(32vw, 175px)",
                zIndex: paper.z,
              }}
            >
              <PaperThumb
                paper={paper}
                index={idx}
                total={papers.length}
                onClick={() => handleBoardPaperClick(paper.id)}
                onStartDrag={(id, e, meta) => onStartDrag(id, "board", e, meta)}
                isJustPlaced={justPlacedId === paper.id}
                isBeingDragged={draggingPaperId === paper.id}
              />
            </div>
          ))}

          {/* Empty Board Hint if all papers cleared */}
          {papers.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none font-mono-tech text-neutral-500 text-xs">
              <span className="text-sm font-bold text-neutral-400 mb-1 uppercase">BOARD IS EMPTY</span>
              <span>Take a sheet from the pile on the right to leave your mark.</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Paper Pile Container (Right on desktop, Below on mobile) */}
      <div className="w-full lg:w-64 flex flex-col justify-between pt-0 lg:pt-8 flex-shrink-0">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4 font-mono-tech text-xs tracking-wider text-neutral-400 uppercase">
            <span>BLANK SHEETS PILE</span>
            <span className="text-white font-bold">{isBoardFull ? "FULL" : "READY"}</span>
          </div>

          <p className="font-mono-tech text-[11px] text-neutral-400 leading-relaxed mb-6">
            Click the top paper to draw with our vector pen. Grab the edges to pin your work onto the board.
          </p>

          {/* Visual Stack of Sheets */}
          <div className="relative w-44 sm:w-48 aspect-[3/4] mx-auto my-4 flex items-center justify-center select-none">
            {/* Sheet 4 (Bottom-most shadow sheet) */}
            <div
              className="absolute inset-0 bg-neutral-200 border border-neutral-400/80 shadow-sm"
              style={{ transform: "rotate(-4deg) translate(-4px, 4px)" }}
            />
            {/* Sheet 3 */}
            <div
              className="absolute inset-0 bg-neutral-100 border border-neutral-300 shadow-sm"
              style={{ transform: "rotate(3deg) translate(3px, -2px)" }}
            />
            {/* Sheet 2 */}
            <div
              ref={newSheetAnimRef}
              className="absolute inset-0 bg-[#fafafa] border border-neutral-300 shadow-sm"
              style={{ transform: "rotate(-1.5deg) translate(-2px, 1px)" }}
            />

            {/* Top Sheet (Interactive Button) */}
            <div
              ref={pileTopRef}
              onClick={handleTopPileClick}
              className={`absolute inset-0 bg-white border border-neutral-300 shadow-md transition-all flex flex-col justify-between p-3 ${
                isBoardFull
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:-translate-y-1 hover:shadow-xl group"
              }`}
              style={{ transform: "rotate(0.5deg)" }}
              role="button"
              tabIndex={isBoardFull ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleTopPileClick();
                }
              }}
              aria-label={
                isBoardFull
                  ? "Board is full. Cannot take new paper."
                  : "Take a new blank paper sheet from the pile to draw"
              }
            >
              {/* Top tape accent */}
              <div className="w-16 h-4 mx-auto -mt-1 bg-neutral-200/60 border border-neutral-300/80 shadow-xs flex items-center justify-center">
                <span className="font-mono-tech text-[8px] tracking-widest text-neutral-400 group-hover:text-black transition-colors">
                  NEW
                </span>
              </div>

              {/* Center icon / invitation */}
              <div className="my-auto text-center flex flex-col items-center justify-center gap-1 font-mono-tech">
                <span className="text-xl group-hover:scale-110 transition-transform">✍︎</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-800">
                  {isBoardFull ? "BOARD FULL" : "CLICK TO DRAW"}
                </span>
                <span className="text-[9px] text-neutral-500">
                  {isBoardFull ? "MAX 30 REACHED" : "+ BLANK SHEET"}
                </span>
              </div>

              {/* Bottom footer hint */}
              <div className="text-center font-mono-tech text-[8px] text-neutral-400 uppercase tracking-widest border-t border-neutral-100 pt-1">
                VECTOR INK
              </div>
            </div>
          </div>
        </div>

        {/* Board Full Notice or Action Helper */}
        {isBoardFull ? (
          <div className="border border-amber-500/30 bg-amber-950/20 p-3 mt-4 text-center font-mono-tech text-xs text-amber-400">
            ⚠️ Board is currently full (30 papers). Reposition or inspect existing notes!
          </div>
        ) : (
          <button
            type="button"
            onClick={handleTopPileClick}
            className="w-full py-3 px-4 bg-white text-black font-bold font-mono-tech text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors mt-4 text-center shadow-sm"
          >
            CREATE NEW NOTE +
          </button>
        )}
      </div>
    </div>
  );
}
