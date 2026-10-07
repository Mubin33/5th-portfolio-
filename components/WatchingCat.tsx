"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface TechItem {
  name: string;
  slug: string;
  category: "Languages" | "Frontend" | "Backend" | "AI" | "Tools/Infra";
}

const STACK_LIST: TechItem[] = [
  // Languages
  { name: "HTML5", slug: "html5", category: "Languages" },
  { name: "CSS3", slug: "css3", category: "Languages" },
  { name: "JavaScript", slug: "javascript", category: "Languages" },
  { name: "TypeScript", slug: "typescript", category: "Languages" },
  { name: "Python", slug: "python", category: "Languages" },
  // Frontend
  { name: "React", slug: "react", category: "Frontend" },
  { name: "Next.js", slug: "nextdotjs", category: "Frontend" },
  { name: "Tailwind CSS", slug: "tailwindcss", category: "Frontend" },
  { name: "GSAP", slug: "greensock", category: "Frontend" },
  { name: "Lenis", slug: "lenis", category: "Frontend" },
  { name: "Zustand", slug: "zustand", category: "Frontend" },
  // Backend
  { name: "Node.js", slug: "nodedotjs", category: "Backend" },
  { name: "Express", slug: "express", category: "Backend" },
  { name: "MongoDB", slug: "mongodb", category: "Backend" },
  { name: "Django", slug: "django", category: "Backend" },
  { name: "Socket.io", slug: "socketdotio", category: "Backend" },
  { name: "REST API", slug: "restapi", category: "Backend" },
  // AI
  { name: "MCP", slug: "mcp", category: "AI" },
  { name: "Vapi", slug: "vapi", category: "AI" },
  // Tools/Infra
  { name: "Git", slug: "git", category: "Tools/Infra" },
  { name: "GitHub", slug: "github", category: "Tools/Infra" },
  { name: "Vercel", slug: "vercel", category: "Tools/Infra" },
  { name: "Figma", slug: "figma", category: "Tools/Infra" },
  { name: "Google Cloud", slug: "googlecloud", category: "Tools/Infra" },
  { name: "Stripe", slug: "stripe", category: "Tools/Infra" },
];

const POOL_SIZE = 12;

