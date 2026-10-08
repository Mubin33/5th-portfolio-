"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { SKILL_TRACK_1, SKILL_TRACK_2, SKILL_CATEGORIES } from "@/data/portfolio";
import ZoomHeadingScene from "@/components/ZoomHeadingScene";

// Change these two symbols to whatever you used before
const SEP = "✦"; // separator between skills in the marquee
const OPEN = "−"; // marker on the active category button

// Each track renders 3 copies, so one copy = exactly 100/3 % of the track width
const TRAVEL = 100 / 3;

export default function Skills() {
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const move1 = useRef<((v: number) => void) | null>(null);
  const move2 = useRef<((v: number) => void) | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  // quickTo setters for the two tracks (created once, driven by the zoom scroll progress)
  useEffect(() => {
    const t1 = track1Ref.current;
    const t2 = track2Ref.current;
    if (!t1 || !t2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(t1, { xPercent: 0 });
    gsap.set(t2, { xPercent: -TRAVEL });
    move1.current = gsap.quickTo(t1, "xPercent", { duration: 0.5, ease: "power3.out" });
    move2.current = gsap.quickTo(t2, "xPercent", { duration: 0.5, ease: "power3.out" });

    return () => {
      move1.current = null;
      move2.current = null;
      gsap.set([t1, t2], { clearProps: "transform" });
    };
  }, []);

  // Called by ZoomHeadingScene while it is pinned: track 1 slides left, track 2 slides right
  const handleProgress = useCallback((p: number) => {
    move1.current?.(-TRAVEL * p);
    move2.current?.(-TRAVEL * (1 - p));
  }, []);

  // This is what you see INSIDE the letters while zooming (and full screen at the end of the zoom)
  const marquee = (
    <div className="w-full space-y-3 md:space-y-4 select-none overflow-hidden py-4">
      <div
        ref={track1Ref}
        className="flex w-max whitespace-nowrap will-change-transform text-4xl sm:text-6xl md:text-8xl font-extrabold uppercase tracking-tighter text-white"
      >
        {[...SKILL_TRACK_1, ...SKILL_TRACK_1, ...SKILL_TRACK_1].map((skill, idx) => (
          <span key={idx} className="mx-5 inline-block">
            {skill}
            <span className="mx-5 text-neutral-600">{SEP}</span>
          </span>
        ))}
      </div>

      <div
        ref={track2Ref}
        className="flex w-max whitespace-nowrap will-change-transform text-4xl sm:text-6xl md:text-8xl font-extrabold uppercase tracking-tighter text-transparent"
        style={{ WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.85)" }}
      >
        {[...SKILL_TRACK_2, ...SKILL_TRACK_2, ...SKILL_TRACK_2].map((skill, idx) => (
          <span key={idx} className="mx-5 inline-block">
            {skill}
            <span className="mx-5">{SEP}</span>
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <ZoomHeadingScene
      id="skills"
      text="SKILLS"
      targetIndex={2}
      subheading="& EXPERTISE"
      // metaTop={
      //   <div className="flex items-center gap-4 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
      //     <span className="text-white font-bold">02</span>
      //     <span className="w-8 h-[1px] bg-white/30" />
      //     <span>TECHNICAL ARSENAL</span>
      //   </div>
      // }
      previewContent={marquee}
      onProgress={handleProgress}
      className="border-b border-white/10"
    >
      {/* Domain selection and details grid: scrolls in after the zoom */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-2">
            
            {SKILL_CATEGORIES.map((cat, idx) => (
              <button
                key={cat.number}
                onClick={() => setActiveCategory(idx)}
                data-cursor="pointer"
                className={`text-left p-5 border transition-all duration-300 flex items-center justify-between ${
                  activeCategory === idx
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-neutral-400 border-white/10 hover:border-white/40 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono-tech text-xs font-bold">{cat.number}</span>
                  <span className="font-bold tracking-tight text-base sm:text-lg uppercase">
                    {cat.title}
                  </span>
                </div>
                <span className="font-mono-tech text-xs">{activeCategory === idx ? OPEN : "+"}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 border border-white/10 p-8 md:p-12 bg-neutral-950/80 flex flex-col justify-between min-h-[340px]">
            <div>
              {/* <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
                <span>CATEGORY {"//"} {SKILL_CATEGORIES[activeCategory].number}</span>
                <span>PRODUCTION READY</span>
              </div> */}
              <h3 className="text-2xl md:text-3xl font-bold uppercase text-white tracking-tight mb-4">
                {SKILL_CATEGORIES[activeCategory].title}
              </h3>
              <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-8">
                {SKILL_CATEGORIES[activeCategory].description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-6 border-t border-white/10">
              {SKILL_CATEGORIES[activeCategory].skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="font-mono-tech text-xs tracking-wider px-3 py-1.5 bg-black border border-white/20 text-neutral-200 hover:bg-white hover:text-black transition-colors duration-200 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ZoomHeadingScene>
  );
}