"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

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
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative py-28 md:py-40 px-6 md:px-12 border-b border-white/10 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="animated-border w-full h-[1px] bg-white/20 origin-left mb-12 will-change-transform" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 flex flex-col justify-between static lg:sticky lg:top-28">
            <div>
              <div className="flex items-baseline gap-4 mb-3">
                <span
                  ref={numberRef}
                  className="font-mono-tech text-4xl md:text-5xl font-bold text-neutral-400 select-none will-change-transform inline-block"
                >
                  01
                </span>
                {/* <span className="font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
                  {"//"} IDENTITY
                </span> */}
              </div>
              <h2
                ref={titleRef}
                className="text-section-huge font-bold uppercase tracking-tighter text-white will-change-transform"
              >
                ABOUT<br />ME
              </h2>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 gap-6 font-mono-tech">
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
          </div>

          <div className="lg:col-span-7 flex flex-col gap-10">
            <div ref={bioRef} className="space-y-6 text-lg md:text-2xl text-neutral-300 font-light leading-relaxed">
              <p className="text-white font-normal">
                I am <span className="font-semibold text-white underline decoration-white/40 underline-offset-4">MD. Yasin Arafat Mubin</span>, a frontend-focused full-stack developer who enjoys building modern web applications, interactive interfaces, and scalable digital experiences.
              </p>
              <p>
                My primary focus is React, Next.js, TypeScript, JavaScript, Python(django), and modern frontend architecture with heavy emphasis on silky smooth motion engineering.
              </p>
              <p className="text-neutral-400 text-base md:text-lg">
                I also work with backend technologies, APIs, databases, and AI-powered development workflows including Model Context Protocol (MCP) and autonomous developer agent pipelines.
              </p>
            </div>

            <div className="animated-border w-full h-[1px] bg-white/10 origin-left will-change-transform" />

            <div
              ref={metaRef}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono-tech text-xs uppercase tracking-wider"
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
        </div>
      </div>
    </section>
  );
}
