# PERSONAL PORTFOLIO — MASTER DEVELOPMENT INSTRUCTION

You are an expert frontend engineer, creative developer, UI/UX designer, and GSAP animation specialist.

Build a complete, production-quality personal portfolio website for me from scratch.

The portfolio must feel like a **high-end creative developer portfolio**, not a normal template portfolio.

The entire experience should be built around:

* GSAP
* ScrollTrigger
* Smooth scrolling
* Typography
* Motion
* Micro-interactions
* Black & white visual language
* Strong visual hierarchy
* Interactive project presentation
* Cinematic section transitions

The website should feel premium, minimal, technical, modern, and memorable.

---

# 1. TECH STACK

Use:

* Next.js
* TypeScript
* App Router
* Tailwind CSS
* GSAP
* GSAP ScrollTrigger
* Lenis for smooth scrolling
* Lucide React for icons where necessary

Do NOT use unnecessary animation libraries if GSAP can handle the animation.

GSAP should be the primary animation engine.

Use reusable React components.

Use proper TypeScript types.

Keep the code clean and maintainable.

---

# 2. CORE DESIGN DIRECTION

The entire website must use a strict:

BLACK + WHITE + GRAYSCALE

visual system.

Primary:

* #000000
* #FFFFFF

Secondary:

* dark gray
* medium gray
* light gray

Do NOT introduce colorful gradients.

Do NOT use blue, purple, green, orange, red, etc.

The website should look good even if all colors are converted to grayscale.

---

# 3. VISUAL STYLE

The visual direction should combine:

* Swiss typography
* Brutalist web design
* Editorial design
* Modern creative developer portfolio
* Minimalism
* Cinematic motion
* Technical interface
* High contrast typography
* Large typography
* Massive whitespace
* Thin borders
* Sharp layouts
* Subtle noise/grain
* Asymmetric compositions

Avoid:

* Generic SaaS design
* Typical developer portfolio cards
* Excessive rounded cards
* Excessive shadows
* Colorful gradients
* Generic hero sections
* Template-like layouts
* Overuse of glassmorphism

Use:

* Huge typography
* Horizontal lines
* Grid systems
* Full-width sections
* Oversized numbers
* Sticky elements
* Text reveals
* Image clipping
* Mask animations
* Horizontal scrolling sections
* Pinning
* Parallax
* Magnetic interactions

---

# 4. SITE STRUCTURE

Create the portfolio with these sections:

1. Custom Cursor
2. Loading Screen
3. Navigation
4. Hero
5. Introduction
6. About Me
7. Skills / Expertise
8. Experience
9. Selected Projects
10. Project Showcase
11. Development Philosophy
12. Services
13. Tech Stack
14. Creative/AI Section
15. Contact
16. Footer

Every major section must have its own GSAP animation.

---

# 5. LOADING SCREEN

Create a cinematic loading screen.

When the website initially loads:

Show:

MUBIN

or

YASIN ARAFAT MUBIN

with a percentage counter:

00
01
02
03
...
100

Animate the percentage using GSAP.

The loading screen should:

1. Start completely black.
2. Show the developer name.
3. Animate percentage.
4. Reveal a thin progress line.
5. At 100%, transition into the website.
6. Use a large curtain/mask animation to reveal the Hero section.

The loading screen should not feel like a normal spinner.

It should feel like the beginning of an interactive experience.

Use GSAP timelines.

---

# 6. CUSTOM CURSOR

Create a custom cursor for desktop.

Cursor should have:

* Small center dot
* Larger circular follower
* Smooth interpolation
* GSAP movement

Different hover states:

NORMAL
→ small circle

LINK
→ circle expands

PROJECT
→ circle expands and displays:

VIEW

IMAGE
or

EXPLORE

TEXT

BUTTON
→ cursor changes scale

Do not break usability on mobile.

Disable custom cursor on touch devices.

---

# 7. NAVIGATION

Create a minimal fixed navigation.

Desktop:

LEFT:
MUBIN

CENTER:
Available for work

RIGHT:
Menu

The navigation should initially be minimal.

When scrolling:

Use GSAP to:

* change background subtly
* reduce height
* animate logo
* hide/show based on scroll direction

Menu should open as a fullscreen overlay.

Menu items:

HOME
ABOUT
WORK
EXPERIENCE
CONTACT

Each menu item should have a large typography animation.

