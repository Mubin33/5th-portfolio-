"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PROJECTS, Project } from "@/data/portfolio";

export default function SelectedProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedModalProject, setSelectedModalProject] = useState<Project | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const projectCards = containerRef.current?.querySelectorAll(".project-card");
      projectCards?.forEach((card) => {
        const imgContainer = card.querySelector(".project-img-wrapper");
        const img = card.querySelector(".project-img");
        const details = card.querySelector(".project-details");
        const number = card.querySelector(".project-number");

        if (imgContainer) {
          gsap.fromTo(
            imgContainer,
            { clipPath: "inset(15% 0% 15% 0%)", opacity: 0.6 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 75%",
                end: "top 35%",
                scrub: 0.6,
              },
            }
          );
        }

        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8, scale: 1.08 },
            {
              yPercent: 8,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            }
          );
        }

        if (details) {
          gsap.fromTo(
            details,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 65%",
              },
            }
          );
        }

        if (number) {
          gsap.fromTo(
            number,
            { opacity: 0.2, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              scrollTrigger: {
                trigger: card,
                start: "top 75%",
              },
            }
          );
        }
      });
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative py-28 md:py-40 px-6 md:px-12 border-b border-white/10 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-24 border-b border-white/10 pb-8">
          <div>
            {/* <div className="flex items-center gap-4 mb-3 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
              <span className="text-white font-bold">04</span>
              <span className="w-8 h-[1px] bg-white/30" />
              <span>INDEXED WORKS</span>
            </div> */}
            <h2 className="text-section-huge font-bold uppercase tracking-tighter text-white">
              SELECTED<br />PROJECTS
            </h2>
          </div>
          {/* <p className="font-mono-tech text-xs tracking-wider text-neutral-400 max-w-sm uppercase">
            {"//"} COMPREHENSIVE ARCHITECTURES ENGINEERED FOR PRODUCTION PERFORMANCE
          </p> */}
        </div>

        <div className="space-y-36 md:space-y-48">
          {PROJECTS.map((project) => (
            <div
              key={project.number}
              className="project-card group relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
            >
              <div className="project-details lg:col-span-5 flex flex-col justify-between order-2 lg:order-1 space-y-6">
                <div>
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-4 mb-6">
                    <span className="project-number font-mono-tech text-4xl md:text-5xl font-extrabold text-neutral-400 select-none">
                      {project.number}
                    </span>
                    <span className="font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
                      {project.category} • {project.year}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="font-mono-tech text-xs uppercase tracking-wider text-neutral-400 mb-6">
                     {project.subtitle}
                  </p>

                  <p className="text-neutral-300 text-sm md:text-lg leading-relaxed font-light mb-8">
                    {project.description}
                  </p>
                </div>

                {/* <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-5 font-mono-tech">
                  {project.metrics.map((m, mIdx) => (
                    <div key={mIdx}>
                      <span className="text-sm md:text-base font-bold text-white block">
                        {m.value}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mt-0.5">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div> */}

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="font-mono-tech text-[11px] tracking-wider px-3 py-1 bg-neutral-950 border border-white/15 text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setSelectedModalProject(project)}
                    data-cursor="pointer"
                    className="group/btn inline-flex items-center gap-3 text-xs font-mono-tech tracking-widest text-white uppercase border border-white/30 px-6 py-3.5 hover:bg-white hover:text-black transition-all duration-300"
                  >
                    <span>VIEW CASE ARCHITECTURE</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>

              <div
                onClick={() => setSelectedModalProject(project)}
                data-cursor="view"
                className="project-img-wrapper lg:col-span-7 order-1 lg:order-2 relative aspect-[16/10] overflow-hidden border border-white/20 bg-neutral-950 cursor-pointer select-none"
              >
                <div className="project-img relative w-full h-[115%] will-change-transform">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover img-grayscale"
                    priority={project.number === "01"}
                  />
                </div>

                {/* <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-white/10 px-3 py-1 font-mono-tech text-[10px] text-white tracking-widest uppercase">
                  {project.number} {"//"} {project.title}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedModalProject && (
        <div className="fixed inset-0 z-[99990] bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-4 sm:p-6 md:p-12 overflow-y-auto">
          <div className="max-w-3xl w-full bg-[#000000] border border-white/20 p-5 sm:p-8 md:p-12 relative flex flex-col justify-between my-auto">
            <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-6">
              <div>
                {/* <span className="font-mono-tech text-xs text-neutral-400 block mb-1">
                  PROJECT SPECIFICATION {"//"} {selectedModalProject.number}
                </span> */}
                <h3 className="text-3xl md:text-4xl font-bold uppercase text-white tracking-tight">
                  {selectedModalProject.title}
                </h3>
                <p className="font-mono-tech text-xs uppercase tracking-wider text-neutral-400 mt-1">
                  {selectedModalProject.subtitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedModalProject(null)}
                data-cursor="pointer"
                className="font-mono-tech text-xs uppercase tracking-widest text-white border border-white/20 px-3 py-1.5 hover:bg-white hover:text-black transition-colors"
              >
                CLOSE ×
              </button>
            </div>

            <div className="relative aspect-[16/9] w-full border border-white/10 overflow-hidden mb-6">
              <Image
                src={selectedModalProject.image}
                alt={selectedModalProject.title}
                fill
                sizes="800px"
                className="object-cover img-grayscale"
              />
            </div>

            <p className="text-neutral-300 text-base md:text-lg leading-relaxed mb-6 font-light">
              {selectedModalProject.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 border-y border-white/10 py-4 mb-6 font-mono-tech">
              {selectedModalProject.metrics.map((m, mIdx) => (
                <div key={mIdx}>
                  <span className="text-base font-bold text-white block">{m.value}</span>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap gap-2">
                {selectedModalProject.technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="font-mono-tech text-[10px] uppercase px-2 py-1 bg-neutral-900 border border-white/10 text-neutral-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedModalProject(null)}
                data-cursor="pointer"
                className="font-mono-tech text-xs uppercase tracking-widest bg-white text-black px-6 py-2.5 font-bold hover:bg-neutral-200 transition-colors"
              >
                RETURN TO LIST
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
