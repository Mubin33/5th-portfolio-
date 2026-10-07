"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const imageGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

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

      gsap.fromTo(
        numberRef.current,
        { rotation: -20, opacity: 0, scale: 0.8 },
        {
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
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
      className="relative py-28 md:py-40 px-6 md:px-12 border-b border-white/10 bg-black overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Title, Narrative Bio, Stats & Meta */}
          <div className="lg:col-span-6 flex flex-col gap-7">
            <div>
              {/* <div className="flex items-baseline gap-4 mb-3">
                <span
                  ref={numberRef}
                  className="font-mono-tech text-4xl md:text-5xl font-bold text-neutral-400 select-none will-change-transform inline-block"
                >
                  01
                </span>
              </div>  */}
            <h2 className="text-section-huge font-medium uppercase tracking-tighter text-white">
          ABOUT ME
        </h2>
            </div>

            <div ref={bioRef} className="space-y-6 text-lg md:text-2xl text-neutral-300 font-light leading-relaxed">
              <p className="text-white font-normal">
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
              className="grid grid-cols-1 sm:grid-cols-3 gap-5 font-mono-tech text-xs uppercase tracking-wider"
            >
              <div className="meta-box p-5 border border-white/10 bg-neutral-950/60">
                <span className="text-neutral-400 block mb-2">{"//"} LOCATION</span>
                <p className="text-white font-sans text-sm font-semibold">
                  DHAKA, BANGLADESH
                </p> 
              </div>

              <div className="meta-box p-5 border border-white/10 bg-neutral-950/60">
                <span className="text-neutral-400 block mb-2">{"//"} ROLE</span>
                <p className="text-white font-sans text-sm font-semibold">
                  FULL STACK
                </p> 
              </div>

              <div className="meta-box p-5 border border-white/10 bg-neutral-950/60">
                <span className="text-neutral-400 block mb-2">{"//"} FOCUS</span>
                <p className="text-white font-sans text-sm font-semibold">
                  REACT / NEXT.JS / GSAP / DJANGO / NODE
                </p>
                <span className="text-neutral-400 text-[11px] block mt-1">
                  AI WORKFLOWS & MCP
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: High-End Monochromatic Portrait with Radiant White Glow */}
          <div
            ref={imageFrameRef}
            className="lg:col-span-6 flex flex-col items-center justify-center will-change-transform mt-8 lg:mt-0"
          >
            <div className="relative w-full max-w-[600px] aspect-[7/8] border border-white/20 bg-neutral-950/80 overflow-hidden group select-none">
              {/* Corner crosshairs */}
              <span className="absolute top-2 left-2 text-xs font-mono-tech text-white/50 z-30 select-none">+</span>
              <span className="absolute top-2 right-2 text-xs font-mono-tech text-white/50 z-30 select-none">+</span>
              <span className="absolute bottom-2 left-2 text-xs font-mono-tech text-white/50 z-30 select-none">+</span>
              <span className="absolute bottom-2 right-2 text-xs font-mono-tech text-white/50 z-30 select-none">+</span>

              

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

              {/* Developer Black & White Portrait */}
              <div className="relative z-10 w-full h-full flex items-end justify-center pt-10">
                <Image
                  src="/mubin_full_img.png"
                  alt="MD. Yasin Arafat Mubin"
                  width={623}
                  height={698}
                  priority
                  className="w-auto ml-16 h-[93%] object-contain object-bottom select-none transition-all duration-700 group-hover:scale-[1.025]"
                  // style={{
                  //   filter: "grayscale(100%) contrast(120%) brightness(1.05)",
                  // }}
                />
              </div>

              {/* Seamless bottom fade into black */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-20" />
 
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
