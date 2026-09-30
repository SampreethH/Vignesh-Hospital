"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

/** Pulls its child slightly toward the cursor while hovered. */
export default function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 14, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 14, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} className="-m-8 inline-block p-8">
      <motion.div style={{ x, y }}>{children}</motion.div>
    </div>
  );
}
