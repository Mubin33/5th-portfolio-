"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export interface ZoomHeadingSceneProps {
  text: string;
  targetIndex?: number;
  children: React.ReactNode;
  /** Shown inside the letters while zooming, and fully visible at the end of the zoom. */
  previewContent?: React.ReactNode;
  bgColor?: string;
  textClassName?: string;
  metaTop?: React.ReactNode;
  subheading?: React.ReactNode;
  className?: string;
  id?: string;
  /** Called while the section is pinned with the scroll progress 0 to 1 (zoom + hold). Use it to drive things inside previewContent. */
  onProgress?: (progress: number) => void;
}

/** Zoom reaches full coverage at this point of the scroll timeline (0 to 1). The rest is a short "hold". */
const ZOOM_END = 0.9;

/** How long the section stays pinned, as a % of the screen height. Lower = less scrolling. */
const SCROLL_DESKTOP = 150;
const SCROLL_MOBILE = 120;

const HEADING_FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";

/** Default target = first letter with a thick solid stem and no counter (I, H, T, N, L ...). */
function getDefaultTargetIndex(text: string): number {
  const solid = ["I", "H", "T", "N", "L", "E", "F", "K", "M", "V", "X", "Z"];
  const upper = text.toUpperCase();
  for (const c of solid) {
    const i = upper.indexOf(c);
    if (i !== -1) return i;
  }
  return Math.max(0, Math.floor(text.length / 2));
}

/**
 * HOW THE ZOOM POINT IS PICKED
 * The point must sit inside the filled stroke of the target letter. If it lands in a counter
 * (the hole of an "O") or between letters, the zoom ends on a solid screen.
 *
 * 1. getExtentOfChar() gives the letter's cell in SVG units: box.x = pen position, box.y = top of the em box.
 * 2. The same letter is drawn on an offscreen canvas with the same font, with its pen at (pad, pad)
 *    and its baseline at pad + ascent, so canvas pixels map 1:1 to SVG units (svg = box + (canvas - pad)).
 * 3. A multi-source BFS from every empty pixel gives each filled pixel its depth inside the stroke.
 *    We take the deepest area and, inside it, the pixel nearest the center of the glyph.
 * 4. r = true Euclidean distance from that pixel to the nearest empty pixel (the largest circle that
 *    fits inside the stroke there). Final scale = farthest viewport corner / r, so the stroke always covers the screen.
 */
