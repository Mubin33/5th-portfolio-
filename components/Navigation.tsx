"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { scrollToTarget } from "./SmoothScroll";
import { DEVELOPER_INFO } from "@/data/portfolio";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navBarRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksContainerRef = useRef<HTMLUListElement>(null);

  const menuItems = [
    { number: "01", label: "HOME", target: "#hero" },
    { number: "02", label: "ABOUT", target: "#about" },
    { number: "03", label: "SELECTED WORK", target: "#projects" },
    { number: "04", label: "EXPERIENCE", target: "#experience" },
    { number: "05", label: "HOW I BUILD", target: "#philosophy" },
    { number: "06", label: "SERVICES & AI", target: "#services" },
    { number: "07", label: "CONTACT", target: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const links = linksContainerRef.current?.querySelectorAll("li");

    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.killTweensOf([overlay, links]);

      gsap.set(overlay, { display: "flex", clipPath: "inset(0% 0% 100% 0%)" });
      gsap.to(overlay, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.65,
        ease: "power4.inOut",
      });

      if (links) {
        gsap.fromTo(
          links,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.06,
            ease: "power3.out",
            delay: 0.3,
          }
        );
      }
    } else {
      document.body.style.overflow = "";
      if (overlay) {
        gsap.to(overlay, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.set(overlay, { display: "none" });
          },
        });
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleLinkClick = (target: string) => {
    setIsOpen(false);
    setTimeout(() => {
      scrollToTarget(target, 1.4);
    }, 300);
  };

  return (
    <>
      <header
        ref={navBarRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? "py-3 bg-black/80 backdrop-blur-md border-b border-white/10"
            : "py-6 bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <button
            onClick={() => handleLinkClick("#hero")}
            data-cursor="link"
            className="group text-left flex items-center gap-3 select-none"
          >
            <span className="font-bold tracking-tight text-lg md:text-4xl text-white group-hover:tracking-wider transition-all duration-300">
              {'<'} {DEVELOPER_INFO.shortName} {'/>'}
            </span>
          </button>

          {/* <div className="hidden md:flex items-center gap-2.5 px-3 py-1 rounded-full border border-white/10 bg-black/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="font-mono-tech text-[11px] tracking-widest text-neutral-300 uppercase">
              AVAILABLE FOR WORK
            </span>
          </div> */}

          <button
            onClick={() => setIsOpen(!isOpen)}
            data-cursor="pointer"
            className="flex items-center gap-2 text-xs font-mono-tech tracking-widest text-white uppercase border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all duration-200"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isOpen}
          >
            <span>{isOpen ? "CLOSE [ × ]" : "MENU [ + ]"}</span>
          </button>
        </div>
      </header>

      <div
        ref={overlayRef}
        style={{ display: "none" }}
        className="fixed inset-0 z-40 bg-[#000000] text-white flex flex-col justify-between pt-24 pb-8 px-6 md:p-14 overflow-y-auto"
      >
        {/* <div className="flex justify-between items-center max-w-7xl mx-auto w-full border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-tight text-xl">{DEVELOPER_INFO.name}</span>
            <span className="font-mono-tech text-xs text-neutral-400 hidden sm:inline">
              {"//"} INDEX
            </span>
          </div>
          <div className="font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
            DHAKA {DEVELOPER_INFO.timezone}
          </div>
        </div> */}

        <div className="max-w-7xl mx-auto w-full my-auto py-12">
          <ul ref={linksContainerRef} className="flex flex-col gap-3 md:gap-5">
            {menuItems.map((item) => (
              <li key={item.number} className="overflow-hidden">
                <button
                  onClick={() => handleLinkClick(item.target)}
                  data-cursor="link"
                  className="group w-full flex items-baseline justify-between text-left py-2 border-b border-white/5 hover:border-white/30 transition-colors"
                >
                  <div className="flex items-baseline gap-4 md:gap-8">
                    <span className="font-mono-tech text-xs md:text-sm text-neutral-500 group-hover:text-white transition-colors">
                      {item.number}
                    </span>
                    <span className="text-3xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase group-hover:translate-x-3 transition-transform duration-300 ease-out">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-mono-tech text-xs md:text-sm text-neutral-500 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300">
                    EXPLORE →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-7xl mx-auto w-full pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 font-mono-tech text-xs text-neutral-400 tracking-wider">
          <div className="flex flex-wrap gap-6">
            <a
              href="mailto:mubinulislam14@gmail.com"
              data-cursor="link"
              className="hover:text-white transition-colors"
            >
              mubinulislam14@gmail.com
            </a>
            <a
              href="https://github.com/mubin33"
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className="hover:text-white transition-colors"
            >
              GITHUB
            </a>
            <a
              href="https://linkedin.com/in/mubinulislam"
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className="hover:text-white transition-colors"
            >
              LINKEDIN
            </a>
          </div>
          <div>© 2026 MD. YASIN ARAFAT MUBIN</div>
        </div>
      </div>
    </>
  );
}
