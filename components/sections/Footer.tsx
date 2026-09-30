import { LogoInline } from "@/components/ui/Logo";
import { CONTACT, NAV_LINKS } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-pearl/10 bg-ink px-5 pb-32 pt-16 text-pearl md:px-10 md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:items-start">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <LogoInline light className="[&>span:first-child]:h-14 [&>span:first-child]:w-14 [&>span:last-child]:text-2xl" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-pearl/50">
            Information on this website is for patient guidance and does not replace medical evaluation. For
            emergencies, call the hospital directly.
          </p>
        </div>

        <nav aria-label="Footer" className="text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pearl/40">Explore</p>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-underline text-pearl/80 hover:text-pearl">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pearl/40">Reach us</p>
          <ul className="mt-4 space-y-2 text-pearl/80">
            <li>
              <a href={CONTACT.phoneHref} className="link-underline hover:text-pearl">
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="link-underline hover:text-pearl">
                {CONTACT.email}
              </a>
            </li>
            <li className="text-pearl/60">Yallapura, Tumkur 572106</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-pearl/10 pt-6 text-xs text-pearl/40 md:flex-row">
        <p>© {new Date().getFullYear()} Vignesh Hospital, Tumkur. All rights reserved.</p>
        <p>24×7 Emergency · Admission · Pharmacy · ECG</p>
      </div>
    </footer>
  );
}
