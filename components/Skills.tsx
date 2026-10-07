"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { SKILL_TRACK_1, SKILL_TRACK_2, SKILL_CATEGORIES } from "@/data/portfolio";

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      if (track1Ref.current) {
        gsap.to(track1Ref.current, {
          xPercent: -35,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      if (track2Ref.current) {
        gsap.fromTo(
          track2Ref.current,
          { xPercent: -35 },
          {
            xPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative py-28 md:py-40 border-b border-white/10 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="flex items-center gap-4 mb-3 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
          <span className="text-white font-bold">02</span>
          <span className="w-8 h-[1px] bg-white/30" />
          <span>TECHNICAL ARSENAL</span>
        </div>
        <h2 className="text-section-huge font-bold uppercase tracking-tighter text-white">
          SKILLS &<br />EXPERTISE
        </h2>
      </div>

      <div className="my-8 space-y-4 select-none overflow-hidden py-4 border-y border-white/10 bg-neutral-950/40">
        <div
          ref={track1Ref}
          className="flex whitespace-nowrap will-change-transform text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold uppercase tracking-tighter text-transparent"
          style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)" }}
        >
          {[...SKILL_TRACK_1, ...SKILL_TRACK_1].map((skill, idx) => (
            <span
              key={idx}
              data-cursor="explore"
              className="mx-6 hover:text-white transition-colors duration-300 inline-block"
            >
              {skill}
              <span className="mx-6 text-neutral-800">•</span>
            </span>
          ))}
        </div>

        <div
          ref={track2Ref}
          className="flex whitespace-nowrap will-change-transform text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold uppercase tracking-tighter text-transparent"
          style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)" }}
        >
          {[...SKILL_TRACK_2, ...SKILL_TRACK_2].map((skill, idx) => (
            <span
              key={idx}
              data-cursor="explore"
              className="mx-6 hover:text-white transition-colors duration-300 inline-block"
            >
              {skill}
              <span className="mx-6 text-neutral-800">•</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-2">
            {/* <span className="font-mono-tech text-xs tracking-widest text-neutral-400 uppercase mb-4">
              {"//"} SELECT DOMAIN
            </span> */}
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
                <span className="font-mono-tech text-xs">
                  {activeCategory === idx ? " →" : "+"}
                </span>
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
    </section>
  );
}
