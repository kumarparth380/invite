/** Round so server and browser render byte-identical SVG attributes. */
export const r2 = (n: number) => Math.round(n * 100) / 100;

/** Point on a polar circle (degrees, 0 = right, clockwise in SVG space). */
export const polar = (cx: number, cy: number, radius: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: r2(cx + radius * Math.cos(a)), y: r2(cy + radius * Math.sin(a)) };
};

/** Evenly spaced points along a quadratic Bézier. */
export const quadPoints = (
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  count: number,
) =>
  Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const u = 1 - t;
    return {
      x: r2(u * u * x0 + 2 * u * t * cx + t * t * x1),
      y: r2(u * u * y0 + 2 * u * t * cy + t * t * y1),
    };
  });

/** React's useId contains characters that are awkward inside url(#…). */
export const safeId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");
