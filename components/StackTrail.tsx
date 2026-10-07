"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface TechItem {
  name: string;
  slug: string;
  category: "Languages" | "Frontend" | "Backend" | "AI" | "Tools/Infra";
}

const STACK_LIST: TechItem[] = [
  // Languages
  { name: "HTML5", slug: "html5", category: "Languages" },
  { name: "CSS3", slug: "css3", category: "Languages" },
  { name: "JavaScript", slug: "javascript", category: "Languages" },
  { name: "TypeScript", slug: "typescript", category: "Languages" },
  { name: "Python", slug: "python", category: "Languages" },
  // Frontend
  { name: "React", slug: "react", category: "Frontend" },
  { name: "Next.js", slug: "nextdotjs", category: "Frontend" },
  { name: "Tailwind CSS", slug: "tailwindcss", category: "Frontend" },
  { name: "GSAP", slug: "greensock", category: "Frontend" },
  { name: "Lenis", slug: "lenis", category: "Frontend" },
  { name: "Zustand", slug: "zustand", category: "Frontend" },
  // Backend
  { name: "Node.js", slug: "nodedotjs", category: "Backend" },
  { name: "Express", slug: "express", category: "Backend" },
  { name: "MongoDB", slug: "mongodb", category: "Backend" },
  { name: "Django", slug: "django", category: "Backend" },
  { name: "Socket.io", slug: "socketdotio", category: "Backend" },
  { name: "REST API", slug: "restapi", category: "Backend" },
  // AI
  { name: "MCP", slug: "mcp", category: "AI" },
  { name: "Vapi", slug: "vapi", category: "AI" },
  // Tools/Infra
  { name: "Git", slug: "git", category: "Tools/Infra" },
  { name: "GitHub", slug: "github", category: "Tools/Infra" },
  { name: "Vercel", slug: "vercel", category: "Tools/Infra" },
  { name: "Figma", slug: "figma", category: "Tools/Infra" },
  { name: "Google Cloud", slug: "googlecloud", category: "Tools/Infra" },
  { name: "Stripe", slug: "stripe", category: "Tools/Infra" },
];

const POOL_SIZE = 12;

