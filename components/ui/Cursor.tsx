"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, [role='button'], [data-cursor]";

/** Aqua dot + trailing ring that grows over links and says "View" over photos. Fine pointers only. */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let hovering = false;
    let viewing = false;
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = pos.x;
        ringPos.y = pos.y;
        dot.current?.classList.add("opacity-100");
        ring.current?.classList.add("opacity-100");
      }
      const el = e.target as Element | null;
      const nextView = !!el?.closest?.("[data-cursor='view']");
      const next = !nextView && !!el?.closest?.(INTERACTIVE);
      if (next !== hovering) {
        hovering = next;
        ring.current?.setAttribute("data-hover", String(next));
      }
      if (nextView !== viewing) {
        viewing = nextView;
        ring.current?.setAttribute("data-view", String(nextView));
      }
    };
    const onLeave = () => {
      visible = false;
      dot.current?.classList.remove("opacity-100");
      ring.current?.classList.remove("opacity-100");
    };
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring pointer-events-none fixed left-0 top-0 z-[100] opacity-0" aria-hidden>
        <span />
      </div>
      <div ref={dot} className="cursor-dot pointer-events-none fixed left-0 top-0 z-[101] opacity-0" aria-hidden>
        <span />
      </div>
    </>
  );
}
