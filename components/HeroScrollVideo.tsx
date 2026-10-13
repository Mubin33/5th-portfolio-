"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

if (typeof window !== "undefined") {
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export interface MobileFocalKeyframe {
  p: number; // scroll progress 0 to 1
  x: number; // horizontal crop anchor 0 to 1
}

export interface HeroScrollVideoCaption {
  from: number; // 0 to 1
  to: number;   // 0 to 1
  text: string;
}

export type ScrollVideoCaption = HeroScrollVideoCaption;

const DEFAULT_CAPTIONS: HeroScrollVideoCaption[] = [
  // { from: 0.0, to: 0.3, text: "WELCOME" },
  { from: 0.42, to: 0.72, text: "HELLO!" },
  { from: 0.8, to: 1.0, text: "LET'S WORK TOGETHER" },
];

export interface HeroScrollVideoProps {
  /** Desktop video (default "/hero-animation.mp4") */
  videoSrc?: string;
  /** Smaller video used below 768px (default "/hero-animation-sm.mp4") */
  mobileVideoSrc?: string;
  /** Poster shown before the video is ready (default "/hero-animation-poster.webp") */
  posterSrc?: string;
  /** Video length in seconds (default 10) */
  durationSeconds?: number;
  /** Video frame rate (default 50) */
  fps?: number;
  /** Source aspect ratio, only used as a fallback (default 16/9) */
  aspectRatio?: number;
  /** Aspect ratio of the video frame below 1024px (default 4/3) */
  mobileAspect?: number;
  /** Desktop pin length (default "500%") */
  pinLength?: string;
  /** Mobile scroll length in screens (default 3.5) */
  mobilePinLength?: number;
  /** Desktop horizontal crop anchor, 0 to 1 (default 0.5) */
  focalX?: number;
  /** Mobile crop anchor by scroll progress, so the crop follows the man */
  mobileFocal?: MobileFocalKeyframe[];
  /** Loading text displayed while loading (default 'LOADING...') */
  loadingText?: string;
  /** Subtitle displayed under loading text */
  slowNetworkText?: string;
  /** Captions appearing during specific progress intervals */
  captions?: HeroScrollVideoCaption[];
  /** Refresh priority for ScrollTrigger (higher refreshes earlier). Default 35 when preceding other pinned sections. */
  refreshPriority?: number;
  className?: string;
  id?: string;
}

const DEFAULT_MOBILE_FOCAL: MobileFocalKeyframe[] = [
  { p: 0, x: 0.4 },
  { p: 0.45, x: 0.5 },
  { p: 0.65, x: 0.42 },
  { p: 1, x: 0.3 },
];

const A11Y_TEXT = "Camera moving through an open office. A man at a desk waves hello.";

function interpolateFocalX(p: number, keyframes: MobileFocalKeyframe[], fallback: number): number {
  if (!keyframes || keyframes.length === 0) return fallback;
  const c = Math.max(0, Math.min(1, p));
  if (c <= keyframes[0].p) return keyframes[0].x;
  const last = keyframes[keyframes.length - 1];
  if (c >= last.p) return last.x;
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (c >= a.p && c <= b.p) {
      const span = b.p - a.p;
      return span <= 0 ? a.x : a.x + ((c - a.p) / span) * (b.x - a.x);
    }
  }
  return fallback;
}

