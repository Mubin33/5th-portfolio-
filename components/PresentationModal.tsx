"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalSlides?: number;
}

const TOTAL_SLIDES = 24;

export default function PresentationModal({
  isOpen,
  onClose,
  totalSlides = TOTAL_SLIDES,
}: PresentationModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasLoaded, setHasLoaded] = useState<Record<number, boolean>>({});

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const currentXRef = useRef(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Preload neighboring slides for instant, silky smooth navigation
  useEffect(() => {
    if (!isOpen) return;

    const indicesToPreload = [
      currentIndex,
      currentIndex + 1,
      currentIndex + 2,
      currentIndex - 1,
    ].filter((i) => i >= 0 && i < totalSlides);

    indicesToPreload.forEach((idx) => {
      if (!hasLoaded[idx]) {
        const img = new Image();
        img.src = `/presentation/slide-${idx + 1}.webp`;
        img.onload = () => {
          setHasLoaded((prev) => ({ ...prev, [idx]: true }));
        };
      }
    });
  }, [isOpen, currentIndex, totalSlides, hasLoaded]);

  // Navigate slides
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation & body overflow lock
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp" || e.key === "Backspace") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "Home") {
        e.preventDefault();
        setCurrentIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setCurrentIndex(totalSlides - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, goToNext, goToPrev, totalSlides]);

  // Touch Handlers for mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
    currentXRef.current = e.touches[0].clientX;
    isHorizontalSwipeRef.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startXRef.current;
    const diffY = currentY - startYRef.current;

    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isHorizontalSwipeRef.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (isHorizontalSwipeRef.current) {
      // Resistance on first and last slide
      if ((currentIndex === 0 && diffX > 0) || (currentIndex === totalSlides - 1 && diffX < 0)) {
        setDragOffset(diffX * 0.25);
      } else {
        setDragOffset(diffX);
      }
      currentXRef.current = currentX;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diffX = dragOffset;
    setDragOffset(0);

    if (isHorizontalSwipeRef.current) {
      const threshold = 45; // pixels to trigger slide change
      if (diffX < -threshold) {
        goToNext();
      } else if (diffX > threshold) {
        goToPrev();
      }
    }
    isHorizontalSwipeRef.current = null;
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diffX = e.clientX - startXRef.current;
    if ((currentIndex === 0 && diffX > 0) || (currentIndex === totalSlides - 1 && diffX < 0)) {
      setDragOffset(diffX * 0.25);
    } else {
      setDragOffset(diffX);
    }
    currentXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diffX = dragOffset;
    setDragOffset(0);

    const threshold = 50;
    if (diffX < -threshold) {
      goToNext();
    } else if (diffX > threshold) {
      goToPrev();
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // Tap navigation: Clicking left side goes back, right side goes forward
  const handleSlideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (Math.abs(startXRef.current - e.clientX) > 10) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width * 0.25) {
      goToPrev();
    } else if (clickX > width * 0.75) {
      goToNext();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[120] bg-black/92 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-8 select-none overflow-hidden transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Presentation: Software Development in the AI Era"
    >
      {/* 
        Presentation container:
        - 16:9 Aspect Ratio
        - Strictly NO modal card styles (no outer border-box/card wrapper/header bar/footer card)
        - Clean floating presentation stage
      */}
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl max-h-[90vh] aspect-[16/9] flex items-center justify-center overflow-hidden rounded-lg sm:rounded-xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] bg-neutral-950"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleSlideClick}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {/* Cross button on top right of the presentation */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-40 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 hover:border-white/50 flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          aria-label="Close Presentation"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Previous Button (Left Side) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          disabled={currentIndex === 0}
          className={`absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/65 hover:bg-black/95 text-white/90 hover:text-white border border-white/20 hover:border-white/60 flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xl hover:scale-110 active:scale-95 ${
            currentIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          aria-label="Previous Slide"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 -translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.4}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Button (Right Side) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          disabled={currentIndex === totalSlides - 1}
          className={`absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/65 hover:bg-black/95 text-white/90 hover:text-white border border-white/20 hover:border-white/60 flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xl hover:scale-110 active:scale-95 ${
            currentIndex === totalSlides - 1 ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          aria-label="Next Slide"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.4}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slides Track with hardware-accelerated transforms */}
        <div
          className="flex w-full h-full will-change-transform"
          style={{
            transform: `translate3d(calc(-${currentIndex * 100}% + ${dragOffset}px), 0, 0)`,
            transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {Array.from({ length: totalSlides }, (_, i) => {
            const isNear = Math.abs(currentIndex - i) <= 2;
            const slideSrc = `/presentation/slide-${i + 1}.webp`;

            return (
              <div
                key={i}
                className="w-full h-full flex-shrink-0 relative flex items-center justify-center bg-black overflow-hidden select-none"
              >
                {isNear ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slideSrc}
                    alt={`Slide ${i + 1} of ${totalSlides} - Software Development in the AI Era`}
                    draggable={false}
                    className="w-full h-full object-contain pointer-events-none select-none"
                    loading={i <= 1 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-950 flex items-center justify-center">
                    <span className="font-mono-tech text-xs text-neutral-600">
                      LOADING SLIDE {i + 1}...
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Minimal slide counter overlay */}
        <div className="pointer-events-none absolute bottom-2.5 left-3 sm:bottom-4 sm:left-4 z-30 font-mono-tech text-[10px] sm:text-xs tracking-widest text-white/70 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10 uppercase">
          <span>{String(currentIndex + 1).padStart(2, "0")}</span>
          <span className="text-white/40 mx-1">/</span>
          <span>{String(totalSlides).padStart(2, "0")}</span>
        </div>

        {/* Subtle slide progress bar line at the very bottom edge */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[2px] bg-white/10">
          <div
            className="h-full bg-white/70 origin-left transition-transform duration-300 ease-out"
            style={{
              transform: `scaleX(${(currentIndex + 1) / totalSlides})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
