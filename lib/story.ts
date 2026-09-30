/**
 * Mutable store shared between the DOM (GSAP/ScrollTrigger, pointer events)
 * and the WebGL scene. The canvas reads it every frame, so plain mutation is
 * intentional: no React re-renders on scroll or pointer move.
 */
export const story = {
  /** 0 = hero field, 1 = heartbeat line, 2 = heart, 3 = logo coin */
  progress: 0,
  /** 0 → 1 once the story is over and the canvas should be gone */
  exit: 0,
  /** 0 → 1 intro fade-in of the particle field */
  intro: 0,
  /** Normalised pointer, -1..1 on both axes (y up) */
  pointer: { x: 0, y: 0 },
  /** True once the pointer has moved at least once (desktop) or tilt is live */
  pointerActive: false,
  /** Set once the loader hands over to the page */
  introStarted: false,
};

export const INTRO_EVENT = "vh:intro";

type Listener = (active: boolean) => void;
const listeners = new Set<Listener>();
let canvasActive = true;

/** Toggle the render loop off once the canvas is fully hidden. */
export function setCanvasActive(active: boolean) {
  if (active === canvasActive) return;
  canvasActive = active;
  listeners.forEach((l) => l(active));
}

export function onCanvasActive(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
