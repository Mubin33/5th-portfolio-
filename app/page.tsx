"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import SelectedProjects from "@/components/SelectedProjects";
import ProjectShowcase from "@/components/ProjectShowcase";
import Philosophy from "@/components/Philosophy";
import Services from "@/components/Services";
import AISection from "@/components/AISection";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <SmoothScroll>
      {/* Cinematic Initial Loading Screen */}
      <LoadingScreen onComplete={() => setIsLoaded(true)} />

      {/* Desktop Magnetic Custom Cursor */}
      <CustomCursor />

      {/* Fixed Navigation & Fullscreen Menu */}
      <Navigation />

      {/* Main Structural Content */}
      <main className="relative z-10 bg-black text-white min-h-screen">
        {/* 01: Hero Section */}
        <Hero isLoaded={isLoaded} />

        {/* 02: Introduction Section */}
        <Introduction />

        {/* 03: About Me Section */}
        <About />

        {/* 04: Skills & Kinetic Typography */}
        <Skills />

        {/* 05: Experience Timeline */}
        <Experience />

        {/* 06: Selected Projects (Vertical Viewport Presentations) */}
        <SelectedProjects />

        {/* 07: Project Showcase (Pinned Horizontal Traverse) */}
        <ProjectShowcase />

        {/* 08: How I Build (Philosophy Pinned Sequence) */}
        <Philosophy />

        {/* 09: Engineering Services */}
        <Services />

        {/* 10: Building With AI & MCP Telemetry */}
        <AISection />

        {/* 11: Continuous Tech Stack Marquee */}
        <TechStack />

        {/* 12: Climax Contact Section */}
        <Contact />
      </main>

      {/* Global Minimal Footer */}
      <Footer />
    </SmoothScroll>
  );
}
