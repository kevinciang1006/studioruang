export function revealClassNameFor(
  isIntersecting: boolean,
  prefersReducedMotion: boolean
): "reveal-visible" | "reveal-hidden" {
  if (prefersReducedMotion) return "reveal-visible";
  return isIntersecting ? "reveal-visible" : "reveal-hidden";
}
