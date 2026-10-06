"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function AISection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"agents" | "mcp" | "audit">("agents");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        terminalRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        }
      );

      gsap.to(".ai-indicator-pulse", {
        opacity: 0.3,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  const terminalLogs = {
    agents: [
      { id: "AG_01", task: "Execute dynamic code refactoring", status: "ONLINE", tokens: "42.8k" },
      { id: "AG_02", task: "Audit AST for hydration discrepancies", status: "COMPLETED", tokens: "18.2k" },
      { id: "AG_03", task: "Generate end-to-end regression specs", status: "EXECUTING", tokens: "89.1k" },
      { id: "AG_04", task: "Synthesize vector embeddings for documentation", status: "STANDBY", tokens: "6.4k" },
    ],
    mcp: [
      { server: "mcp-git-bridge", version: "v1.4.2", state: "CONNECTED", ping: "8ms" },
      { server: "mcp-database-inspector", version: "v2.0.1", state: "CONNECTED", ping: "14ms" },
      { server: "mcp-browser-puppeteer", version: "v3.1.0", state: "ACTIVE", ping: "22ms" },
      { server: "mcp-terminal-executor", version: "v1.1.9", state: "CONNECTED", ping: "4ms" },
    ],
    audit: [
      { target: "app/layout.tsx", issues: "0 VULNERABILITIES", score: "100/100", verdict: "VERIFIED" },
      { target: "lib/gsap.ts", issues: "0 MEMORY LEAKS", score: "99/100", verdict: "OPTIMAL" },
      { target: "components/SmoothScroll.tsx", issues: "CLEANUP VERIFIED", score: "100/100", verdict: "ROBUST" },
      { target: "data/portfolio.ts", issues: "TYPESCRIPT STRICT", score: "100/100", verdict: "VALIDATED" },
    ],
  };

  return (
    <section
      id="ai-section"
      ref={containerRef}
      className="relative py-28 md:py-40 px-6 md:px-12 border-b border-white/10 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-4 mb-3 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
              <span className="text-white font-bold">08</span>
              <span className="w-8 h-[1px] bg-white/30" />
              <span>FRONTIER WORKFLOWS</span>
            </div>
            <h2 className="text-section-huge font-bold uppercase tracking-tighter text-white">
              BUILDING<br />WITH AI
            </h2>
          </div>
          <p className="font-mono-tech text-xs tracking-wider text-neutral-400 max-w-sm uppercase">
            {"//"} MODEL CONTEXT PROTOCOL (MCP), AGENTIC CODING PIPELINES, AND AUTOMATED TELEMETRY
          </p>
        </div>

        <div
          ref={terminalRef}
          className="border border-white/20 bg-neutral-950 p-6 md:p-10 font-mono-tech select-none"
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-6 mb-8 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
              </div>
              <span className="text-white font-bold tracking-wider">
                MCP_AGENTIC_HOST_DAEMON {"//"} v2.4
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("agents")}
                data-cursor="pointer"
                className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-colors border ${
                  activeTab === "agents"
                    ? "bg-white text-black border-white font-bold"
                    : "border-white/20 text-neutral-400 hover:text-white"
                }`}
              >
                AUTONOMOUS AGENTS
              </button>
              <button
                onClick={() => setActiveTab("mcp")}
                data-cursor="pointer"
                className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-colors border ${
                  activeTab === "mcp"
                    ? "bg-white text-black border-white font-bold"
                    : "border-white/20 text-neutral-400 hover:text-white"
                }`}
              >
                MCP SERVERS
              </button>
              <button
                onClick={() => setActiveTab("audit")}
                data-cursor="pointer"
                className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-colors border ${
                  activeTab === "audit"
                    ? "bg-white text-black border-white font-bold"
                    : "border-white/20 text-neutral-400 hover:text-white"
                }`}
              >
                CODE AUDIT
              </button>
            </div>
          </div>

          {activeTab === "agents" && (
            <div className="space-y-4">
              <div className="text-xs text-neutral-400 uppercase tracking-widest mb-4 flex justify-between">
                <span>ACTIVE WORKERS [04 RUNNING]</span>
                <span className="flex items-center gap-2">
                  <span className="ai-indicator-pulse w-2 h-2 rounded-full bg-white inline-block" />
                  PIPELINE NOMINAL
                </span>
              </div>
              <div className="divide-y divide-white/5 border border-white/10 bg-black">
                {terminalLogs.agents.map((ag) => (
                  <div
                    key={ag.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-white font-bold">{ag.id}</span>
                      <span className="text-neutral-300 text-xs sm:text-sm font-sans">
                        {ag.task}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-neutral-400">
                      <span>TOKENS: {ag.tokens}</span>
                      <span className="border border-white/20 px-2 py-0.5 text-white uppercase text-[10px]">
                        {ag.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "mcp" && (
            <div className="space-y-4">
              <div className="text-xs text-neutral-400 uppercase tracking-widest mb-4 flex justify-between">
                <span>MODEL CONTEXT PROTOCOL DAEMONS</span>
                <span>STATUS: 4/4 LINKED</span>
              </div>
              <div className="divide-y divide-white/5 border border-white/10 bg-black">
                {terminalLogs.mcp.map((srv) => (
                  <div
                    key={srv.server}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-white font-bold">{srv.server}</span>
                      <span className="text-neutral-400 text-xs">{srv.version}</span>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-neutral-400">
                      <span>LATENCY: {srv.ping}</span>
                      <span className="border border-white/20 px-2 py-0.5 text-white uppercase text-[10px]">
                        {srv.state}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-4">
              <div className="text-xs text-neutral-400 uppercase tracking-widest mb-4 flex justify-between">
                <span>AST & MEMORY LEAK VERIFICATION PIPELINE</span>
                <span>PASS RATE: 100%</span>
              </div>
              <div className="divide-y divide-white/5 border border-white/10 bg-black">
                {terminalLogs.audit.map((aud, idx) => (
                  <div
                    key={idx}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-white font-bold">{aud.target}</span>
                      <span className="text-neutral-400 text-xs">{aud.issues}</span>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-neutral-400">
                      <span>SCORE: {aud.score}</span>
                      <span className="border border-white/20 px-2 py-0.5 text-white uppercase text-[10px]">
                        {aud.verdict}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          
        </div>
      </div>
    </section>
  );
}
