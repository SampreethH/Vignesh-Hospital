import type Lenis from "lenis";

/** Handle on the smooth-scroll instance so overlays can pause it. Null with reduced motion. */
export const scroll: { lenis: Lenis | null } = { lenis: null };
