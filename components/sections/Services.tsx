import { Baby, Brain, Microscope, MonitorSmartphone, Smile, Stethoscope } from "lucide-react";
import { FadeUp, SplitReveal } from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

const SERVICES = [
  {
    icon: Stethoscope,
    title: "Comprehensive Pediatrics",
    body: "Routine and emergency pediatric consultation, inpatient care, childhood illnesses, growth and nutrition monitoring, vaccination, nebulization and day-care treatment.",
  },
  {
    icon: Brain,
    title: "Developmental Pediatrics",
    body: "Developmental surveillance and assessment, speech/language delay, autism screening and assessment, ADHD and behavioral concerns, learning difficulties and coordinated therapy referrals.",
  },
  {
    icon: Baby,
    title: "Newborn & Infant Care",
    body: "Basic newborn care, feeding support, jaundice assessment, phototherapy, growth monitoring, immunization and developmental follow-up.",
  },
  {
    icon: Smile,
    title: "Dental Care",
    body: "Oral medicine & radiology, orthodontics, pediatric dentistry, extraction, dentures and root canal treatment, by prior appointment.",
  },
  {
    icon: Microscope,
    title: "Diagnostics",
    body: "Laboratory 8 AM–8 PM, in-house routine investigations and coordinated outsourced specialized blood tests. X-ray 8 AM–8 PM. ECG 24×7.",
  },
  {
    icon: MonitorSmartphone,
    title: "Digital Hospital",
    body: "Electronic patient records through HealthPlix, pharmacy management through eVitalRx and online consultation with prior appointment.",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative z-10 bg-mist px-5 pb-24 md:px-10 md:pb-36">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Our services</p>
            <SplitReveal as="h2" text="Everything a growing family needs." className="h-section mt-4 block max-w-3xl" />
          </div>
          <FadeUp delay={0.2}>
            <p className="max-w-sm text-base leading-relaxed text-slate md:text-lg">
              From a newborn&apos;s first check-up to a parent&apos;s root canal, six services under one roof.
            </p>
          </FadeUp>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, body }, i) => (
            <FadeUp as="li" key={title} delay={(i % 3) * 0.08}>
              <TiltCard className="h-full">
                <div className="flex h-full flex-col p-7 md:p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-aqua/15 text-aqua-dark transition-colors duration-300 group-hover:bg-aqua group-hover:text-ink">
                    <Icon size={22} strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight text-ink">{title}</h3>
                  <p className="mt-3 leading-relaxed text-slate">{body}</p>
                  <span className="mt-auto pt-8 text-xs font-semibold uppercase tracking-[0.18em] text-aqua-dark">
                    0{i + 1}
                  </span>
                </div>
              </TiltCard>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}
