import Lenis from "lenis";

/**
 * Smooth scrolling for mouse wheels and trackpads. Touch devices keep their
 * native scrolling (Lenis leaves touch alone by default), which is already
 * smooth and keeps the scroll-linked animations on the compositor.
 */
let lenis: Lenis | null = null;

export function startSmoothScroll() {
  if (lenis || typeof window === "undefined") return;
  lenis = new Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true });
}

export function stopSmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.8 });
  else window.scrollTo({ top: y, behavior: "smooth" });
}
