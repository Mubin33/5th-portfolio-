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
  const [isCvOpen, setIsCvOpen] = useState(false);
  const cvBackdropRef = useRef<HTMLDivElement>(null);

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

    if (isOpen || isCvOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    if (isOpen) {
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
      if (e.key === "Escape") {
        if (isCvOpen) {
          setIsCvOpen(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isCvOpen]);

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
              {'<'}  {'/>'}
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

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setIsCvOpen(true)}
              data-cursor="pointer"
              className="flex items-center gap-1.5 text-xs font-mono-tech tracking-widest text-white uppercase border border-white/20 px-3.5 py-2 hover:bg-white hover:text-black transition-all duration-200"
              aria-label="View Resume and Curriculum Vitae"
            >
              <span>CV  ↗</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              data-cursor="pointer"
              className="flex items-center gap-2 text-xs font-mono-tech tracking-widest text-white uppercase border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all duration-200"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isOpen}
            >
              <span>{isOpen ? "CLOSE  ×" : "MENU  + "}</span>
            </button>
          </div>
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
                    {/* <span className="font-mono-tech text-xs md:text-sm text-neutral-500 group-hover:text-white transition-colors">
                      {item.number}
                    </span> */}
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
          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsCvOpen(true);
              }}
              data-cursor="link"
              className="text-white hover:underline flex items-center gap-1 uppercase tracking-wider font-semibold"
            >
              <span>CV</span>
              <span>↗</span>
            </button>
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
              href="https://linkedin.com/in/md-yasin-arafat-mubin-web-developer"
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
      {/* CV / RESUME VIEWER MODAL */}
      {isCvOpen && (
        <div
          ref={cvBackdropRef}
          onClick={(e) => {
            if (e.target === cvBackdropRef.current) {
              setIsCvOpen(false);
            }
          }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Curriculum Vitae Preview Modal"
        >
          <div className="relative w-full max-w-5xl h-[88vh] md:h-[92vh] bg-black border border-white/20 flex flex-col shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-end px-4 sm:px-6 py-3.5 border-b border-white/15 bg-neutral-950 font-mono-tech text-xs tracking-wider">
              {/* <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-white font-semibold uppercase">
                  DOCUMENT // CV_PREVIEW
                </span>
                <span className="hidden sm:inline text-neutral-500">
                  [ MD. YASIN ARAFAT MUBIN ]
                </span>
              </div> */}

              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href="/Mubin_Software_Developer_CV.pdf"
                  download="Mubin_Software_Developer_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 text-[11px] text-neutral-300 hover:text-black hover:bg-white transition-all uppercase"
                >
                  <span>DOWNLOAD</span>
                  <span>↓</span>
                </a>

                {/* <a
                  href="https://drive.google.com/file/d/1F5559vAFENl5vzMYjnAP5CaLW38cxdAt/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 text-[11px] text-neutral-300 hover:text-black hover:bg-white transition-all uppercase"
                >
                  <span>OPEN NEW TAB</span>
                  <span>↗</span>
                </a> */}

                <button
                  onClick={() => setIsCvOpen(false)}
                  className="px-3 py-1.5 border border-white/20 text-[11px] text-white hover:text-black hover:bg-white transition-all uppercase font-bold"
                  aria-label="Close CV Modal"
                >
                  CLOSE ×
                </button>
              </div>
            </div>

            {/* Modal Body: Embedded Google Drive Preview Frame */}
            <div className="relative flex-1 w-full h-full bg-neutral-900 overflow-hidden">
              <iframe
                src="https://drive.google.com/file/d/1F5559vAFENl5vzMYjnAP5CaLW38cxdAt/preview"
                title="MD. Yasin Arafat Mubin CV Preview"
                className="w-full h-full border-0"
                allow="autoplay"
              />
            </div>

            {/* Modal Footer / Telemetry Bar */}
            {/* <div className="px-4 sm:px-6 py-2.5 border-t border-white/10 bg-black flex flex-col sm:flex-row items-center justify-between gap-2 font-mono-tech text-[10px] text-neutral-400 uppercase tracking-widest">
              <span>DHAKA, BANGLADESH • FRONTEND ARCHITECTURE & CREATIVE MOTION</span>
              <span>PRESS [ ESC ] OR CLICK OUTSIDE TO CLOSE</span>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}
