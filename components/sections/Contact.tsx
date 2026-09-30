import { ArrowRight, Mail, MapPin, Navigation, Phone } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import { FadeUp, SplitReveal } from "@/components/ui/Reveal";
import { CONTACT, whatsappHref } from "@/lib/content";

export default function Contact() {
  return (
    <section id="contact" className="relative z-10 overflow-hidden bg-ink px-5 py-28 text-pearl md:px-10 md:py-40">
      <div className="cta-glow pointer-events-none absolute left-1/2 top-0 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/3 rounded-full" aria-hidden />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <p className="rounded-full border border-aqua/30 bg-aqua/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-aqua-light">
            Contact & appointments
          </p>
          <h2 className="mt-8 font-display text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-tightest">
            <SplitReveal text="We're here," className="block" />
            <SplitReveal text="day and night." className="block italic text-aqua" delay={0.15} />
          </h2>
          <FadeUp delay={0.25}>
            <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-pearl/70 md:text-lg">
              Call or WhatsApp to book a consultation. For emergencies, call the hospital directly.
            </p>
          </FadeUp>
          <FadeUp delay={0.35} className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <a
                href={CONTACT.phoneHref}
                className="group inline-flex items-center gap-3 rounded-full bg-aqua px-9 py-5 text-lg font-semibold text-ink shadow-[0_20px_60px_-15px_rgba(44,198,211,0.6)] transition-shadow hover:shadow-[0_24px_80px_-10px_rgba(44,198,211,0.85)]"
              >
                Call {CONTACT.phone}
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn btn-outline-pearl py-5">
              WhatsApp appointment
            </a>
          </FadeUp>
        </div>

        <div className="mt-20 grid gap-6 md:mt-28 lg:grid-cols-[1fr_1.4fr]">
          <FadeUp className="rounded-[2rem] border border-pearl/10 bg-pearl/[0.04] p-8 md:p-10">
            <h3 className="font-display text-3xl font-semibold tracking-tight">Vignesh Hospital</h3>
            <ul className="mt-8 space-y-6 text-pearl/80">
              <li className="flex gap-4">
                <MapPin size={20} className="mt-0.5 shrink-0 text-aqua" />
                <address className="not-italic leading-relaxed">
                  {CONTACT.address.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex gap-4">
                <Phone size={20} className="mt-0.5 shrink-0 text-aqua" />
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-pearl/40">Phone / WhatsApp</span>
                  <a href={CONTACT.phoneHref} className="link-underline text-lg text-pearl">
                    {CONTACT.phone}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <Mail size={20} className="mt-0.5 shrink-0 text-aqua" />
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-pearl/40">Email</span>
                  <a href={`mailto:${CONTACT.email}`} className="link-underline break-all text-pearl">
                    {CONTACT.email}
                  </a>
                </span>
              </li>
            </ul>
            <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer" className="btn btn-outline-pearl mt-10">
              <Navigation size={16} /> Open in Google Maps
            </a>
          </FadeUp>

          <FadeUp delay={0.1} className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-pearl/10">
            <iframe
              title="Vignesh Hospital on the map"
              src={CONTACT.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.35)_contrast(1.05)]"
            />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
