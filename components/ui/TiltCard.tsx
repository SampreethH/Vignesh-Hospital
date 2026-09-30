"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import clsx from "@/lib/clsx";

/** Perspective tilt toward the cursor with a aqua glow that tracks along the edge. */
export default function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(44,198,211,0.9), rgba(44,198,211,0) 45%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px * 100);
    my.set(py * 100);
    if (!reduced) {
      rx.set((0.5 - py) * 12);
      ry.set((px - 0.5) * 14);
    }
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="[perspective:1000px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className={clsx("group relative h-full rounded-[1.75rem] p-px", className)}
      >
        {/* edge glow: gradient on the 1px frame */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glow }}
        />
        <div className="absolute inset-0 rounded-[1.75rem] bg-ink/[0.07]" aria-hidden />
        <div className="relative h-full rounded-[calc(1.75rem-1px)] bg-pearl" style={{ transform: "translateZ(0)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
