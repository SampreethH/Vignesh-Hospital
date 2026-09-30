"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import clsx from "@/lib/clsx";

const EASE = [0.22, 1, 0.36, 1] as const;

type SplitProps = {
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  delay?: number;
  /** When provided, animates on this flag instead of on scroll into view. */
  play?: boolean;
};

/** Word-by-word masked reveal: each word slides up from behind its own line mask. */
export function SplitReveal({ text, as: Tag = "span", className, wordClassName, delay = 0, play }: SplitProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { y: reduced ? 0 : "110%", opacity: reduced ? 0 : 1 },
    show: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: EASE } },
  };
  const trigger =
    play === undefined
      ? { whileInView: "show", viewport: { once: true, margin: "0px 0px -12% 0px" } }
      : { animate: play ? "show" : "hidden" };

  return (
    <Tag className={className} aria-label={text}>
      <motion.span className="inline" variants={container} initial="hidden" {...trigger} aria-hidden>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
            <motion.span className={clsx("inline-block", wordClassName)} variants={word}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Simple fade-up for blocks of content. */
export function FadeUp({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "p" | "article";
}) {
  const reduced = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}
