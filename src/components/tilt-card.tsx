"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
  scale?: number;
  spring?: number;
}

export function TiltCard({
  children,
  className = "",
  intensity = 12,
  glare = true,
  scale = 1.02,
  spring = 0.18,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 200, damping: spring * 100 });
  const sry = useSpring(ry, { stiffness: 200, damping: spring * 100 });
  const rotateX = useTransform(srx, (v) => `${v}deg`);
  const rotateY = useTransform(sry, (v) => `${v}deg`);
  const glareBg = useTransform(
    [gx, gy] as any,
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, oklch(0.9 0.1 320 / 0.18), transparent 45%)`,
  );

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const cx = px - 0.5;
    const cy = py - 0.5;
    ry.set(cx * intensity * 2);
    rx.set(-cy * intensity * 2);
    gx.set(px * 100);
    gy.set(py * 100);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ scale }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(0)" }} className="h-full w-full">
        {children}
      </div>
      {glare ? (
        <motion.div
          aria-hidden
          style={{ background: glareBg as any, opacity: 0 }}
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          data-glare
        />
      ) : null}
    </motion.div>
  );
}
