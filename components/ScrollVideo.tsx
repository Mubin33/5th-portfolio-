"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export interface ScrollVideoCaption {
  from: number; // 0 to 1
  to: number;   // 0 to 1
  text: string;
}

export interface MobileFocalKeyframe {
  p: number; // progress 0 to 1
  x: number; // focalX 0 to 1
}

export interface ScrollVideoProps {
  /** Section number label (e.g. "03") */
  sectionNumber?: string;
  /** Section uppercase title (e.g. "THE OFFICE") */
  sectionTitle?: string;
  /** Function returning path for frame i (1-indexed) */
  framePath?: (i: number) => string;
  /** Total frames on desktop (default 240) */
  frameCount?: number;
  /** Function returning path for mobile frame i (1-indexed) */
  mobileFramePath?: (i: number) => string;
  /** Total frames on mobile (default 120) */
  mobileFrameCount?: number;
  /** Aspect ratio of frames (default 16/9) */
  aspectRatio?: number;
  /** Total duration in seconds (default 10) */
  durationSeconds?: number;
  /** Pin scroll length (defaults to 500% desktop, 400% mobile) */
  pinLength?: string;
  /** Horizontal crop anchor (0 to 1, default 0.5) */
  focalX?: number;
  /** Dynamic focal crop keyframes on mobile portrait screens */
  mobileFocal?: MobileFocalKeyframe[];
  /** Optional frame blending using alpha transparency */
  blendFrames?: boolean;
  /** Captions appearing during specific progress intervals */
  captions?: ScrollVideoCaption[];
  /** Refresh priority for ScrollTrigger (higher refreshes earlier). Auto-calculated from DOM position if omitted. */
  refreshPriority?: number;
  /** Custom outer container class name */
  className?: string;
  /** Section id */
  id?: string;
}

const DEFAULT_MOBILE_FOCAL: MobileFocalKeyframe[] = [
  { p: 0, x: 0.4 },
  { p: 0.45, x: 0.5 },
  { p: 0.65, x: 0.42 },
  { p: 1, x: 0.3 },
];

const DEFAULT_CAPTIONS: ScrollVideoCaption[] = [
  { from: 0.0, to: 0.3, text: "WELCOME" },
  { from: 0.42, to: 0.72, text: "HELLO." },
  { from: 0.8, to: 1.0, text: "LET'S WORK TOGETHER" },
];

/**
 * Loads and decodes an image frame, prioritizing createImageBitmap for GPU upload performance.
 */
async function loadFrame(url: string, signal?: AbortSignal): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof window !== "undefined" && "createImageBitmap" in window && typeof fetch !== "undefined") {
    try {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
      const blob = await res.blob();
      return await createImageBitmap(blob);
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") throw err;
      // Fallback below
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      if ("decode" in img) {
        img.decode().then(() => resolve(img)).catch(() => resolve(img));
      } else {
        resolve(img);
      }
    };
    img.onerror = reject;
  });
}

/**
 * Calculates focalX across mobile keyframes based on scroll progress.
 */
function interpolateFocalX(p: number, keyframes: MobileFocalKeyframe[], defaultFocal: number): number {
  if (!keyframes || keyframes.length === 0) return defaultFocal;
  const clamped = Math.max(0, Math.min(1, p));
  if (clamped <= keyframes[0].p) return keyframes[0].x;
  if (clamped >= keyframes[keyframes.length - 1].p) {
    return keyframes[keyframes.length - 1].x;
  }

  for (let i = 0; i < keyframes.length - 1; i++) {
    const k1 = keyframes[i];
    const k2 = keyframes[i + 1];
    if (clamped >= k1.p && clamped <= k2.p) {
      const span = k2.p - k1.p;
      if (span <= 0) return k1.x;
      const t = (clamped - k1.p) / span;
      return k1.x + t * (k2.x - k1.x);
    }
  }
  return defaultFocal;
}

