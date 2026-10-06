export interface Project {
  number: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  technologies: string[];
  image: string;
  liveUrl: string;
  metrics: { label: string; value: string }[];
}

export interface Experience {
  year: string;
  company: string;
  role: string;
  location: string;
  description: string;
  technologies: string[];
}

export interface SkillCategory {
  title: string;
  number: string;
  skills: string[];
  description: string;
}

export interface Service {
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
}

export interface PhilosophyStep {
  number: string;
  title: string;
  description: string;
  detail: string;
}

export const DEVELOPER_INFO = {
  name: "MD. YASIN ARAFAT MUBIN",
  shortName: "MUBIN",
  title: "FULL STACK DEVELOPER",
  email: "mubinulislam14@gmail.com",
  location: "DHAKA, BANGLADESH",
  coordinates: "23.8103° N, 90.4125° E",
  status: "AVAILABLE FOR SELECTIVE ROLES & PROJECTS",
  timezone: "UTC+06:00 (DHAKA)",
  bio: "I am MD. Yasin Arafat Mubin, a frontend-focused full-stack developer who builds modern web applications, interactive interfaces, and scalable digital experiences where engineering precision meets editorial aesthetics.",
  socials: [
    { name: "GITHUB", url: "https://github.com/mubin33", handle: "@mubin33" },
    { name: "LINKEDIN", url: "https://linkedin.com/in/md-yasin-arafat-mubin-web-developer", handle: "/in/ MD. Yasin Arafat Mubin" },
    { name: "EMAIL", url: "mailto:mubinulislam14@gmail.com", handle: "mubinulislam14@gmail.com" },
  ],
};

export const PROJECTS: Project[] = [
  {
    number: "01",
    title: "VALRPRO",
    subtitle: "Veteran Digital Ecosystem Platform",
    category: "Full Stack / Enterprise Web App",
    year: "2025",
    description: "A mission-critical digital ecosystem engineered for military veterans, providing high-integrity benefits tracking, certified identity verification, and community networking. Built with Next.js App Router, TypeScript, and high-performance server actions.",
    technologies: [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Microservices",
  "REST API",
  "GSAP",
  "VA.gov API",
  "Lighthouse API",
  "OneSignal",
  "Stripe",
  "Brevo",
  "Sendbox",
  "Vapi",
],
    image: "/projects/valrpro.jpg",
    liveUrl: "https://valrpro.com",
    metrics: [
      { label: "Active Veterans", value: "1,000+" },
      { label: "Lighthouse Score", value: "99/100" },
      { label: "Verification Latency", value: "<140ms" },
    ],
  },
  {
    number: "02",
    title: "BRIGHT CAR WASH",
    subtitle: "Car Wash Management Ecosystem",
    category: "Operational Automation / Telemetry",
    year: "2024",
    description: "Comprehensive operational automation suite featuring live wash bay telemetry, queue scheduling, automated payment routing, and real-time chemical & power telemetry monitoring.",
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS",
  "Node.js",
  "Microservices",
  "REST API",],
    image: "/projects/bright-carwash.jpg",
    liveUrl: "https://brightcarwash.com",
    metrics: [
      { label: "Telemetry Bays", value: "4 Active" },
      { label: "Daily Throughput", value: "+42% Velocity" },
      { label: "System Uptime", value: "99.98%" },
    ],
  },
  {
    number: "03",
    title: "EMPTYBD",
    subtitle: "Digital Marketplace & Social Platform",
    category: "E-Commerce / Social Media",
    year: "2024",
    description: "High-speed multi-vendor e-commerce platform and community hub built with modern Next.js and MongoDB. Engineered with brutalist editorial UI, fast live search, and low-latency interaction loops.",
    technologies: ["Next.js", "TypeScript", "MongoDB", "Express", "Tailwind CSS"],
    image: "/projects/emptybd.jpg",
    liveUrl: "https://emptybd.com",
    metrics: [
      { label: "Product Catalog", value: "12,000+ Items" },
      { label: "Query Speed", value: "38ms" },
      { label: "Visual System", value: "Strict Brutalism" },
    ],
  },
  {
    number: "04",
    title: "EMPOWER QUBIT",
    subtitle: "Quantum Computing Learning Platform",
    category: "EdTech / Interactive Canvas",
    year: "2024",
    description: "Interactive quantum computing educational environment featuring dynamic quantum circuit visualizations, interactive browser code editors, and progressive mastery curriculum.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Interactive Canvas", "Python"],
    image: "/projects/empower-qubit.jpg",
    liveUrl: "https://empowerqubit.com",
    metrics: [
      { label: "Interactive Circuits", value: "24 Gates" },
      { label: "Active Learners", value: "3,500+" },
      { label: "Course Completion", value: "88%" },
    ],
  },
  {
    number: "05",
    title: "AI AGENTS & MCP SUITE",
    subtitle: "Autonomous Agentic Workflows & Tool Telemetry",
    category: "AI Architecture / Automation",
    year: "2025",
    description: "Autonomous developer tooling suite leveraging Model Context Protocol (MCP), agentic multi-step code refactoring, automated security audit pipelines, and LLM context management.",
    technologies: ["TypeScript", "Python", "MCP", "AI Agents", "Next.js", "Tailwind CSS"],
    image: "/projects/ai-agentic.jpg",
    liveUrl: "https://agentic-mcp.dev",
    metrics: [
      { label: "Agent Pipelines", value: "5 Workers" },
      { label: "Context Window", value: "1M Tokens" },
      { label: "Audit Accuracy", value: "99.4%" },
    ],
  },
];

