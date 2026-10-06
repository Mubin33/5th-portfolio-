"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [cursorText, setCursorText] = useState<string>("");

  useEffect(() => {
    // Only run on desktop devices with fine pointer
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const container = containerRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!container || !dot || !ring) return;

    container.style.display = "block";
    document.body.classList.add("has-custom-cursor");

    const setDotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
    const setDotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
    const setRingX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const setRingY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    let hasMoved = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!hasMoved) {
        hasMoved = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      setDotX(e.clientX);
      setDotY(e.clientY);
      setRingX(e.clientX);
      setRingY(e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-cursor], a, button, [role=\'button\']");
      if (!target) {
        setCursorText("");
        gsap.to(ring, {
          width: 36,
          height: 36,
          backgroundColor: "transparent",
          borderColor: "rgba(255, 255, 255, 0.4)",
          borderRadius: "50%",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.2 });
        return;
      }

      const cursorType = target.getAttribute("data-cursor") || (target.tagName.toLowerCase() === "a" || target.tagName.toLowerCase() === "button" ? "link" : "normal");

      if (cursorType === "view") {
        setCursorText("VIEW");
        gsap.to(ring, {
          width: 90,
          height: 90,
          backgroundColor: "#ffffff",
          borderColor: "#ffffff",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(dot, { opacity: 0, duration: 0.2 });
      } else if (cursorType === "explore") {
        setCursorText("EXPLORE");
        gsap.to(ring, {
          width: 100,
          height: 100,
          backgroundColor: "#ffffff",
          borderColor: "#ffffff",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(dot, { opacity: 0, duration: 0.2 });
      } else if (cursorType === "drag") {
        setCursorText("DRAG ↔");
        gsap.to(ring, {
          width: 90,
          height: 90,
          backgroundColor: "#ffffff",
          borderColor: "#ffffff",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(dot, { opacity: 0, duration: 0.2 });
      } else if (cursorType === "link" || cursorType === "pointer") {
        setCursorText("");
        gsap.to(ring, {
          width: 56,
          height: 56,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderColor: "#ffffff",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, { scale: 0.5, opacity: 0.8, duration: 0.2 });
      }
    };

    const onMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ display: "none" }}
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-white will-change-transform shadow-[0_0_8px_rgba(255,255,255,0.8)]"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border border-white/40 will-change-transform transition-[border-color,background-color] duration-200"
        style={{ width: 36, height: 36 }}
      >
        <span
          ref={textRef}
          className="font-mono-tech text-[10px] font-bold tracking-widest text-black select-none pointer-events-none"
        >
          {cursorText}
        </span>
      </div>
    </div>
  );
}
