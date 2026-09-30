"use client";

/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { INTRO_EVENT, story } from "@/lib/story";

/** Ring and heartbeat draw in, the seal pops, then hands over to the particle field. Total ≤ 1.5s. */
export default function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const handoff = reduced ? 400 : 1250;

    const start = window.setTimeout(() => {
      setVisible(false);
      story.introStarted = true;
      window.dispatchEvent(new Event(INTRO_EVENT));
      gsap.to(story, { intro: 1, duration: reduced ? 0.4 : 1.8, ease: "power2.out" });
    }, handoff);

    return () => window.clearTimeout(start);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="loader fixed inset-0 z-[90] grid place-items-center bg-ink text-pearl"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          aria-hidden
        >
          <div className="flex flex-col items-center gap-5">
            <div className="relative h-28 w-28">
              <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full">
                <circle cx="32" cy="32" r="30.5" fill="none" stroke="#2CC6D3" strokeWidth="1.2" pathLength={1} className="badge-ring" />
              </svg>
              <span className="badge-logo absolute inset-[9%] overflow-hidden rounded-full bg-white">
                <img src="/images/logo.jpg" alt="" className="h-full w-full object-cover" />
              </span>
            </div>
            <svg viewBox="0 0 120 24" className="h-6 w-32" fill="none">
              <path
                d="M0 12h38l4-6 5 14 6-22 5 18 3-4h59"
                stroke="#2CC6D3"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                className="badge-pulse"
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
