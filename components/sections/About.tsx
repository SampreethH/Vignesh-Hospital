"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { STATS, type Stat } from "@/lib/content";
import { FadeUp, SplitReveal } from "@/components/ui/Reveal";
import ParallaxImage from "@/components/ui/ParallaxImage";

const MARQUEE = [
  "Pediatrics",
  "Newborn care",
  "Developmental pediatrics",
  "Dental care",
  "Diagnostics",
  "Day-care",
  "24×7 Emergency",
  "Vaccination",
];

/** Counts up to `value` when it has one; otherwise shows the display text as-is. */
function StatValue({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el || stat.value === undefined) return;
    const fmt = (n: number) => `${Math.round(n).toLocaleString("en-IN")}${stat.suffix ?? ""}`;
    if (reduced) {
      el.textContent = stat.display;
      return;
    }
    const controls = animate(0, stat.value, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (el.textContent = fmt(v)),
      onComplete: () => (el.textContent = stat.display),
    });
    return () => controls.stop();
  }, [inView, reduced, stat]);

  return (
    <span ref={ref} className="tabular-nums">
      {stat.display}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="relative z-10 overflow-hidden bg-mist pb-24 md:pb-36">
      {/* Marquee band */}
      <div className="border-b border-ink/10 py-7 md:py-9" aria-hidden>
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-[clamp(2rem,5vw,4rem)] font-semibold italic tracking-tight">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className={i % 2 ? "step-num not-italic" : "text-ink"}>{m}</span>
              <span className="h-2.5 w-2.5 rounded-full bg-aqua" />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-24 grid max-w-7xl gap-14 px-5 md:mt-32 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div className="order-2 lg:order-1">
          <p className="eyebrow">About Vignesh Hospital</p>
          <SplitReveal as="h2" text="Patient-centred care, close to home." className="h-section mt-4 block max-w-xl" />
          <FadeUp delay={0.15}>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-slate md:text-lg">
              Located at Yallapura on Madhugiri Road, Vignesh Hospital provides patient-centred pediatric and family
              healthcare with inpatient, day-care, diagnostic and dental facilities.
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate md:text-lg">
              Electronic patient records through HealthPlix and pharmacy management through eVitalRx keep your
              family&apos;s history ready whenever you walk in.
            </p>
          </FadeUp>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10">
            {STATS.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.08} className="border-t border-ink/15 pt-5">
                <dd className="font-display text-[clamp(2.2rem,4.2vw,3.5rem)] font-semibold leading-none tracking-tight text-aqua-dark">
                  <StatValue stat={s} />
                </dd>
                <dt className="mt-3 text-sm font-medium text-slate md:text-base">{s.label}</dt>
              </FadeUp>
            ))}
          </dl>
          <p className="mt-8 text-xs text-slate/80">*Approximate HealthPlix dashboard figures displayed for 2024–2026.</p>
        </div>

        <div className="relative order-1 lg:order-2">
          <ParallaxImage
            src="/images/hospital-front.jpg"
            alt="Vignesh Hospital entrance on Madhugiri Road"
            className="relative aspect-[4/5] w-[82%] rounded-[2rem] bg-ink"
          />
          <ParallaxImage
            src="/images/reception.jpg"
            alt="Reception and waiting area"
            className="absolute -bottom-10 right-0 aspect-[3/4] w-[46%] rounded-[1.5rem] border-[6px] border-mist bg-ink shadow-[0_30px_60px_-30px_rgba(8,28,46,0.5)]"
            amount={14}
            delay={0.2}
          />
          <FadeUp delay={0.4} className="absolute left-4 top-4 md:left-6 md:top-6">
            <div className="rounded-2xl bg-pearl/90 px-4 py-3 shadow-lg backdrop-blur">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate">Caring since</p>
              <p className="font-display text-3xl font-semibold leading-none text-ink">2018</p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
