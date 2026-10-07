"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const capabilities = [
  {
    number: "01",
    title: "AI INTEGRATION",
    description:
      "Integrating AI-powered features and intelligent workflows into modern web applications.",
  },
  {
    number: "02",
    title: "AGENTIC WORKFLOWS",
    description:
      "Working with AI agents and automated development workflows to improve productivity and development processes.",
  },
  {
    number: "03",
    title: "MCP",
    description:
      "Exploring and working with Model Context Protocol based workflows and AI-assisted development environments.",
  },
  {
    number: "04",
    title: "CODE AUDITING",
    description:
      "Using AI-assisted workflows for code review, debugging, optimization, maintenance, and identifying potential issues.",
  },
];

const technologies = [
  "MCP",
  "AI AGENTS",
  "VAPI",
  "AI INTEGRATION",
  "AUTOMATION",
  "CODE AUDITING",
];

export default function AISection() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      /*
       * Main heading reveal
       */
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          {
            yPercent: 100,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
            },
          },
        );
      }

      /*
       * Intro text reveal
       */
      if (introRef.current) {
        gsap.fromTo(
          introRef.current,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: introRef.current,
              start: "top 85%",
            },
          },
        );
      }

      /*
       * Capability rows
       */
      if (capabilitiesRef.current) {
        const rows = capabilitiesRef.current.querySelectorAll(
          ".ai-capability-row",
        );

        gsap.fromTo(
          rows,
          {
            y: 70,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: capabilitiesRef.current,
              start: "top 80%",
            },
          },
        );

        /*
         * Capability divider animation
         */
        const lines = capabilitiesRef.current.querySelectorAll(
          ".ai-capability-line",
        );

        gsap.fromTo(
          lines,
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: capabilitiesRef.current,
              start: "top 80%",
            },
          },
        );
      }

      /*
       * Infinite marquee
       */
      if (marqueeRef.current) {
        const track = marqueeRef.current.querySelector(
          ".ai-marquee-track",
        ) as HTMLElement | null;

        if (track) {
          const marqueeAnimation = gsap.to(track, {
            xPercent: -50,
            duration: 25,
            repeat: -1,
            ease: "none",
          });

          /*
           * Slightly slow the marquee while hovering.
           */
          marqueeRef.current.addEventListener("mouseenter", () => {
            gsap.to(marqueeAnimation, {
              timeScale: 0.35,
              duration: 0.4,
            });
          });

          marqueeRef.current.addEventListener("mouseleave", () => {
            gsap.to(marqueeAnimation, {
              timeScale: 1,
              duration: 0.4,
            });
          });
        }
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="ai-section"
      ref={containerRef}
      className="relative overflow-hidden border-b border-white/10 bg-black px-6 py-28 md:px-12 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        {/* =========================
            HEADER
        ========================== */}
        <div className="mb-20 grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.3fr_0.7fr] md:items-end">
          <div className="overflow-hidden">
            {/* <div className="mb-5 flex items-center gap-4 font-mono-tech text-[10px] uppercase tracking-[0.25em] text-neutral-500">
              <span className="font-bold text-white">05</span>

              <span className="h-px w-8 bg-white/30" />

              <span>AI & DEVELOPMENT</span>
            </div> */}

            <h2
              ref={headingRef}
              className="text-section-huge font-bold uppercase leading-[0.82] tracking-tighter text-white"
            >
              BUILDING
              <br />
              <span className="text-neutral-500">WITH AI</span>
            </h2>
          </div>

          <p
            ref={introRef}
            className="max-w-md font-mono-tech text-xs uppercase leading-6 tracking-[0.08em] text-neutral-400 md:pb-2"
          >
            I use AI-assisted development workflows to build, audit, improve,
            and maintain modern web applications.
          </p>
        </div>

        {/* =========================
            CAPABILITIES
        ========================== */}
        <div
          ref={capabilitiesRef}
          className="border-t border-white/10"
        >
          {capabilities.map((capability) => (
            <div
              key={capability.number}
              className="ai-capability-row group relative"
            >
              <div className="ai-capability-line h-px w-full bg-white/10" />

              <div className="grid gap-8 py-8 md:grid-cols-[80px_1fr_1fr] md:items-center md:py-12">
                {/* Number */}
                <span className="font-mono-tech text-xs tracking-widest text-neutral-600 transition-colors duration-300 group-hover:text-white">
                  {capability.number}
                </span>

                {/* Title */}
                <div className="overflow-hidden">
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-white transition-transform duration-500 ease-out group-hover:translate-x-3 md:text-4xl">
                    {capability.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="max-w-md text-sm leading-6 text-neutral-500 transition-colors duration-300 group-hover:text-neutral-300">
                  {capability.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* =========================
            MARQUEE
        ========================== */}
        <div
          ref={marqueeRef}
          className="relative mt-24 overflow-hidden border-y border-white/10 py-6"
        >
          <div className="ai-marquee-track flex w-max items-center">
            {[...technologies, ...technologies].map((technology, index) => (
              <div
                key={`${technology}-${index}`}
                className="flex items-center"
              >
                <span className="whitespace-nowrap px-6 font-mono-tech text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 transition-colors duration-300 hover:text-white md:px-10"
                >
                  {technology}
                </span>

                <span className="h-1 w-1 rounded-full bg-white/40" />
              </div>
            ))}
          </div>
        </div>

        {/* =========================
            BOTTOM STATEMENT
        ========================== */}
        <div className="mt-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <p className="max-w-xl text-sm leading-7 text-neutral-500">
            Technology is only part of the process. I use AI to explore ideas,
            accelerate development, analyze problems, and improve the quality
            of the final product.
          </p>

          <span className="font-mono-tech text-[10px] uppercase tracking-[0.25em] text-neutral-600">
            AI / ENGINEERING / AUTOMATION
          </span>
        </div>
      </div>
    </section>
  );
}