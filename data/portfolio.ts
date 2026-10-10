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
  responsibilities: string[];
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
    image: "/projects/valrpro-platform.jpg",
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
    image: "/projects/bright-carwash-telemetry.jpg",
    liveUrl: "https://brightcarwash.com",
    metrics: [
      { label: "Telemetry Bays", value: "4 Active" },
      { label: "Daily Throughput", value: "+42% Velocity" },
      { label: "System Uptime", value: "99.98%" },
    ],
  },
  {
  number: "03",
  title: "COUNT TRUST",
  subtitle: "Voting & Election Management Platform",
  category: "Full Stack / Enterprise Voting Platform",
  year: "2025",
  description:
    "A comprehensive digital voting platform developed for a US-based partner, enabling organizations to conduct representative elections and various types of voting processes. The platform streamlines voter participation, candidate management, election workflows, and secure result handling through a centralized web-based system.",
  technologies: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "REST API",
    "MongoDB",
    "Tailwind CSS",
    "Authentication",
    "Role-Based Access Control",
  ],
  image: "/projects/count-trust-platform.jpg",
  liveUrl: "https://counttrust.com",
  metrics: [
    { label: "Platform Type", value: "Voting & Elections" },
    { label: "Target Market", value: "US Organizations" },
    { label: "Election Support", value: "Multi-Purpose Voting" },
  ],
},
{
  number: "04",
  title: "MEETING SCHEDULE",
  subtitle: "Reusable Meeting Scheduling NPM Package",
  category: "NPM Package / Developer Tool",
  year: "2025",
  description:
    "A reusable NPM package independently designed and developed to provide meeting scheduling functionality across partner websites. Built as a modular integration layer that connects partner websites with real-time meeting availability, allowing clients to select and confirm meeting dates while keeping the partner website as the primary interface.",
  technologies: [
    "NPM",
    "JavaScript",
    "TypeScript",
    "React",
    "REST API",
    "API Integration",
    "Reusable Components",
  ],
  image: "/projects/meeting-schedule-package.jpg",
  liveUrl: "https://www.npmjs.com/",
  metrics: [
    { label: "Development", value: "Independently Built" },
    { label: "Integration", value: "Partner Websites" },
    { label: "Data Flow", value: "Real-Time Availability" },
  ],
},
  {
    number: "05",
    title: "EMPTYBD",
    subtitle: "Digital Marketplace & Social Platform",
    category: "E-Commerce / Social Media",
    year: "2024",
    description: "High-speed multi-vendor e-commerce platform and community hub built with modern Next.js and MongoDB. Engineered with brutalist editorial UI, fast live search, and low-latency interaction loops.",
    technologies: ["Next.js", "TypeScript", "MongoDB", "Express", "Tailwind CSS"],
    image: "/projects/emptybd-marketplace.jpg",
    liveUrl: "https://emptybd.com",
    metrics: [
      { label: "Product Catalog", value: "12,000+ Items" },
      { label: "Query Speed", value: "38ms" },
      { label: "Visual System", value: "Strict Brutalism" },
    ],
  },
  {
    number: "06",
    title: "EMPOWER QUBIT",
    subtitle: "Quantum Computing Learning Platform",
    category: "EdTech / Interactive Canvas",
    year: "2024",
    description: "Interactive quantum computing educational environment featuring dynamic quantum circuit visualizations, interactive browser code editors, and progressive mastery curriculum.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Interactive Canvas", "Python"],
    image: "/projects/empower-qubit-lab.jpg",
    liveUrl: "https://empowerqubit.com",
    metrics: [
      { label: "Interactive Circuits", value: "24 Gates" },
      { label: "Active Learners", value: "3,500+" },
      { label: "Course Completion", value: "88%" },
    ],
  },
  {
    number: "07",
    title: "AI AGENTS & MCP SUITE",
    subtitle: "Autonomous Agentic Workflows & Tool Telemetry",
    category: "AI Architecture / Automation",
    year: "2025",
    description: "Autonomous developer tooling suite leveraging Model Context Protocol (MCP), agentic multi-step code refactoring, automated security audit pipelines, and LLM context management.",
    technologies: ["TypeScript", "Python", "MCP", "AI Agents", "Next.js", "Tailwind CSS"],
    image: "/projects/ai-agents-mcp-suite.jpg",
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
    description: "Working in a B2B-focused software development environment at BeyondAI, contributing to in-house SaaS products, ERP and HRM systems, AI-powered solutions, and custom software projects developed for clients and business partners based on their specific requirements. Responsible for building scalable and high-performance web applications, developing reusable UI architectures, integrating REST APIs and backend services, and delivering production-ready features from requirements to deployment. Experienced in developing complex frontend systems with Next.js, React, TypeScript, and Tailwind CSS, along with microservices, AI agents, and MCP-based workflows. Also involved in performance optimization, Core Web Vitals, responsive and interactive UI development, debugging, code review, codebase auditing, vulnerability analysis, and maintaining existing applications to ensure reliability, scalability, and long-term product quality.",
    responsibilities: [
      "Develop and maintain scalable web applications and business-focused software products.",
      "Build responsive, interactive, and reusable frontend architectures using Next.js, React, TypeScript, and Tailwind CSS.",
      "Translate business and client requirements into practical technical solutions and production-ready features.",
      "Develop and contribute to SaaS, ERP, HRM, AI-powered, and client-specific software products.",
      "Integrate REST APIs and backend services, manage application data, and implement complex business workflows.",
      "Work with AI agents, MCP-based workflows, microservices, and third-party services across different projects.",
      "Optimize application performance, Core Web Vitals, rendering, loading experience, and overall frontend reliability.",
      "Perform debugging, code reviews, codebase audits, testing, and vulnerability/risk analysis.",
      "Maintain existing applications, resolve production issues, and continuously improve code quality and system reliability.",
      "Collaborate with developers, designers, product teams, and stakeholders throughout the development lifecycle."
    ],
    technologies: ["Next.js", "React", "Python", "TypeScript", "Tailwind CSS", "Microfrontends", "REST APIs", "AI Agents", "MCP", "Google Cloud Platform", "Microservices"],
  },
  {
    year: "2024 — 2025",
    company: "Ryven.co",
    role: "Frontend Developer",
    location: "Remote / Dhaka",
    description:
      "Worked in a B2C-focused software development environment, contributing to customer-facing web applications, digital products, and interactive user experiences designed to improve engagement and conversion. Developed modern, responsive interfaces and client dashboards while translating UI/UX designs and business requirements into scalable frontend solutions. Focused on building reusable component systems, improving visual consistency, and delivering polished web experiences with modern interaction and motion design.",

    responsibilities: [
      "Develop responsive and high-conversion web applications using React, Next.js, and TypeScript.",
      "Build reusable UI components, layouts, and frontend systems for scalable product development.",
      "Translate Figma designs, UI/UX requirements, and business goals into production-ready interfaces.",
      "Develop customer-facing applications and client dashboards with a strong focus on usability and conversion.",
      "Implement GSAP-based animations, micro-interactions, and motion design to create engaging user experiences.",
      "Lead frontend UI modernization and Swiss-style design overhauls across existing web applications.",
      "Ensure responsive behavior, cross-browser compatibility, accessibility, and consistent visual implementation.",
      "Optimize frontend performance, rendering, component structure, and overall user experience.",
      "Collaborate with designers, developers, and stakeholders to refine requirements and deliver frontend features.",
      "Maintain and improve existing applications through debugging, refactoring, and continuous UI/UX enhancements."
    ],
    technologies: ["React", "Next.js", "TypeScript", "UI/UX Systems", "Motion Design", "Figma"],
  },
  {
    year: "2024",
    company: "Bdcalling",
    role: "Web Developer",
    location: "Dhaka, Bangladesh", description:
      "Worked in a web development and educational environment, delivering frontend development training and mentoring students in core web technologies and modern frontend practices. Alongside teaching and mentorship, contributed to B2C client projects by developing responsive web applications and digital solutions based on business and user requirements. Also contributed to EmptyBD, a social media and digital marketplace platform combining community engagement, content sharing, real-time communication, and marketplace functionality.",

    responsibilities: [
      "Deliver frontend development classes covering modern web development concepts, tools, and practical implementation.",
      "Mentor students through hands-on projects, debugging, code review, and frontend development best practices.",
      "Develop responsive and user-focused web applications for B2C clients based on project requirements.",
      "Build reusable React and Next.js components and maintain scalable frontend structures.",
      "Contribute to EmptyBD, a social media and digital marketplace platform with real-time and community-driven features.",
      "Implement real-time messaging and social interactions using Socket.io and Zustand.",
      "Develop Web Push notification functionality for real-time user engagement and updates.",
      "Contribute to digital wallet features including deposits, withdrawals, and subscription management.",
      "Integrate frontend applications with backend APIs and manage application data and state.",
      "Collaborate with designers and developers to translate requirements and UI/UX designs into production-ready features.",
      "Debug, maintain, and improve existing applications while ensuring usability, responsiveness, and code quality."
    ],
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
    responsibilities: [],
    technologies: ["Instructional Mastery", "Discipline & Memory", "Information Systems", "Systematic Review"],
  },
  {
    year: "2022 — 2023",
    company: "Tahfijul Ummah Hifj Madrasha",
    role: "Quranic Studies & Academic Coordination",
    location: "Dhaka, Bangladesh",
    description: "Deep memorization mastery, phonetics precision, strict discipline, instructional guidance, and student accountability tracking with high focus.",
    responsibilities: [],
    technologies: ["Attention to Detail", "High Discipline", "Vocal & Mnemonic Systems", "Patience & Grit"],
  },
];

export const SKILL_TRACK_1 = [
  "FRONTEND",
  "BACKEND",
  "SAAS",
  "ERP & HRM",
  "API",
  "AI-ASSISTED",
  "AI AGENTS & AUTOMATION",
  "SOFTWARE QA",
  "CODE AUDITING",
  "UI/UX",
];

export const SKILL_TRACK_2 = [
  "FRONTEND",
  "BACKEND",
  "SAAS",
  "ERP & HRM",
  "API",
  "AI-ASSISTED",
  "AI AGENTS & AUTOMATION",
  "SOFTWARE QA",
  "CODE AUDITING",
  "UI/UX",
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