export default function HeroScrollVideo({
  videoSrc = "/hero-animation.mp4",
  mobileVideoSrc = "/hero-animation-sm.mp4",
  posterSrc = "/hero-animation-poster.webp",
  durationSeconds = 11,
  fps = 50,
  aspectRatio = 16 / 9,
  mobileAspect = 3 / 4,
  pinLength = "500%",
  mobilePinLength = 3.5,
  focalX = 0.5,
  mobileFocal = DEFAULT_MOBILE_FOCAL,
  loadingText = "LOADING...",
  slowNetworkText = "your internet is very slow, please wait to load.",
  captions = DEFAULT_CAPTIONS,
  refreshPriority,
  className = "",
  id = "hero-scroll-video",
}: HeroScrollVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const loadBarRef = useRef<HTMLDivElement>(null);
  const loadingPunchRef = useRef<HTMLDivElement>(null);

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Latest crop settings, read inside the effect without re-running it
  const cropRef = useRef({ focalX, mobileFocal, aspectRatio });
  useEffect(() => {
    cropRef.current = { focalX, mobileFocal, aspectRatio };
  });

  useEffect(() => {
    setIsReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    const section = sectionRef.current;
    const frame = videoFrameRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!section || !frame || !canvas || !video) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");

    const abort = new AbortController();
    const frameStep = 1 / Math.max(1, fps);
    const LERP = 0.14;

    let disposed = false;
    let loaded = false;
    let tabVisible = !document.hidden;
    let posterImg: HTMLImageElement | null = null;
    let blobUrl: string | null = null;

    // Playhead (all in seconds)
    let progress = 0;
    let target = 0; // where the scroll wants to be
    let current = 0; // smoothed position
    let desired = 0; // frame-aligned time we want the video on
    let seekStartedAt = 0;

    /* ---------- drawing (cover crop + focal point) ---------- */
    const draw = () => {
      const cw = canvas.width;
      const ch = canvas.height;
      if (!cw || !ch) return;

      let source: CanvasImageSource | null = null;
      let sw = 0;
      let sh = 0;

      if (loaded) {
        // While a seek is in flight the video has no frame. Keep the last picture instead of flashing the poster.
        if (video.readyState < 2 || !video.videoWidth) return;
        source = video;
        sw = video.videoWidth;
        sh = video.videoHeight;
      } else if (posterImg && posterImg.naturalWidth) {
        source = posterImg;
        sw = posterImg.naturalWidth;
        sh = posterImg.naturalHeight;
      }
      if (!source || !sw || !sh) return;

      const crop = cropRef.current;
      const fx = mqDesktop.matches ? crop.focalX : interpolateFocalX(progress, crop.mobileFocal, crop.focalX);

      const srcRatio = sw / sh;
      const canvasRatio = cw / ch;
      let sWidth: number;
      let sHeight: number;
      let sx = 0;
      let sy = 0;

      if (canvasRatio < srcRatio) {
        sHeight = sh;
        sWidth = sh * canvasRatio;
        sx = (sw - sWidth) * Math.max(0, Math.min(1, fx));
      } else {
        sWidth = sw;
        sHeight = sw / canvasRatio;
        sy = (sh - sHeight) * 0.5;
      }

      ctx.drawImage(source, sx, sy, sWidth, sHeight, 0, 0, cw, ch);
    };

    /* ---------- canvas size (ignores the mobile URL bar) ---------- */
    let lastW = 0;
    let lastH = 0;
    const resizeCanvas = () => {
      const w = frame.clientWidth;
      const h = frame.clientHeight;
      if (!w || !h) return;

      const wChanged = Math.abs(w - lastW) >= 1;
      const hChanged = Math.abs(h - lastH) >= (mqCoarse.matches ? 120 : 1);
      if (lastW && !wChanged && !hChanged) return;

      lastW = w;
      lastH = h;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.imageSmoothingQuality = "high";
      draw();
    };
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(frame);

    /* ---------- poster ---------- */
    if (posterSrc) {
      const img = new Image();
      img.onload = () => {
        if (disposed) return;
        posterImg = img;
        if (!loaded) draw();
      };
      img.src = posterSrc;
    }

    /* ---------- seeking: one seek at a time, always exact ---------- */
    const pump = () => {
      if (!loaded || video.seeking) return;
      if (Math.abs(video.currentTime - desired) < frameStep * 0.5) return;
      seekStartedAt = performance.now();
      video.currentTime = desired; // exact seek (fastSeek would snap to keyframes)
    };

    const onSeeked = () => {
      draw();
      pump(); // if the target moved while seeking, go to the newest one
    };

    const onLoadedData = () => {
      loaded = true;

      // iOS/Safari: a muted play() then pause() makes the browser decode frames
      const unlock = () => video.play().then(() => video.pause());
      unlock().catch(() => {
        const retry = () => {
          unlock().catch(() => {});
        };
        window.addEventListener("touchstart", retry, { once: true });
        window.addEventListener("pointerdown", retry, { once: true });
      });

      pump();
      draw();
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadeddata", onLoadedData);

    /* ---------- loading: fetch -> Blob (local seeking is much faster) ---------- */
    const setLoad = (ratio: number) => {
      if (loadBarRef.current) loadBarRef.current.style.transform = `scaleX(${ratio})`;
    };

    const attach = (blob: Blob) => {
      if (disposed) return;
      blobUrl = URL.createObjectURL(blob);
      video.src = blobUrl;
      video.load();
      if (loadBarRef.current) loadBarRef.current.style.opacity = "0";
    };

    const loadVideo = async (src: string, fallback?: string) => {
      try {
        let res = await fetch(src, { signal: abort.signal });
        if (!res.ok && fallback && fallback !== src) res = await fetch(fallback, { signal: abort.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const total = parseInt(res.headers.get("Content-Length") || "0", 10);
        if (res.body && total > 0) {
          const reader = res.body.getReader();
          const chunks: Uint8Array[] = [];
          let got = 0;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              chunks.push(value);
              got += value.length;
              setLoad(Math.min(1, got / total));
            }
          }
          attach(new Blob(chunks as BlobPart[], { type: "video/mp4" }));
        } else {
          attach(await res.blob());
        }
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        if (fallback && fallback !== src) {
          loadVideo(fallback);
        }
        // otherwise: the poster stays visible, nothing breaks
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        const small = window.innerWidth < 768 && !!mobileVideoSrc;
        loadVideo(small ? mobileVideoSrc : videoSrc, videoSrc);
      },
      { rootMargin: "150% 0px 150% 0px" }
    );
    io.observe(section);

    /* ---------- scroll: desktop = pin, mobile = CSS sticky (no JS pin, no jitter) ---------- */
    const setProgress = (p: number) => {
      progress = p;
      target = p * durationSeconds;
      if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${p})`;
      if (p > 0.03 && loadingPunchRef.current) {
        loadingPunchRef.current.style.opacity = "0";
      }
      updateCaptionsUI(p);
    };

    // Dynamically calculate refreshPriority so earlier pinned sections calculate before downstream ones
    const resolvedPriority =
      refreshPriority !== undefined
        ? refreshPriority
        : (() => {
            if (typeof document === "undefined" || !section) return 35;
            const aboutEl = document.getElementById("about");
            if (aboutEl && (section.compareDocumentPosition(aboutEl) & Node.DOCUMENT_POSITION_FOLLOWING)) {
              return 35; // Precedes About (refreshPriority: 20)
            }
            const skillsEl = document.getElementById("skills");
            if (skillsEl && (section.compareDocumentPosition(skillsEl) & Node.DOCUMENT_POSITION_FOLLOWING)) {
              return 18; // Precedes ZoomHeadingScene (refreshPriority: 15)
            }
            const showcaseEl = document.getElementById("projects") || document.querySelector("#work");
            if (showcaseEl && (section.compareDocumentPosition(showcaseEl) & Node.DOCUMENT_POSITION_FOLLOWING)) {
              return 12; // Precedes ProjectShowcase (refreshPriority: 10)
            }
            return 35; // At top of page, must calculate first
          })();

    const mm = gsap.matchMedia();
    const makeTrigger = (pin: boolean) => () => {
      const st = ScrollTrigger.create({
        trigger: section,
        pin,
        start: "top top",
        end: pin ? "+=" + pinLength : "bottom bottom",
        invalidateOnRefresh: true,
        refreshPriority: resolvedPriority,
        anticipatePin: pin ? 1 : 0,
        onUpdate: (self) => setProgress(self.progress),
        onRefresh: (self) => {
          setProgress(self.progress);
          current = target; // no long glide after a refresh
        },
      });
      return () => st.kill();
    };
    mm.add("(min-width: 1024px)", makeTrigger(true));
    mm.add("(max-width: 1023px)", makeTrigger(false));

    updateCaptionsUI(0);

    // Re-sort and recalculate all ScrollTriggers on page so subsequent sections (Hero, About, Skills, Projects)
    // get exact, pixel-perfect start/end scroll offsets!
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 150);

    /* ---------- smoothing loop ---------- */
    const tick = (_time: number, deltaMs: number) => {
      if (!tabVisible) return;

      const diff = target - current;
      if (Math.abs(diff) > 0.0005) {
        const dt = Math.min(Math.max(deltaMs || 16.7, 1), 100);
        current += diff * (1 - Math.pow(1 - LERP, dt / 16.667));
      } else {
        current = target;
      }

      // Aim at the middle of a frame so rounding never lands on the previous one
      const realDuration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : durationSeconds;
      const maxT = Math.max(0, realDuration - frameStep * 0.5);
      const idx = Math.round(current / frameStep - 0.5);
      desired = Math.min(maxT, Math.max(0, (idx + 0.5) * frameStep));

      pump();

      // Watchdog: a seek that never finishes gets re-issued
      if (loaded && video.seeking && performance.now() - seekStartedAt > 1500) {
        seekStartedAt = performance.now();
        video.currentTime = desired;
      }
    };
    gsap.ticker.add(tick);

    const onVisibility = () => {
      tabVisible = !document.hidden;
      if (tabVisible) draw();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimeout(refreshTimer);
      disposed = true;
      abort.abort();
      io.disconnect();
      ro.disconnect();
      mm.revert();
      ScrollTrigger.refresh();
      gsap.ticker.remove(tick);
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadeddata", onLoadedData);
      video.pause();
      video.removeAttribute("src");
      video.load();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [isReducedMotion, videoSrc, mobileVideoSrc, posterSrc, durationSeconds, fps, pinLength, refreshPriority, updateCaptionsUI]);

  /* ---------- reduced motion: a still picture, no text ---------- */
  if (isReducedMotion) {
    return (
      <section
        id={id}
        aria-label="Office tour"
        className={`hsv-wrapper relative w-full h-svh bg-black overflow-hidden ${className}`}
      >
        {posterSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={posterSrc} alt={A11Y_TEXT} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.8)_100%)]" />

        {/* Reduced motion static captions display */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-6">
          {captions.map((cap, i) => (
            <p key={i} className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              {cap.text}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id={id}
        ref={sectionRef}
        aria-label="Office tour"
        style={
          {
            "--hsv-pin-h": `calc(100svh + (${mobilePinLength} * 100svh))`,
            "--hsv-aspect": `${mobileAspect}`,
          } as React.CSSProperties
        }
        className={`hsv-wrapper relative w-full h-[var(--hsv-pin-h)] lg:h-svh bg-black ${className}`}
      >
        {/* Mobile: sticky stage. Desktop: GSAP pins the whole section */}
        <div className="hsv-stage sticky top-0 lg:relative w-full h-svh overflow-hidden bg-black max-lg:flex max-lg:flex-col max-lg:justify-between lg:block">
          {/* Video frame: edge-to-edge strip on mobile, full-bleed on desktop */}
          <div
            ref={videoFrameRef}
            className="hsv-video-frame max-lg:relative max-lg:w-full max-lg:my-auto border-none max-lg:overflow-hidden max-lg:aspect-[var(--hsv-aspect)] max-lg:max-h-[70svh] lg:absolute lg:inset-0 lg:w-full lg:h-full lg:my-0 lg:aspect-auto"
          >
            <canvas ref={canvasRef} aria-hidden="true" className="hsv-canvas block w-full h-full" />

            {/* Soft edges so the video blends into the black page */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.8)_100%)]" />
            <div className="lg:hidden pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black to-transparent" />
            <div className="lg:hidden pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent" />
          </div>

          <p className="sr-only">{A11Y_TEXT}</p>

          {/* Desktop Left Ambient Vignette for Captions */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-full sm:w-3/4 md:w-1/2 bg-gradient-to-r from-black/70 via-black/35 to-transparent pointer-events-none z-[5]" />

          {/* Captions Area (Directly below video frame on mobile, bottom overlay on desktop) */}
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

          {/* Centered Big Punched Loading Text (Over the video for 1s, then fades out smoothly) */}
          <div
            ref={loadingPunchRef}
            className={`absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700 ease-out select-none bg-black/40 backdrop-blur-[2px] px-4 ${
              showLoading ? "opacity-100" : "opacity-0"
            }`}
          >
            <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase select-none text-center drop-shadow-2xl">
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

            {slowNetworkText && (
              <p className="font-mono-tech text-xs sm:text-sm tracking-widest text-neutral-400 uppercase mt-3 sm:mt-5 text-center drop-shadow-md">
                {slowNetworkText}
              </p>
            )}
          </div>

          {/* Thin lines only, no text: scroll progress, and download progress */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-px bg-transparent">
            <div
              ref={progressBarRef}
              className="h-full origin-left bg-white/70"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-px">
            <div
              ref={loadBarRef}
              className="h-full origin-left bg-white transition-opacity duration-500"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </section>

      {/* Frame source. Outside the pinned section on purpose: GSAP moves pinned elements in the DOM,
          and moving a <video> can interrupt it. */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        className="hsv-video pointer-events-none fixed -left-[9999px] -top-[9999px] h-1 w-1 opacity-0"
      />
    </>
  );
}