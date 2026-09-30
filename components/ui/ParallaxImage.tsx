"use client";

/* eslint-disable @next/next/no-img-element */
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import clsx from "@/lib/clsx";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Photo that unmasks upward when it enters, then drifts slower than the page. Pass a position class (relative/absolute). */
export default function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  amount = 10,
  delay = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Drift in percent of the frame height. */
  amount?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : [`-${amount}%`, `${amount}%`]);

  return (
    <motion.div
      ref={ref}
      className={clsx("overflow-hidden", className)}
      initial={{ clipPath: reduced ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.2, ease: EASE, delay }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ y, scale: 1 + (amount * 2.4) / 100 }}
        className={clsx("absolute inset-0 h-full w-full object-cover", imgClassName)}
      />
    </motion.div>
  );
}