function findStrokePoint(
  box: { x: number; y: number; width: number; height: number },
  char: string,
  fontFamily: string,
  fontWeight: string,
  fontSize: number
): { x: number; y: number; r: number } | null {
  if (typeof document === "undefined") return null;

  const pad = Math.ceil(fontSize * 0.25) + 8;
  const cw = Math.ceil(Math.max(box.width, fontSize * 0.7)) + pad * 2;
  const chh = Math.ceil(box.height) + pad * 2;

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = chh;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  const safeFontFamily = fontFamily && !fontFamily.includes("var(") ? fontFamily : "sans-serif";
  ctx.font = `${fontWeight} ${fontSize}px ${safeFontFamily}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const metrics = ctx.measureText(char);
  const ascent =
    typeof metrics.fontBoundingBoxAscent === "number"
      ? metrics.fontBoundingBoxAscent
      : box.height * 0.8;

  ctx.fillStyle = "#ffffff";
  ctx.fillText(char, pad, pad + ascent);

  const data = ctx.getImageData(0, 0, cw, chh).data;
  const total = cw * chh;
  const dist = new Int32Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;
  let minX = cw;
  let maxX = 0;
  let minY = chh;
  let maxY = 0;

  for (let i = 0; i < total; i++) {
    if (data[i * 4 + 3] > 127) {
      dist[i] = -1;
      const x = i % cw;
      const y = (i / cw) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    } else {
      dist[i] = 0;
      queue[tail++] = i;
    }
  }
  if (maxX <= minX) return null; // nothing was drawn

  while (head < tail) {
    const cur = queue[head++];
    const d = dist[cur] + 1;
    const x = cur % cw;
    const y = (cur / cw) | 0;
    if (x > 0 && dist[cur - 1] === -1) {
      dist[cur - 1] = d;
      queue[tail++] = cur - 1;
    }
    if (x < cw - 1 && dist[cur + 1] === -1) {
      dist[cur + 1] = d;
      queue[tail++] = cur + 1;
    }
    if (y > 0 && dist[cur - cw] === -1) {
      dist[cur - cw] = d;
      queue[tail++] = cur - cw;
    }
    if (y < chh - 1 && dist[cur + cw] === -1) {
      dist[cur + cw] = d;
      queue[tail++] = cur + cw;
    }
  }

  let maxDist = 0;
  for (let i = 0; i < total; i++) if (dist[i] > maxDist) maxDist = dist[i];
  if (maxDist < 2) return null;

  // Among the deepest pixels, take the one nearest to the center of the glyph
  const gx = (minX + maxX) / 2;
  const gy = (minY + maxY) / 2;
  const threshold = Math.max(2, Math.floor(maxDist * 0.85));
  let bx = -1;
  let by = -1;
  let bestD2 = Infinity;
  for (let y = 0; y < chh; y++) {
    for (let x = 0; x < cw; x++) {
      if (dist[y * cw + x] >= threshold) {
        const d2 = (x - gx) * (x - gx) + (y - gy) * (y - gy);
        if (d2 < bestD2) {
          bestD2 = d2;
          bx = x;
          by = y;
        }
      }
    }
  }
  if (bx < 0) return null;

  // Exact Euclidean radius of the largest circle around (bx, by) that stays inside the stroke
  let minD2 = Infinity;
  for (let i = 0; i < total; i++) {
    if (dist[i] === 0) {
      const dx = (i % cw) - bx;
      const dy = ((i / cw) | 0) - by;
      const d2 = dx * dx + dy * dy;
      if (d2 < minD2) minD2 = d2;
    }
  }
  const r = Math.max(4, Math.sqrt(minD2) - 1);

  return { x: box.x + (bx - pad), y: box.y + (by - pad), r };
}

export default function ZoomHeadingScene({
  text,
  targetIndex,
  children,
  previewContent,
  bgColor = "#000000",
  textClassName = "",
  metaTop,
  subheading,
  className = "",
  id,
  onProgress,
}: ZoomHeadingSceneProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const contentLayerRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const maskGroupRef = useRef<SVGGElement>(null);
  const outlineFadeRef = useRef<SVGGElement>(null);
  const outlineGroupRef = useRef<SVGGElement>(null);
  const outlineTextRef = useRef<SVGTextElement>(null);
  const overlayRectRef = useRef<SVGRectElement>(null);

  // Keep the latest callback in a ref so changing it never rebuilds the ScrollTrigger
  const onProgressRef = useRef(onProgress);
  useEffect(() => {
    onProgressRef.current = onProgress;
  });

  const reactId = useId();
  const maskId = `zoom-mask-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const [isFontReady, setIsFontReady] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1440, height: 900 });

  const resolvedTargetIndex =
    typeof targetIndex === "number" && targetIndex >= 0 && targetIndex < text.length
      ? targetIndex
      : getDefaultTargetIndex(text);

  // Heading font size: fits the viewport width and height
  const charCount = Math.max(text.length, 4);
  const maxCharWidth = (dimensions.width * 0.82) / (charCount * 0.65);
  const fontSize = Math.round(Math.max(40, Math.min(maxCharWidth, dimensions.height * 0.28, 220)));

  const svgTextStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily: HEADING_FONT_FAMILY,
    fontWeight: 900,
    letterSpacing: "-0.04em",
  };

  // Wait for fonts: the glyph measurement depends on the real font
  useEffect(() => {
    let alive = true;
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => alive && setIsFontReady(true));
    } else {
      setIsFontReady(true);
    }
    return () => {
      alive = false;
    };
  }, []);

  // Reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Measure the stage itself (not window.innerHeight). h-svh is stable, so the mobile URL bar
  // never changes this value and never rebuilds the ScrollTrigger in the middle of a scroll.
  useEffect(() => {
    if (isReducedMotion) return;
    let timer: ReturnType<typeof setTimeout>;
    const measure = () => {
      const el = stageRef.current;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h) return;
      setDimensions((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
    };
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(measure, 200);
    };
    measure();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [isReducedMotion]);

  // The scroll animation
  useEffect(() => {
    const stage = stageRef.current;
    const measureEl = outlineTextRef.current;
    const maskGroup = maskGroupRef.current;
    const outlineGroup = outlineGroupRef.current;
    if (!isFontReady || isReducedMotion || !stage || !measureEl || !maskGroup || !outlineGroup) return;

    const vw = dimensions.width;
    const vh = dimensions.height;
    const isMobile = vw < 768;
    let rafId = 0;

    const ctx = gsap.context(() => {
      const char = text[resolvedTargetIndex] || "I";

      // 1. Letter cell in SVG units (measured on the visible outline text, outside the mask)
      let box = { x: 0, y: 0, width: 0, height: 0 };
      try {
        const b = measureEl.getExtentOfChar(resolvedTargetIndex);
        box = { x: b.x, y: b.y, width: b.width, height: b.height };
      } catch {
        /* handled below */
      }
      if (!(box.width > 0)) {
        const cellW = fontSize * 0.62;
        box = {
          x: vw / 2 - (text.length * cellW) / 2 + resolvedTargetIndex * cellW,
          y: vh / 2 - fontSize * 0.6,
          width: cellW,
          height: fontSize * 1.2,
        };
      }

      // 2. Zoom point inside the stroke + inscribed radius
      const cs = window.getComputedStyle(measureEl);
      const found = findStrokePoint(box, char, cs.fontFamily || "sans-serif", cs.fontWeight || "900", fontSize);
      const ox = found ? found.x : box.x + box.width / 2;
      const oy = found ? found.y : box.y + box.height / 2;
      const r = found ? found.r : Math.max(6, box.width * 0.12);

      // 3. Scale that guarantees the stroke covers the farthest corner
      const farthest = Math.max(
        Math.hypot(ox, oy),
        Math.hypot(vw - ox, oy),
        Math.hypot(ox, vh - oy),
        Math.hypot(vw - ox, vh - oy)
      );
      // If the point could not be found, do a gentle 3x zoom and let the overlay cross-fade (never a solid screen)
      const lnFinal = found ? Math.log((farthest / r) * (isMobile ? 1.1 : 1.15)) : Math.log(3);

      // 4. Apply the zoom as an explicit matrix around (ox, oy).
      //    GSAP is NOT used on these SVG groups on purpose: its default SVG transform origin is
      //    the bbox center, which would zoom into the middle of the word instead of into the letter.
      const apply = (z: number) => {
        const s = Math.exp(lnFinal * z); // exponential: constant perceived zoom speed
        const m = `translate(${ox} ${oy}) scale(${s}) translate(${-ox} ${-oy})`;
        maskGroup.setAttribute("transform", m);
        outlineGroup.setAttribute("transform", m);
        measureEl.setAttribute("stroke-width", String(1.5 / s)); // keep the outline a hairline
      };
      apply(0);

      const proxy = { z: 0 };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          start: "top top",
          end: `+=${isMobile ? SCROLL_MOBILE : SCROLL_DESKTOP}%`,
          invalidateOnRefresh: true,
          onUpdate: (self) => onProgressRef.current?.(self.progress),
          onRefresh: (self) => onProgressRef.current?.(self.progress),
        },
      });

      // Dive: eases in AND eases out, so there is no sudden rush at the end
      tl.to(
        proxy,
        { z: 1, ease: "sine.inOut", duration: ZOOM_END, onUpdate: () => apply(proxy.z) },
        0
      );

      // Outline text fades while it zooms
      if (outlineFadeRef.current) {
        tl.to(outlineFadeRef.current, { opacity: 0, ease: "power2.out", duration: 0.55 }, 0);
      }

      // Content behind the letters: depth effect
      if (contentLayerRef.current) {
        tl.fromTo(
          contentLayerRef.current,
          { scale: 1.15, opacity: 0.4 },
          { scale: 1, opacity: 1, ease: "power2.out", duration: ZOOM_END - 0.15 },
          0
        );
      }

      // Small meta text fades in the first part
      if (metaRef.current) {
        tl.fromTo(
          metaRef.current,
          { opacity: 1, y: 0 },
          { opacity: 0, y: -20, ease: "power1.out", duration: 0.15 },
          0
        );
      }

      // Overlay cross-fades out in the last part of the zoom (invisible when the stroke already covers
      // the screen, a soft fallback otherwise). autoAlpha also hides it afterwards to save paint cost.
      if (svgContainerRef.current) {
        tl.to(svgContainerRef.current, { autoAlpha: 0, ease: "none", duration: 0.1 }, ZOOM_END - 0.1);
      }

      // Short hold: the revealed content stays pinned for the last part of the scroll
      tl.to({}, { duration: 1 - ZOOM_END }, ZOOM_END);

      rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
    }, stage);

    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
      maskGroup.removeAttribute("transform");
      outlineGroup.removeAttribute("transform");
      measureEl.setAttribute("stroke-width", "1.5");
    };
  }, [isFontReady, isReducedMotion, text, resolvedTargetIndex, fontSize, dimensions.width, dimensions.height]);

  // Reduced motion: plain stacked layout, no pin, no zoom
  if (isReducedMotion) {
    return (
      <section id={id} className={`relative w-full bg-black py-20 ${className}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
          {metaTop && <div className="mb-3">{metaTop}</div>}
          <h2 className="text-section-huge font-bold uppercase tracking-tighter text-white">
            {text}
            {subheading && <span className="block text-neutral-400">{subheading}</span>}
          </h2>
        </div>
        {previewContent && <div className="w-full mb-16">{previewContent}</div>}
        <div className="w-full">{children}</div>
      </section>
    );
  }

  const cx = dimensions.width / 2;
  const cy = dimensions.height / 2;

  return (
    <section id={id} className={`relative w-full bg-black ${className}`}>
      {/* Pinned stage. h-svh = stable height, no jumps when the mobile URL bar hides */}
      <div
        ref={stageRef}
        className="relative w-full h-svh overflow-hidden flex flex-col justify-center items-center"
      >
        <h2 className="sr-only">
          {text} {typeof subheading === "string" ? subheading : ""}
        </h2>

        {/* Layer 1 (bottom): the content you see THROUGH the letters */}
        <div
          ref={contentLayerRef}
          className="absolute inset-0 w-full h-full flex flex-col justify-center items-center pointer-events-none will-change-transform"
          style={{ transformOrigin: "center center" }}
        >
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 45%, transparent 75%)",
            }}
          />
          <div className="w-full z-10">{previewContent}</div>
        </div>

        {metaTop && (
          <div
            ref={metaRef}
            className="absolute top-10 md:top-14 left-0 right-0 z-30 max-w-7xl mx-auto px-6 md:px-12 pointer-events-none will-change-transform"
          >
            {metaTop}
          </div>
        )}

        {/* Layer 2 (top): solid overlay with the heading cut out as a hole */}
        <div
          ref={svgContainerRef}
          className="absolute inset-0 w-full h-full z-20 pointer-events-none overflow-hidden"
        >
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full block"
            aria-hidden="true"
          >
            <defs>
              <mask
                id={maskId}
                maskUnits="userSpaceOnUse"
                maskContentUnits="userSpaceOnUse"
                x="0"
                y="0"
                width={dimensions.width}
                height={dimensions.height}
              >
                <rect x="0" y="0" width={dimensions.width} height={dimensions.height} fill="#ffffff" />
                {/* transform of this group is set by apply() */}
                <g ref={maskGroupRef}>
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#000000"
                    className={`font-extrabold tracking-tighter uppercase select-none ${textClassName}`}
                    style={svgTextStyle}
                  >
                    {text}
                  </text>
                </g>
              </mask>
            </defs>

            <rect
              ref={overlayRectRef}
              x="0"
              y="0"
              width={dimensions.width}
              height={dimensions.height}
              fill={bgColor}
              mask={`url(#${maskId})`}
            />

            {/* Hairline outline: crisp edge for the heading, also used to measure the letters */}
            <g ref={outlineFadeRef}>
              <g ref={outlineGroupRef}>
                <text
                  ref={outlineTextRef}
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.5"
                  className={`font-extrabold tracking-tighter uppercase select-none ${textClassName}`}
                  style={svgTextStyle}
                >
                  {text}
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Real section content: flows normally after the pin releases */}
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}