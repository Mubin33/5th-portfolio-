"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface LightningBranch {
  start: Point;
  end: Point;
  branches: LightningBranch[];
  alpha: number;
  width: number;
}

interface Arc {
  points: Point[];
  life: number;
  maxLife: number;
  width: number;
}

export default function ElectricLightning({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isHoveredRef = useRef<boolean>(false);
  const mousePosRef = useRef<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rawCtx = canvas.getContext("2d");
    if (!rawCtx) return;
    const ctx: CanvasRenderingContext2D = rawCtx;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Track parent hover & mouse position
    const parent = canvas.parentElement;
    const onMouseEnter = () => {
      isHoveredRef.current = true;
    };
    const onMouseLeave = () => {
      isHoveredRef.current = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    if (parent) {
      parent.addEventListener("mouseenter", onMouseEnter);
      parent.addEventListener("mouseleave", onMouseLeave);
      parent.addEventListener("mousemove", onMouseMove);
    }

    // Active lightning strikes & electric arcs
    const activeStrikes: { branches: LightningBranch[]; alpha: number; flash: number }[] = [];
    const electricArcs: Arc[] = [];
    let nextStrikeTime = Date.now() + 800;

    // Recursive fractal lightning generator
    function createBolt(start: Point, end: Point, depth = 0, maxDepth = 5): LightningBranch {
      const branch: LightningBranch = {
        start,
        end,
        branches: [],
        alpha: 1,
        width: Math.max(1, (maxDepth - depth) * 0.9),
      };

      if (depth >= maxDepth) return branch;

      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;

      const dist = Math.hypot(end.x - start.x, end.y - start.y);
      const normalX = -(end.y - start.y) / dist;
      const normalY = (end.x - start.x) / dist;

      // Random displacement perpendicular to segment
      const maxOffset = dist * 0.28;
      const offset = (Math.random() - 0.5) * 2 * maxOffset;

      const displacedMid: Point = {
        x: midX + normalX * offset,
        y: midY + normalY * offset,
      };

      // Split into two sub-branches
      branch.branches.push(createBolt(start, displacedMid, depth + 1, maxDepth));
      branch.branches.push(createBolt(displacedMid, end, depth + 1, maxDepth));

      // 30% chance to fork a child branch
      if (Math.random() < 0.35 && depth < maxDepth - 1) {
        const forkAngle = (Math.random() - 0.5) * 0.9;
        const forkLength = dist * (0.4 + Math.random() * 0.35);
        const dirX = (end.x - start.x) / dist;
        const dirY = (end.y - start.y) / dist;

        const cos = Math.cos(forkAngle);
        const sin = Math.sin(forkAngle);
        const forkDirX = dirX * cos - dirY * sin;
        const forkDirY = dirX * sin + dirY * cos;

        const forkEnd: Point = {
          x: displacedMid.x + forkDirX * forkLength,
          y: displacedMid.y + forkDirY * forkLength,
        };

        branch.branches.push(createBolt(displacedMid, forkEnd, depth + 2, maxDepth));
      }

      return branch;
    }

    // Trigger a massive thunderbolt strike
    function triggerStrike() {
      const startX = width * (0.2 + Math.random() * 0.6);
      const startY = -10;
      // Strike target: center behind Mubin, or towards mouse if hovered
      let targetX = width * (0.3 + Math.random() * 0.4);
      let targetY = height * (0.55 + Math.random() * 0.35);

      if (isHoveredRef.current && Math.random() < 0.6) {
        targetX = mousePosRef.current.x + (Math.random() - 0.5) * 80;
        targetY = mousePosRef.current.y + (Math.random() - 0.5) * 80;
      }

      const mainBolt = createBolt({ x: startX, y: startY }, { x: targetX, y: targetY });

      activeStrikes.push({
        branches: [mainBolt],
        alpha: 1,
        flash: 0.85, // Ambient thunder flash intensity
      });
    }

    // Spawn crackling electric micro-arcs around the silhouette
    function createElectricArc() {
      const centerX = width * 0.52;
      const centerY = height * 0.48;
      const baseRadius = width * 0.24;

      const angle = Math.random() * Math.PI * 2;
      const r = baseRadius * (0.7 + Math.random() * 0.6);
      let currentPoint: Point = {
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
      };

      const points: Point[] = [currentPoint];
      const segments = 4 + Math.floor(Math.random() * 5);
      const stepLength = 18 + Math.random() * 20;

      for (let i = 0; i < segments; i++) {
        const stepAngle = angle + (Math.random() - 0.5) * 1.6;
        currentPoint = {
          x: currentPoint.x + Math.cos(stepAngle) * stepLength,
          y: currentPoint.y + Math.sin(stepAngle) * stepLength,
        };
        points.push(currentPoint);
      }

      electricArcs.push({
        points,
        life: 0,
        maxLife: 6 + Math.floor(Math.random() * 8),
        width: 1 + Math.random() * 1.5,
      });
    }

    // Render tree of lightning branches
    function drawBranch(branch: LightningBranch, alpha: number) {
      if (branch.branches.length === 0) {
        ctx.beginPath();
        ctx.moveTo(branch.start.x, branch.start.y);
        ctx.lineTo(branch.end.x, branch.end.y);

        // Core white bolt
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
        ctx.lineWidth = branch.width;
        ctx.stroke();

        // Outer bloom
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
        ctx.lineWidth = branch.width * 2.8;
        ctx.stroke();
      } else {
        for (const child of branch.branches) {
          drawBranch(child, alpha);
        }
      }
    }

    // Main animation loop
    function animate() {
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();

      // Check strike timer
      if (now > nextStrikeTime) {
        triggerStrike();
        const delay = isHoveredRef.current
          ? 350 + Math.random() * 700 // High frequency when hovered
          : 1200 + Math.random() * 2200; // Natural ambient thunder strikes
        nextStrikeTime = now + delay;
      }

      // Continuously generate electric micro-arcs
      if (Math.random() < (isHoveredRef.current ? 0.65 : 0.35)) {
        createElectricArc();
      }

      // Draw and update thunder strikes
      for (let i = activeStrikes.length - 1; i >= 0; i--) {
        const strike = activeStrikes[i];

        // Draw ambient background lightning flash
        if (strike.flash > 0) {
          const grad = ctx.createRadialGradient(
            width * 0.5,
            height * 0.45,
            10,
            width * 0.5,
            height * 0.45,
            width * 0.65
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${strike.flash * 0.4})`);
          grad.addColorStop(0.5, `rgba(255, 255, 255, ${strike.flash * 0.12})`);
          grad.addColorStop(1, "transparent");

          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          strike.flash -= 0.12;
        }

        // Draw the lightning bolt structure
        ctx.save();
        ctx.shadowBlur = 18;
        ctx.shadowColor = "#ffffff";
        for (const b of strike.branches) {
          drawBranch(b, strike.alpha);
        }
        ctx.restore();

        // Rapid multi-strobe flickering decay
        strike.alpha -= 0.085;
        if (strike.alpha <= 0) {
          activeStrikes.splice(i, 1);
        }
      }

      // Draw and update electric crackle arcs
      for (let i = electricArcs.length - 1; i >= 0; i--) {
        const arc = electricArcs[i];
        arc.life++;

        const progress = arc.life / arc.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.85;

        if (arc.points.length > 1) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(arc.points[0].x, arc.points[0].y);
          for (let p = 1; p < arc.points.length; p++) {
            ctx.lineTo(arc.points[p].x, arc.points[p].y);
          }

          ctx.shadowBlur = 10;
          ctx.shadowColor = "#ffffff";
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = arc.width;
          ctx.stroke();

          // Hot inner spark
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 1.2})`;
          ctx.lineWidth = arc.width * 0.5;
          ctx.stroke();
          ctx.restore();
        }

        if (arc.life >= arc.maxLife) {
          electricArcs.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mouseenter", onMouseEnter);
        parent.removeEventListener("mouseleave", onMouseLeave);
        parent.removeEventListener("mousemove", onMouseMove);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none select-none ${className}`}
      style={{
        filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.75))",
      }}
    />
  );
}
