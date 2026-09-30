"use client";

/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, Clock } from "lucide-react";
import { DOCTORS, whatsappHref } from "@/lib/content";
import { FadeUp, SplitReveal } from "@/components/ui/Reveal";

export default function Doctors() {
  return (
    <section id="doctors" className="relative z-10 bg-pearl px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow">Our consultants</p>
          <SplitReveal as="h2" text="Doctors your family will know by name." className="h-section mt-4 block" />
          <FadeUp delay={0.2}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-slate md:text-lg">
              A consultant pediatrician and developmental pediatrician, and a dental surgeon, both seeing patients
              right here at Yallapura.
            </p>
          </FadeUp>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2">
          {DOCTORS.map((d, i) => (
            <FadeUp as="li" key={d.name} delay={i * 0.12} className={i === 1 ? "sm:mt-20" : undefined}>
              <article className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-aqua-light/60 to-mist">
                  <img
                    src={d.photo}
                    alt={`Portrait of ${d.name}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" aria-hidden />
                  <p className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-full bg-pearl/90 px-3.5 py-2 text-xs font-semibold text-ink backdrop-blur">
                    <Clock size={14} className="shrink-0 text-aqua-dark" />
                    {d.opd}
                  </p>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">{d.name}</h3>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-aqua-dark">{d.degrees}</p>
                  </div>
                  <a
                    href={whatsappHref(`Hello Vignesh Hospital, I would like to book an appointment with ${d.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Book with ${d.name} on WhatsApp`}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/15 text-ink transition-all duration-300 group-hover:rotate-45 group-hover:border-aqua group-hover:bg-aqua"
                  >
                    <ArrowUpRight size={18} />
                  </a>
                </div>
                <p className="mt-3 leading-relaxed text-ink/80">{d.role}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate">{d.note}</p>
              </article>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}