export default function StackTrail() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const staticGridRef = useRef<HTMLDivElement>(null);

  // References for object pool cards
  const poolCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const poolImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const poolTextRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // State for touch / reduced-motion fallback
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device or reduced motion
    const touchQuery = window.matchMedia("(pointer: coarse)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isTouch = touchQuery.matches || !window.matchMedia("(pointer: fine)").matches;
    const isReduced = motionQuery.matches;

    if (isTouch || isReduced) {
      setIsTouchDevice(true);
    }

    const ctx = gsap.context(() => {
      // 1. Accessibility / Static grid ScrollTrigger entrance
      if ((isTouch || isReduced) && staticGridRef.current) {
        if (!isReduced) {
          const cards = staticGridRef.current.querySelectorAll(".static-stack-card");
          gsap.fromTo(
            cards,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.03,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: staticGridRef.current,
                start: "top 80%",
              },
            }
          );
        }
        return;
      }

      // 2. Desktop Trail Mode
      const section = sectionRef.current;
      const heading = headingRef.current;
      const cursorDot = cursorDotRef.current;
      if (!section) return;

      // Heading Parallax quickTo
      const setHeadingX = heading ? gsap.quickTo(heading, "x", { duration: 0.6, ease: "power2.out" }) : null;
      const setHeadingY = heading ? gsap.quickTo(heading, "y", { duration: 0.6, ease: "power2.out" }) : null;

      // Section Cursor Dot quickTo
      const setCursorX = cursorDot ? gsap.quickTo(cursorDot, "x", { duration: 0.15, ease: "power2.out" }) : null;
      const setCursorY = cursorDot ? gsap.quickTo(cursorDot, "y", { duration: 0.15, ease: "power2.out" }) : null;

      let lastX = -9999;
      let lastY = -9999;
      let poolIndex = 0;
      let techIndex = 0;
      let zIndexCounter = 100;
      let cursorTimeout: ReturnType<typeof setTimeout> | null = null;

      const handlePointerEnter = () => {
        if (cursorDot) {
          gsap.to(cursorDot, { opacity: 1, scale: 1, duration: 0.2 });
        }
      };

      const handlePointerLeave = () => {
        if (cursorDot) {
          gsap.to(cursorDot, { opacity: 0, scale: 0.5, duration: 0.2 });
        }
        if (setHeadingX && setHeadingY) {
          setHeadingX(0);
          setHeadingY(0);
        }
        lastX = -9999;
        lastY = -9999;
      };

      const handlePointerMove = (e: PointerEvent) => {
        const rect = section.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // Update cursor dot
        if (setCursorX && setCursorY) {
          setCursorX(currentX);
          setCursorY(currentY);
        }
        if (cursorDot) {
          gsap.to(cursorDot, { scale: 1.4, duration: 0.1 });
          if (cursorTimeout) clearTimeout(cursorTimeout);
          cursorTimeout = setTimeout(() => {
            gsap.to(cursorDot, { scale: 1, duration: 0.2 });
          }, 150);
        }

        // Heading Parallax (max 15px)
        if (setHeadingX && setHeadingY) {
          const relX = (currentX / rect.width - 0.5) * 2; // -1 to 1
          const relY = (currentY / rect.height - 0.5) * 2;
          setHeadingX(relX * 14);
          setHeadingY(relY * 14);
        }

        // Distance Threshold Check (~70px)
        const dx = currentX - lastX;
        const dy = currentY - lastY;
        const distance = Math.hypot(dx, dy);

        if (distance < 70) return;

        lastX = currentX;
        lastY = currentY;

        // Spawn Card from Object Pool
        const cardEl = poolCardRefs.current[poolIndex];
        const imgEl = poolImgRefs.current[poolIndex];
        const textEl = poolTextRefs.current[poolIndex];

        if (!cardEl || !imgEl || !textEl) return;

        const currentTech = STACK_LIST[techIndex];

        // Update content
        imgEl.src = `/stack/${currentTech.slug}.svg`;
        imgEl.alt = `${currentTech.name} logo`;
        textEl.textContent = currentTech.name;

        // Rotate index
        poolIndex = (poolIndex + 1) % POOL_SIZE;
        techIndex = (techIndex + 1) % STACK_LIST.length;

        const zIndex = ++zIndexCounter;
        const randomRotation = gsap.utils.random(-8, 8);

        // Kill active tween on this card
        gsap.killTweensOf(cardEl);

        // Animate card trail
        const cardTl = gsap.timeline();

        // Attach hover pause handlers
        cardEl.onmouseenter = () => {
          cardTl.pause();
          gsap.to(cardEl, { scale: 1.15, borderColor: "#ffffff", duration: 0.2 });
        };
        cardEl.onmouseleave = () => {
          gsap.to(cardEl, { scale: 1, borderColor: "rgba(255,255,255,0.3)", duration: 0.2 });
          cardTl.resume();
        };

        cardTl
          .set(cardEl, {
            display: "flex",
            x: currentX,
            y: currentY,
            xPercent: -50,
            yPercent: -50,
            rotation: randomRotation,
            zIndex,
            scale: 0.4,
            opacity: 0,
          })
          .to(cardEl, {
            scale: 1,
            opacity: 1,
            duration: 0.25,
            ease: "power3.out",
          })
          .to(cardEl, {
            opacity: 0,
            scale: 0.8,
            y: currentY - 30,
            duration: 0.5,
            ease: "power2.in",
            delay: 0.5,
            onComplete: () => {
              gsap.set(cardEl, { display: "none" });
            },
          });
      };

      section.addEventListener("pointerenter", handlePointerEnter);
      section.addEventListener("pointerleave", handlePointerLeave);
      section.addEventListener("pointermove", handlePointerMove);

      return () => {
        section.removeEventListener("pointerenter", handlePointerEnter);
        section.removeEventListener("pointerleave", handlePointerLeave);
        section.removeEventListener("pointermove", handlePointerMove);
        if (cursorTimeout) clearTimeout(cursorTimeout);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [isTouchDevice]);

  return (
    <section
      id="stack"
      ref={sectionRef}
      aria-label="Technologies and Tech Stack Trail"
      className="relative min-h-[80vh] flex flex-col justify-center items-center py-20 px-6 md:px-12 overflow-hidden border-b border-white/10 bg-black cursor-crosshair select-none"
    >
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-grid-tech opacity-20 pointer-events-none" />

      {/* Decorative Technical Corner Crosshairs */}
      <span className="absolute top-3 left-4 text-xs font-mono-tech text-white/30 pointer-events-none select-none">+</span>
      <span className="absolute top-3 right-4 text-xs font-mono-tech text-white/30 pointer-events-none select-none">+</span>
      <span className="absolute bottom-3 left-4 text-xs font-mono-tech text-white/30 pointer-events-none select-none">+</span>
      <span className="absolute bottom-3 right-4 text-xs font-mono-tech text-white/30 pointer-events-none select-none">+</span>

      {/* Center Kinetic Heading (Behind Trail: z-10) */}
      <div
        ref={headingWrapperRef}
        className="relative z-10 flex flex-col items-center text-center pointer-events-none select-none max-w-4xl"
      >
        {/* <div className="overflow-hidden mb-3">
          <span className="font-mono-tech text-[11px] uppercase tracking-[0.28em] text-neutral-500 block">
            [ 06 // SYSTEM ARSENAL ]
          </span>
        </div> */}

        <h2
          ref={headingRef}
          className="text-section-huge font-extrabold uppercase tracking-tighter text-white leading-none will-change-transform drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
        >
          MY STACK
        </h2>

        <div className="mt-6 flex items-center gap-3 px-4 py-1.5font-mono-tech text-base tracking-[0.25em] text-neutral-400 uppercase">
          {/* <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> */}
          <span>{isTouchDevice ? "CORE CAPABILITIES" : "MOVE YOUR CURSOR TO EXPLORE"}</span>
        </div>
      </div>

      {/* DESKTOP MOUSE TRAIL LAYER (Object Pool of 12 Cards - aria-hidden) */}
      {!isTouchDevice && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
        >
          {Array.from({ length: POOL_SIZE }).map((_, idx) => (
            <div
              key={idx}
              ref={(el) => {
                poolCardRefs.current[idx] = el;
              }}
              style={{ display: "none" }}
              className="absolute top-0 left-0 w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] bg-neutral-950 border border-white/30 p-2.5 flex flex-col items-center justify-center select-none shadow-[0_12px_36px_rgba(0,0,0,0.9)] pointer-events-auto transition-colors duration-200"
            >
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                <img
                  ref={(el) => {
                    poolImgRefs.current[idx] = el;
                  }}
                  src="/stack/react.svg"
                  alt="Technology Logo"
                  width={38}
                  height={38}
                  className="w-9 h-9 object-contain filter invert pointer-events-none"
                  loading="lazy"
                />
              </div>

              <span
                ref={(el) => {
                  poolTextRefs.current[idx] = el;
                }}
                className="font-mono-tech text-[10px] font-bold uppercase tracking-wider text-neutral-200 mt-2 text-center truncate w-full block"
              >
                REACT
              </span>
            </div>
          ))}

          {/* Interactive Section Cursor Dot */}
          <div
            ref={cursorDotRef}
            className="absolute top-0 left-0 w-3 h-3 rounded-full bg-white opacity-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-[0_0_12px_#ffffff] z-30"
          />
        </div>
      )}

      {/* ACCESSIBLE / TOUCH / REDUCED-MOTION STATIC GRID (Fallback) */}
      <div
        ref={staticGridRef}
        role="list"
        aria-label="Tech Stack List"
        className={`relative z-10 w-full max-w-5xl mx-auto mt-12 ${
          isTouchDevice ? "block" : "hidden"
        }`}
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {STACK_LIST.map((tech) => (
            <div
              key={tech.slug}
              role="listitem"
              className="static-stack-card group p-3 sm:p-4 border border-white/15 bg-neutral-950/70 flex flex-col items-center justify-center text-center transition-colors duration-200 hover:border-white/50 hover:bg-neutral-900"
            >
              <div className="w-9 h-9 flex items-center justify-center mb-2.5">
                <Image
                  src={`/stack/${tech.slug}.svg`}
                  alt={`${tech.name} logo`}
                  width={36}
                  height={36}
                  className="w-8 h-8 object-contain filter invert"
                />
              </div>
              <span className="font-mono-tech text-[10px] uppercase tracking-wider text-neutral-300 font-semibold truncate w-full">
                {tech.name}
              </span>
              <span className="font-mono-tech text-[8px] uppercase tracking-widest text-neutral-500 mt-0.5 truncate w-full">
                {tech.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
