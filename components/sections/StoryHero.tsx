"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { INTRO_EVENT, story } from "@/lib/story";
import { ALWAYS_ON, CONTACT, whatsappHref } from "@/lib/content";
import { SplitReveal } from "@/components/ui/Reveal";

const CHAPTERS = [
  {
    step: "01",
    name: "Always on",
    title: "Awake whenever you need us.",
    body: "Emergency evaluation, round-the-clock admission, ECG and an in-house pharmacy, 24 hours a day, 7 days a week.",
    tags: ALWAYS_ON.map((t) => `24×7 ${t}`),
  },
  {
    step: "02",
    name: "For little ones",
    title: "Every child, every milestone.",
    body: "Pediatric and developmental care from the newborn days onwards: vaccination, growth and nutrition, speech, autism and ADHD assessment.",
    tags: ["Pediatrics", "Developmental pediatrics", "Newborn care"],
  },
  {
    step: "03",
    name: "For the whole family",
    title: "One trusted hospital for the family.",
    body: "Dental care, in-house diagnostics and digital medical records, all under one roof at Yallapura on Madhugiri Road.",
    tags: ["Dental care", "Lab & X-ray", "Digital records"],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/** Words wrapped in line masks for the GSAP-scrubbed chapter headings. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i, arr) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-top">
            <span data-word className="inline-block">
              {w}
            </span>
          </span>
          {i < arr.length - 1 && " "}
        </Fragment>
      ))}
    </>
  );
}

function useIntro() {
  const [intro, setIntro] = useState(false);
  useEffect(() => {
    if (story.introStarted) return setIntro(true);
    const on = () => setIntro(true);
    window.addEventListener(INTRO_EVENT, on);
    return () => window.removeEventListener(INTRO_EVENT, on);
  }, []);
  return intro;
}

export default function StoryHero() {
  const root = useRef<HTMLElement>(null);
  const intro = useIntro();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      gsap.set(panels, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 4.5}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Hero out, field becomes a heartbeat, then a heart, then the seal.
      tl.to("[data-scroll-hint]", { autoAlpha: 0, duration: 0.15 }, 0)
        .to("[data-hero-item]", { autoAlpha: 0, y: -60, stagger: 0.05, duration: 0.4, ease: "power1.in" }, 0.1)
        .to(story, { progress: 1, duration: 1 }, 0.2)
        .to(story, { progress: 2, duration: 1 }, 1.55)
        .to(story, { progress: 3, duration: 1.1 }, 2.9);

      panels.forEach((panel, i) => {
        const at = 0.75 + i * 1.35;
        tl.to(panel, { autoAlpha: 1, duration: 0.1 }, at)
          .fromTo(
            panel.querySelectorAll("[data-word]"),
            { yPercent: 115 },
            { yPercent: 0, stagger: 0.035, duration: 0.4, ease: "power3.out" },
            at,
          )
          .fromTo(
            panel.querySelectorAll("[data-fade]"),
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.35, ease: "power2.out" },
            at + 0.15,
          );
        if (i < panels.length - 1) {
          tl.to(panel, { autoAlpha: 0, y: -50, duration: 0.3, ease: "power1.in" }, at + 1.0);
        }
      });

      // Hold on the seal before releasing the pin.
      tl.to({}, { duration: 0.7 });
    }, root);

    return () => {
      ctx.revert();
      story.progress = 0;
    };
  }, []);

  return (
    <section id="top" ref={root} className="relative z-10 h-[100svh] overflow-hidden text-pearl">
      {/* HERO */}
      <div className="absolute inset-0 flex items-end md:items-center">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ink via-ink/75 to-transparent md:hidden" />
        {/* Keeps the copy readable over the fields on wide screens. */}
        <div data-hero-item className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-ink/85 via-ink/55 to-transparent md:block" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-28 md:px-10 md:pb-0">
          <div className="max-w-2xl">
            <div data-hero-item>
              <motion.p
                className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-aqua/30 bg-aqua/10 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-aqua-light backdrop-blur md:text-[0.78rem]"
                initial={{ opacity: 0, y: 16 }}
                animate={intro ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-aqua" aria-hidden />
                Est. 04 March 2018 · 20-bed hospital
              </motion.p>
            </div>

            <h1 data-hero-item className="font-display text-[clamp(3rem,9.5vw,8rem)] font-semibold leading-[0.95] tracking-tightest">
              <SplitReveal text="Gentle care" className="block" play={intro} delay={0.1} />
              <SplitReveal text="for every heartbeat." className="block italic text-aqua" play={intro} delay={0.25} />
            </h1>

            <div data-hero-item>
              <motion.p
                className="mt-6 max-w-lg text-base leading-relaxed text-pearl/75 md:text-lg"
                initial={{ opacity: 0, y: 16 }}
                animate={intro ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
              >
                Comprehensive child &amp; family healthcare in Tumkur. Pediatrics, developmental pediatrics, newborn
                care, dental care, diagnostics and day-care, supported by digital medical records.
              </motion.p>
            </div>

            <div data-hero-item>
              <motion.div
                className="mt-8 flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={intro ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
              >
                <a href={CONTACT.phoneHref} className="btn btn-aqua">
                  <Phone size={17} strokeWidth={2.2} /> Call for appointment
                </a>
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn btn-outline-pearl">
                  WhatsApp appointment
                </a>
              </motion.div>
            </div>

            <div data-hero-item>
              <motion.ul
                className="mt-8 grid max-w-lg grid-cols-2 gap-x-6 gap-y-2 text-sm text-pearl/60 sm:flex sm:flex-wrap"
                initial={{ opacity: 0 }}
                animate={intro ? { opacity: 1 } : undefined}
                transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
              >
                {ALWAYS_ON.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="font-semibold text-aqua">24×7</span> {t}
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </div>

      {/* CHAPTERS */}
      {CHAPTERS.map((c) => (
        <div
          key={c.step}
          data-panel
          className="invisible absolute inset-0 flex items-end md:items-center"
          aria-label={`${c.name}: ${c.title}`}
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-ink via-ink/80 to-transparent md:hidden" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-28 md:px-10 md:pb-0">
            <div className="max-w-xl">
              <p data-fade className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-pearl/60">
                <span className="rounded-full bg-aqua px-2.5 py-1 text-ink">{c.step}</span>
                {c.name}
              </p>
              <h2 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[1] tracking-tightest">
                <Words text={c.title} />
              </h2>
              <p data-fade className="mt-5 max-w-md text-base leading-relaxed text-pearl/70 md:text-lg">
                {c.body}
              </p>
              <ul data-fade className="mt-6 flex flex-wrap gap-2">
                {c.tags.map((s) => (
                  <li key={s} className="rounded-full border border-aqua/40 bg-aqua/10 px-4 py-1.5 text-sm font-medium text-aqua-light">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

      {/* Scroll hint */}
      <div data-scroll-hint className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-pearl/50 md:flex">
        Scroll
        <span className="scroll-line block h-10 w-px overflow-hidden bg-pearl/15" />
      </div>
    </section>
  );
}
