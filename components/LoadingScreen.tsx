"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsDone(true);
          onComplete();
        },
      });

      if (prefersReducedMotion) {
        tl.to(containerRef.current, {
          opacity: 0,
          duration: 0.3,
          delay: 1.5,
          onComplete: () => {
            if (containerRef.current) containerRef.current.style.display = "none";
          },
        });
        return;
      }

      // Initial state
      gsap.set([".loader-badge", ".loader-step-1", ".loader-step-2", ".loader-step-3"], {
        opacity: 0,
        y: 10,
      });

      // 0.0s: Reveal Badge & Step 1: Checking your network connection...
      tl.to(".loader-badge", {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      }, 0.0)
      .to(".loader-step-1", {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      }, 0.1)

      // 0.7s: Reveal Step 2: Connect with server.
      .to(".loader-step-2", {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      }, 0.7)

      // 1.4s: Reveal Step 3: Wait a while...
      .to(".loader-step-3", {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      }, 1.4)

      // Hold until exactly 2.0s display duration.
      // At 2.0s: trigger onComplete and begin smooth 1-second fade out transition!
      .call(() => {
        if (containerRef.current) {
          containerRef.current.style.pointerEvents = "none";
        }
        onComplete();
      }, undefined, 2.0)
      .to(containerRef.current, {
        opacity: 0,
        duration: 1.0,
        ease: "power2.inOut",
      }, 2.0)

      // After 1s fade out (at 3.0s total): fully hide and unmount
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
      className="fixed inset-0 z-[99999] pointer-events-auto select-none bg-black overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Subtle ambient vignette background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_65%)]" />

      {/* Centered HUD */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg mx-auto">
        {/* Top Status Pill */}
        <div className="loader-badge flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md mb-8 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-mono-tech text-[10px] sm:text-xs tracking-[0.25em] text-neutral-300 uppercase">
            INITIALIZING SYSTEM
          </span>
        </div>

        {/* 3 Status Lines */}
        <div className="flex flex-col items-start gap-3 w-full max-w-sm font-mono-tech text-xs sm:text-sm tracking-wide text-left">
          <div className="loader-step-1 flex items-center gap-3 text-neutral-300 will-change-transform">
            <span className="text-neutral-500 font-bold select-none">01 //</span>
            <span>Checking your network connection...</span>
          </div>

          <div className="loader-step-2 flex items-center gap-3 text-neutral-300 will-change-transform">
            <span className="text-neutral-500 font-bold select-none">02 //</span>
            <span>Connect with server.</span>
          </div>

          <div className="loader-step-3 flex items-center gap-3 text-white font-medium will-change-transform">
            <span className="text-emerald-400 font-bold select-none">03 //</span>
            <span>Wait a while...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
