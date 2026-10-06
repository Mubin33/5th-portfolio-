"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SERVICES } from "@/data/portfolio";

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const serviceRows = containerRef.current?.querySelectorAll(".service-row");
      if (serviceRows) {
        gsap.fromTo(
          serviceRows,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative py-28 md:py-40 px-6 md:px-12 border-b border-white/10 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-4 mb-3 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
              <span className="text-white font-bold">07</span>
              <span className="w-8 h-[1px] bg-white/30" />
              <span>CAPABILITIES</span>
            </div>
            <h2 className="text-section-huge font-bold uppercase tracking-tighter text-white">
              ENGINEERING<br />SERVICES
            </h2>
          </div>
          <p className="font-mono-tech text-xs tracking-wider text-neutral-400 max-w-sm uppercase">
            {"//"} SPECIALIZED DISCIPLINES AVAILABLE FOR CONTRACTS & ARCHITECTURAL CONSULTING
          </p>
        </div>

        <div className="divide-y divide-white/10">
          {SERVICES.map((srv) => (
            <div
              key={srv.number}
              className="service-row group relative py-8 md:py-12 transition-colors duration-300 hover:bg-neutral-950/60 cursor-pointer"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-2 font-mono-tech text-xl md:text-2xl font-bold text-neutral-400 group-hover:text-white transition-colors">
                  {srv.number}
                </div>

                <div className="md:col-span-6">
                  <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white group-hover:translate-x-3 transition-transform duration-300 ease-out">
                    {srv.title}
                  </h3>
                  <p className="font-mono-tech text-xs tracking-wider text-neutral-400 uppercase mt-2">
                    {"//"} {srv.tagline}
                  </p>
                </div>

                <div className="md:col-span-4 flex items-center justify-between gap-4">
                  <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed hidden sm:block">
                    {srv.description}
                  </p>
                  <span className="font-mono-tech text-xl text-neutral-400 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                    →
                  </span>
                </div>
              </div>

              <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-500 ease-in-out">
                <div className="pt-6 mt-4 border-t border-white/10 flex flex-wrap gap-2.5">
                  {srv.deliverables.map((item, dIdx) => (
                    <span
                      key={dIdx}
                      className="font-mono-tech text-[11px] tracking-wider uppercase px-3 py-1 bg-white text-black font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
