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
  /** Section number label (e.g. "03" or "00") */
  sectionNumber?: string;
  /** Section uppercase title (e.g. "THE OFFICE") */
  sectionTitle?: string;
  /** Function returning path for frame i (1-indexed) */
  framePath?: (i: number) => string;
  /** Total frames on desktop (default 500) */
  frameCount?: number;
  /** Function returning path for mobile frame i (1-indexed) */
  mobileFramePath?: (i: number) => string;
  /** Total frames on mobile (default 500) */
  mobileFrameCount?: number;
  /** Aspect ratio of source frames (default 16/9) */
  aspectRatio?: number;
  /** Aspect ratio of the video frame on mobile below 1024px (width / height, default 3/4 for taller portrait height) */
  mobileAspect?: number;
  /** Scroll duration multiplier for mobile sticky pin (default 3.5, meaning 3.5x viewport height) */
  mobilePinLength?: number;
  /** Total duration in seconds for time indicator (default 10) */
  durationSeconds?: number;
  /** Desktop pin scroll length (defaults to "500%") */
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
  /** Loading text displayed while frames are loading (default 'LOADING...') */
  loadingText?: string;
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
  // { from: 0.0, to: 0.3, text: "WELCOME" },
  { from: 0.42, to: 0.72, text: "Hi" },
  { from: 0.8, to: 1.0, text: "LET'S WORK TOGETHER" },
];

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

const DEFAULT_FRAME_PATH = (i: number) =>
  `/frames-up/f_${String(Math.max(1, Math.min(500, i))).padStart(4, "0")}.webp`;

