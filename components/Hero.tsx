"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { DEVELOPER_INFO } from "@/data/portfolio";
import { scrollToTarget } from "./SmoothScroll";

interface HeroProps {
  isLoaded: boolean;
}

export default function Hero({ isLoaded }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const metaTopRef = useRef<HTMLDivElement>(null);
  const metaBottomRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        metaTopRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(
        ".hero-headline-line",
        { yPercent: 110, opacity: 0, rotateX: -15 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
        },
        "-=0.4"
      )
      .fromTo(
        metaBottomRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        tickerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );

      const tickerInner = tickerRef.current?.querySelector(".ticker-inner");
      if (tickerInner) {
        gsap.to(tickerInner, {
          xPercent: -50,
          ease: "none",
          duration: 25,
          repeat: -1,
        });
      }

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xOffset = (clientX / window.innerWidth - 0.5) * 20;
        const yOffset = (clientY / window.innerHeight - 0.5) * 20;

        gsap.to(headlineRef.current, {
          x: xOffset,
          y: yOffset,
          duration: 1.2,
          ease: "power2.out",
        });
      };

      if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", handleMouseMove);
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, [isLoaded]);

  const marqueeWords = [
    "FRONTEND",
    "REACT",
    "NEXT.JS ",
    "TYPESCRIPT",
    "GSAP 3",
    "INTERACTION DESIGN",
    "AI AGENTS",
    "FULL STACK",
    "LENIS MOTION",
    "BRUTALIST CODE",
  ];

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between pt-28 md:pt-36 pb-12 overflow-hidden border-b border-white/10"
    >
      <div className="absolute inset-0 bg-grid-tech pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col justify-between flex-grow">
        <div
          ref={metaTopRef}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase"
        >
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-white rounded-full inline-block" />
            <span>{DEVELOPER_INFO.title}</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-500">
            <span className="text-white">BANANI, DHAKA, BANGLADESH</span>
          </div>
        </div>

        <div className="my-auto py-10 md:py-16">
          {/* <div className="overflow-hidden mb-2">
            <span className="block font-mono-tech text-xs md:text-sm tracking-widest text-neutral-400 uppercase">
              {"//"} CRAFTING DIGITAL ARCHITECTURE
            </span>
          </div> */}

          <h1
            ref={headlineRef}
            className="text-hero-giant font-extrabold uppercase text-white tracking-tighter will-change-transform select-none"
            style={{ perspective: 1000 }}
          >
            <div className="overflow-hidden py-1">
              <span className="hero-headline-line block leading-[0.88]">
                I BUILD
              </span>
            </div>
            <div className="overflow-hidden py-1">
              <span className="hero-headline-line block leading-[0.88] text-white">
                DIGITAL
              </span>
            </div>
            <div className="overflow-hidden py-1">
              <span className="hero-headline-line block leading-[0.88] text-neutral-400 hover:text-white transition-colors duration-500">
                EXPERIENCES.
              </span>
            </div>
          </h1>
        </div>

        <div
          ref={metaBottomRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10 items-end font-mono-tech text-xs text-neutral-400 tracking-wider uppercase"
        >
          <div>
            <span className="text-neutral-600 block mb-1">DISCIPLINE</span>
            <p className="text-white font-sans text-sm font-medium">
              Frontend Architecture & Creative Motion
            </p>
          </div>

          {/* <div>
            <span className="text-neutral-600 block mb-1">STATUS</span>
            <p className="text-white font-sans text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white inline-block animate-pulse" />
              Available for Work & Contracts
            </p>
          </div> */}

          {/* <div className="flex justify-start md:justify-end">
            <button
              onClick={() => scrollToTarget("#intro")}
              data-cursor="pointer"
              className="group flex items-center gap-3 text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all duration-300"
            >
              <span>EXPLORE WORK</span>
              <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
            </button>
          </div> */}
        </div>
      </div>

      <div
        ref={tickerRef}
        className="relative z-10 w-full mt-12 overflow-hidden border-y border-white/10 bg-black/60 py-3.5 select-none"
      >
        <div className="ticker-inner flex whitespace-nowrap will-change-transform font-mono-tech text-xs md:text-sm tracking-widest uppercase text-neutral-300">
          {[...marqueeWords, ...marqueeWords].map((word, idx) => (
            <span key={idx} className="flex items-center mx-4">
              <span>{word}</span>
              <span className="mx-4 text-neutral-700">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
