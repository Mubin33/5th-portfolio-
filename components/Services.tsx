"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { SERVICES } from "@/data/portfolio";

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
      className="relative py-16 sm:py-24 md:py-36 px-4 sm:px-8 md:px-12 border-b border-white/10 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 md:mb-20 border-b border-white/10 pb-6 md:pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
              <span className="text-white font-bold">06</span>
              <span className="w-6 sm:w-8 h-[1px] bg-white/30" />
              <span>CAPABILITIES</span>
            </div>
            <h2 className="text-section-huge font-bold uppercase tracking-tighter text-white">
              ENGINEERING<br />SERVICES
            </h2>
          </div>
          <p className="font-mono-tech text-[11px] sm:text-xs tracking-wider text-neutral-400 max-w-sm uppercase">
             SPECIALIZED DISCIPLINES AVAILABLE FOR CONTRACTS & ARCHITECTURAL CONSULTING
          </p>
        </div>

        {/* Services Rows List */}
        <div className="divide-y divide-white/10">
          {SERVICES.map((srv, idx) => (
            <div
              key={srv.number}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="service-row group relative py-6 sm:py-8 md:py-12 transition-colors duration-300 hover:bg-neutral-950/60 cursor-pointer"
            >
              {/* Mobile Top Meta: Number & Toggle Indicator */}
              <div className="flex md:hidden items-center justify-between mb-2.5 font-mono-tech">
                <span className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">
                    {srv.number}
                </span>
                <span
                  className={`text-sm text-neutral-400 group-hover:text-white transition-transform duration-300 ${
                    openIndex === idx ? "rotate-90 text-white" : ""
                  }`}
                >
                  →
                </span>
              </div>

              {/* Main Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-6 items-start md:items-center">
                {/* Desktop Index Number */}
                <div className="hidden md:block md:col-span-2 font-mono-tech text-xl md:text-2xl font-bold text-neutral-400 group-hover:text-white transition-colors">
                  {srv.number}
                </div>

                {/* Title & Tagline */}
                <div className="md:col-span-6">
                  <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white group-hover:translate-x-2 md:group-hover:translate-x-3 transition-transform duration-300 ease-out">
                    {srv.title}
                  </h3>
                  {srv.tagline && (
                    <p className="font-mono-tech text-[10px] sm:text-xs tracking-wider text-neutral-400 uppercase mt-1 sm:mt-1.5">
                       {srv.tagline}
                    </p>
                  )}
                </div>

                {/* Description & Desktop Arrow */}
                <div className="md:col-span-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mt-2 md:mt-0">
                  <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                    {srv.description}
                  </p>
                  <span className="hidden md:inline font-mono-tech text-xl text-neutral-400 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                    →
                  </span>
                </div>
              </div>

              {/* Deliverables Accordion (Smooth Expand on Mobile Tap or Desktop Hover) */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === idx
                    ? "max-h-80 opacity-100"
                    : "max-h-0 opacity-0 group-hover:max-h-80 group-hover:opacity-100"
                }`}
              >
                <div className="pt-4 sm:pt-6 mt-4 border-t border-white/10 flex flex-wrap gap-2 sm:gap-2.5">
                  {srv.deliverables.map((item, dIdx) => (
                    <span
                      key={dIdx}
                      className="font-mono-tech text-[10px] sm:text-[11px] tracking-wider uppercase px-2.5 py-1 sm:px-3 bg-white text-black font-semibold"
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
