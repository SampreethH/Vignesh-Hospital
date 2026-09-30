/* eslint-disable @next/next/no-img-element */
import clsx from "@/lib/clsx";

/** The real hospital seal in a pearl chip, so it sits cleanly on navy or white. */
export function Seal({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-block shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-black/5", className)}>
      <img src="/images/logo.jpg" alt="" className="h-full w-full object-cover" />
    </span>
  );
}

export function Wordmark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={clsx("flex flex-col leading-none", className)}>
      <span className="font-display text-[1.15em] font-semibold tracking-tight">
        Vignesh<span className="text-aqua">.</span>
      </span>
      <span className={clsx("mt-1 hidden whitespace-nowrap text-[0.55em] font-semibold uppercase tracking-[0.28em] sm:block", light ? "text-pearl/55" : "text-slate")}>
        Hospital · Tumkur
      </span>
    </span>
  );
}

export function LogoInline({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <Seal className="h-10 w-10" />
      <Wordmark className="text-lg" light={light} />
    </span>
  );
}