On menu opening:

* background expands
* menu items stagger in
* line animations
* number indicators

Example:

01 — HOME
02 — ABOUT
03 — WORK
04 — EXPERIENCE
05 — CONTACT

Use GSAP timeline.

---

# 8. HERO SECTION

The Hero must be the strongest section of the website.

Use very large typography.

Example:

I BUILD

DIGITAL

EXPERIENCES.

or

FRONTEND

ENGINEER

CREATIVE

DEVELOPER

Do not simply place text on the center.

Create an editorial composition.

Possible layout:

Top:

FULL STACK DEVELOPER

Center:

I BUILD
DIGITAL
EXPERIENCES

Bottom:

BASED IN DHAKA, BANGLADESH
AVAILABLE FOR WORK

Add a large scrolling text:

FRONTEND • REACT • NEXT.JS • GSAP • AI

Animate this horizontally with GSAP.

---

# 9. HERO GSAP ANIMATIONS

On page load:

1. Navigation enters.
2. Small metadata fades in.
3. Main heading splits into words/characters.
4. Text moves upward from hidden position.
5. Large typography reveals using clip-path.
6. Bottom metadata appears.
7. Horizontal marquee starts moving.
8. Mouse movement creates subtle parallax.

Use GSAP timelines.

The animation should feel smooth and intentional.

Do not animate everything simultaneously.

Use proper stagger.

---

# 10. INTRODUCTION SECTION

Create a large statement:

"I design and build interfaces where
engineering meets interaction."

The sentence should be displayed very large.

As the user scrolls:

* words reveal gradually
* opacity changes
* text moves slightly
* selected words become highlighted

Use ScrollTrigger.

Pin the section if appropriate.

---

# 11. ABOUT ME

Create an editorial About section.

Left:

ABOUT ME

01

Right:

A detailed introduction.

Example content:

I am MD. Yasin Arafat Mubin, a frontend-focused full-stack developer who enjoys building modern web applications, interactive interfaces and scalable digital experiences.

My primary focus is React, Next.js, TypeScript, JavaScript, Tailwind CSS and modern frontend architecture.

I also work with backend technologies, APIs, databases and AI-powered development workflows.

Do not make the text too long.

Use typography and spacing instead of cards.

Add:

LOCATION
DHAKA, BANGLADESH

ROLE
FRONTEND / FULL STACK DEVELOPER

FOCUS
REACT / NEXT.JS / TYPESCRIPT / AI

---

# 12. ABOUT SECTION ANIMATION

When About enters viewport:

* Section title slides from left.
* Number rotates/fades in.
* Paragraph reveals line by line.
* Metadata appears with stagger.
* Thin borders draw themselves using GSAP.

Use:

gsap.from()
gsap.to()
ScrollTrigger
drawSVG-like effect using scaleX where appropriate.

---

# 13. SKILLS / EXPERTISE

Do NOT create boring skill cards.

Create an interactive typography-based skill section.

Large words:

REACT
NEXT.JS
TYPESCRIPT
JAVASCRIPT
GSAP
TAILWIND
NODE.JS
MONGODB
PYTHON
AI

Each skill should have a hover interaction.

When hovering:

* typography expands
* surrounding text moves
* subtle background inversion can happen
* cursor changes
* GSAP animation triggers

Example:

REACT

01

NEXT.JS

02

TYPESCRIPT

03

GSAP

04

---

# 14. SKILLS SCROLL ANIMATION

Create a vertical section where the skills move differently from normal scrolling.

Possible effect:

As the user scrolls:

REACT
moves left

NEXT.JS
moves right

TYPESCRIPT
moves left

GSAP
moves right

Use ScrollTrigger scrub.

The movement should be subtle and smooth.

---

# 15. EXPERIENCE SECTION

Create a timeline.

Experience items:

2025 — PRESENT
Betopia Limited
Junior Frontend Developer

2024 — 2025
Ryven.co
Frontend Developer

2023 — 2024
Rowjatul Quran Hifj Madrasha

2022 — 2023
Tahfijul Ummah Hifj Madrasha

Design the experience section as an editorial timeline rather than cards.

Each experience:

YEAR

COMPANY

ROLE

DESCRIPTION

TECHNOLOGIES

---

# 16. EXPERIENCE ANIMATION

As the user scrolls:

