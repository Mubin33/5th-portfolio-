"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { scrollToTarget } from "./SmoothScroll";
import { DEVELOPER_INFO } from "@/data/portfolio";
import { SocialIconGroup } from "./SocialIcons";
import PresentationModal from "./PresentationModal";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navBarRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksContainerRef = useRef<HTMLUListElement>(null);
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
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

    if (isOpen || isCvOpen || isPresentationOpen) {
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
        if (isPresentationOpen) {
          setIsPresentationOpen(false);
        } else if (isCvOpen) {
          setIsCvOpen(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isCvOpen, isPresentationOpen]);

  const handleLinkClick = (target: string) => {
    setIsOpen(false);
    setTimeout(() => {
      scrollToTarget(target);
    }, 400);
  };

  return (
    <>
      <header
        ref={navBarRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-3 bg-black/80 backdrop-blur-md border-b border-white/10"
            : "py-5 sm:py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center">
            <button
            onClick={() => handleLinkClick("#hero")}
            data-cursor="link"
            className="group text-left flex items-center gap-3 select-none"
          >
            <span className="font-bold tracking-tight text-3xl md:text-4xl text-white group-hover:tracking-wider transition-all duration-300">
              {'<'}  {'/>'}
            </span>
          </button>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsCvOpen(true)}
              data-cursor="pointer"
              className="flex items-center gap-1.5 text-xs font-mono-tech tracking-widest text-white uppercase border border-white/20 px-3 sm:px-3.5 py-2 hover:bg-white hover:text-black transition-all duration-200"
              aria-label="View Resume and Curriculum Vitae"
            >
              <span>CV  ↗</span>
            </button>

            <button
              onClick={() => setIsPresentationOpen(true)}
              data-cursor="pointer"
              className="flex items-center gap-1.5 text-xs font-mono-tech tracking-widest text-white uppercase border border-white/20 px-3 sm:px-3.5 py-2 hover:bg-white hover:text-black transition-all duration-200"
              aria-label="View Presentation: Software Development in the AI Era"
            >
              <span>SLIDES  ↗</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              data-cursor="pointer"
              className="flex items-center gap-2 text-xs font-mono-tech tracking-widest text-white uppercase border border-white/20 px-3.5 sm:px-4 py-2 hover:bg-white hover:text-black transition-all duration-200"
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
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
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
            <span className="text-white/20">|</span>
            <button
              onClick={() => {
                setIsOpen(false);
                setIsPresentationOpen(true);
              }}
              data-cursor="link"
              className="text-white hover:underline flex items-center gap-1 uppercase tracking-wider font-semibold"
            >
              <span>SDAIE</span>
              <span>↗</span>
            </button>
            <span className="text-white/20 hidden sm:inline">|</span>
            <SocialIconGroup size="sm" />
          </div> 
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
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href="/Yasin Arafat Software Developer CV.pdf"
                  download="Yasin Arafat Software Developer CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 text-[11px] text-neutral-300 hover:text-black hover:bg-white transition-all uppercase"
                >
                  <span>DOWNLOAD</span>
                  <span>↓</span>
                </a>

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
                src="https://drive.google.com/file/d/1C2whv6JyCn16dgP0MfFHohvcVD82ZyTs/preview"
                title="MD. Yasin Arafat Mubin CV Preview"
                className="w-full h-full border-0"
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      )}

      {/* PRESENTATION MODAL */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        totalSlides={24}
      />
    </>
  );
}