export default function ScrollVideo({
  sectionNumber = "03",
  sectionTitle = "THE OFFICE",
  frameCount = 240,
  mobileFrameCount = 120,
  framePath = (i: number) => `/frames/f_${String(Math.max(1, Math.min(240, i))).padStart(4, "0")}.webp`,
  mobileFramePath = (i: number) => `/frames-sm/f_${String(Math.max(1, Math.min(120, i))).padStart(4, "0")}.webp`,
  aspectRatio = 16 / 9,
  durationSeconds = 10,
  pinLength,
  focalX = 0.5,
  mobileFocal = DEFAULT_MOBILE_FOCAL,
  blendFrames = false,
  captions = DEFAULT_CAPTIONS,
  refreshPriority,
  className = "",
  id = "office-tour",
}: ScrollVideoProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Overlay UI refs for high-frequency updates without React re-renders
  const timeRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const pass1BarRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Storage and control refs
  const framesRef = useRef<(ImageBitmap | HTMLImageElement | null)[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cancelledRef = useRef(false);
  const queueStartedRef = useRef(false);

  // Playhead & smoothing references
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const lastRenderedIdxRef = useRef(-1);
  const progressRef = useRef(0);
  const isTabVisibleRef = useRef(true);

  const totalFrames = isMobile ? mobileFrameCount : frameCount;
  const activePinLength = pinLength ?? (isMobile ? "400%" : "500%");

  // Detect motion preferences and device size on mount
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsReducedMotion(reduced);
    setIsMobile(window.innerWidth < 768);
  }, []);

  /**
   * Finds the nearest loaded frame to prevent blank canvas flickering.
   */
  const getNearestLoadedFrame = useCallback((targetIdx: number) => {
    const frames = framesRef.current;
    const len = frames.length;
    if (len === 0) return null;

    const clamped = Math.max(0, Math.min(len - 1, targetIdx));
    if (frames[clamped]) {
      return { frame: frames[clamped]!, index: clamped };
    }

    for (let offset = 1; offset < len; offset++) {
      const prev = clamped - offset;
      if (prev >= 0 && frames[prev]) {
        return { frame: frames[prev]!, index: prev };
      }
      const next = clamped + offset;
      if (next < len && frames[next]) {
        return { frame: frames[next]!, index: next };
      }
    }
    return null;
  }, []);

  /**
   * Draws a frame onto canvas with manual object-fit: cover and focal point crop.
   */
  const drawImageToCanvas = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: ImageBitmap | HTMLImageElement,
      cw: number,
      ch: number,
      fx: number,
      alpha = 1.0
    ) => {
      const srcW = img.width;
      const srcH = img.height;
      if (!srcW || !srcH) return;

      const srcRatio = srcW / srcH;
      const canvasRatio = cw / ch;

      let sWidth: number;
      let sHeight: number;
      let sx = 0;
      let sy = 0;

      if (canvasRatio < srcRatio) {
        // Canvas is narrower/taller than frame (e.g. portrait screens)
        sHeight = srcH;
        sWidth = srcH * canvasRatio;
        sx = Math.max(0, Math.min(srcW - sWidth, (srcW - sWidth) * fx));
        sy = 0;
      } else {
        // Canvas is wider than frame (e.g. desktop/ultrawide screens)
        sWidth = srcW;
        sHeight = srcW / canvasRatio;
        sx = 0;
        sy = Math.max(0, Math.min(srcH - sHeight, (srcH - sHeight) * 0.5));
      }

      ctx.globalAlpha = alpha;
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, cw, ch);
    },
    []
  );

  /**
   * Main render method. Draws the current frame or blended pair.
   */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    if (cw === 0 || ch === 0) return;

    const isPortrait = cw < ch;
    const p = progressRef.current;
    const currentFx = isPortrait ? interpolateFocalX(p, mobileFocal, focalX) : focalX;

    if (blendFrames) {
      const f = currentFrameRef.current;
      const f0 = Math.floor(f);
      const f1 = Math.min(totalFrames - 1, f0 + 1);
      const alpha = f - f0;

      const r0 = getNearestLoadedFrame(f0);
      const r1 = getNearestLoadedFrame(f1);

      if (r0) {
        drawImageToCanvas(ctx, r0.frame, cw, ch, currentFx, 1.0);
        lastRenderedIdxRef.current = r0.index;
      }
      if (r1 && r1.index !== r0?.index && alpha > 0.01) {
        drawImageToCanvas(ctx, r1.frame, cw, ch, currentFx, alpha);
      }
    } else {
      const targetIdx = Math.round(currentFrameRef.current);
      const res = getNearestLoadedFrame(targetIdx);
      if (res) {
        drawImageToCanvas(ctx, res.frame, cw, ch, currentFx, 1.0);
        lastRenderedIdxRef.current = res.index;
      }
    }
  }, [blendFrames, totalFrames, mobileFocal, focalX, getNearestLoadedFrame, drawImageToCanvas]);

  /**
   * Resizes canvas internal pixel dimensions with devicePixelRatio capped at 2.
   */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const rect = stage.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w === 0 || h === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    draw();
  }, [draw]);

  /**
   * Updates time indicator overlay: e.g. "04.2 / 10.0 S".
   */
  const updateTimeUI = useCallback(
    (frameIdx: number) => {
      if (!timeRef.current) return;
      const maxIdx = Math.max(1, totalFrames - 1);
      const p = Math.max(0, Math.min(1, frameIdx / maxIdx));
      const currentSec = p * durationSeconds;
      timeRef.current.textContent = `${currentSec.toFixed(1).padStart(4, "0")} / ${durationSeconds.toFixed(1)} S`;
    },
    [totalFrames, durationSeconds]
  );

  /**
   * Updates caption opacity and vertical translation during its specified progress interval.
   */
  const updateCaptionsUI = useCallback(
    (p: number) => {
      if (!captions || captions.length === 0) return;

      captions.forEach((cap, idx) => {
        const el = captionRefs.current[idx];
        if (!el) return;

        const from = cap.from;
        const to = cap.to;
        const span = Math.max(0.001, to - from);

        if (p < from || p > to) {
          el.style.opacity = "0";
          el.style.visibility = "hidden";
          el.style.transform = "translate3d(0, 24px, 0)";
          return;
        }

        el.style.visibility = "visible";
        const fadeInEnd = from + span * 0.22;
        const fadeOutStart = to - span * 0.22;

        if (p < fadeInEnd) {
          const t = (p - from) / (fadeInEnd - from);
          el.style.opacity = t.toFixed(3);
          const y = (24 * (1 - t)).toFixed(1);
          el.style.transform = `translate3d(0, ${y}px, 0)`;
        } else if (p > fadeOutStart) {
          const t = (p - fadeOutStart) / (to - fadeOutStart);
          el.style.opacity = (1 - t).toFixed(3);
          const y = (-12 * t).toFixed(1);
          el.style.transform = `translate3d(0, ${y}px, 0)`;
        } else {
          el.style.opacity = "1";
          el.style.transform = "translate3d(0, 0, 0)";
        }
      });
    },
    [captions]
  );

  /**
   * Updates progress bar, percentage text, and scroll hint opacity.
   */
  const updateProgressUI = useCallback((p: number) => {
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${p})`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = `${Math.round(p * 100)}%`;
    }
    if (scrollHintRef.current) {
      if (p <= 0.05) {
        scrollHintRef.current.style.opacity = (1 - p / 0.05).toFixed(3);
        scrollHintRef.current.style.visibility = "visible";
      } else {
        scrollHintRef.current.style.opacity = "0";
        scrollHintRef.current.style.visibility = "hidden";
      }
    }
  }, []);

  /**
   * 2-pass loading queue: Pass 1 (every 10th frame), Pass 2 (gap fill), max 6 parallel requests.
   */
  const startLoadingQueue = useCallback(() => {
    if (queueStartedRef.current) return;
    queueStartedRef.current = true;

    // Pass 1: every 10th frame (e.g. 9, 19, 29... total-1)
    const pass1Queue: number[] = [];
    for (let i = 0; i < totalFrames; i++) {
      if (i !== 0 && ((i + 1) % 10 === 0 || i === totalFrames - 1)) {
        pass1Queue.push(i);
      }
    }
    const pass1Total = Math.max(1, pass1Queue.length);
    let pass1LoadedCount = 0;

    // Pass 2: remaining frame gaps in order
    const pass1Set = new Set(pass1Queue);
    const pass2Queue: number[] = [];
    for (let i = 1; i < totalFrames; i++) {
      if (!pass1Set.has(i)) {
        pass2Queue.push(i);
      }
    }

    const updatePass1Line = (ratio: number) => {
      if (pass1BarRef.current) {
        const clamped = Math.min(1, Math.max(0, ratio));
        pass1BarRef.current.style.width = `${(clamped * 100).toFixed(1)}%`;
        if (clamped >= 1) {
          setTimeout(() => {
            if (pass1BarRef.current) {
              pass1BarRef.current.style.opacity = "0";
            }
          }, 350);
        }
      }
    };

    const MAX_CONCURRENT = 6;
    let activeWorkers = 0;

    const pullNext = () => {
      if (cancelledRef.current) return;

      while (activeWorkers < MAX_CONCURRENT && (pass1Queue.length > 0 || pass2Queue.length > 0)) {
        const isPass1 = pass1Queue.length > 0;
        const idx = isPass1 ? pass1Queue.shift()! : pass2Queue.shift()!;

        if (framesRef.current[idx]) {
          if (isPass1) {
            pass1LoadedCount++;
            updatePass1Line(pass1LoadedCount / pass1Total);
          }
          continue;
        }

        activeWorkers++;
        const frameNum = idx + 1;
        const url = isMobile ? mobileFramePath(frameNum) : framePath(frameNum);

        loadFrame(url, abortControllerRef.current?.signal)
          .then((img) => {
            if (cancelledRef.current) {
              if (img && "close" in img && typeof img.close === "function") img.close();
              return;
            }
            framesRef.current[idx] = img;

            // Redraw if this frame improves accuracy of current displayed view
            const currentTarget = Math.round(currentFrameRef.current);
            if (Math.abs(idx - currentTarget) <= Math.abs(lastRenderedIdxRef.current - currentTarget)) {
              draw();
            }

            if (isPass1) {
              pass1LoadedCount++;
              updatePass1Line(pass1LoadedCount / pass1Total);
            }
          })
          .catch(() => {
            if (isPass1) {
              pass1LoadedCount++;
              updatePass1Line(pass1LoadedCount / pass1Total);
            }
          })
          .finally(() => {
            activeWorkers--;
            pullNext();
          });
      }
    };

    pullNext();
  }, [totalFrames, isMobile, mobileFramePath, framePath, draw]);

  // Main lifecycle: poster, observer, ticker loop, ScrollTrigger, cleanup
  useEffect(() => {
    cancelledRef.current = false;
    abortControllerRef.current = new AbortController();
    framesRef.current = new Array(totalFrames).fill(null);
    queueStartedRef.current = false;

    // Initial canvas sizing
    resizeCanvas();

    // 1. Immediately load Frame 1 as poster
    const posterUrl = isMobile ? mobileFramePath(1) : framePath(1);
    loadFrame(posterUrl, abortControllerRef.current.signal)
      .then((poster) => {
        if (!cancelledRef.current) {
          framesRef.current[0] = poster;
          draw();
        }
      })
      .catch(() => {});

    // 2. IntersectionObserver: begin full preloading queue when ~1.5 screens away
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          io.disconnect();
          startLoadingQueue();
        }
      },
      { rootMargin: "150% 0px 150% 0px" }
    );
    if (sectionRef.current) {
      io.observe(sectionRef.current);
    }

    // Tab visibility handling: pause/resume ticker
    const handleVisibility = () => {
      isTabVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        draw();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Resize handling: ignore mobile URL bar height changes (< 120px)
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;

    const handleResize = () => {
      const curW = window.innerWidth;
      const curH = window.innerHeight;
      const dw = Math.abs(curW - lastW);
      const dh = Math.abs(curH - lastH);

      if (dw > 0 || dh >= 120) {
        lastW = curW;
        lastH = curH;
        resizeCanvas();
        ScrollTrigger.refresh();
      } else {
        resizeCanvas();
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // GSAP context & ScrollTrigger setup
    const ctx = gsap.context(() => {
      if (isReducedMotion) {
        updateTimeUI(0);
        updateProgressUI(0);
        return;
      }

      if (!sectionRef.current) return;

      // In GSAP ScrollTrigger, earlier pinned sections in the DOM MUST have higher refreshPriority
      // so their pin spacers are accounted for when later triggers calculate their start/end positions.
      const resolvedPriority =
        refreshPriority !== undefined
          ? refreshPriority
          : (() => {
              if (typeof document === "undefined" || !sectionRef.current) return 30;
              const aboutEl = document.getElementById("about");
              if (aboutEl && (sectionRef.current.compareDocumentPosition(aboutEl) & Node.DOCUMENT_POSITION_FOLLOWING)) {
                return 30; // Precedes About (refreshPriority: 20)
              }
              const skillsEl = document.getElementById("skills");
              if (skillsEl && (sectionRef.current.compareDocumentPosition(skillsEl) & Node.DOCUMENT_POSITION_FOLLOWING)) {
                return 18; // Precedes ZoomHeadingScene (refreshPriority: 15)
              }
              const showcaseEl = document.getElementById("projects") || document.querySelector("#work");
              if (showcaseEl && (sectionRef.current.compareDocumentPosition(showcaseEl) & Node.DOCUMENT_POSITION_FOLLOWING)) {
                return 12; // Precedes ProjectShowcase (refreshPriority: 10)
              }
              return 5;
            })();

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: true,
        start: "top top",
        end: "+=" + activePinLength,
        invalidateOnRefresh: true,
        refreshPriority: resolvedPriority,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          targetFrameRef.current = p * (totalFrames - 1);
          updateCaptionsUI(p);
          updateProgressUI(p);
        },
        onRefresh: (self) => {
          // Sync state if page loads in middle or scrolled upward from below
          const p = self.progress;
          progressRef.current = p;
          const target = p * (totalFrames - 1);
          targetFrameRef.current = target;
          currentFrameRef.current = target;
          lastDrawnFrameRef.current = Math.round(target);
          draw();
          updateTimeUI(target);
          updateCaptionsUI(p);
          updateProgressUI(p);
        },
      });

      // Synchronize trigger order so subsequent pinned sections recalculate immediately
      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      // Frame-rate independent lerp ticker (factor ~0.14)
      const TICKER_LERP = 0.14;

      const tickerCallback = (_time: number, deltaTime: number) => {
        if (!isTabVisibleRef.current || document.hidden) return;

        const target = targetFrameRef.current;
        const current = currentFrameRef.current;
        const diff = target - current;

        if (Math.abs(diff) > 0.001) {
          const dt = Math.max(1, Math.min(deltaTime || 16.67, 100));
          const factor = 1 - Math.pow(1 - TICKER_LERP, dt / 16.667);
          const next = current + diff * factor;
          currentFrameRef.current = next;

          if (blendFrames) {
            if (Math.abs(next - lastDrawnFrameRef.current) > 0.005) {
              lastDrawnFrameRef.current = next;
              draw();
              updateTimeUI(next);
            }
          } else {
            const rounded = Math.round(next);
            if (rounded !== lastDrawnFrameRef.current) {
              lastDrawnFrameRef.current = rounded;
              draw();
              updateTimeUI(next);
            }
          }
        } else if (current !== target) {
          currentFrameRef.current = target;
          lastDrawnFrameRef.current = Math.round(target);
          draw();
          updateTimeUI(target);
        }
      };

      gsap.ticker.add(tickerCallback);

      return () => {
        gsap.ticker.remove(tickerCallback);
        st.kill();
        ScrollTrigger.refresh();
      };
    }, sectionRef);

    // Initial UI state
    updateTimeUI(0);
    updateCaptionsUI(0);
    updateProgressUI(0);

    return () => {
      cancelledRef.current = true;
      abortControllerRef.current?.abort();
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      ctx.revert();

      // Memory cleanup: close all loaded ImageBitmaps
      framesRef.current.forEach((item) => {
        if (item && "close" in item && typeof item.close === "function") {
          try {
            item.close();
          } catch {}
        }
      });
      framesRef.current = [];
    };
  }, [
    totalFrames,
    isMobile,
    isReducedMotion,
    activePinLength,
    blendFrames,
    refreshPriority,
    framePath,
    mobileFramePath,
    draw,
    resizeCanvas,
    startLoadingQueue,
    updateTimeUI,
    updateCaptionsUI,
    updateProgressUI,
  ]);

  // Reduced motion alternative view: static image stage with stacked transcript captions below
  if (isReducedMotion) {
    return (
      <section id={id} className={`relative w-full bg-black text-white ${className}`}>
        <div className="relative w-full h-svh bg-black overflow-hidden flex items-center justify-center border-b border-white/10">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover block" aria-hidden="true" />
          <p className="sr-only">
            Camera moving through an open office. A man at a desk waves hello.
          </p>

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.85)_100%)] z-[4]" />

          {/* Top Bar Header */}
          {/* <div className="absolute top-6 sm:top-10 inset-x-0 max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between z-10">
            <div className="flex items-center gap-3 font-mono-tech text-xs tracking-widest text-neutral-300 uppercase">
              <span className="text-white font-bold">{sectionNumber}</span>
              <span className="w-6 sm:w-8 h-[1px] bg-white/30" />
              <span>{sectionTitle}</span>
            </div>
            <div className="font-mono-tech text-xs text-neutral-400 tracking-widest uppercase">
              00.0 / {durationSeconds.toFixed(1)} S
            </div>
          </div> */}
        </div>

        {/* Stacked Captions Content */}
        {/* <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 sm:py-24 border-b border-white/10 space-y-8">
          <div className="font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
            {sectionNumber} // {sectionTitle} - TRANSCRIPT
          </div>
          <div className="space-y-6">
            {captions.map((cap, i) => (
              <div key={i} className="border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                <span className="font-mono-tech text-xs text-neutral-500 tracking-wider">
                  [{(cap.from * durationSeconds).toFixed(1)}S - {(cap.to * durationSeconds).toFixed(1)}S]
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                  {cap.text}
                </h3>
              </div>
            ))}
          </div>
        </div> */}
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative w-full h-svh bg-black text-white overflow-hidden select-none border-b border-white/10 ${className}`}
    >
      {/* Viewport Canvas Stage */}
      <div ref={stageRef} className="relative w-full h-full overflow-hidden">
        {/* Full-bleed Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover block will-change-transform"
          aria-hidden="true"
        />

        {/* Screen Reader Accessible Summary */}
        <p className="sr-only">
          Camera moving through an open office. A man at a desk waves hello.
        </p>

        {/* Subtle Vignette & Depth Edge Gradients */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.85)_100%)] z-[4]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none z-[4]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-[4]" />

        {/* Subtle dark gradient behind left captions for flawless contrast */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-3/4 md:w-3/5 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-[5]" />

        {/* Top Header UI */}
        {/* <div className="absolute top-6 sm:top-10 inset-x-0 max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-3 font-mono-tech text-xs tracking-widest uppercase">
            <span className="text-white font-bold">{sectionNumber}</span>
            <span className="w-6 sm:w-8 h-[1px] bg-white/30" />
            <span className="text-neutral-300">{sectionTitle}</span>
          </div>

          <div
            ref={timeRef}
            className="font-mono-tech text-xs text-neutral-300 tracking-widest uppercase tabular-nums"
          >
            00.0 / {durationSeconds.toFixed(1)} S
          </div>
        </div> */}

        {/* Captions Presentation Area */}
        <div className="absolute inset-x-0 bottom-24 sm:bottom-28 md:bottom-32 max-w-7xl mx-auto px-6 md:px-12 pointer-events-none z-10">
          <div className="relative max-w-2xl sm:max-w-3xl min-h-[5rem] sm:min-h-[7rem] flex items-end">
            {captions.map((cap, i) => (
              <div
                key={i}
                ref={(el) => {
                  captionRefs.current[i] = el;
                }}
                className="absolute left-0 bottom-0 top-auto will-change-transform transition-none"
                style={{ opacity: 0, transform: "translate3d(0, 24px, 0)", visibility: "hidden" }}
              >
                <h2 className="text-section-huge font-extrabold uppercase tracking-tighter text-white leading-none drop-shadow-md">
                  {cap.text}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar UI: Progress bar & percentage */}
        <div className="absolute bottom-6 sm:bottom-10 inset-x-0 max-w-7xl mx-auto px-6 md:px-12 flex items-end justify-between pointer-events-none z-10">
          {/* Bottom-left 1px progress track */}
          {/* <div className="flex items-center gap-3 sm:gap-4">
            <span className="font-mono-tech text-[10px] sm:text-xs tracking-widest text-neutral-400 uppercase">
              PROG
            </span>
            <div className="w-24 sm:w-36 h-[1px] bg-white/20 relative overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-white will-change-transform origin-left"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <span
              ref={progressTextRef}
              className="font-mono-tech text-[10px] sm:text-xs tracking-widest text-white uppercase w-8 tabular-nums"
            >
              0%
            </span>
          </div> */}

          {/* Bottom-right office coordinate badge */}
          {/* <div className="hidden sm:flex items-center gap-2 font-mono-tech text-[10px] tracking-widest text-neutral-500 uppercase">
            <span>OFFICE_TOUR</span>
            <span>//</span>
            <span>24FPS</span>
          </div> */}
        </div>

        {/* Bottom-center animated SCROLL hint */}
        {/* <div
          ref={scrollHintRef}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-300 z-10"
        >
          <span className="font-mono-tech text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
            SCROLL
          </span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-white via-white/70 to-transparent animate-pulse" />
        </div> */}

        {/* Pass 1 Loading 1px Line at Bottom Edge */}
        <div
          ref={pass1BarRef}
          className="absolute bottom-0 left-0 h-[1px] bg-white pointer-events-none z-30 transition-opacity duration-700 ease-out"
          style={{ width: "0%", opacity: 1 }}
        />
      </div>
    </section>
  );
}