* Timeline line grows vertically.
* Year appears.
* Company slides in.
* Description reveals.
* Technology tags appear sequentially.

Use ScrollTrigger scrub.

The timeline line should animate according to scroll progress.

---

# 17. PROJECT SECTION

This should be one of the biggest parts of the website.

Title:

SELECTED
WORK

Then create large project presentations.

Projects can include:

01 — VALRPRO
Veteran-focused digital platform

02 — BRIGHT CAR WASH
Car wash management ecosystem

03 — EMPTYBD
Digital marketplace and social platform

04 — EMPOWER QUBIT
Education / learning platform

05 — AI / AGENTIC PROJECTS
AI-powered development and automation work

Use real project information when available.

Do NOT invent fake project details.

---

# 18. PROJECT PRESENTATION

Do NOT create standard cards.

Each project should occupy a large viewport area.

Example:

---

01

VALRPRO

Veteran Digital Platform

REACT
NEXT.JS
TYPESCRIPT
API

[ LARGE PROJECT IMAGE ]

## VIEW PROJECT →

When scrolling:

* Project image scales
* Text moves
* Number changes
* Image gets clipped/revealed
* Background transitions subtly
* Next project enters

Use ScrollTrigger.

---

# 19. PROJECT IMAGE ANIMATION

Project images should have:

* clip-path reveal
* scale animation
* parallax
* slight rotation
* grayscale treatment

On hover:

Image becomes slightly brighter.

Cursor changes to:

VIEW PROJECT

Use GSAP.

---

# 20. HORIZONTAL PROJECT SECTION

Create at least one horizontal scrolling project section.

The user scrolls vertically.

But projects move horizontally.

Example:

PROJECT 01 → PROJECT 02 → PROJECT 03 → PROJECT 04

Use:

ScrollTrigger
pin
scrub

The section should occupy several viewport heights.

This should be one of the portfolio's signature interactions.

---

# 21. DEVELOPMENT PHILOSOPHY

Create a section titled:

HOW I BUILD

Display several statements:

01
Understand the problem.

02
Design the experience.

03
Build the system.

04
Test the details.

05
Ship and improve.

As user scrolls:

Each statement should appear sequentially.

Use large typography.

Pin the section if appropriate.

---

# 22. SERVICES

Create a minimal service section.

Services:

FRONTEND DEVELOPMENT

REACT / NEXT.JS DEVELOPMENT

FULL STACK DEVELOPMENT

INTERACTIVE WEB EXPERIENCES

API INTEGRATION

AI-POWERED WEB APPLICATIONS

Each item should animate on hover.

Hover effect:

* text moves
* number changes
* underline grows
* cursor changes

No cards.

---

# 23. AI / CREATIVE DEVELOPMENT SECTION

Create a special section about modern AI-assisted development.

Title:

BUILDING WITH
AI

Content:

AI INTEGRATION

AGENTIC WORKFLOWS

MCP

AI-POWERED FEATURES

DEVELOPMENT AUTOMATION

CODE AUDITING

The visual style should feel technical.

Create a subtle animated grid/background.

Use GSAP to animate:

* grid movement
* text
* small status indicators
* lines
* numbers

Keep it monochrome.

---

# 24. TECH STACK SECTION

Create a continuously moving marquee.

Example:

HTML
CSS
JAVASCRIPT
TYPESCRIPT
REACT
NEXT.JS
TAILWIND
GSAP
NODE.JS
EXPRESS
MONGODB
PYTHON
DJANGO
GIT
AI

Use infinite GSAP horizontal animation.

The marquee should pause or change speed on hover.

---

# 25. CONTACT SECTION

This should feel like the final climax of the website.

Large typography:

LET'S

BUILD

SOMETHING

TOGETHER.

Below:

EMAIL
[mubinulislam14@gmail.com](mailto:mubinulislam14@gmail.com)

LINKEDIN

GITHUB

LOCATION
DHAKA, BANGLADESH

Add:

GET IN TOUCH →

Make the email interactive.

On hover:

Text expands
Underline grows
Cursor changes

---

# 26. CONTACT ANIMATION

When Contact enters:

* Huge heading reveals from bottom.
* Letters stagger.
* Email slides from side.
* Social links appear one by one.
* Footer line draws across screen.

Use GSAP timeline + ScrollTrigger.

---

# 27. FOOTER

Minimal footer.

Left:

© 2026 MUBIN

