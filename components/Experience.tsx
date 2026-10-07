"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { EXPERIENCES } from "@/data/portfolio";

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: itemsRef.current,
              start: "top 70%",
              end: "bottom 80%",
              scrub: 0.5,
            },
          }
        );
      }

      const rows = itemsRef.current?.querySelectorAll(".timeline-row");
      rows?.forEach((row) => {
        const year = row.querySelector(".row-year");
        const content = row.querySelector(".row-content");
        const dot = row.querySelector(".row-dot");

        gsap.fromTo(
          [dot, year, content],
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
            },
          }
        );
      });
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative py-28 md:py-40 px-6 md:px-12 border-b border-white/10 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 border-b border-white/10 pb-8">
          <div>
            {/* <div className="flex items-center gap-4 mb-3 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
              <span className="text-white font-bold">03</span>
              <span className="w-8 h-[1px] bg-white/30" />
              <span>CHRONOLOGICAL TRAJECTORY</span>
            </div> */}
            <h2 className="text-section-huge font-bold uppercase tracking-tighter text-white">
              CAREER &<br />EXPERIENCE
            </h2>
          </div>
          {/* <p className="font-mono-tech text-xs tracking-wider text-neutral-400 max-w-sm uppercase">
            {"//"} A RECORD OF DISCIPLINE, CODE PRODUCTION, AND SYSTEM ARCHITECTURE
          </p> */}
        </div>

        <div ref={itemsRef} className="relative pl-6 md:pl-10">
          <div className="absolute top-2 bottom-0 left-0.5 w-[1px] bg-neutral-800">
            <div
              ref={timelineLineRef}
              className="absolute top-0 left-0 w-full h-full bg-white origin-top will-change-transform"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          <div className="space-y-16 md:space-y-24">
            {EXPERIENCES.map((exp, index) => (
              <div
                key={index}
                className="timeline-row relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start"
              >
                <div className="row-dot absolute -left-[27px] md:-left-[43px] top-1.5 w-3 h-3 rounded-full bg-black border-2 border-white" />

                <div className="row-year lg:col-span-4 font-mono-tech">
                  <span className="text-xl md:text-2xl font-bold text-white block tracking-tight">
                    {exp.year}
                  </span>
                  <span className="text-xs text-neutral-400 tracking-widest uppercase block mt-1">
                    {exp.location}
                  </span>
                </div>

                <div className="row-content lg:col-span-8 space-y-4">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-2xl md:text-4xl font-bold   text-white tracking-tight">
                      {exp.company}
                    </h3>
                    <p className="font-mono-tech text-sm text-neutral-300 mt-1 uppercase tracking-wider">
                      {exp.role}
                    </p>
                  </div>

                  <p className="text-neutral-300 text-sm md:text-lg leading-relaxed font-light">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {exp.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="font-mono-tech text-[11px] tracking-wider px-2.5 py-1 bg-neutral-950 border border-white/15 text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
