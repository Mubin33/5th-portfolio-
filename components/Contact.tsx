"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { DEVELOPER_INFO } from "@/data/portfolio";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const emailBoxRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const lines = headlineRef.current?.querySelectorAll(".contact-line");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
      });

      if (lines) {
        tl.fromTo(
          lines,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power4.out",
          }
        );
      }

      tl.fromTo(
        emailBoxRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        socialsRef.current?.children ? Array.from(socialsRef.current.children) : [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      );
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DEVELOPER_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative py-28 md:py-44 px-6 md:px-12 border-b border-white/10 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col justify-between">
        <div className="flex items-center gap-4 mb-16 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
          <span className="text-white font-bold">10</span>
          <span className="w-8 h-[1px] bg-white/30" />
          <span>INITIALIZE CONTACT</span>
        </div>

        <h2
          ref={headlineRef}
          className="text-hero-giant font-extrabold uppercase text-white tracking-tighter leading-[0.88] select-none mb-16 md:mb-24"
        >
          <div className="overflow-hidden py-1">
            <span className="contact-line block">LET&apos;S</span>
          </div>
          <div className="overflow-hidden py-1">
            <span className="contact-line block">BUILD</span>
          </div>
          <div className="overflow-hidden py-1">
            <span className="contact-line block">SOMETHING</span>
          </div>
          <div className="overflow-hidden py-1">
            <span className="contact-line block text-neutral-400 hover:text-white transition-colors duration-500">
              TOGETHER.
            </span>
          </div>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/10 pt-12 items-start">
          <div ref={emailBoxRef} className="lg:col-span-7 space-y-4">
            <span className="font-mono-tech text-xs tracking-widest text-neutral-400 uppercase block">
              {"//"} DIRECT TRANSMISSION
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={`mailto:${DEVELOPER_INFO.email}`}
                data-cursor="link"
                className="group text-2xl sm:text-4xl md:text-4xl font-bold text-white hover:text-neutral-300 transition-colors inline-block break-all"
              >
                <span className="border-b-2 border-white/40 group-hover:border-white transition-colors">
                  {DEVELOPER_INFO.email}
                </span>
              </a>

              <button
                onClick={handleCopyEmail}
                data-cursor="pointer"
                className="font-mono-tech text-xs uppercase tracking-widest border border-white/30 px-4 py-2 text-white hover:bg-white hover:text-black transition-colors self-start sm:self-auto"
                title="Copy Email Address"
              >
                {copied ? "COPIED ✓" : "COPY EMAIL"}
              </button>
            </div>
            <p className="font-mono-tech text-xs text-neutral-400 uppercase tracking-wider pt-2">
              LOCATION: {DEVELOPER_INFO.location}  
            </p>
          </div>

          <div ref={socialsRef} className="lg:col-span-5 space-y-4">
            <span className="font-mono-tech text-xs tracking-widest text-neutral-400 uppercase block">
              {"//"} NETWORKS & REPOSITORIES
            </span>
            <div className="divide-y divide-white/10 border-y border-white/10 font-mono-tech text-sm  ">
              {DEVELOPER_INFO.socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="group py-4 flex items-center justify-between text-neutral-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-white font-bold">{soc.name}</span>
                    <span className="text-neutral-400 text-xs">{soc.handle}</span>
                  </div>
                  <span className="group-hover:translate-x-1.5 transition-transform">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
