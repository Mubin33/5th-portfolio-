"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { DEVELOPER_INFO } from "@/data/portfolio";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const formBoxRef = useRef<HTMLDivElement>(null);
  const infoBoxRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    description: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const lines = headlineRef.current?.querySelectorAll(".contact-line");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });

      if (lines) {
        tl.fromTo(
          lines,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: "power4.out",
          }
        );
      }

      tl.fromTo(
        formBoxRef.current,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      )
        .fromTo(
          infoBoxRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        );
    }, containerRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DEVELOPER_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus("error");
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    if (!formData.whatsapp.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your WhatsApp contact number.");
      return;
    }

    if (!formData.description.trim()) {
      setStatus("error");
      setErrorMessage("Please describe your project scope or inquiry.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to dispatch transmission.");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        description: "",
      });
    } catch (err: unknown) {
      console.error("Form dispatch error:", err);
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again or reach out directly via email."
      );
    }
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative py-28 md:py-44 px-6 md:px-12 border-b border-white/10 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col justify-between">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16 font-mono-tech text-xs tracking-widest text-neutral-400 uppercase">
          <span className="text-white font-bold">10</span>
          <span className="w-8 h-[1px] bg-white/30" />
          <span>INITIALIZE CONTACT // TRANSMISSION GATE</span>
        </div>

        {/* Climax Headline */}
        <h2
          ref={headlineRef}
          className="text-hero-giant font-extrabold uppercase text-white tracking-tighter leading-[0.88] select-none mb-16 md:mb-24"
        >
          <div className="overflow-hidden py-1">
            <span className="contact-line block">LET&apos;S</span>
          </div>
          <div className="overflow-hidden py-1">
            <span className="contact-line block">BUILD</span>
          </div>
          <div className="overflow-hidden py-1">
            <span className="contact-line block">SOMETHING</span>
          </div>
          <div className="overflow-hidden py-1">
            <span className="contact-line block text-neutral-400 hover:text-white transition-colors duration-500">
              TOGETHER.
            </span>
          </div>
        </h2>

        {/* Grid: Interactive Form (Left) & Direct Channels (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16  items-start">
          {/* Left Column: Direct Transmission Form */}
          <div ref={formBoxRef} className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <p className="text-neutral-400 text-sm font-light leading-relaxed mb-8">
                Submit your project specifications, system requirements, or contract inquiries below. Your transmission will be dispatched directly to my primary inbox.
              </p>
            </div>

            {status === "success" ? (
              <div className="border border-white/40 bg-neutral-950/80 p-8 md:p-12 font-mono-tech relative">
                <span className="absolute top-2 left-2 text-xs text-white/40">+</span>
                <span className="absolute top-2 right-2 text-xs text-white/40">+</span>
                <span className="absolute bottom-2 left-2 text-xs text-white/40">+</span>
                <span className="absolute bottom-2 right-2 text-xs text-white/40">+</span>

                <div className="flex items-center gap-3 text-white mb-4">

                  <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight">
                    TRANSMISSION CONFIRMED
                  </h3>
                </div>

                <p className="text-neutral-300 font-sans text-sm md:text-base leading-relaxed mb-6 font-light">
                  Your message has been delivered to <strong>{DEVELOPER_INFO.email}</strong>. I review inquiries daily and will contact you directly via Email or WhatsApp within 24 hours.
                </p>

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => setStatus("idle")}
                    data-cursor="pointer"
                    className="border border-white/30 text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    SEND ANOTHER INQUIRY [ + ]
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === "error" && errorMessage && (
                  <div className="p-4 border border-white/40 bg-neutral-900 text-white text-xs font-mono-tech tracking-wider uppercase flex items-center justify-between">
                    <span>[!] {errorMessage}</span>
                    <button
                      type="button"
                      onClick={() => setErrorMessage("")}
                      className="text-neutral-400 hover:text-white"
                    >
                      [×]
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="font-mono-tech text-xs tracking-wider uppercase text-neutral-400 block mb-2"
                    >
                      YOUR NAME <span className="text-white">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Alexander Vance"
                      required
                      disabled={status === "submitting"}
                      className="w-full bg-neutral-950/80 border border-white/20 focus:border-white focus:outline-none text-white px-4 py-3.5 font-mono-tech text-sm transition-all duration-200 placeholder:text-neutral-600 disabled:opacity-50"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="font-mono-tech text-xs tracking-wider uppercase text-neutral-400 block mb-2"
                    >
                      RETURN EMAIL <span className="text-white">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. alexander@enterprise.com"
                      required
                      disabled={status === "submitting"}
                      className="w-full bg-neutral-950/80 border border-white/20 focus:border-white focus:outline-none text-white px-4 py-3.5 font-mono-tech text-sm transition-all duration-200 placeholder:text-neutral-600 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* WhatsApp Field */}
                <div>
                  <label
                    htmlFor="contact-whatsapp"
                    className="font-mono-tech text-xs tracking-wider uppercase text-neutral-400 block mb-2"
                  >
                    WHATSAPP NUMBER <span className="text-white">*</span>
                  </label>
                  <input
                    id="contact-whatsapp"
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="e.g. +880 1700-000000 or +1 (555) 019-2834"
                    required
                    disabled={status === "submitting"}
                    className="w-full bg-neutral-950/80 border border-white/20 focus:border-white focus:outline-none text-white px-4 py-3.5 font-mono-tech text-sm transition-all duration-200 placeholder:text-neutral-600 disabled:opacity-50"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label
                    htmlFor="contact-description"
                    className="font-mono-tech text-xs tracking-wider uppercase text-neutral-400 block mb-2"
                  >
                    DESCRIPTION<span className="text-white">*</span>
                  </label>
                  <textarea
                    id="contact-description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your architectural goals, product requirements, stack preferences, or contract timeline..."
                    required
                    disabled={status === "submitting"}
                    className="w-full bg-neutral-950/80 border border-white/20 focus:border-white focus:outline-none text-white px-4 py-3.5 font-mono-tech text-sm transition-all duration-200 placeholder:text-neutral-600 resize-y min-h-[130px] disabled:opacity-50"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    data-cursor="pointer"
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-white text-black font-bold uppercase tracking-widest text-xs font-mono-tech px-8 py-4 hover:bg-neutral-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    <span>
                      {status === "submitting"
                        ? "Sending..."
                        : "Send"}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {status === "submitting" ? "•••" : "→"}
                    </span>
                  </button>

                </div>
              </form>
            )}
          </div>

          {/* Right Column: Direct Channels, WhatsApp & Socials */}
          <div ref={infoBoxRef} className="lg:col-span-5 flex flex-col gap-10">
            {/* Direct Email Box */}
            <div className="border border-white/10 bg-neutral-950/60 p-6 md:p-8 space-y-4">

              <div>
                <a
                  href={`mailto:${DEVELOPER_INFO.email}`}
                  data-cursor="link"
                  className="group text-xl sm:text-2xl font-bold text-white hover:text-neutral-300 transition-colors inline-block break-all"
                >
                  <span className="border-b border-white/40 group-hover:border-white transition-colors">
                    {DEVELOPER_INFO.email}
                  </span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleCopyEmail}
                  data-cursor="pointer"
                  className="font-mono-tech text-xs uppercase tracking-widest border border-white/30 px-4 py-2 text-white hover:bg-white hover:text-black transition-colors"
                  title="Copy Email Address"
                >
                  {copied ? "COPIED ✓" : "COPY EMAIL"}
                </button>

                <a
                  href={`mailto:${DEVELOPER_INFO.email}?subject=Project%20Inquiry%20via%20Portfolio`}
                  data-cursor="link"
                  className="font-mono-tech text-xs uppercase tracking-widest border border-white/15 px-4 py-2 text-neutral-300 hover:text-white hover:border-white/40 transition-colors"
                >
                  OPEN CLIENT ↗
                </a>
              </div>
            </div>

            {/* Direct WhatsApp Quick Contact */}
            <div className="border border-white/10 bg-neutral-950/60 p-6 md:p-8 space-y-3">

              <p className="text-sm text-neutral-300 font-light">
                Prefer immediate messaging? Chat directly via WhatsApp for swift syncs and consultation.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/8801560008450" // will be linked or open web whatsapp
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="inline-flex items-center gap-3 font-mono-tech text-xs uppercase tracking-widest border border-white/30 px-5 py-2.5 text-white hover:bg-white hover:text-black transition-colors"
                >
                  <span>CHAT ON WHATSAPP</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Location & Status Telemetry */}
            {/* <div className="border border-white/10 bg-neutral-950/60 p-6 font-mono-tech text-xs space-y-2 uppercase tracking-wider">
              <div className="flex justify-between items-center text-neutral-400">
                <span>LOCATION:</span>
                <span className="text-white font-bold">{DEVELOPER_INFO.location}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-400">
                <span>TIMEZONE:</span>
                <span className="text-neutral-300">{DEVELOPER_INFO.timezone}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-400 pt-2 border-t border-white/10">
                <span>STATUS:</span>
                <span className="text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-ping" />
                  AVAILABLE FOR CONTRACTS
                </span>
              </div>
            </div> */}

            {/* Networks & Repositories */}
            <div className="space-y-3">
              <div className="divide-y divide-white/10 border-y border-white/10 font-mono-tech text-sm">
                {DEVELOPER_INFO.socials.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="group py-3.5 flex items-center justify-between text-neutral-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-white font-bold">{soc.name}</span>
                      <span className="text-neutral-400 text-xs">{soc.handle}</span>
                    </div>
                    <span className="group-hover:translate-x-1.5 transition-transform">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