export default function WatchingCat() {
  const sectionRef = useRef<HTMLElement>(null);
  const catSvgRef = useRef<SVGSVGElement>(null);
  const leftEyeWhiteRef = useRef<SVGEllipseElement>(null);
  const rightEyeWhiteRef = useRef<SVGEllipseElement>(null);
  const pupilLeftRef = useRef<SVGGElement>(null);
  const pupilRightRef = useRef<SVGGElement>(null);
  const slitLeftRef = useRef<SVGEllipseElement>(null);
  const slitRightRef = useRef<SVGEllipseElement>(null);
  const eyelidLeftRef = useRef<SVGRectElement>(null);
  const eyelidRightRef = useRef<SVGRectElement>(null);
  const earLeftRef = useRef<SVGGElement>(null);
  const earRightRef = useRef<SVGGElement>(null);
  const tailRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pool references for interactive Tech Stack Trail
  const poolCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const poolImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const poolTextRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [hintText, setHintText] = useState("I'M WATCHING YOUR CURSOR.");
  const [popupText, setPopupText] = useState("MEOW");
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleLookTimerRef = useRef<NodeJS.Timeout | null>(null);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const earTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLookingAroundRef = useRef<boolean>(false);
  const isTouchDeviceRef = useRef<boolean>(false);

  useEffect(() => {
    // Preload meow audio asset
    try {
      const audio = new Audio("/meow.wav");
      audio.preload = "auto";
      audio.volume = 0.9;
      audioRef.current = audio;
    } catch {
      // Audio preloading fallback
    }

    if (!sectionRef.current || !catSvgRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      isTouchDeviceRef.current = true;
      setHintText("I'M WATCHING YOUR TOUCH. TAP ON ME.");
    }

    const ctx = gsap.context(() => {
      // 1. Tail sway (pivot = tail base, in SVG coordinates)
      let tailTween: gsap.core.Tween | null = null;
      if (!prefersReducedMotion && tailRef.current) {
        gsap.set(tailRef.current, { svgOrigin: "445 630", rotation: -5 });
        tailTween = gsap.to(tailRef.current, {
          rotation: 7,
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // 2. Breathing (pivot = ground line)
      let bodyTween: gsap.core.Tween | null = null;
      if (!prefersReducedMotion && bodyRef.current) {
        gsap.set(bodyRef.current, { svgOrigin: "300 650" });
        bodyTween = gsap.to(bodyRef.current, {
          scaleY: 1.015,
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // 3. Eye quickTo controllers
      let qLeftX: ((v: number) => void) | null = null;
      let qLeftY: ((v: number) => void) | null = null;
      let qRightX: ((v: number) => void) | null = null;
      let qRightY: ((v: number) => void) | null = null;

      if (pupilLeftRef.current && pupilRightRef.current) {
        const d = prefersReducedMotion ? 0 : 0.25;
        qLeftX = gsap.quickTo(pupilLeftRef.current, "x", { duration: d, ease: "power3.out" });
        qLeftY = gsap.quickTo(pupilLeftRef.current, "y", { duration: d, ease: "power3.out" });
        qRightX = gsap.quickTo(pupilRightRef.current, "x", { duration: d, ease: "power3.out" });
        qRightY = gsap.quickTo(pupilRightRef.current, "y", { duration: d, ease: "power3.out" });
      }

      let leftCenter = { x: 0, y: 0 };
      let rightCenter = { x: 0, y: 0 };

      // Tech Stack Trail state
      let lastTrailX = -9999;
      let lastTrailY = -9999;
      let poolIndex = 0;
      let techIndex = 0;
      let zIndexCounter = 20;

      const updateEyeCenters = () => {
        if (leftEyeWhiteRef.current) {
          const rL = leftEyeWhiteRef.current.getBoundingClientRect();
          leftCenter = { x: rL.left + rL.width / 2, y: rL.top + rL.height / 2 };
        }
        if (rightEyeWhiteRef.current) {
          const rR = rightEyeWhiteRef.current.getBoundingClientRect();
          rightCenter = { x: rR.left + rR.width / 2, y: rR.top + rR.height / 2 };
        }
      };

      updateEyeCenters();
      window.addEventListener("resize", updateEyeCenters);
      window.addEventListener("scroll", updateEyeCenters, { passive: true });

      // 4. Blinking
      const triggerBlink = () => {
        if (!eyelidLeftRef.current || !eyelidRightRef.current || prefersReducedMotion) return;

        const isDouble = Math.random() < 0.32;
        const tl = gsap.timeline();

        tl.to([eyelidLeftRef.current, eyelidRightRef.current], {
          scaleY: 1,
          duration: 0.08,
          ease: "power2.in",
        }).to([eyelidLeftRef.current, eyelidRightRef.current], {
          scaleY: 0,
          duration: 0.12,
          ease: "power2.out",
        });

        if (isDouble) {
          tl.to({}, { duration: 0.1 })
            .to([eyelidLeftRef.current, eyelidRightRef.current], {
              scaleY: 1,
              duration: 0.07,
              ease: "power2.in",
            })
            .to([eyelidLeftRef.current, eyelidRightRef.current], {
              scaleY: 0,
              duration: 0.12,
              ease: "power2.out",
            });
        }

        blinkTimeoutRef.current = setTimeout(triggerBlink, 2000 + Math.random() * 4000);
      };

      // 5. Ear twitch (pivot = ear base, in SVG coordinates)
      const triggerEarTwitch = () => {
        if (!earLeftRef.current || !earRightRef.current || prefersReducedMotion) return;

        const isLeft = Math.random() < 0.5;
        const targetEar = isLeft ? earLeftRef.current : earRightRef.current;
        const origin = isLeft ? "228 210" : "372 210";
        const angle = isLeft ? -7 : 7;

        gsap.to(targetEar, {
          rotation: angle,
          svgOrigin: origin,
          duration: 0.06,
          yoyo: true,
          repeat: 3,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.set(targetEar, { rotation: 0, svgOrigin: origin });
          },
        });

        earTimeoutRef.current = setTimeout(triggerEarTwitch, 3500 + Math.random() * 4500);
      };

      // 6. Idle looking around
      let idleLookTimeline: gsap.core.Timeline | null = null;
      const startIdleLooking = () => {
        if (prefersReducedMotion || !pupilLeftRef.current || !pupilRightRef.current) return;
        isLookingAroundRef.current = true;

        idleLookTimeline = gsap.timeline({
          repeat: -1,
          repeatDelay: 1.8,
          onComplete: () => {
            isLookingAroundRef.current = false;
          },
        });

        idleLookTimeline
          .to([pupilLeftRef.current, pupilRightRef.current], {
            x: -12,
            y: -2,
            scaleX: 0.9,
            duration: 0.5,
            ease: "power2.out",
          })
          .to({}, { duration: 0.8 })
          .to([pupilLeftRef.current, pupilRightRef.current], {
            x: 13,
            y: -6,
            scaleX: 0.92,
            duration: 0.6,
            ease: "power2.out",
          })
          .to({}, { duration: 0.7 })
          .to([pupilLeftRef.current, pupilRightRef.current], {
            x: 0,
            y: 0,
            scaleX: 1,
            duration: 0.5,
            ease: "power2.out",
          });
      };

      const stopIdleLooking = () => {
        if (idleLookTimeline) {
          idleLookTimeline.kill();
          idleLookTimeline = null;
        }
        isLookingAroundRef.current = false;
      };

      const returnEyesToCenter = () => {
        if (!pupilLeftRef.current || !pupilRightRef.current) return;
        gsap.to([pupilLeftRef.current, pupilRightRef.current], {
          x: 0,
          y: 0,
          scaleX: 1,
          duration: 0.6,
          ease: "power2.out",
        });
        if (slitLeftRef.current && slitRightRef.current) {
          gsap.to([slitLeftRef.current, slitRightRef.current], {
            scaleX: 1,
            scaleY: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      };

      const scheduleIdleLooking = () => {
        if (idleLookTimerRef.current) clearTimeout(idleLookTimerRef.current);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

        idleLookTimerRef.current = setTimeout(() => {
          startIdleLooking();
        }, 2000);

        idleTimerRef.current = setTimeout(() => {
          setHintText(
            isTouchDeviceRef.current ? "TAP TO WAKE ME UP." : "PSST. MOVE YOUR MOUSE."
          );
        }, 5000);
      };

      blinkTimeoutRef.current = setTimeout(triggerBlink, 2200);
      earTimeoutRef.current = setTimeout(triggerEarTwitch, 3500);
      scheduleIdleLooking();

      // 7. Pointer tracking
      const handlePointerMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") {
          isTouchDeviceRef.current = true;
        }

        stopIdleLooking();
        scheduleIdleLooking();

        setHintText(
          isTouchDeviceRef.current ? "I'M WATCHING YOUR TOUCH." : "I'M WATCHING YOUR CURSOR."
        );

        setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });

        const curX = e.clientX;
        const curY = e.clientY;

        if (leftCenter.x === 0 || rightCenter.x === 0) {
          updateEyeCenters();
        }

        const dxL = curX - leftCenter.x;
        const dyL = curY - leftCenter.y;
        const angleL = Math.atan2(dyL, dxL);
        const distL = Math.hypot(dxL, dyL);
        const maxRadiusL = 18;
        const factorL = Math.min(distL * 0.08, 1);
        const targetLX = Math.cos(angleL) * maxRadiusL * factorL;
        const targetLY = Math.sin(angleL) * (maxRadiusL * 0.7) * factorL;

        const dxR = curX - rightCenter.x;
        const dyR = curY - rightCenter.y;
        const angleR = Math.atan2(dyR, dxR);
        const distR = Math.hypot(dxR, dyR);
        const maxRadiusR = 18;
        const factorR = Math.min(distR * 0.08, 1);
        const targetRX = Math.cos(angleR) * maxRadiusR * factorR;
        const targetRY = Math.sin(angleR) * (maxRadiusR * 0.7) * factorR;

        const squashL = Math.max(0.84, 1 - (Math.abs(targetLX) / maxRadiusL) * 0.16);
        const squashR = Math.max(0.84, 1 - (Math.abs(targetRX) / maxRadiusR) * 0.16);

        const faceCenterX = (leftCenter.x + rightCenter.x) / 2;
        const faceCenterY = (leftCenter.y + rightCenter.y) / 2;
        const distToFace = Math.hypot(curX - faceCenterX, curY - faceCenterY);
        const isClose = distToFace < 135;

        if (qLeftX) qLeftX(targetLX);
        if (qLeftY) qLeftY(targetLY);
        if (qRightX) qRightX(targetRX);
        if (qRightY) qRightY(targetRY);

        if (!prefersReducedMotion) {
          if (pupilLeftRef.current) {
            gsap.to(pupilLeftRef.current, { scaleX: squashL, duration: 0.2, overwrite: "auto" });
          }
          if (pupilRightRef.current) {
            gsap.to(pupilRightRef.current, { scaleX: squashR, duration: 0.2, overwrite: "auto" });
          }

          if (slitLeftRef.current && slitRightRef.current) {
            gsap.to([slitLeftRef.current, slitRightRef.current], {
              scaleX: isClose ? 2.2 : 1,
              scaleY: isClose ? 1.25 : 1,
              duration: 0.2,
              overwrite: "auto",
              transformOrigin: "center center",
            });
          }
        }

        // Spawn Tech Stack Trail Cards over the cat section
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          if (
            curX >= rect.left &&
            curX <= rect.right &&
            curY >= rect.top &&
            curY <= rect.bottom
          ) {
            const relX = curX - rect.left;
            const relY = curY - rect.top;

            const dxTrail = relX - lastTrailX;
            const dyTrail = relY - lastTrailY;
            const distance = Math.hypot(dxTrail, dyTrail);

            // Distance threshold (~65px between cards for smooth trail flow)
            if (distance >= 65) {
              lastTrailX = relX;
              lastTrailY = relY;

              const cardEl = poolCardRefs.current[poolIndex];
              const imgEl = poolImgRefs.current[poolIndex];
              const textEl = poolTextRefs.current[poolIndex];

              if (cardEl && imgEl && textEl) {
                const currentTech = STACK_LIST[techIndex];

                imgEl.src = `/stack/${currentTech.slug}.svg`;
                imgEl.alt = `${currentTech.name} logo`;
                textEl.textContent = currentTech.name;

                poolIndex = (poolIndex + 1) % POOL_SIZE;
                techIndex = (techIndex + 1) % STACK_LIST.length;

                const zIndex = ++zIndexCounter;
                const randomRotation = gsap.utils.random(-8, 8);

                gsap.killTweensOf(cardEl);

                const cardTl = gsap.timeline();

                cardEl.onmouseenter = () => {
                  cardTl.pause();
                  gsap.to(cardEl, { scale: 1.15, borderColor: "#ffffff", duration: 0.2 });
                };
                cardEl.onmouseleave = () => {
                  gsap.to(cardEl, { scale: 1, borderColor: "rgba(255,255,255,0.3)", duration: 0.2 });
                  cardTl.resume();
                };
                cardEl.onclick = () => {
                  handleCatClick();
                };

                cardTl
                  .set(cardEl, {
                    display: "flex",
                    x: relX,
                    y: relY,
                    xPercent: -50,
                    yPercent: -50,
                    rotation: randomRotation,
                    zIndex,
                    scale: 0.4,
                    opacity: 0,
                  })
                  .to(cardEl, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.25,
                    ease: "power3.out",
                  })
                  .to(cardEl, {
                    opacity: 0,
                    scale: 0.8,
                    y: relY - 30,
                    duration: 0.5,
                    ease: "power2.in",
                    delay: 0.5,
                    onComplete: () => {
                      gsap.set(cardEl, { display: "none" });
                    },
                  });
              }
            }
          }
        }
      };

      const handleMouseLeave = () => {
        lastTrailX = -9999;
        lastTrailY = -9999;
        returnEyesToCenter();
        scheduleIdleLooking();
      };

      window.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("mouseleave", handleMouseLeave);

      // 8. Pause when offscreen
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            if (tailTween) tailTween.play();
            if (bodyTween) bodyTween.play();
            updateEyeCenters();
            if (!blinkTimeoutRef.current) {
              blinkTimeoutRef.current = setTimeout(triggerBlink, 1500);
            }
            if (!earTimeoutRef.current) {
              earTimeoutRef.current = setTimeout(triggerEarTwitch, 2500);
            }
          } else {
            if (tailTween) tailTween.pause();
            if (bodyTween) bodyTween.pause();
            stopIdleLooking();
            if (blinkTimeoutRef.current) {
              clearTimeout(blinkTimeoutRef.current);
              blinkTimeoutRef.current = null;
            }
            if (earTimeoutRef.current) {
              clearTimeout(earTimeoutRef.current);
              earTimeoutRef.current = null;
            }
            if (idleLookTimerRef.current) {
              clearTimeout(idleLookTimerRef.current);
              idleLookTimerRef.current = null;
            }
            if (idleTimerRef.current) {
              clearTimeout(idleTimerRef.current);
              idleTimerRef.current = null;
            }
          }
        },
        { threshold: 0.1 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
        window.removeEventListener("resize", updateEyeCenters);
        window.removeEventListener("scroll", updateEyeCenters);
        observer.disconnect();
        if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
        if (earTimeoutRef.current) clearTimeout(earTimeoutRef.current);
        if (idleLookTimerRef.current) clearTimeout(idleLookTimerRef.current);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        stopIdleLooking();
      };
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  // Synthesize realistic meow as zero-latency web audio fallback
  const synthesizeMeow = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Soft, sweet, cute kitten tone using gentle triangle wave
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.52);

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1100, now);
      filter.frequency.linearRampToValueAtTime(1600, now + 0.2);
      filter.frequency.linearRampToValueAtTime(950, now + 0.52);
      filter.Q.value = 2.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // ignore
    }
  };

  const playMeowSound = () => {
    try {
      if (audioRef.current) {
        const sound = audioRef.current.cloneNode() as HTMLAudioElement;
        sound.volume = 0.9;
        const playPromise = sound.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            synthesizeMeow();
          });
        }
      } else {
        synthesizeMeow();
      }
    } catch {
      synthesizeMeow();
    }
  };

  const playPurrSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(95, now);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(28, now);

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.001, now);
      mainGain.gain.linearRampToValueAtTime(0.22, now + 0.15);
      mainGain.gain.setValueAtTime(0.22, now + 0.65);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      lfo.connect(mainGain.gain);
      osc.connect(mainGain);
      mainGain.connect(ctx.destination);

      osc.start(now);
      lfo.start(now);
      osc.stop(now + 1.15);
      lfo.stop(now + 1.15);
    } catch {
      // ignore
    }
  };

  // 9. Click: bounce + eyes widen + meow sound
  const handleCatClick = () => {
    if (!catSvgRef.current) return;

    // Trigger authentic meow sound
    playMeowSound();

    gsap
      .timeline()
      .to(catSvgRef.current, { y: -15, duration: 0.12, ease: "power2.out" })
      .to(catSvgRef.current, { y: 0, duration: 0.42, ease: "bounce.out" });

    if (slitLeftRef.current && slitRightRef.current) {
      gsap.fromTo(
        [slitLeftRef.current, slitRightRef.current],
        { scaleX: 2.3, scaleY: 1.35 },
        {
          scaleX: 1,
          scaleY: 1,
          duration: 0.55,
          ease: "power2.out",
          transformOrigin: "center center",
        }
      );
    }

    if (earLeftRef.current && earRightRef.current) {
      gsap.to(earLeftRef.current, {
        scale: 1.08,
        svgOrigin: "228 210",
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
      gsap.to(earRightRef.current, {
        scale: 1.08,
        svgOrigin: "372 210",
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }

    setPopupText("MEOW!");
    if (popupRef.current) {
      gsap.fromTo(
        popupRef.current,
        { opacity: 1, y: 0, scale: 0.8 },
        { opacity: 0, y: -30, scale: 1, duration: 0.85, ease: "power2.out" }
      );
    }
  };

  // 10. Double click: happy squint + purr sound
  const handleCatDoubleClick = () => {
    if (!eyelidLeftRef.current || !eyelidRightRef.current) return;

    // Trigger purr sound
    playPurrSound();

    gsap
      .timeline()
      .to([eyelidLeftRef.current, eyelidRightRef.current], {
        scaleY: 0.58,
        duration: 0.2,
        ease: "power2.out",
      })
      .to([eyelidLeftRef.current, eyelidRightRef.current], {
        scaleY: 0,
        duration: 0.25,
        delay: 0.9,
        ease: "power2.inOut",
      });

    setPopupText("PURRR <3");
    if (popupRef.current) {
      gsap.fromTo(
        popupRef.current,
        { opacity: 1, y: 0, scale: 0.8 },
        { opacity: 0, y: -32, scale: 1, duration: 1.1, ease: "power2.out" }
      );
    }
  };

  const FUR = "#141414"; // cat fur
  const FUR_LINE = "#3b3b3b"; // fur texture strokes
  const SOCK = "#f2f2f2"; // white tuxedo patches

  return (
    <section
      id="watching-cat"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] flex flex-col justify-between items-center bg-black border-b border-white/10 overflow-hidden select-none py-8 md:py-12 px-4 sm:px-8"
    >
      {/* Header */}
      {/* <div className="w-full max-w-[1440px] flex items-center justify-between font-mono-tech text-[11px] uppercase tracking-widest text-neutral-400 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>INTERACTIVE // SYS_CAT</span>
          <span className="hidden sm:inline text-neutral-400">[ STATUS: GAZE_LOCKED ]</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-400">
          <span className="hidden md:inline">
            TARGET: X:{coords.x} Y:{coords.y}
          </span>
          <span className="text-white font-semibold">60 FPS</span>
        </div>
      </div> */}

      {/* Cat arena */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full my-auto py-4">
        <div
          ref={popupRef}
          className="absolute pointer-events-none opacity-0 z-50 font-mono-tech text-[11px] tracking-widest text-black bg-white px-3 py-1 font-bold select-none uppercase border border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          style={{ top: "12%" }}
        >
          {popupText}
        </div>

        <svg
          id="cat-svg"
          ref={catSvgRef}
          role="img"
          aria-label="Black and white cat whose eyes follow your cursor"
          viewBox="0 0 600 700"
          className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[520px] h-auto max-h-[64vh] cursor-pointer will-change-transform drop-shadow-[0_10px_35px_rgba(255,255,255,0.06)]"
          onClick={handleCatClick}
          onDoubleClick={handleCatDoubleClick}
        >
          <defs>
            <clipPath id="eye-left-socket">
              <ellipse cx="235" cy="265" rx="40" ry="30" />
            </clipPath>
            <clipPath id="eye-right-socket">
              <ellipse cx="365" cy="265" rx="40" ry="30" />
            </clipPath>
          </defs>

          {/* Ground shadow */}
          <ellipse cx="300" cy="656" rx="205" ry="11" fill="#1a1a1a" />

          {/* TAIL: sits behind the body, white-tipped, pivots at its base */}
          <g id="tail" ref={tailRef} className="will-change-transform">
            <path
              d="M 445,630 C 520,640 565,590 555,520 C 548,470 510,445 488,462"
              fill="none"
              stroke="#ffffff"
              strokeWidth="27"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 445,630 C 520,640 565,590 555,520 C 548,470 510,445 488,462"
              fill="none"
              stroke={FUR}
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* White tail tip */}
            <path
              d="M 519,461 C 508,455 497,455 488,462"
              fill="none"
              stroke={SOCK}
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Fur rings on tail */}
            <path d="M 548,545 L 566,549 M 553,505 L 570,503 M 540,472 L 553,461" stroke={FUR_LINE} strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* BODY GROUP: torso, haunches, chest bib. Breathes subtly */}
          <g id="body" ref={bodyRef} className="will-change-transform">
            {/* Torso silhouette: narrow shoulders, wide seated haunches */}
            <path
              d="M 232,372 C 200,400 172,448 154,516 C 128,578 120,628 150,650 L 450,650 C 480,628 472,578 446,516 C 428,448 400,400 368,372 Z"
              fill={FUR}
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Haunch (thigh) contours */}
            <path d="M 162,520 C 212,516 248,556 242,612" fill="none" stroke={FUR_LINE} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 438,520 C 388,516 352,556 358,612" fill="none" stroke={FUR_LINE} strokeWidth="2.5" strokeLinecap="round" />
            {/* Shoulder fur strokes */}
            <path d="M 196,430 C 206,446 210,462 212,480 M 214,412 C 224,430 228,446 230,462 M 404,430 C 394,446 390,462 388,480 M 386,412 C 376,430 372,446 370,462" fill="none" stroke={FUR_LINE} strokeWidth="2" strokeLinecap="round" />
            {/* Flank fur strokes */}
            <path d="M 170,560 L 186,566 M 164,590 L 182,594 M 430,560 L 414,566 M 436,590 L 418,594" stroke={FUR_LINE} strokeWidth="2" strokeLinecap="round" />
            {/* White chest bib (tuxedo) */}
            <path
              d="M 258,378 C 268,420 288,464 300,508 C 312,464 332,420 342,378 C 322,392 278,392 258,378 Z"
              fill={SOCK}
            />
            <path d="M 300,420 L 300,470 M 288,430 L 292,462 M 312,430 L 308,462" stroke="#bdbdbd" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* HIND PAWS peeking out at the sides */}
          <ellipse cx="182" cy="645" rx="38" ry="14" fill={SOCK} stroke="#ffffff" strokeWidth="2.5" />
          <ellipse cx="418" cy="645" rx="38" ry="14" fill={SOCK} stroke="#ffffff" strokeWidth="2.5" />
          <path d="M 168,637 L 168,650 M 182,636 L 182,651 M 196,637 L 196,650 M 404,637 L 404,650 M 418,636 L 418,651 M 432,637 L 432,650" stroke="#9a9a9a" strokeWidth="1.8" strokeLinecap="round" />

          {/* FRONT PAWS: no separate legs, just the paws resting at the bottom of the body */}
          {/* <ellipse cx="262" cy="636" rx="34" ry="17" fill={SOCK} stroke="#ffffff" strokeWidth="2.5" />
          <ellipse cx="338" cy="636" rx="34" ry="17" fill={SOCK} stroke="#ffffff" strokeWidth="2.5" />
          <path d="M 249,627 L 249,644 M 262,625 L 262,646 M 275,627 L 275,644 M 325,627 L 325,644 M 338,625 L 338,646 M 351,627 L 351,644" stroke="#9a9a9a" strokeWidth="2" strokeLinecap="round" /> */}

          {/* EARS */}
          <g id="ear-left" ref={earLeftRef} className="will-change-transform">
            <path d="M 195,218 L 176,88 L 268,180 Z" fill={FUR} stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M 200,196 L 188,118 L 250,176 Z" fill="#2c2c2c" stroke={FUR_LINE} strokeWidth="1.5" strokeLinejoin="round" />
            {/* Inner ear fur tufts */}
            <path d="M 204,190 L 214,166 M 214,192 L 226,172" stroke="#8a8a8a" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          <g id="ear-right" ref={earRightRef} className="will-change-transform">
            <path d="M 332,180 L 424,88 L 405,218 Z" fill={FUR} stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M 350,176 L 412,118 L 400,196 Z" fill="#2c2c2c" stroke={FUR_LINE} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M 396,190 L 386,166 M 386,192 L 374,172" stroke="#8a8a8a" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* HEAD: wide cheeks with fur tufts */}
          <path
            id="head"
            d="M 205,200 C 165,235 140,285 152,330 L 136,344 L 160,350 L 152,374 L 182,366 C 207,390 255,404 300,404 C 345,404 393,390 418,366 L 448,374 L 440,350 L 464,344 L 448,330 C 460,285 435,235 395,200 C 370,185 335,178 300,178 C 265,178 230,185 205,200 Z"
            fill={FUR}
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Forehead tabby marks */}
          <path d="M 300,186 L 300,218 M 280,190 L 285,214 M 320,190 L 315,214 M 260,198 L 268,216 M 340,198 L 332,216" stroke={FUR_LINE} strokeWidth="2.4" strokeLinecap="round" />
          {/* Cheek fur strokes */}
          <path d="M 170,300 L 192,306 M 166,322 L 190,324 M 430,300 L 408,306 M 434,322 L 410,324" stroke={FUR_LINE} strokeWidth="2" strokeLinecap="round" />

          {/* WHITE MUZZLE + CHIN */}
          <path
            d="M 248,330 C 248,306 276,304 300,314 C 324,304 352,306 352,330 C 356,366 330,386 300,386 C 270,386 244,366 248,330 Z"
            fill={SOCK}
          />
          {/* Nose */}
          <path d="M 288,322 L 312,322 L 300,336 Z" fill="#4a4a4a" stroke="#2a2a2a" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Mouth */}
          <path
            d="M 300,336 L 300,348 C 292,360 278,358 270,350 M 300,348 C 308,360 322,358 330,350"
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Whisker pads dots */}
          <g fill="#555555">
            <circle cx="272" cy="332" r="1.7" />
            <circle cx="280" cy="338" r="1.7" />
            <circle cx="268" cy="341" r="1.7" />
            <circle cx="328" cy="332" r="1.7" />
            <circle cx="320" cy="338" r="1.7" />
            <circle cx="332" cy="341" r="1.7" />
          </g>

          {/* WHISKERS */}
          <g stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" fill="none">
            <path d="M 252,332 C 200,318 150,312 100,306" />
            <path d="M 250,340 C 195,340 145,342 92,342" />
            <path d="M 252,348 C 200,360 152,372 106,384" />
            <path d="M 348,332 C 400,318 450,312 500,306" />
            <path d="M 350,340 C 405,340 455,342 508,342" />
            <path d="M 348,348 C 400,360 448,372 494,384" />
          </g>

          {/* EYE RIMS */}
          <ellipse cx="235" cy="265" rx="41" ry="31" fill="none" stroke="#ffffff" strokeWidth="3" />
          <ellipse cx="365" cy="265" rx="41" ry="31" fill="none" stroke="#ffffff" strokeWidth="3" />

          {/* LEFT EYE */}
          <g id="eye-left" clipPath="url(#eye-left-socket)">
            <ellipse id="eye-left-white" ref={leftEyeWhiteRef} cx="235" cy="265" rx="40" ry="30" fill="#ffffff" />
            <g id="pupil-left" ref={pupilLeftRef} className="will-change-transform">
              {/* Light gray iris so the slit pupil reads clearly */}
              <ellipse cx="235" cy="265" rx="23" ry="23" fill="#9c9c9c" stroke="#3a3a3a" strokeWidth="2" />
              <ellipse cx="235" cy="265" rx="16" ry="19" fill="#c9c9c9" />
              <ellipse id="slit-left" ref={slitLeftRef} cx="235" cy="265" rx="6.5" ry="22" fill="#000000" />
              <circle cx="243" cy="255" r="3.8" fill="#ffffff" />
              <circle cx="228" cy="273" r="1.6" fill="#ffffff" opacity="0.85" />
            </g>
            <rect
              id="eyelid-left"
              ref={eyelidLeftRef}
              x="180"
              y="225"
              width="110"
              height="80"
              fill={FUR}
              style={{ transformOrigin: "235px 235px", transform: "scaleY(0)" }}
            />
          </g>

          {/* RIGHT EYE */}
          <g id="eye-right" clipPath="url(#eye-right-socket)">
            <ellipse id="eye-right-white" ref={rightEyeWhiteRef} cx="365" cy="265" rx="40" ry="30" fill="#ffffff" />
            <g id="pupil-right" ref={pupilRightRef} className="will-change-transform">
              <ellipse cx="365" cy="265" rx="23" ry="23" fill="#9c9c9c" stroke="#3a3a3a" strokeWidth="2" />
              <ellipse cx="365" cy="265" rx="16" ry="19" fill="#c9c9c9" />
              <ellipse id="slit-right" ref={slitRightRef} cx="365" cy="265" rx="6.5" ry="22" fill="#000000" />
              <circle cx="373" cy="255" r="3.8" fill="#ffffff" />
              <circle cx="358" cy="273" r="1.6" fill="#ffffff" opacity="0.85" />
            </g>
            <rect
              id="eyelid-right"
              ref={eyelidRightRef}
              x="310"
              y="225"
              width="110"
              height="80"
              fill={FUR}
              style={{ transformOrigin: "365px 235px", transform: "scaleY(0)" }}
            />
          </g>
        </svg>

        <div className="mt-2 font-mono-tech text-[10px] uppercase tracking-widest text-neutral-400 select-none">
          CLICK ME ? 
        </div>
      </div>

      {/* Bottom text */}
      {/* <div className="w-full max-w-[1440px] flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/10 pt-4 font-mono-tech text-xs tracking-widest text-center sm:text-left">
        <span className="text-neutral-400 text-[10px] sm:text-xs">BRUTALIST EXPERIMENTAL // 001</span>
        <span className="text-white font-medium tracking-[0.2em] uppercase transition-colors duration-300">
          {hintText}
        </span>
        <span className="text-neutral-400 text-[10px] sm:text-xs">SWISS MONOCHROME</span>
      </div> */}
      {/* INTERACTIVE TECH STACK TRAIL LAYER (Spawns along cursor on hover) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
      >
        {Array.from({ length: POOL_SIZE }).map((_, idx) => (
          <div
            key={idx}
            ref={(el) => {
              poolCardRefs.current[idx] = el;
            }}
            style={{ display: "none" }}
            className="absolute top-0 left-0 w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] bg-neutral-950/90 border border-white/30 p-2.5 flex flex-col items-center justify-center select-none shadow-[0_12px_36px_rgba(0,0,0,0.9)] pointer-events-auto transition-colors duration-200 backdrop-blur-sm cursor-pointer"
          >
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
              <img
                ref={(el) => {
                  poolImgRefs.current[idx] = el;
                }}
                src="/stack/react.svg"
                alt="Technology Logo"
                width={38}
                height={38}
                className="w-9 h-9 object-contain filter invert pointer-events-none"
                loading="lazy"
              />
            </div>

            <span
              ref={(el) => {
                poolTextRefs.current[idx] = el;
              }}
              className="font-mono-tech text-[10px] font-bold uppercase tracking-wider text-neutral-200 mt-2 text-center truncate w-full block"
            >
              REACT
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}