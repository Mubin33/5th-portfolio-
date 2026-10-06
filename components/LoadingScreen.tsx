"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const counterObj = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          setIsDone(true);
          onComplete();
        },
      });

      if (prefersReducedMotion) {
        tl.to(containerRef.current, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            if (containerRef.current) containerRef.current.style.display = "none";
          },
        });
        return;
      }

      // Initial state using scoped selectors
      gsap.set(".loader-name", { y: 20, opacity: 0 });
            gsap.set(".loader-progress-bar", { scaleX: 0 });

      // Step 1: Reveal developer name and metadata
      tl.to(".loader-name", {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      })
      

      // Step 2: Animate counter from 00 to 100
      .to(counterObj, {
        value: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            const val = Math.floor(counterObj.value);
            counterRef.current.textContent = val < 10 ? `0${val}` : `${val}`;
          }
          const bar = containerRef.current?.querySelector(".loader-progress-bar") as HTMLElement | null;
          if (bar) {
            bar.style.transform = `scaleX(${counterObj.value / 100})`;
          }
        },
      })

      // Step 3: Brief hold at 100%
      .to({}, { duration: 0.1 })

      // Step 4: Cinematic split curtain reveal
      .to(".loader-name", {
        opacity: 0,
        y: -15,
        duration: 0.35,
        ease: "power2.in",
      })
      .to(".loader-curtain-top", {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
      }, "curtain")
      .to(".loader-curtain-bottom", {
        yPercent: 100,
        duration: 0.8,
        ease: "power4.inOut",
      }, "curtain")
      .set(containerRef.current, {
        display: "none",
      });
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] pointer-events-auto select-none bg-black overflow-hidden flex flex-col justify-between"
    >
      {/* Top curtain half */}
      <div
        className="loader-curtain-top absolute top-0 left-0 right-0 h-1/2 bg-[#000000] z-20 border-b border-white/10 will-change-transform"
      />
      {/* Bottom curtain half */}
      <div
        className="loader-curtain-bottom absolute bottom-0 left-0 right-0 h-1/2 bg-[#000000] z-20 border-t border-white/10 will-change-transform"
      />

      {/* Main content layer on top of curtains */}
      <div className="relative z-30 flex flex-col justify-between h-full p-6 sm:p-8 md:p-14 max-w-7xl mx-auto w-full">
        {/* Top bar */} 

        {/* Center Typography & Counter */}
        <div className="my-auto py-12 flex flex-col items-start md:items-center text-left md:text-center">
         
          <h1
            className="loader-name text-3xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white uppercase font-sans mb-6"
          >
            MD. YASIN ARAFAT MUBIN
          </h1>

          {/* Large Monospace percentage counter */}
          <div className="flex items-baseline gap-2 mt-4">
            <span
              ref={counterRef}
              className="font-mono-tech text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white tabular-nums"
            >
              00
            </span>
            <span className="font-mono-tech text-xl md:text-3xl text-neutral-500 font-normal">
              %
            </span>
          </div>
        </div>

        {/* Bottom progress bar & status */}
        <div className="w-full flex flex-col gap-3">
          <div className="w-full h-[1px] bg-neutral-900 overflow-hidden relative">
            <div
              className="loader-progress-bar absolute top-0 left-0 bottom-0 w-full bg-white origin-left will-change-transform"
              style={{ transform: "scaleX(0)" }}
            />
          </div> 
        </div>
      </div>
    </div>
  );
}