export default function ScrollVideo({
  sectionNumber = "03",
  sectionTitle = "THE OFFICE",
  frameCount = 500,
  mobileFrameCount = 500,
  framePath = DEFAULT_FRAME_PATH,
  mobileFramePath = DEFAULT_FRAME_PATH,
  aspectRatio = 16 / 9,
  mobileAspect = 1 / 4,
  mobilePinLength = 3.5,
  durationSeconds = 16,
  pinLength = "500%",
  focalX = 0.5,
  mobileFocal = DEFAULT_MOBILE_FOCAL,
  blendFrames = true,
  captions = DEFAULT_CAPTIONS,
  loadingText = "LOADING...",
  refreshPriority,
  className = "",
  id = "office-tour",
}: ScrollVideoProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Overlay UI refs for high-frequency updates without React re-renders
  const timeRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const pass1BarRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const loadingPunchRef = useRef<HTMLDivElement>(null);

  // State
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Storage and control refs
  // Stable refs to prevent unneeded effect re-runs
  const framePathRef = useRef(framePath);
  framePathRef.current = framePath;
  const mobileFramePathRef = useRef(mobileFramePath);
  mobileFramePathRef.current = mobileFramePath;

  const framesRef = useRef<(ImageBitmap | HTMLImageElement | null)[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cancelledRef = useRef(false);
  const queueStartedRef = useRef(false);
  const pullNextRef = useRef<(() => void) | null>(null);

  // Playhead & smoothing references
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const lastRenderedIdxRef = useRef(-1);
  const progressRef = useRef(0);
  const isTabVisibleRef = useRef(true);

  // Check prefers-reduced-motion on mount
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsReducedMotion(reduced);
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
        // Canvas is narrower/taller than frame (e.g. 4/3 mobile or portrait)
        sHeight = srcH;
        sWidth = srcH * canvasRatio;
        sx = Math.max(0, Math.min(srcW - sWidth, (srcW - sWidth) * fx));
        sy = 0;
      } else {
        // Canvas is wider than frame (e.g. 16/9 uncropped or ultrawide desktop)
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

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    const totalFrames = isDesktop ? frameCount : mobileFrameCount;
    const p = progressRef.current;
    const currentFx = !isDesktop ? interpolateFocalX(p, mobileFocal, focalX) : focalX;

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
  }, [blendFrames, frameCount, mobileFrameCount, mobileFocal, focalX, getNearestLoadedFrame, drawImageToCanvas]);

  /**
   * Updates time indicator overlay: e.g. "04.2 / 10.0 S".
   */
  const updateTimeUI = useCallback(
    (frameIdx: number, total: number) => {
      if (!timeRef.current) return;
      const maxIdx = Math.max(1, total - 1);
      const p = Math.max(0, Math.min(1, frameIdx / maxIdx));
      const currentSec = p * durationSeconds;
      timeRef.current.textContent = `${currentSec.toFixed(1).padStart(4, "0")} / ${durationSeconds.toFixed(1)} S`;
    },
    [durationSeconds]
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
   * High-performance Scroll-Aware Streaming Queue:
   * 1. Preloads initial consecutive head buffer (frames 0 to 24) immediately for zero-lag start.
   * 2. Dynamically prioritizes frames directly ahead of current scroll direction (+1 to +25).
   * 3. Uses 8 parallel workers on desktop, 4 on mobile.
   * 4. Decodes via createImageBitmap off main thread for butter-smooth 60fps scrolling.
   */
  const startLoadingQueue = useCallback(
    (isDesktop: boolean) => {
      if (queueStartedRef.current) return;
      queueStartedRef.current = true;

      const total = isDesktop ? frameCount : mobileFrameCount;
      const loadedSet = new Set<number>();
      const inFlightSet = new Set<number>();
      const failedSet = new Set<number>();
      let loadedCount = 0;

      const checkAllLoaded = () => {
        if (loadedSet.size + failedSet.size >= total) {
          if (loadingPunchRef.current) {
            loadingPunchRef.current.style.opacity = "0";
            setTimeout(() => {
              if (loadingPunchRef.current) {
                loadingPunchRef.current.style.display = "none";
              }
            }, 700);
          }
        }
      };

      const updateProgressLine = (count: number) => {
        if (pass1BarRef.current) {
          const targetBuffer = Math.max(35, Math.round(total * 0.3));
          const ratio = Math.min(1, Math.max(0, count / targetBuffer));
          pass1BarRef.current.style.width = `${(ratio * 100).toFixed(1)}%`;
          if (count >= targetBuffer) {
            setTimeout(() => {
              if (pass1BarRef.current) {
                pass1BarRef.current.style.opacity = "0";
              }
            }, 350);
          }
        }
      };

      const getNextFrameIndex = (): number | null => {
        const current = Math.round(targetFrameRef.current);

        // 1. Immediate Lookahead Window (+0 to +30): Frames directly ahead of user's current scroll playhead
        for (let offset = 0; offset <= 30; offset++) {
          const idx = current + offset;
          if (idx < total && !loadedSet.has(idx) && !inFlightSet.has(idx) && !failedSet.has(idx)) {
            return idx;
          }
        }

        // 2. Essential Head Buffer (Frames 0 to 40): Guarantees instant zero-lag start on first visit
        for (let idx = 0; idx < Math.min(40, total); idx++) {
          if (!loadedSet.has(idx) && !inFlightSet.has(idx) && !failedSet.has(idx)) {
            return idx;
          }
        }

        // 3. Immediate Lookbehind Window (-1 to -15): Frames right behind playhead (for reverse scrolling)
        for (let offset = 1; offset <= 15; offset++) {
          const idx = current - offset;
          if (idx >= 0 && !loadedSet.has(idx) && !inFlightSet.has(idx) && !failedSet.has(idx)) {
            return idx;
          }
        }

        // 4. Extended Lookahead Window (+26 to +75): Anticipates faster downward scrolling
        for (let offset = 26; offset <= 75; offset++) {
          const idx = current + offset;
          if (idx < total && !loadedSet.has(idx) && !inFlightSet.has(idx) && !failedSet.has(idx)) {
            return idx;
          }
        }

        // 5. Sparse Skeleton Grid (Every 5th frame across all 500 frames):
        // Ensures max gap is never more than 4 frames even during fast flings
        for (let idx = 0; idx < total; idx += 5) {
          if (!loadedSet.has(idx) && !inFlightSet.has(idx) && !failedSet.has(idx)) {
            return idx;
          }
        }

        // 6. Sequential Fill: Complete all remaining gaps smoothly
        for (let idx = 0; idx < total; idx++) {
          if (!loadedSet.has(idx) && !inFlightSet.has(idx) && !failedSet.has(idx)) {
            return idx;
          }
        }

        return null;
      };

      // Desktop: 10 parallel requests. Mobile: 5 parallel requests.
      const MAX_CONCURRENT = isDesktop ? 12 : 6;
      const retriedSet = new Set<number>();
      let activeWorkers = 0;

      // Serialized decode chain on mobile to prevent scrolling decode spikes
      let decodeChain = Promise.resolve();

      const loadAndDecode = async (url: string, signal?: AbortSignal): Promise<ImageBitmap | HTMLImageElement> => {
        if (typeof window !== "undefined" && "createImageBitmap" in window && typeof fetch !== "undefined") {
          const res = await fetch(url, { signal });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();

          if (isDesktop) {
            return await createImageBitmap(blob);
          }

          return new Promise<ImageBitmap>((resolve, reject) => {
            decodeChain = decodeChain.then(async () => {
              try {
                const bmp = await createImageBitmap(blob);
                resolve(bmp);
              } catch (e) {
                reject(e);
              }
            });
          });
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
      };

      const pullNext = () => {
        if (cancelledRef.current) return;

        while (activeWorkers < MAX_CONCURRENT) {
          const idx = getNextFrameIndex();
          if (idx === null) break;

          inFlightSet.add(idx);
          activeWorkers++;

          const frameNum = idx + 1;
          const url = isDesktop ? framePath(frameNum) : mobileFramePath(frameNum);

          loadAndDecode(url, abortControllerRef.current?.signal)
            .then((img) => {
              if (cancelledRef.current) {
                if (img && "close" in img && typeof img.close === "function") img.close();
                return;
              }
              framesRef.current[idx] = img;
              loadedSet.add(idx);
              inFlightSet.delete(idx);
              loadedCount++;
              updateProgressLine(loadedCount);
              checkAllLoaded();

              // Redraw if this frame is close to current displayed view
              const currentTarget = Math.round(currentFrameRef.current);
              if (Math.abs(idx - currentTarget) <= 2) {
                draw();
              }
            })
            .catch(() => {
              inFlightSet.delete(idx);
              if (!retriedSet.has(idx)) {
                retriedSet.add(idx);
              } else {
                failedSet.add(idx);
                checkAllLoaded();
              }
            })
            .finally(() => {
              activeWorkers--;
              pullNext();
            });
        }
      };

      pullNextRef.current = pullNext;
      pullNext();
    },
    [frameCount, mobileFrameCount, framePath, mobileFramePath, draw]
  );

  // Main lifecycle: poster, observer, ticker loop, matchMedia, cleanup
  useEffect(() => {
    cancelledRef.current = false;
    abortControllerRef.current = new AbortController();
    queueStartedRef.current = false;

    const isDesktop = window.innerWidth >= 1024;
    const total = isDesktop ? frameCount : mobileFrameCount;
    framesRef.current = new Array(total).fill(null);

    // Initial canvas sizing using videoFrameRef geometry
    const initCanvas = () => {
      const container = videoFrameRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      draw();
    };
    initCanvas();

    // 1. Immediately load Frame 1 as poster
    const posterUrl = isDesktop ? framePath(1) : mobileFramePath(1);
    const posterImg = new Image();
    posterImg.crossOrigin = "anonymous";
    posterImg.src = posterUrl;
    posterImg.onload = () => {
      if (!cancelledRef.current) {
        framesRef.current[0] = posterImg;
        draw();
      }
    };

    // 2. Immediately start full preloading queue as soon as user lands on the site!
    startLoadingQueue(isDesktop);

    // 3. Tab visibility handling: pause/resume ticker
    const handleVisibility = () => {
      isTabVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        draw();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // 4. ResizeObserver on videoFrameRef: stop reacting to mobile URL bar (56-100px changes)
    let lastW = 0;
    let lastH = 0;

    const ro = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const rect = entries[0].contentRect;
      const newW = rect.width;
      const newH = rect.height;
      if (newW === 0 || newH === 0) return;

      const wChanged = Math.abs(newW - lastW) >= 1;
      const hChanged = Math.abs(newH - lastH) > 120;

      // Ignore mobile URL bar collapse/expand (< 120px height change without width change)
      if (lastW === 0 || wChanged || hChanged) {
        lastW = newW;
        lastH = newH;

        const canvas = canvasRef.current;
        if (canvas) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.round(newW * dpr);
          canvas.height = Math.round(newH * dpr);
          draw();
        }

        // Only refresh ScrollTrigger on desktop where layout changes; never on mobile!
        if (window.innerWidth >= 1024) {
          ScrollTrigger.refresh();
        }
      }
    });

    if (videoFrameRef.current) {
      ro.observe(videoFrameRef.current);
    }

    // Calculate dynamic refreshPriority so pinned sections refresh in top-to-bottom DOM order
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

    // 5. GSAP matchMedia: Desktop (pin: true) vs Mobile (pin: false + CSS sticky)
    const mm = gsap.matchMedia();

    if (!isReducedMotion && sectionRef.current) {
      // Desktop: >= 1024px (keep existing pin-based behavior untouched)
      mm.add("(min-width: 1024px)", () => {
        if (!sectionRef.current) return;

        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          pin: true,
          start: "top top",
          end: "+=" + pinLength,
          invalidateOnRefresh: true,
          refreshPriority: resolvedPriority,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            progressRef.current = p;
            targetFrameRef.current = p * (frameCount - 1);
            if (p > 0.05 && loadingPunchRef.current) {
              loadingPunchRef.current.style.opacity = "0";
            }
            updateCaptionsUI(p);
            updateProgressUI(p);
            pullNextRef.current?.();
          },
          onRefresh: (self) => {
            const p = self.progress;
            progressRef.current = p;
            const target = p * (frameCount - 1);
            targetFrameRef.current = target;
            currentFrameRef.current = target;
            lastDrawnFrameRef.current = Math.round(target);
            draw();
            updateTimeUI(target, frameCount);
            updateCaptionsUI(p);
            updateProgressUI(p);
            pullNextRef.current?.();
          },
        });

        return () => {
          st.kill();
        };
      });

      // Mobile: < 1024px (NO pin! Compositor-driven CSS position: sticky eliminates jitter)
      mm.add("(max-width: 1023px)", () => {
        if (!sectionRef.current) return;

        const st = ScrollTrigger.create({
          trigger: sectionRef.current, // wrapper element
          pin: false,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          refreshPriority: resolvedPriority,
          onUpdate: (self) => {
            const p = self.progress;
            progressRef.current = p;
            targetFrameRef.current = p * (mobileFrameCount - 1);
            if (p > 0.05 && loadingPunchRef.current) {
              loadingPunchRef.current.style.opacity = "0";
            }
            updateCaptionsUI(p);
            updateProgressUI(p);
            pullNextRef.current?.();
          },
          onRefresh: (self) => {
            const p = self.progress;
            progressRef.current = p;
            const target = p * (mobileFrameCount - 1);
            targetFrameRef.current = target;
            currentFrameRef.current = target;
            lastDrawnFrameRef.current = Math.round(target);
            draw();
            updateTimeUI(target, mobileFrameCount);
            updateCaptionsUI(p);
            updateProgressUI(p);
            pullNextRef.current?.();
          },
        });

        return () => {
          st.kill();
        };
      });

      // Sync trigger order so subsequent pinned sections recalculate accurately
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }

    // 6. Ticker loop: frame-rate independent lerp (~0.14)
    const TICKER_LERP = 0.14;

    const tickerCallback = (_time: number, deltaTime: number) => {
      if (!isTabVisibleRef.current || document.hidden) return;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;
      const isDesktopNow = window.innerWidth >= 1024;
      const totalNow = isDesktopNow ? frameCount : mobileFrameCount;

      if (Math.abs(diff) > 0.001) {
        const dt = Math.max(1, Math.min(deltaTime || 16.67, 100));
        const factor = 1 - Math.pow(1 - TICKER_LERP, dt / 16.667);
        const next = current + diff * factor;
        currentFrameRef.current = next;

        if (blendFrames) {
          if (Math.abs(next - lastDrawnFrameRef.current) > 0.005) {
            lastDrawnFrameRef.current = next;
            draw();
            updateTimeUI(next, totalNow);
          }
        } else {
          const rounded = Math.round(next);
          if (rounded !== lastDrawnFrameRef.current) {
            lastDrawnFrameRef.current = rounded;
            draw();
            updateTimeUI(next, totalNow);
          }
        }
      } else if (current !== target) {
        currentFrameRef.current = target;
        lastDrawnFrameRef.current = Math.round(target);
        draw();
        updateTimeUI(target, totalNow);
      }
    };

    gsap.ticker.add(tickerCallback);

    // Initial UI state
    updateTimeUI(0, total);
    updateCaptionsUI(0);
    updateProgressUI(0);

    return () => {
      cancelledRef.current = true;
      abortControllerRef.current?.abort();
      ro.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      gsap.ticker.remove(tickerCallback);
      mm.revert();
      ScrollTrigger.refresh();

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
    frameCount,
    mobileFrameCount,
    mobileAspect,
    mobilePinLength,
    pinLength,
    durationSeconds,
    isReducedMotion,
    blendFrames,
    refreshPriority,
    framePath,
    mobileFramePath,
    draw,
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
      style={{
        "--mobile-pin-h": `calc(100svh + (${mobilePinLength} * 100svh))`,
        "--mobile-aspect": `${mobileAspect}`,
      } as React.CSSProperties}
      className={`relative w-full h-[var(--mobile-pin-h)] lg:h-svh border-b border-white/10 ${className}`}
    >
      {/* Sticky stage on mobile (<1024px), relative full-height stage on desktop (>=1024px) */}
      <div
        ref={stageRef}
        className="sticky top-0 lg:relative w-full h-svh bg-black text-white select-none overflow-hidden max-lg:flex max-lg:flex-col max-lg:justify-between lg:block"
      >
        {/* 1. Top Bar */}
        {/* <div className="relative lg:absolute lg:top-10 lg:inset-x-0 w-full max-w-7xl mx-auto px-6 md:px-12 pt-5 sm:pt-8 lg:pt-0 pb-2 lg:pb-0 flex items-center justify-between pointer-events-none z-10">
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

        {/* 2. Video Frame Container (Edge-to-edge 4/3 frame on mobile, full-bleed on desktop) */}
        <div
          ref={videoFrameRef}
          className="max-lg:relative max-lg:w-full max-lg:my-auto max-lg:border-y max-lg:border-white/10 max-lg:overflow-hidden max-lg:aspect-[var(--mobile-aspect)] max-lg:max-h-[70svh] lg:absolute lg:inset-0 lg:w-full lg:h-full lg:border-none lg:my-0 lg:aspect-auto"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block object-cover will-change-transform"
            aria-hidden="true"
          />

          {/* Centered Big Punched Loading Text */}
          <div
            ref={loadingPunchRef}
            className="absolute inset-0 z-[6] flex items-center justify-center pointer-events-none transition-opacity duration-700 ease-out select-none"
            style={{ opacity: 1 }}
          >
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase select-none text-center drop-shadow-2xl px-4">
              {loadingText.endsWith("...") ? (
                <>
                  {loadingText.slice(0, -3)}
                  <span className="inline-block animate-pulse">...</span>
                </>
              ) : (
                <>
                  {loadingText}
                  <span className="inline-block animate-pulse">...</span>
                </>
              )}
            </h2>
          </div>


          {/* Top & Bottom Cinematic Edge Shadows on Video Frame (Mobile Only) */}
          <div className="lg:hidden absolute inset-x-0 top-0 h-16 sm:h-24 bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none z-[3]" />
          <div className="lg:hidden absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-[3]" />
          <div className="lg:hidden absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.75)_100%)] z-[3]" />
        </div>

        {/* Screen Reader Accessible Summary */}
        <p className="sr-only">
          Camera moving through an open office. A man at a desk waves hello.
        </p>

        {/* Viewport Top & Bottom Ambient Depth Shadows */}
        <div className="absolute inset-x-0 top-0 h-20 sm:h-28 lg:h-28 bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none z-[4]" />
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 lg:h-28 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-[4]" />
        <div className="hidden lg:block absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)] z-[4]" />
        <div className="hidden lg:block absolute inset-y-0 left-0 w-full sm:w-3/4 md:w-1/2 bg-gradient-to-r from-black/70 via-black/35 to-transparent pointer-events-none z-[5]" />

        {/* 3. Captions Area (Directly below video frame on mobile, bottom overlay on desktop) */}
        <div className="max-lg:relative max-lg:w-full max-lg:max-w-7xl max-lg:mx-auto max-lg:px-6 max-lg:pb-6 max-lg:min-h-[4.5rem] sm:max-lg:min-h-[5.5rem] max-lg:flex max-lg:items-center max-lg:z-10 lg:absolute lg:inset-x-0 lg:bottom-28 lg:max-w-7xl lg:mx-auto lg:px-12 lg:pointer-events-none lg:z-10">
          <div className="relative w-full max-w-2xl sm:max-w-3xl min-h-[3.5rem] sm:min-h-[4.5rem] flex items-end">
            {captions.map((cap, i) => (
              <div
                key={i}
                ref={(el) => {
                  captionRefs.current[i] = el;
                }}
                className="absolute left-0 bottom-0 top-auto will-change-transform transition-none"
                style={{ opacity: 0, transform: "translate3d(0, 24px, 0)", visibility: "hidden" }}
              >
                <h2 className="text-6xl sm:text-[140px] lg:text-section-huge font-extrabold tracking-tight lg:tracking-tighter text-white leading-none drop-shadow-md">
                  {cap.text}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Bottom Area (Scroll progress and SCROLL hint) */}
        {/* <div className="relative lg:absolute lg:bottom-10 lg:inset-x-0 w-full max-w-7xl mx-auto px-6 md:px-12 pb-5 sm:pb-8 lg:pb-0 pt-2 lg:pt-0 flex items-end justify-between pointer-events-none z-10">
            <div className="flex items-center gap-3 sm:gap-4">
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
          </div>

           <div
            ref={scrollHintRef}
            className="absolute bottom-5 sm:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-none transition-opacity duration-300 z-10"
          >
            <span className="font-mono-tech text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
              SCROLL
            </span>
            <div className="w-[1px] h-5 sm:h-6 bg-gradient-to-b from-white via-white/70 to-transparent animate-pulse" />
          </div>

            <div className="hidden lg:flex items-center gap-2 font-mono-tech text-[10px] tracking-widest text-neutral-500 uppercase">
            <span>OFFICE_TOUR</span>
            <span>//</span>
            <span>24FPS</span>
          </div>
        </div> */}


      </div>
    </section>
  );
}
