"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { TECH_STACK_ITEMS } from "@/data/portfolio";

export default function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const track = trackRef.current;
      if (!track) return;

      // Infinite continuous marquee
      tweenRef.current = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 28,
        repeat: -1,
      });
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 0.2, duration: 0.5 });
    }
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5 });
    }
  };

  return (
    <section
      id="tech-stack"
      ref={containerRef}
      className="relative py-20 border-b border-white/10 bg-black overflow-hidden select-none"
    >
      {/* <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 flex justify-between items-center font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
        <span>09 // COMPREHENSIVE RUNTIMES & PROTOCOLS</span>
        <span className="hidden sm:inline">HOVER TO DECELERATE</span>
      </div> */}

      {/* Infinite Marquee Strip */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full overflow-hidden border-y border-white/10 py-5 bg-neutral-950/40 cursor-grab active:cursor-grabbing"
      >
        <div
          ref={trackRef}
          className="flex whitespace-nowrap will-change-transform font-mono-tech text-lg md:text-2xl font-bold uppercase tracking-wider text-neutral-400"
        >
          {[...TECH_STACK_ITEMS, ...TECH_STACK_ITEMS].map((item, idx) => (
            <span
              key={idx}
              className="flex items-center mx-6 hover:text-white transition-colors duration-200"
            >
              <span>{item}</span>
              <span className="mx-6 text-neutral-700 font-normal">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
