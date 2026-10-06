"use client";

import { scrollToTarget } from "./SmoothScroll";
import { DEVELOPER_INFO } from "@/data/portfolio";

export default function Footer() {
  const handleScrollToTop = () => {
    scrollToTarget(0, 1.8);
  };

  return (
    <footer className="relative py-12 md:py-16 px-6 md:px-12 bg-black border-t border-white/10 text-neutral-400 font-mono-tech text-xs tracking-wider uppercase select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span>© 2026</span>
          <span className="text-white font-bold">{DEVELOPER_INFO.name}</span>
          {/* <span className="hidden sm:inline text-neutral-400">{"//"} ALL RIGHTS RESERVED</span> */}
        </div>

        {/* <div className="text-center text-neutral-400">
          ARCHITECTED WITH{" "}
          <span className="text-white font-semibold">NEXT.JS 16</span> +{" "}
          <span className="text-white font-semibold">GSAP 3</span> +{" "}
          <span className="text-white font-semibold">LENIS</span>
        </div> */}

        <button
          onClick={handleScrollToTop}
          data-cursor="pointer"
          className="group flex items-center gap-2 text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all duration-300"
        >
          <span>BACK TO TOP</span>
          <span className="group-hover:-translate-y-1 transition-transform">↑</span>
        </button>
      </div>
    </footer>
  );
}