Center:

BUILT WITH
NEXT.JS + GSAP

Right:

BACK TO TOP ↑

Back to top must use smooth scrolling.

When clicked:

Scroll to top using Lenis.

---

# 28. GLOBAL SCROLL EXPERIENCE

Use Lenis for smooth scrolling.

GSAP ScrollTrigger must be synchronized with Lenis.

The scrolling experience must feel:

* smooth
* responsive
* cinematic
* premium

Avoid excessive lag.

Make sure ScrollTrigger.refresh() works correctly.

---

# 29. GSAP REQUIREMENT

IMPORTANT:

GSAP must be used throughout the website.

Every major section must contain meaningful GSAP animation.

Use:

* gsap.timeline()
* gsap.from()
* gsap.to()
* gsap.set()
* ScrollTrigger
* scrub
* pin
* stagger
* clipPath
* scale
* xPercent
* yPercent
* rotation
* opacity

Do NOT add animations just for the sake of animation.

Every animation should improve the visual experience.

---

# 30. SCROLL ANIMATION MAP

Implement at least these:

Hero
→ entrance timeline

Introduction
→ text reveal

About
→ line + text reveal

Skills
→ horizontal movement

Experience
→ timeline progress

Projects
→ image reveal + parallax

Project Showcase
→ horizontal scroll

Philosophy
→ pinned text sequence

Services
→ hover animation

AI section
→ technical motion

Tech stack
→ marquee

Contact
→ cinematic reveal

Footer
→ final transition

---

# 31. RESPONSIVE DESIGN

Desktop:

1920px
1440px
1280px

Tablet:

1024px
768px

Mobile:

430px
390px
375px

The website must be fully responsive.

Do not simply shrink desktop.

Mobile needs its own layout decisions.

---

# 32. MOBILE GSAP

On mobile:

Reduce heavy animations.

Disable:

* custom cursor
* excessive parallax
* unnecessary 3D effects
* extremely heavy pinned sections

Keep:

* text reveal
* fade
* slide
* scale
* simple ScrollTrigger animations

The website must remain smooth on mobile.

---

# 33. PERFORMANCE

Very important.

Do not sacrifice performance for animation.

Use:

* lazy-loaded images
* next/image
* optimized assets
* transform-based animation
* opacity
* will-change only where necessary
* cleanup GSAP contexts
* proper React useGSAP/useEffect cleanup

Avoid animating:

width
height
top
left

when transform can be used.

Prefer:

transform
opacity

---

# 34. ACCESSIBILITY

Implement:

* semantic HTML
* keyboard navigation
* visible focus states
* proper headings
* alt text
* accessible links
* reduced-motion support

Respect:

prefers-reduced-motion

If reduced motion is enabled:

Disable heavy GSAP animations and use simple transitions.

---

# 35. COMPONENT ARCHITECTURE

Create reusable components.

Suggested structure:

components/

Navigation.tsx
Loader.tsx
CustomCursor.tsx
Hero.tsx
Intro.tsx
About.tsx
Skills.tsx
Experience.tsx
Projects.tsx
ProjectShowcase.tsx
Philosophy.tsx
Services.tsx
AISection.tsx
TechStack.tsx
Contact.tsx
Footer.tsx

lib/

gsap.ts
lenis.ts

data/

projects.ts
experience.ts
skills.ts

Do not put the entire website into one component.

---

# 36. DATA-DRIVEN PROJECTS

Projects should come from data.

Example:

const projects = [
{
number: "01",
title: "VALRPRO",
description: "...",
technologies: [...],
image: "...",
link: "..."
}
]

This makes it easy to add/remove projects later.

---

# 37. IMAGE HANDLING

Use high-quality project screenshots.

Every image should:

* maintain aspect ratio
* be optimized
* support lazy loading
* have alt text

Images should generally appear grayscale.

Use CSS:

filter: grayscale(100%);

On hover:

transition toward slightly brighter/high-contrast appearance.

Do not introduce colors.

---

# 38. TYPOGRAPHY

Use a modern sans-serif font.

Possible:

Inter
Manrope
Space Grotesk

Use one primary font family.

Typography hierarchy should be extreme.

Example:

Small text:

12px

Body:

16–20px

Section title:

80–160px

Hero:

120–220px depending on viewport

Use clamp() for responsive typography.

Example:

font-size: clamp(...)

