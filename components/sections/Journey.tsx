"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SplitReveal } from "@/components/ui/Reveal";

const STEPS = [
  {
    title: "Book",
    body: "Call or WhatsApp 6361035840. Specialist, dental and online consultations are by prior appointment.",
    tags: ["Phone", "WhatsApp", "Online consultation"],
    photo: "/images/front-desk.jpg",
  },
  {
    title: "Consult",
    body: "Pediatric OPD 1–2 PM and 6:30–9 PM. Vaccinations in the morning hours, and a duty doctor from 10 PM to 8 AM.",
    tags: ["OPD", "Vaccination", "Night duty doctor"],
    photo: "/images/consultation-room.jpg",
  },
  {
    title: "Diagnose",
    body: "In-house laboratory and X-ray from 8 AM to 8 PM, specialised blood tests coordinated for you, and ECG around the clock.",
    tags: ["Laboratory", "X-ray", "ECG 24×7"],
    photo: "/images/laboratory.jpg",
  },
  {
    title: "Recover",
    body: "Day-care treatment, inpatient admission in our 20-bed hospital and a 24×7 pharmacy on site.",
    tags: ["Day-care", "Inpatient", "Pharmacy"],
    photo: "/images/pediatric-ward.jpg",
  },
];

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const dist = () => Math.max(0, el.scrollWidth - window.innerWidth);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(el, { x: () => -dist() }, 0).fromTo(bar.current, { scaleX: 0 }, { scaleX: 1 }, 0);
      // Photos drift inside their frames as the track moves.
      el.querySelectorAll("img").forEach((img) => tl.fromTo(img, { xPercent: -6 }, { xPercent: 6 }, 0));
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="journey" ref={root} className="relative z-10 overflow-hidden bg-mist">
      <div className="flex flex-col justify-center py-24 md:py-32 lg:h-screen lg:py-0">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
          <p className="eyebrow">Your visit</p>
          <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SplitReveal as="h2" text="From first call to full recovery." className="h-section block max-w-3xl" />
            <div className="hidden h-px w-64 bg-ink/10 lg:block" aria-hidden>
              <div ref={bar} className="h-full origin-left bg-aqua" />
            </div>
          </div>
        </div>

        <div
          ref={track}
          className="mt-14 flex flex-col gap-0 px-5 md:px-10 lg:mt-16 lg:w-max lg:flex-row lg:gap-6 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-[12vw]"
        >
          {STEPS.map((s, i) => (
            <article
              key={s.title}
              className="relative flex gap-6 pb-12 last:pb-0 lg:grid lg:w-[min(46rem,58vw)] lg:grid-cols-[1fr_1.05fr] lg:gap-0 lg:overflow-hidden lg:rounded-[2rem] lg:border lg:border-ink/10 lg:bg-pearl lg:pb-0"
            >
              {/* Mobile timeline rail */}
              <div className="relative flex flex-col items-center lg:hidden" aria-hidden>
                <span className="mt-2 h-3 w-3 rounded-full bg-aqua ring-4 ring-aqua/20" />
                {i < STEPS.length - 1 && <span className="mt-2 w-px flex-1 bg-ink/15" />}
              </div>
              <div className="lg:p-10">
                <span className="step-num font-display text-6xl font-semibold leading-none lg:text-[7rem]">0{i + 1}</span>
                <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink lg:mt-8 lg:text-4xl">{s.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-slate lg:text-lg">{s.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li key={t} className="rounded-full bg-aqua/10 px-3 py-1 text-xs font-semibold text-aqua-dark">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative hidden overflow-hidden lg:block">
                <img src={s.photo} alt="" loading="lazy" className="absolute inset-0 h-full w-full scale-[1.15] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-pearl/30 to-transparent" aria-hidden />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
