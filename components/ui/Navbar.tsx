"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CONTACT, NAV_LINKS } from "@/lib/content";
import { LogoInline } from "./Logo";

/** Glass navbar that slides in once the hero story is behind us. */
export default function Navbar() {
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = shown || open;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[60] px-4 pt-4 md:px-6"
      initial={false}
      animate={{ y: visible ? 0 : -120, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!visible}
    >
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-pearl/10 bg-ink/[0.94] py-1.5 pl-2 pr-2 text-pearl shadow-[0_18px_50px_-20px_rgba(8,28,46,0.6)] backdrop-blur-xl backdrop-saturate-150"
        aria-label="Primary"
      >
        <a href="#top" aria-label="Vignesh Hospital home" tabIndex={visible ? 0 : -1}>
          <LogoInline light />
        </a>

        <ul className="hidden items-center gap-7 text-sm font-medium text-pearl/80 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="link-underline transition-colors hover:text-pearl" tabIndex={visible ? 0 : -1}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={CONTACT.phoneHref}
            className="inline-flex items-center gap-2 rounded-full bg-aqua px-4 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 sm:px-5"
            tabIndex={visible ? 0 : -1}
          >
            <Phone size={15} strokeWidth={2.2} />
            <span className="hidden sm:inline">Call</span> {CONTACT.phone}
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-pearl lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            tabIndex={visible ? 0 : -1}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-pearl/10 bg-ink/90 p-2 text-pearl backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 font-display text-2xl hover:bg-pearl/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
