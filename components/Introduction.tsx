"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Introduction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const words = textRef.current?.querySelectorAll(".intro-word");
      if (!words || words.length === 0) return;

      gsap.fromTo(
        words,
        {
          opacity: 0.15,
          y: 10,
          color: "#444444",
        },
        {
          opacity: 1,
          y: 0,
          color: "#ffffff",
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "bottom 45%",
            scrub: 0.8,
          },
        }
      );
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  const statement =
    "I design and build interfaces where engineering meets interaction.";

  return (
    <section
      id="intro"
      ref={containerRef}
      className="relative py-28 md:py-44 px-6 md:px-12 border-b border-white/10 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col justify-between">
        <div className="flex items-center gap-4 mb-12 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
          <span className="text-white font-bold">00</span>
          <span className="w-8 h-[1px] bg-white/30" />
          <span>PHILOSOPHICAL PREMISE</span>
        </div>

        <h2
          ref={textRef}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-400 leading-[1.1] max-w-5xl select-none"
        >
          {statement.split(" ").map((word, idx) => (
            <span
              key={idx}
              className={`intro-word inline-block mr-3 md:mr-5 transition-colors duration-200 ${
                word.toLowerCase().includes("engineering") ||
                word.toLowerCase().includes("interaction")
                  ? "font-extrabold underline decoration-white/30 underline-offset-8"
                  : ""
              }`}
            >
              {word}
            </span>
          ))}
        </h2>

        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-white/10 pt-8">
          {/* <div className="md:col-span-4 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
            {"//"} CORE BELIEF
          </div> */}
          <div className="md:col-span-8 space-y-4 text-base md:text-xl text-neutral-300 font-light leading-relaxed">
            <p>
              Modern web architecture cannot exist solely as cold logic or hollow visual flourish. The highest tier of digital craftsmanship occurs when uncompromising performance, semantic cleanliness, and evocative interaction motion coalesce into a single coherent system.
            </p>
            <p className="text-neutral-400 text-sm md:text-base font-mono-tech">
              Specialized in React, Next.js , TypeScript, GSAP, and AI-augmented developer pipelines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
