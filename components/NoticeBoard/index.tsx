"use client";

import React, { useRef, useState, useCallback } from "react";
import { useNoticeBoardStore } from "./useNoticeBoardStore";
import Board from "./Board";
import PaperModal from "./PaperModal";
import DragGhost from "./DragGhost";
import { Paper, DragGhostData, Stroke } from "./types";

export default function NoticeBoard() {
  const store = useNoticeBoardStore();

  const boardRef = useRef<HTMLDivElement | null>(null);
  const pileTopRef = useRef<HTMLDivElement | null>(null);

  const [activePaper, setActivePaper] = useState<Paper | null>(null);
  const [modalOriginRect, setModalOriginRect] = useState<DOMRect | null>(null);
  const [justPlacedId, setJustPlacedId] = useState<string | null>(null);

  // Drag ghost state
  const [dragGhostData, setDragGhostData] = useState<DragGhostData | null>(null);

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
      let targetW = 140;
      let targetH = 186;
      if (boardRef.current) {
        const bw = boardRef.current.clientWidth;
        targetW = Math.min(bw * 0.28, 150);
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

          <div className="font-mono-tech text-xs tracking-wider text-neutral-400 max-w-sm uppercase space-y-1">
            <p className="text-white font-semibold"> LEAVE A DRAWING. PIN IT ANYWHERE.</p>
            <p className="text-neutral-500 font-light text-[11px]">
              Interactive vector pinboard. Take a sheet from the pile, sketch your idea, and drag it onto the board.
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
    </section>
  );
}
