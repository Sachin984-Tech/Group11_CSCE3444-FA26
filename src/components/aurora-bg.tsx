"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface AuroraBgProps {
  variant?: "default" | "calm" | "vivid";
}

export function AuroraBg({ variant = "default" }: AuroraBgProps) {
  const orbs = useMemo(
    () => [
      { color: "oklch(0.72 0.22 320 / 0.55)", size: 520, top: "-12%", left: "-8%", delay: 0, dur: 22 },
      { color: "oklch(0.78 0.2 165 / 0.42)", size: 460, top: "8%", left: "62%", delay: 3, dur: 28 },
      { color: "oklch(0.82 0.18 85 / 0.32)", size: 380, top: "62%", left: "70%", delay: 6, dur: 26 },
      { color: "oklch(0.65 0.24 0 / 0.36)", size: 420, top: "70%", left: "5%", delay: 9, dur: 24 },
      { color: "oklch(0.55 0.18 280 / 0.42)", size: 360, top: "32%", left: "32%", delay: 12, dur: 30 },
    ],
    [],
  );
  const dim = variant === "calm" ? 0.6 : variant === "vivid" ? 1.1 : 1;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 mask-fade-b" />
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[120px]"
          style={{
            background: o.color,
            width: o.size,
            height: o.size,
            top: o.top,
            left: o.left,
            opacity: 0.85 * dim,
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 25, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: o.dur,
            delay: o.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
