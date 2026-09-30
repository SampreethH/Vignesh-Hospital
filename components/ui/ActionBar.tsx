"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { CONTACT, whatsappHref } from "@/lib/content";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43m8.03-17.46A11.28 11.28 0 0 0 12.05.7C5.8.7.7 5.78.7 12.04c0 2 .52 3.95 1.52 5.67L.6 23.6l6.03-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.25 0 11.34-5.09 11.35-11.34 0-3.03-1.18-5.88-3.33-8.02" />
    </svg>
  );
}

/**
 * Desktop: floating WhatsApp button. Phones: a two-button Call / WhatsApp bar,
 * because for a hospital the call button should never be more than a thumb away.
 */
export default function ActionBar() {
  return (
    <>
      <motion.a
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Book an appointment on WhatsApp"
        className="fixed bottom-8 right-8 z-50 hidden h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] md:grid"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <WhatsAppIcon className="h-7 w-7" />
      </motion.a>

      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-pearl/10 bg-ink/90 px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl md:hidden"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ delay: 1.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href={CONTACT.phoneHref} className="flex items-center justify-center gap-2 rounded-2xl bg-aqua py-3 text-sm font-bold text-ink">
          <Phone size={16} strokeWidth={2.4} /> Call hospital
        </a>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366]/15 py-3 text-sm font-bold text-[#5BE38E]"
        >
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp
        </a>
      </motion.div>
    </>
  );
}
