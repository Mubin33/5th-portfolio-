"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PROJECTS } from "@/data/portfolio";

export default function ProjectShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 80);

      const horizontalTween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth + 400}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          refreshPriority: 10,
          invalidateOnRefresh: true,
        },
      });

      const cards = track.querySelectorAll(".horizontal-card");
      cards.forEach((card) => {
        const img = card.querySelector(".inner-img");
        if (img) {
          gsap.fromTo(
            img,
            { xPercent: 15 },
            {
              xPercent: -15,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }
      });
    }, sectionRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black overflow-hidden border-b border-white/10 flex flex-col justify-between py-12"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex items-center justify-between">
        <div className="flex items-center gap-4 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
          {/* <span className="text-white font-bold">05</span>
          <span className="w-8 h-[1px] bg-white/30" />
          <span>SIGNATURE SHOWCASE</span> */}
        </div>
        <div className="font-mono-tech text-xs text-neutral-400 tracking-wider flex items-center gap-2">
          <span>SCROLL DOWN TO TRAVERSE</span>
          <span>→</span>
        </div>
      </div>

      <div className="my-auto py-8">
        <div
          ref={trackRef}
          className="flex gap-8 md:gap-14 px-6 md:px-16 w-max will-change-transform items-center"
        >
          <div className="w-[82vw] max-w-[340px] md:w-[420px] flex-shrink-0 flex flex-col justify-center pr-4 md:pr-6">
            {/* <span className="font-mono-tech text-xs tracking-widest text-neutral-400 uppercase mb-4">
              {"//"} ARCHITECTURAL EXHIBIT
            </span> */}
            <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white leading-none mb-6">
              SYSTEMS IN MOTION
            </h3>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-light">
              Full-width panoramic inspection across production projects. Engineered for high-throughput user operations and seamless interactive responsiveness.
            </p>
          </div>

          {PROJECTS.map((project) => (
            <div
              key={project.number}
              className="horizontal-card w-[84vw] max-w-[620px] sm:w-[480px] md:w-[620px] flex-shrink-0 border border-white/20 bg-neutral-950 p-5 sm:p-6 md:p-8 flex flex-col justify-between group hover:border-white/50 transition-colors duration-300"
            >
              <div className="flex items-baseline justify-between border-b border-white/10 pb-4 mb-6">
                <span className="font-mono-tech text-3xl md:text-4xl font-extrabold text-neutral-400 group-hover:text-white transition-colors">
                  {project.number}
                </span>
                <span className="font-mono-tech text-[11px] tracking-widest text-neutral-400 uppercase">
                  {project.category}
                </span>
              </div>

              <div
                data-cursor="view"
                className="relative aspect-[16/10] w-full overflow-hidden border border-white/10 bg-black mb-6"
              >
                <div className="inner-img relative w-[130%] -left-[15%] h-full will-change-transform">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 340px, 620px"
                    className="object-cover img-grayscale"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-2xl md:text-3xl font-bold uppercase text-white tracking-tight mb-2">
                  {project.title}
                </h4>
                <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed mb-6 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  {project.technologies.slice(0, 4).map((tech, idx) => (
                    <span
                      key={idx}
                      className="font-mono-tech text-[10px] tracking-wider px-2 py-0.5 bg-black border border-white/15 text-neutral-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="w-[80vw] max-w-[300px] flex-shrink-0 border border-white/10 p-6 md:p-8 flex flex-col justify-center text-center">
            {/* <span className="font-mono-tech text-xs tracking-widest text-neutral-400 uppercase mb-4">
              {"//"} MORE IN REPOSITORIES
            </span> */}
            <p className="text-xl font-bold uppercase text-white mb-4">
              EXPLORE OPEN CODE
            </p>
            <a
              href="https://github.com/mubin33"
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className="font-mono-tech text-xs uppercase tracking-widest border border-white/30 py-3 px-4 hover:bg-white hover:text-black transition-colors"
            >
              GITHUB REPOSITORIES →
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}