export const EXPERIENCES: Experience[] = [
  {
    year: "2025 — PRESENT",
    company: "BeyondAI",
    role: "Software Developer",
    location: "Dhaka, Bangladesh",
    description: "Architecting mission-critical frontend systems, high-converting digital products, and high-performance interactive interfaces with Next.js, TypeScript, and Tailwind CSS. Implementing micro-interactions, optimizing core web vitals, and collaborating with cross-functional product teams.",
    technologies: ["Next.js", "React", "Python", "TypeScript", "Tailwind CSS", "Microfrontends", "REST APIs", "AI Agents", "MCP", "Google Cloud Platform", "Microservices"],
  },
  {
    year: "2024 — 2025",
    company: "Ryven.co",
    role: "Frontend Developer",
    location: "Remote / Dhaka",
    description: "Developed high-conversion customer-facing web applications, client dashboards, and responsive component libraries. Spearheaded GSAP animation integrations and modern Swiss UI overhauls.",
    technologies: ["React", "Next.js", "TypeScript", "UI/UX Systems", "Motion Design", "Figma"],
  },
  {
year: "2024",
company: "Bdcalling",
role: "Web Developer",
location: "Dhaka, Bangladesh",
description:
"Delivered front-end development classes and mentored students in core web technologies and modern front-end practices. Also developed web applications and digital solutions for B2C clients based on their requirements. Contributed to EmptyBD, a social media and digital marketplace platform featuring community engagement, content sharing, real-time communication, and marketplace functionality. Implemented real-time social interactions and messaging using Socket.io and Zustand, Web Push notifications, and digital wallet features including deposits, withdrawals, and subscription management.",
technologies: [
"React",
"Next.js",
"JavaScript",
"Socket.io",
"Zustand",
"Web Push",
"MongoDB",
"UI/UX",
"Figma"
],
},

  {
    year: "2023 — 2024",
    company: "Rowjatul Quran Hifj Madrasha",
    role: "Educational Instructor & Digital Coordination",
    location: "Dhaka, Bangladesh",
    description: "Islamic scholarship and educational management, institutional digital record keeping, structured syllabus delivery, and disciplined curriculum coordination.",
    technologies: ["Instructional Mastery", "Discipline & Memory", "Information Systems", "Systematic Review"],
  },
  {
    year: "2022 — 2023",
    company: "Tahfijul Ummah Hifj Madrasha",
    role: "Quranic Studies & Academic Coordination",
    location: "Dhaka, Bangladesh",
    description: "Deep memorization mastery, phonetics precision, strict discipline, instructional guidance, and student accountability tracking with high focus.",
    technologies: ["Attention to Detail", "High Discipline", "Vocal & Mnemonic Systems", "Patience & Grit"],
  },
];

export const SKILL_TRACK_1 = [
  "REACT ",
  "NEXT.JS ",
  "TYPESCRIPT",
  "JAVASCRIPT (ESNEXT)",
  "GSAP 3",
  "SCROLLTRIGGER",
  "TAILWIND CSS 4",
  "RESPONSIVE UI",
];

export const SKILL_TRACK_2 = [
  "NODE.JS",
  "EXPRESS",
  "MONGODB",
  "PYTHON 3",
  "DJANGO",
  "MODEL CONTEXT PROTOCOL (MCP)",
  "AI AGENTS",
  "REST APIS",
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    number: "01",
    title: "FRONTEND ENGINEERING",
    skills: ["React", "Next.js ", "TypeScript", "Tailwind CSS 4", "HTML5 Semantic", "Modern CSS"],
    description: "Building resilient component architectures with strict typing, zero hydration layout shift, and server-side rendering excellence.",
  },
  {
    number: "02",
    title: "MOTION & INTERACTION",
    skills: ["GSAP 3", "ScrollTrigger", "Lenis Smooth Scroll", "Clip-Path Masking", "Micro-interactions", "Kinetic Typography"],
    description: "Creating cinematic scroll choreography and tactile micro-interactions that elevate utilitarian software into memorable digital art.",
  },
  {
    number: "03",
    title: "BACKEND & DATA SYSTEMS",
    skills: ["Node.js", "Express", "MongoDB", "Python", "Django", "RESTful APIs", "Authentication"],
    description: "Designing reliable server actions, data schemas, API gateways, and asynchronous pipeline integrations.",
  },
  {
    number: "04",
    title: "AI & AGENTIC WORKFLOWS",
    skills: ["Model Context Protocol (MCP)", "Autonomous Coding Agents", "Prompt Engineering", "LLM APIs", "Automated Code Auditing"],
    description: "Supercharging modern software development with AI-driven pipelines, autonomous agents, and tool execution protocols.",
  },
];

