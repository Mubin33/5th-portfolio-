"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNoticeBoardStore } from "./useNoticeBoardStore";
import Board from "./Board";
import PaperModal from "./PaperModal";
import DragGhost from "./DragGhost";
import { Paper, DragGhostData, Stroke } from "./types";
import { gsap } from "@/lib/gsap";

export default function NoticeBoard() {
  const store = useNoticeBoardStore();

  const boardRef = useRef<HTMLDivElement | null>(null);
  const pileTopRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [activePaper, setActivePaper] = useState<Paper | null>(null);
  const [modalOriginRect, setModalOriginRect] = useState<DOMRect | null>(null);
  const [justPlacedId, setJustPlacedId] = useState<string | null>(null);

  // Drag ghost state
  const [dragGhostData, setDragGhostData] = useState<DragGhostData | null>(null);

  // Send all notices state
  const [isSending, setIsSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle opening modal
  const handleOpenModal = useCallback(
    (paperId: string, mode: "new" | "edit", targetRect?: DOMRect) => {
      let paperToOpen: Paper | undefined;

      if (mode === "new" || paperId === "new") {
        paperToOpen = store.createNewPaper();
      } else {
        paperToOpen = store.getPaper(paperId);
      }

      if (!paperToOpen) return;

      setActivePaper(paperToOpen);
      setModalOriginRect(targetRect || null);
      store.openModal(paperToOpen.id, mode);
    },
    [store]
  );

  // Handle closing modal
  const handleCloseModal = useCallback(() => {
    setActivePaper(null);
    setModalOriginRect(null);
    store.closeModal();
  }, [store]);

  // Handle saving strokes from modal
  const handleSaveStrokes = useCallback(
    (strokes: Stroke[]) => {
      if (activePaper) {
        store.updateStrokes(activePaper.id, strokes);
        setActivePaper((prev) => (prev ? { ...prev, strokes } : null));
      }
    },
    [activePaper, store]
  );

  // Auto pin fallback from modal
  const handlePinAuto = useCallback(
    (paperId: string) => {
      store.pinToBoardAuto(paperId);
      setJustPlacedId(paperId);
      handleCloseModal();
      setTimeout(() => setJustPlacedId(null), 1000);
    },
    [store, handleCloseModal]
  );

  // Start drag interaction
  const handleStartDrag = useCallback(
    (
      paperId: string,
      from: "modal" | "board",
      e: React.PointerEvent,
      meta?: {
        grabOffsetX: number;
        grabOffsetY: number;
        initialRect: DOMRect;
        rotation: number;
      }
    ) => {
      const paper = store.getPaper(paperId) || (activePaper?.id === paperId ? activePaper : null);
      if (!paper) return;

      setActivePaper(paper);

      // Measure target paper size on the board
      let targetW = 160;
      let targetH = 213;
      if (boardRef.current) {
        const bw = boardRef.current.clientWidth;
        targetW = Math.min(bw * 0.32, 175);
        targetH = targetW * (4 / 3);
      }

      const initialW = from === "modal" ? Math.min(window.innerWidth * 0.88, 420) : targetW;
      const initialH = initialW * (4 / 3);

      const grabOffsetX = meta ? meta.grabOffsetX : 0;
      const grabOffsetY = meta ? meta.grabOffsetY : 0;
      const initialRotation = meta ? meta.rotation : (paper.rotation || 0);

      setDragGhostData({
        paperId,
        from,
        strokes: paper.strokes,
        initialWidth: initialW,
        initialHeight: initialH,
        targetWidth: targetW,
        targetHeight: targetH,
        startPointerX: e.clientX,
        startPointerY: e.clientY,
        grabOffsetX,
        grabOffsetY,
        initialRotation,
      });

      store.startDrag(paperId, from);

      // Pause Lenis smooth scroll while dragging - NEVER touch body overflow to avoid scrollbar jump
      const win = window as unknown as { __lenis?: { stop: () => void; start: () => void } };
      win.__lenis?.stop();
    },
    [store, activePaper]
  );

  const handleDropComplete = useCallback(
    (normX: number, normY: number) => {
      // Resume Lenis smooth scroll
      const win = window as unknown as { __lenis?: { stop: () => void; start: () => void } };
      win.__lenis?.start();

      if (dragGhostData) {
        store.placePaper(dragGhostData.paperId, normX, normY);
        setJustPlacedId(dragGhostData.paperId);
        setTimeout(() => setJustPlacedId(null), 800);
      }

      setDragGhostData(null);
      setActivePaper(null);
    },
    [dragGhostData, store]
  );

  const handleCancelDrag = useCallback(() => {
    // Resume Lenis smooth scroll
    const win = window as unknown as { __lenis?: { stop: () => void; start: () => void } };
    win.__lenis?.start();

    setDragGhostData(null);
    setActivePaper(null);
    store.cancelDrag();
  }, [store]);

  // Send all notices to Mubin action
  const handleSendAllNotices = () => {
    if (store.boardPapers.length === 0 || isSending) return;
    setIsSending(true);
    const count = store.boardPapers.length;
    setSentCount(count);

    // Animate all papers sweeping/flying up off the board
    const paperElements = document.querySelectorAll("#notice-board-surface .board-paper-item");
    if (paperElements.length > 0) {
      gsap.to(paperElements, {
        y: -140,
        opacity: 0,
        scale: 0.75,
        rotation: () => Math.random() * 24 - 12,
        stagger: 0.05,
        duration: 0.52,
        ease: "power2.in",
        onComplete: () => {
          store.clearBoard();
          setIsSending(false);
          setShowSuccessModal(true);
        },
      });
    } else {
      store.clearBoard();
      setIsSending(false);
      setShowSuccessModal(true);
    }
  };

  return (
    <section
      id="notice-board"
      className="relative w-full min-h-[100svh] bg-black text-white py-24 sm:py-32 md:py-40 px-4 sm:px-8 md:px-12 border-b border-white/10 flex flex-col justify-center select-none"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 border-b border-white/10 pb-8">
          <div>   
            <h2 className="text-section-huge font-bold uppercase tracking-tighter text-white">
              NOTICE<br />BOARD
            </h2>
          </div>

          <div className="font-sans text-sm lg:text-base text-neutral-400 max-w-md space-y-1.5">
            <p className="text-neutral-200 font-medium">Take a page for note. Pin it anywhere on the board.</p>
            <p className="text-neutral-400 font-normal leading-relaxed text-xs lg:text-sm">
              Draw your ideas, thoughts, or doodles on a paper sheet. Once you're ready, send all pinned notices directly to Mubin!
            </p>
          </div>
        </div>

        {/* Main Board & Sheet Pile Assembly */}
        <Board
          papers={store.boardPapers}
          pilePapers={store.pilePapers}
          isBoardFull={store.isBoardFull}
          maxPapers={store.maxPapers}
          onOpenModal={handleOpenModal}
          onStartDrag={handleStartDrag}
          justPlacedId={justPlacedId}
          draggingPaperId={dragGhostData?.paperId || null}
          boardRef={boardRef}
          pileTopRef={pileTopRef}
        />

        {/* Full-width "Send all notices to Mubin" button */}
        <div className="mt-8 sm:mt-10 w-full">
          <button
            type="button"
            onClick={handleSendAllNotices}
            disabled={store.boardPapers.length === 0 || isSending}
            className="group relative w-full overflow-hidden border border-white/20 hover:bg-neutral-950 bg-white hover:text-white text-black py-2 sm:py-4 px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_8px_30px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {/* <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" /> */}
              <div className="text-left">
                <span className="font-sans font-semibold text-sm sm:text-base tracking-normal block">
                  {isSending ? "Sending notices to Mubin..." : "Send all notices to Mubin"}
                </span>
                {/* <span className="font-sans font-normal text-xs text-neutral-400 group-hover:text-neutral-600 transition-colors hidden sm:block">
                  Packages every sketch on this board and delivers it straight to Mubin
                </span> */}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* <span className="font-sans text-xs px-3 py-1 bg-white/10 group-hover:bg-black/10 rounded-full font-medium transition-colors">
                {store.boardPapers.length} {store.boardPapers.length === 1 ? "notice" : "notices"} pinned
              </span> */}
              <span className="font-sans text-base sm:text-lg group-hover:translate-x-1.5 transition-transform duration-300">
                →
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Drawing / Edit Modal */}
      {store.activeMode.type === "modal" && activePaper && (
        <PaperModal
          paper={activePaper}
          mode={store.activeMode.mode}
          onClose={handleCloseModal}
          onSaveStrokes={handleSaveStrokes}
          onStartDrag={(id, e) => handleStartDrag(id, "modal", e)}
          onPinAuto={handlePinAuto}
          originRect={modalOriginRect}
        />
      )}

      {/* Floating Drag Ghost Portal */}
      {store.activeMode.type === "dragging" && dragGhostData && (
        <DragGhost
          paperId={dragGhostData.paperId}
          strokes={dragGhostData.strokes}
          from={dragGhostData.from}
          initialWidth={dragGhostData.initialWidth}
          initialHeight={dragGhostData.initialHeight}
          targetWidth={dragGhostData.targetWidth}
          targetHeight={dragGhostData.targetHeight}
          startPointerX={dragGhostData.startPointerX}
          startPointerY={dragGhostData.startPointerY}
          grabOffsetX={dragGhostData.grabOffsetX}
          grabOffsetY={dragGhostData.grabOffsetY}
          initialRotation={dragGhostData.initialRotation}
          boardRef={boardRef}
          onDrop={handleDropComplete}
          onCancel={handleCancelDrag}
        />
      )}

      {/* Thank you confirmation modal */}
      {showSuccessModal && mounted && (
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[99995] flex items-center justify-center p-4 sm:p-6 select-none"
          >
            {/* Backdrop */}
            <div
              onClick={() => setShowSuccessModal(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
            />

            {/* Modal Card */}
            <div className="relative z-10 w-full max-w-md bg-neutral-950 border border-white/20 p-6 sm:p-8 text-center flex flex-col items-center shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
              {/* Checkmark icon badge */}
              <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-2xl font-bold mb-4 shadow-md">
                ✓
              </div>

              <h3 className="font-sans font-bold text-xl sm:text-2xl text-white tracking-tight mb-2">
                Thank you for your notice!
              </h3>

              <p className="font-sans text-sm text-neutral-300 leading-relaxed mb-2 font-normal">
                Your {sentCount > 1 ? `${sentCount} notices have` : "notice has"} been sent directly to Mubin.
              </p>

              <p className="font-sans text-xs text-neutral-400 leading-relaxed mb-6 font-normal">
                 He will take a look at your doodle and ideas!
              </p>

              <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    handleOpenModal("new", "new");
                  }}
                  className="w-full py-3 px-4 bg-white text-black font-semibold font-sans text-sm hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
                >
                  Create another note +
                </button>

                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3 px-4 border border-white/20 text-neutral-300 hover:text-white hover:border-white/50 font-medium font-sans text-sm transition-colors cursor-pointer"
                >
                  Close ×
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      )}
    </section>
  );
}
