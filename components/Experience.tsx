"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scroll } from "@/lib/scroll";
import { setCanvasActive, story } from "@/lib/story";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

/**
 * Global client layer: Lenis smooth scroll wired into GSAP's ticker,
 * pointer / device-tilt tracking for the 3D scene, and the fixed canvas.
 */
export default function Experience() {
  const canvasWrap = useRef<HTMLDivElement>(null);

  // Smooth scroll.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -88 } });
    scroll.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      scroll.lenis = null;
    };
  }, []);

  // Pointer (mouse) and tilt (touch devices that allow it without a prompt).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      story.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      story.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      story.pointerActive = true;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      story.pointer.x = gsap.utils.clamp(-1, 1, e.gamma / 35);
      story.pointer.y = gsap.utils.clamp(-1, 1, (45 - e.beta) / 35);
      story.pointerActive = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    if (window.matchMedia("(pointer: coarse)").matches) {
      window.addEventListener("deviceorientation", onTilt, { passive: true });
    }
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  // Fade the canvas out as the first light section covers it, then stop rendering.
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#about",
      start: "top bottom",
      end: "top top",
      refreshPriority: -1,
      onUpdate: (self) => {
        story.exit = self.progress;
        if (canvasWrap.current) canvasWrap.current.style.opacity = String(1 - self.progress);
        setCanvasActive(self.progress < 1);
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={canvasWrap} className="pointer-events-none fixed inset-0 z-0 bg-ink">
      <Scene />
    </div>
  );
}