export const SERVICES: Service[] = [
  {
    number: "01",
    title: "FRONTEND ARCHITECTURE",
    tagline: "Scalable, resilient web applications",
    description: "Full-scale frontend development from architecture to deployment using Next.js App Router, React 19, and TypeScript with uncompromising code quality.",
    deliverables: ["Next.js App Router Architecture", "Strict TypeScript Codebase", "Core Web Vitals Optimization", "Clean Component Library"],
  },
  {
    number: "02",
    title: "CREATIVE & MOTION DEVELOPMENT",
    tagline: "Cinematic, award-worthy web motion",
    description: "GSAP-driven interaction design, ScrollTrigger choreography, smooth Lenis scrolling, and micro-interactions that captivate users.",
    deliverables: ["ScrollTrigger Sequencing", "Kinetic Typography", "Hardware-Accelerated Animation", "Accessible Reduced-Motion Support"],
  },
  {
    number: "03",
    title: "FULL STACK WEB APPLICATIONS",
    tagline: "Complete end-to-end software delivery",
    description: "Bridging modern frontend interfaces with secure Node.js, Express, or Python backends and MongoDB/SQL databases.",
    deliverables: ["RESTful API Engineering", "Database Modeling", "Auth & Access Control", "Cloud & Vercel Deployment"],
  },
  {
    number: "04",
    title: "EDITORIAL & BRUTALIST UI/UX",
    tagline: "High-contrast Swiss typographic design",
    description: "Striking black and white visual systems with razor-sharp borders, massive typography, and high-impact editorial layouts.",
    deliverables: ["Custom Design Systems", "Responsive Grid Architecture", "Micro-interaction Specifications", "Figma to React Precision"],
  },
  {
    number: "05",
    title: "AI & AGENTIC INTEGRATION",
    tagline: "Next-generation intelligence pipelines",
    description: "Leveraging Model Context Protocol (MCP), agentic workflows, and LLM integrations to build intelligent, autonomous web features.",
    deliverables: ["MCP Server Integration", "Autonomous Agent Workflows", "AI-Powered Search & Telemetry", "Automated Testing Pipelines"],
  },
  {
    number: "06",
    title: "PERFORMANCE & CODE AUDITING",
    tagline: "Sub-second speed & zero jank",
    description: "Deep dive profiling of rendering bottlenecks, bundle sizes, memory leaks, and animation framerates to ensure smooth 60fps performance.",
    deliverables: ["Lighthouse 95+ Guarantee", "Render Profiling & Memoization", "Bundle Splitting Optimization", "SEO & Metadata Strategy"],
  },
];

export const PHILOSOPHY: PhilosophyStep[] = [
  {
    number: "01",
    title: "Understand the problem.",
    description: "Code without understanding is liability. Before touching the editor, dissect the technical constraints, user motives, and business stakes.",
    detail: "Every interface solves a human problem. High engineering begins with radical clarity on what must be built and why.",
  },
  {
    number: "02",
    title: "Design the experience.",
    description: "Typography, whitespace, and contrast are not superficial decor. They are structural communication tools that dictate how humans process information.",
    detail: "A monochrome palette demands ruthless typographic hierarchy and intentional spatial balance. No fluff. No distractions.",
  },
  {
    number: "03",
    title: "Build the system.",
    description: "Construct scalable, reusable React components with strict TypeScript types, defensive state management, and semantic DOM foundations.",
    detail: "Clean abstractions, zero circular dependencies, and isolated component responsibilities make applications effortless to maintain.",
  },
  {
    number: "04",
    title: "Test the details.",
    description: "Obsess over tactile physics, transition timings, 60 FPS animation profiles, keyboard accessibility, and cross-browser resilience.",
    detail: "The distinction between average and world-class software lives in the final 5% — the milliseconds of easing, the hover feedback, the zero jank.",
  },
  {
    number: "05",
    title: "Ship and improve.",
    description: "Deploy to production with automated CI/CD pipelines, track real-world performance telemetry, and relentlessly refine.",
    detail: "Shipping is not the finish line; it is the genesis of real-world feedback. Great digital craft is an unending iteration.",
  },
];

export const TECH_STACK_ITEMS = [
  "HTML5",
  "CSS3 / POSTCSS",
  "JAVASCRIPT (ES2026)",
  "TYPESCRIPT",
  "REACT ",
  "NEXT.JS ",
  "TAILWIND CSS 4",
  "GSAP 3",
  "SCROLLTRIGGER",
  "LENIS",
  "NODE.JS",
  "EXPRESS",
  "MONGODB",
  "PYTHON 3",
  "DJANGO",
  "MODEL CONTEXT PROTOCOL (MCP)",
  "AGENTIC AI",
  "REST APIS",
  "GIT / GITHUB",
  "VERCEL",
];
