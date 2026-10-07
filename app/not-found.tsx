import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-16 select-none font-sans">
      {/* Background Tech Grid & Ambient Atmosphere */}
      <div className="absolute inset-0 bg-grid-tech opacity-20 pointer-events-none" />

      {/* Central Radiant Spotlight Halo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] md:w-[650px] h-[340px] sm:h-[500px] md:h-[650px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 45%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Top Header Telemetry Bar */}
      {/* <header className="relative z-10 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5 font-mono-tech text-xs tracking-widest uppercase">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-white inline-block animate-ping" />
          <span className="text-white font-semibold">STATUS // 404_PAGE_NOT_FOUND</span>
        </div>

        <div className="flex items-center gap-6 text-neutral-400 text-[11px]">
          <span>LOC // DHAKA [ 23.79° N ]</span>
          <span className="hidden sm:inline-block text-neutral-600">|</span>
          <span className="text-neutral-300 font-mono-tech">PORTFOLIO // SYS_NETWORK</span>
        </div>
      </header> */}

      {/* Centerpiece 404 Cybernetic Presentation */}
      <section className="relative z-10 my-auto py-12 flex flex-col items-center text-center max-w-4xl mx-auto w-full">
        {/* Massive Geometric 404 Container */}
        <div className="relative  bg-neutral-950/70 p-8 sm:p-14 md:p-16 w-full backdrop-blur-md overflow-hidden group">
          {/* Corner Technical Crosshairs */}
          <span className="absolute top-2 left-2 text-xs font-mono-tech text-white/50 select-none">+</span>
          <span className="absolute top-2 right-2 text-xs font-mono-tech text-white/50 select-none">+</span>
          <span className="absolute bottom-2 left-2 text-xs font-mono-tech text-white/50 select-none">+</span>
          <span className="absolute bottom-2 right-2 text-xs font-mono-tech text-white/50 select-none">+</span>

          {/* Glitch / Laser scan accent line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Subtitle tag */}
          {/* <div className="font-mono-tech text-[10px] md:text-xs text-neutral-400 tracking-widest uppercase mb-4">
            {"//"} SYSTEM EXCEPTION : ERR_SECTOR_UNRESOLVED
          </div> */}

          {/* Huge 404 Display */}
          <h1 className="text-[clamp(5rem,18vw,14rem)] font-black tracking-tighter leading-none text-white select-none drop-shadow-[0_0_35px_rgba(255,255,255,0.35)]">
            404
          </h1>

          <div className="w-16 h-[2px] bg-white mx-auto my-6" />

          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight uppercase text-white max-w-xl mx-auto">
            THE REQUESTED COORDINATE DOES NOT EXIST
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto mt-4 font-light leading-relaxed">
            The page endpoint you navigated to could not be located in this network architecture. It may have been relocated, unmounted, or erased.
          </p>

          {/* Technical Diagnostics Trace */}
          {/* <div className="mt-8 pt-6 border-t border-white/10 max-w-md mx-auto grid grid-cols-2 gap-4 text-left font-mono-tech text-[11px] text-neutral-400">
            <div>
              <span className="text-neutral-500 block mb-0.5">PROTOCOL:</span>
              <span className="text-neutral-200">HTTP NOT FOUND</span>
            </div>
            <div>
              <span className="text-neutral-500 block mb-0.5">RECOVERY:</span>
              <span className="text-neutral-200">RETURN TO ROOT</span>
            </div>
          </div> */}
        </div>

        {/* Action Button Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-mono-tech text-xs tracking-widest uppercase font-bold transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]"
          >
            <span>  RETURN TO HOME</span>
          </Link>

          {/* <Link
            href="/#contact"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 bg-black/60 text-white font-mono-tech text-xs tracking-widest uppercase transition-all duration-300 hover:border-white hover:bg-white/10"
          >
            <span> CONTACT →</span>
          </Link> */}
        </div>
      </section>

      {/* Bottom Technical Telemetry Footer */}
      {/* <footer className="relative z-10 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10 pt-5 font-mono-tech text-[10px] md:text-xs tracking-wider text-neutral-400 uppercase">
        <div>
          <span>MD. YASIN ARAFAT MUBIN // PORTFOLIO</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-500">
          <span>CODEBASE: NEXT.JS 16 // GSAP</span>
          <span>•</span>
          <span className="text-neutral-400">STATUS: RECOVERABLE</span>
        </div>
      </footer> */}
    </main>
  );
}