---

# 39. MICRO INTERACTIONS

Add subtle interactions:

* magnetic buttons
* underline animation
* cursor interaction
* image scale
* text movement
* menu transitions
* hover inversion
* number transitions
* arrow movement

Do not overdo them.

---

# 40. PAGE TRANSITION

If appropriate, create a subtle page-entry animation.

On refresh:

Black screen

→ typography

→ line

→ reveal

→ website

The transition should be fast enough that it doesn't annoy users.

---

# 41. BACKGROUND

Use mostly solid black and white.

Optionally add extremely subtle:

* noise texture
* grain
* grid

Do not use distracting backgrounds.

The background should support the content.

---

# 42. NO GENERIC TEMPLATE FEEL

This is extremely important.

The final website should NOT look like:

"Developer Portfolio Template #57"

It should feel like a custom-designed creative developer portfolio.

Use unusual compositions.

Use strong typography.

Use motion.

Use whitespace.

Use editorial layouts.

---

# 43. CODE QUALITY

Use:

* TypeScript
* reusable components
* clear naming
* no unnecessary duplication
* no console.log
* no unused imports
* no dead code
* no unnecessary dependencies

Before finishing:

Run:

pnpm lint

and

pnpm build

Fix all errors.

---

# 44. GSAP CLEANUP

Make sure GSAP animations are properly cleaned up when components unmount.

Do not create duplicate ScrollTriggers during development/hot reload.

Use gsap.context() or @gsap/react useGSAP where appropriate.

Kill/revert animations correctly.

---

# 45. FINAL QA

Before considering the website complete, test:

Desktop
✓ Chrome
✓ Edge

Mobile
✓ Chrome Android
✓ Safari iOS

Test:

✓ Navigation
✓ Menu
✓ Scroll
✓ GSAP animations
✓ Project links
✓ Email
✓ LinkedIn
✓ GitHub
✓ Back to top
✓ Mobile menu
✓ Responsive typography
✓ Reduced motion
✓ Page refresh
✓ Production build

---

# 46. FINAL EXPERIENCE TARGET

The final experience should feel like:

"Someone who understands frontend engineering AND creative interaction design built this."

It should communicate:

Frontend expertise
+
Full-stack understanding
+
Modern web development
+
AI awareness
+
Strong UI/UX
+
GSAP animation expertise

without making the website look like a resume.

The portfolio itself should demonstrate the developer's skills.

The animation is part of the portfolio.

The interaction is part of the portfolio.

The website itself should be the strongest project.

---

# 47. DEVELOPMENT PROCESS

Do NOT try to build everything blindly in one pass.

Build in phases.

PHASE 1
Create project structure and install dependencies.

PHASE 2
Create global styles, typography and black/white design system.

PHASE 3
Create Lenis + GSAP infrastructure.

PHASE 4
Build Loader + Navigation + Hero.

PHASE 5
Build About + Skills + Experience.

PHASE 6
Build Projects + horizontal project showcase.

PHASE 7
Build Philosophy + Services + AI section.

PHASE 8
Build Contact + Footer.

PHASE 9
Add and refine all GSAP animations.

PHASE 10
Responsive optimization.

PHASE 11
Performance optimization.

PHASE 12
Accessibility + reduced motion.

PHASE 13
Final QA.

PHASE 14
Production build.

---

# 48. IMPORTANT WORKING RULE

Do not stop after creating a visually acceptable static website.

The website must have:

REAL GSAP ANIMATIONS
REAL SCROLLTRIGGER INTERACTIONS
REAL RESPONSIVE BEHAVIOR
REAL MICRO-INTERACTIONS
REAL PROJECT PRESENTATION
REAL PERFORMANCE OPTIMIZATION

If an animation can be implemented properly with GSAP, use GSAP.

---

# 49. FINAL INSTRUCTION

Start by inspecting the existing project structure.

If this is a new project, initialize the required Next.js project.

Then implement the portfolio phase by phase.

After each major phase:

1. Check TypeScript errors.
2. Check layout.
3. Check responsiveness.
4. Check GSAP cleanup.
5. Check browser console.
6. Continue to the next phase.

Do not leave TODO placeholders.

Do not use fake functionality.

Do not create fake project information.

Use the provided personal/project information where available.

The final result must be a complete, production-ready, black-and-white creative developer portfolio powered heavily by GSAP.
