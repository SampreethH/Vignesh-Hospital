"use client";

/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GALLERY } from "@/lib/content";
import { scroll } from "@/lib/scroll";
import { FadeUp, SplitReveal } from "@/components/ui/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const item = GALLERY[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    scroll.lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      scroll.lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      data-lenis-prevent
    >
      <AnimatePresence mode="wait">
        <motion.figure
          key={item.src}
          className="flex max-h-full max-w-6xl flex-col items-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: EASE }}
          onClick={(e) => e.stopPropagation()}
        >
          <img src={item.src} alt={item.alt} className="max-h-[78vh] w-auto rounded-2xl object-contain" />
          <figcaption className="mt-4 text-center text-sm text-pearl/70">
            {item.alt} <span className="text-pearl/40">· {index + 1} / {GALLERY.length}</span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-pearl/10 text-pearl hover:bg-pearl/20 md:right-8 md:top-8"
        aria-label="Close"
      >
        <X size={20} />
      </button>
      {[-1, 1].map((d) => (
        <button
          key={d}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStep(d);
          }}
          className={`absolute bottom-6 grid h-12 w-12 place-items-center rounded-full bg-pearl/10 text-pearl hover:bg-aqua hover:text-ink md:bottom-auto md:top-1/2 md:-translate-y-1/2 ${d < 0 ? "left-1/2 -translate-x-[120%] md:left-8 md:translate-x-0" : "right-1/2 translate-x-[120%] md:right-8 md:translate-x-0"}`}
          aria-label={d < 0 ? "Previous photo" : "Next photo"}
        >
          {d < 0 ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
      ))}
    </motion.div>
  );
}

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduced = useReducedMotion();
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + GALLERY.length) % GALLERY.length)), []);

  return (
    <section id="gallery" className="relative z-10 bg-mist px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Gallery</p>
            <SplitReveal as="h2" text="Inside Vignesh Hospital." className="h-section mt-4 block" />
          </div>
          <FadeUp delay={0.2}>
            <p className="max-w-sm text-base leading-relaxed text-slate md:text-lg">
              Real photographs of our hospital and patient-care facilities. Tap any photo to see it full size.
            </p>
          </FadeUp>
        </div>

        <ul className="mt-14 columns-2 gap-3 md:mt-20 md:columns-3 md:gap-5 lg:columns-4">
          {GALLERY.map((g, i) => (
            <li key={g.src} className="mb-3 break-inside-avoid md:mb-5">
              <motion.button
                type="button"
                onClick={() => setOpen(i)}
                data-cursor="view"
                className="group relative block w-full overflow-hidden rounded-2xl bg-ink md:rounded-[1.5rem]"
                style={{ aspectRatio: `${g.w} / ${g.h}` }}
                initial={{ clipPath: reduced ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)" }}
                whileInView={{ clipPath: "inset(0% 0 0 0)" }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 1.1, ease: EASE, delay: (i % 4) * 0.08 }}
                aria-label={`Open photo: ${g.alt}`}
              >
                <motion.span
                  className="absolute inset-0 block"
                  initial={{ scale: reduced ? 1 : 1.25 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: EASE, delay: (i % 4) * 0.08 }}
                >
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                </motion.span>
                <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/80 to-transparent p-4 pt-12 text-left text-xs font-medium text-pearl opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:text-sm">
                  {g.alt}
                </span>
              </motion.button>
            </li>
          ))}
        </ul>
      </div>

      {/* Portalled so it stacks above the navbar instead of inside this section's z-index. */}
      {mounted &&
        createPortal(
          <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onStep={step} />}</AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
