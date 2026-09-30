"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { CONTACT, FEES } from "@/lib/content";
import Magnetic from "@/components/ui/Magnetic";
import { FadeUp, SplitReveal } from "@/components/ui/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Timings() {
  return (
    <section id="timings" className="relative z-10 bg-pearl px-5 pb-24 md:px-10 md:pb-36">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div className="rounded-[2.25rem] bg-mist px-6 py-12 md:px-12 md:py-16">
          <p className="eyebrow">Timings & consultation</p>
          <SplitReveal as="h2" text="Clear hours. Clear fees." className="h-section mt-4 block" />
          <table className="mt-10 w-full text-left">
            <tbody>
              {FEES.map((f, i) => (
                <motion.tr
                  key={f.item}
                  className="border-b border-ink/10 last:border-0"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}
                >
                  <td className="py-4 pr-4 text-slate md:text-lg">{f.item}</td>
                  <th scope="row" className="py-4 text-right font-display text-xl font-semibold text-ink md:text-2xl">
                    {f.value}
                  </th>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <FadeUp delay={0.1} className="h-full">
          <div className="relative flex h-full flex-col overflow-hidden rounded-[2.25rem] bg-ink px-6 py-12 text-pearl md:px-12 md:py-16">
            <div className="cta-glow pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full" aria-hidden />
            <p className="relative inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-aqua">
              <span className="live-dot h-2 w-2 rounded-full bg-[#FF5A6A]" aria-hidden />
              Open now · always
            </p>
            <h2 className="relative mt-5 font-display text-[clamp(2.3rem,4.5vw,3.75rem)] font-semibold leading-[1.02] tracking-tightest">
              24×7 Emergency Care
            </h2>
            <p className="relative mt-4 max-w-sm leading-relaxed text-pearl/70 md:text-lg">
              Emergency evaluation, round-the-clock admission, ECG and in-house pharmacy.
            </p>

            <svg viewBox="0 0 400 80" className="relative mt-10 h-16 w-full" fill="none" aria-hidden>
              <path d="M0 40h120l10-14 12 34 16-56 12 46 8-10h222" stroke="rgba(251,253,253,0.12)" strokeWidth="2" />
              <path
                d="M0 40h120l10-14 12 34 16-56 12 46 8-10h222"
                stroke="#2CC6D3"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                className="ecg-trace"
              />
            </svg>

            <div className="relative mt-auto pt-10">
              <Magnetic>
                <a
                  href={CONTACT.phoneHref}
                  className="group inline-flex items-center gap-3 rounded-full bg-pearl px-7 py-4 text-lg font-semibold text-ink shadow-[0_20px_60px_-15px_rgba(44,198,211,0.5)] transition-shadow hover:shadow-[0_24px_80px_-10px_rgba(44,198,211,0.8)]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-aqua">
                    <Phone size={17} strokeWidth={2.3} />
                  </span>
                  Emergency call
                </a>
              </Magnetic>
              <p className="mt-4 font-display text-2xl tracking-tight text-pearl/80">{CONTACT.phone}</p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
