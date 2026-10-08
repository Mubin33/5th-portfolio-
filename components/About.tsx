"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const imageGlowRef = useRef<HTMLDivElement>(null);

  // Divider and Image Layer Refs for Scroll-Driven Transition
  const dividerLineRef = useRef<HTMLDivElement>(null);
  const layerEditedRef = useRef<HTMLDivElement>(null);
  const layerOriginalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      // Pinned Scroll Section Transition: Divider moves from 0% (extreme left) to 100% (full right)
      if (
        containerRef.current &&
        dividerLineRef.current &&
        layerEditedRef.current &&
        layerOriginalRef.current
      ) {
        const posObj = { pos: 0 };

        const dividerTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=380", // Snappy single scroll wheel flick to complete
            pin: true,
            pinSpacing: true,
            scrub: 0.3,
            anticipatePin: 1,
            refreshPriority: 20,
            invalidateOnRefresh: true,
          },
        });

        dividerTl.to(posObj, {
          pos: 100,
          ease: "none",
          onUpdate: () => {
            const p = posObj.pos;
            if (dividerLineRef.current) {
              dividerLineRef.current.style.left = `${p}%`;
              // Smoothly fade out divider glow near edges (0% and 100%) so it hides cleanly behind the side shadows
              let edgeAlpha = 1;
              if (p <= 10) {
                edgeAlpha = p / 10;
              } else if (p >= 90) {
                edgeAlpha = (100 - p) / 10;
              }
              dividerLineRef.current.style.opacity = `${Math.max(0, Math.min(1, edgeAlpha))}`;
            }
            if (layerEditedRef.current) {
              // Left side of divider: Edited image reveals from 0% to p%
              layerEditedRef.current.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
            }
            if (layerOriginalRef.current) {
              // Right side of divider: Original image reveals from p% to 100%
              layerOriginalRef.current.style.clipPath = `inset(0 0 0 ${p}%)`;
            }
          },
        });
      }

      const borders = containerRef.current?.querySelectorAll(".animated-border");
      if (borders) {
        gsap.fromTo(
          borders,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
            },
          }
        );
      }

      gsap.fromTo(
        titleRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );

      const paragraphs = bioRef.current?.querySelectorAll("p");
      if (paragraphs) {
        gsap.fromTo(
          paragraphs,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bioRef.current,
              start: "top 80%",
            },
          }
        );
      }

      const metaItems = metaRef.current?.querySelectorAll(".meta-box");
      if (metaItems) {
        gsap.fromTo(
          metaItems,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: metaRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Smooth reveal & parallax for portrait image frame
      if (imageFrameRef.current) {
        gsap.fromTo(
          imageFrameRef.current,
          { y: 45, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: imageFrameRef.current,
              start: "top 80%",
            },
          }
        );

        // Subtle parallax scrub during scroll
        gsap.to(imageFrameRef.current, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Radiant white glow breathe & reveal
      if (imageGlowRef.current) {
        gsap.fromTo(
          imageGlowRef.current,
          { scale: 0.75, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: imageFrameRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-screen py-16 md:py-24 px-6 md:px-12 border-b border-white/10 bg-black overflow-hidden flex flex-col justify-center"
    >
      <div className="max-w-7xl w-full mx-auto my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Title, Narrative Bio, Stats & Meta */}
          <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col gap-6">
            {/* <div>
              <h2
                ref={titleRef}
                className="text-section-huge font-medium uppercase tracking-tighter text-white will-change-transform"
              >
                ABOUT ME
              </h2>
            </div> */}

            <div ref={bioRef} className="space-y-6 text-xl md:text-3xl text-neutral-300 font-light leading-7 lg:leading-12 -mt-7">
              <p className="text-white font-medium italic">
                I am <span className="font-semibold text-white decoration-white/40">MD. Yasin Arafat Mubin</span>, a Full-Stack developer who enjoys building modern web applications, interactive interfaces, and scalable digital experiences.
              </p>
              <p className="text-lg md:text-xl">
                My primary focus is React, Next.js, TypeScript, JavaScript, Node, Python(django), and modern frontend architecture with heavy emphasis on silky smooth motion engineering.
              </p>
              <p className="text-neutral-400 text-base md:text-lg">
                I also work with backend technologies, APIs, databases, and AI-powered development workflows including Model Context Protocol (MCP) and autonomous developer agent pipelines.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-6 font-mono-tech">
              <div>
                <span className="text-3xl font-bold text-white block">04+</span>
                <span className="text-xs text-neutral-400 uppercase tracking-wider">
                  Years Crafting Code
                </span>
              </div>
              <div>
                <span className="text-3xl font-bold text-white block">20+</span>
                <span className="text-xs text-neutral-400 uppercase tracking-wider">
                  Shipped Systems
                </span>
              </div>
            </div>

            <div className="animated-border w-full h-[1px] bg-white/10 origin-left will-change-transform" />

            <div
              ref={metaRef}
              className="flex flex-col gap-4 font-mono-tech text-xs uppercase tracking-wider"
            >
              {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="meta-box p-4 border border-white/10 bg-neutral-950/60">
                  <span className="text-neutral-400 block mb-2">{"//"} LOCATION</span>
                  <p className="text-white font-sans text-sm font-semibold">
                    DHAKA, BANGLADESH
                  </p>
                </div>

                <div className="meta-box p-4 border border-white/10 bg-neutral-950/60">
                  <span className="text-neutral-400 block mb-2">{"//"} ROLE</span>
                  <p className="text-white font-sans text-sm font-semibold">
                    FULL STACK
                  </p>
                </div>

                <div className="meta-box p-4 border border-white/10 bg-neutral-950/60">
                  <span className="text-neutral-400 block mb-2">{"//"} FOCUS</span>
                  <p className="text-white font-sans text-sm font-semibold">
                    REACT / NEXT.JS / GSAP / DJANGO / NODE
                  </p>
                  <span className="text-neutral-400 text-[11px] block mt-1">
                    AI WORKFLOWS & MCP
                  </span>
                </div>
              </div> */}

              {/* Education Box */}
              <div className="meta-box p-4 sm:p-5 border border-white/10 bg-neutral-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div> 
                  <p className="text-white font-sans text-sm sm:text-base font-semibold normal-case">
                    BSc in Computer Science and Engineering
                  </p>
                  <p className="text-neutral-300 text-xs font-mono-tech mt-1 tracking-wide normal-case">
                    Northern University Bangladesh
                  </p>
                  <span className="text-neutral-500 text-[11px] block font-mono-tech mt-0.5 tracking-normal normal-case">
                    Dakshinkhan, Dhaka-1230
                  </span>
                </div>
                <div className="self-start sm:self-center">
                  <span className="inline-block px-2.5 py-1 text-[10px] font-mono-tech uppercase tracking-widest text-white/80 border border-white/20 bg-white/5">
                    CSE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-End Scroll-Driven Before/After Portrait Transition */}
          <div
            ref={imageFrameRef}
            className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-center justify-center will-change-transform mt-0"
          >
            <div className="relative w-full max-w-[600px] aspect-[7/8] overflow-hidden group select-none">
              {/* Corner crosshairs */}
              <span className="absolute top-2 left-2 text-xs font-mono-tech text-white/50 z-30 select-none pointer-events-none">
                {/* + */}
              </span>
              <span className="absolute top-2 right-2 text-xs font-mono-tech text-white/50 z-30 select-none pointer-events-none">
                {/* + */}
              </span>
              <span className="absolute bottom-2 left-2 text-xs font-mono-tech text-white/50 z-30 select-none pointer-events-none">
                {/* + */}
              </span>
              <span className="absolute bottom-2 right-2 text-xs font-mono-tech text-white/50 z-30 select-none pointer-events-none">
                {/* + */}
              </span>

              {/* RADIANT WHITE GLOW (Backlight halo behind Mubin) */}
              <div
                ref={imageGlowRef}
                className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[340px] h-[280px] sm:h-[340px] rounded-full pointer-events-none z-0"
                style={{
                  background: "radial-gradient(circle, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.14) 42%, rgba(255, 255, 255, 0.04) 65%, transparent 75%)",
                  filter: "blur(42px)",
                }}
              />

              {/* Secondary breathing halo layer */}
              <div
                className="absolute top-[84%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-60 h-48 sm:h-60 rounded-full bg-white/25 blur-[65px] pointer-events-none z-0 animate-pulse"
              />

              {/* Subtle tech background grid pattern */}
              <div className="absolute inset-0 bg-grid-tech opacity-25 pointer-events-none z-0" />

              {/* Top Mode Badges */}
              {/* <div className="absolute top-3 left-4 right-4 z-30 flex justify-between items-center font-mono-tech text-[10px] tracking-widest uppercase pointer-events-none select-none">
                <span className="px-2 py-0.5 border border-white/20 bg-black/75 text-neutral-300 backdrop-blur-sm">
                  EDITED
                </span>
                <span className="px-2 py-0.5 border border-white/20 bg-black/75 text-white backdrop-blur-sm font-semibold">
                  ORIGINAL
                </span>
              </div> */}

              {/* LAYER 1 (Left Side of Divider): Edited Image with Dynamic Inset Clip Path */}
              <div
                ref={layerEditedRef}
                className="absolute mt-1 lg:mt-2 inset-0 z-10 w-full h-full flex items-end justify-center pt-10 pointer-events-none will-change-[clip-path]"
                style={{
                  clipPath: "inset(0 100% 0 0)",
                }}
              >
                <Image
                  src="/mubin_full_img_edited.png"
                  alt="MD. Yasin Arafat Mubin (Edited)"
                  width={674}
                  height={831}
                  priority
                  className="w-auto ml-8 lg:ml-3 h-[100%] object-contain object-bottom select-none pointer-events-none"
                />
              </div>

              {/* LAYER 2 (Right Side of Divider): Original Image with Dynamic Inset Clip Path */}
              <div
                ref={layerOriginalRef}
                className="absolute inset-0 z-10 w-full h-full flex items-end justify-center pt-10 pointer-events-none will-change-[clip-path]"
                style={{
                  clipPath: "inset(0 0 0 0%)",
                }}
              >
                <Image
                  src="/mubin_full_img.png"
                  alt="MD. Yasin Arafat Mubin (Original)"
                  width={674}
                  height={831}
                  priority
                  className="w-auto ml-16 h-[98%] object-contain object-bottom select-none pointer-events-none"
                />
              </div>

              {/* Left & Right edge shadows to seamlessly conceal divider at endpoints */}
              <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-40" />
              <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-40" />

              {/* Seamless bottom fade into black */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-40" />

              {/* SCROLL-DRIVEN RADIANT GLOW LIGHT BEAM */}
              <div
                ref={dividerLineRef}
                className="absolute top-0 bottom-0 z-30 pointer-events-none will-change-[left,opacity] flex items-center justify-center"
                style={{
                  left: "0%",
                  transform: "translateX(-50%)",
                  opacity: 0,
                }}
              >
                {/* 1. Wide Atmospheric Ambient Glow Aura */}
                <div className="absolute w-28 sm:w-36 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl" />

                {/* 2. Soft Luminous Scan Blade (Covers the transition seam) */}
                <div className="absolute w-12 sm:w-16 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent blur-md" />

                {/* 3. Ethereal Vertical Photon Ray (Fades seamlessly at top and bottom) */}
                {/* <div
                  className="w-[1.5px] h-full bg-gradient-to-b from-transparent via-white to-transparent"
                  style={{
                    boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.75), 0 0 25px 5px rgba(255, 255, 255, 0.35)",
                  }}
                /> */}

                {/* 4. Delicate Optical Center Light Spark */}
                {/* <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white blur-[0.5px] shadow-[0_0_12px_#ffffff,0_0_24px_rgba(255,255,255,0.9)]" /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
