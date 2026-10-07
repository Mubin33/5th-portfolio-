"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PHILOSOPHY } from "@/data/portfolio";

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const steps = containerRef.current?.querySelectorAll(".philosophy-step");
      if (!steps) return;

      // Sequential scroll-triggered reveal
      steps.forEach((step, idx) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 60%",
          onEnter: () => setActiveIndex(idx),
          onEnterBack: () => setActiveIndex(idx),
        });

        const headline = step.querySelector(".step-headline");
        const body = step.querySelector(".step-body");

        gsap.fromTo(
          [headline, body],
          { opacity: 0.2, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 75%",
              end: "bottom 40%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      ref={containerRef}
      className="relative py-28 md:py-40 px-6 md:px-12 border-b border-white/10 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            {/* <div className="flex items-center gap-4 mb-3 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
              <span className="text-white font-bold">06</span>
              <span className="w-8 h-[1px] bg-white/30" />
              <span>CORE DISCIPLINE</span>
            </div> */}
            <h2 className="text-section-huge font-bold uppercase tracking-tighter text-white">
              HOW I<br />BUILD
            </h2>
          </div>
          <div className="font-mono-tech text-xs text-neutral-400 uppercase tracking-widest flex items-center gap-4">
            <span>STEP 0{activeIndex + 1} OF 05</span>
            <div className="w-24 h-[2px] bg-neutral-800 relative">
              <div
                className="absolute top-0 left-0 bottom-0 bg-white transition-all duration-300"
                style={{ width: `${((activeIndex + 1) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 5 Sequential Philosophy Steps */}
        <div className="space-y-32 md:space-y-44">
          {PHILOSOPHY.map((step, idx) => (
            <div
              key={step.number}
              className={`philosophy-step grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start border-t border-white/10 pt-12 transition-opacity duration-300 ${
                activeIndex === idx ? "opacity-100" : "opacity-40"
              }`}
            >
              {/* Left Column: Huge Number */}
              <div className="lg:col-span-3 font-mono-tech">
                <span className="text-6xl md:text-9xl font-black text-neutral-700 tracking-tighter block select-none">
                  {step.number}
                </span>
                {/* <span className="text-xs uppercase tracking-widest text-neutral-400 mt-2 block">
                  PHASE // 0{idx + 1}
                </span> */}
              </div>

              {/* Center Column: Big Statement Headline */}
              <div className="lg:col-span-6 step-headline">
                <h3 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white leading-[1.05]">
                  {step.title}
                </h3>
              </div>

              {/* Right Column: Deep Explanation */}
              <div className="lg:col-span-3 step-body space-y-4 font-light text-neutral-300 text-base md:text-lg leading-relaxed">
                <p>{step.description}</p>
                <p className="font-mono-tech text-xs text-neutral-400 pt-2 border-t border-white/10">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
