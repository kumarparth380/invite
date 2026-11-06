/** Round so server and browser render byte-identical SVG attributes. */
export const r2 = (n: number) => Math.round(n * 100) / 100;

/** Point on a polar circle (degrees, 0 = right, clockwise in SVG space). */
export const polar = (cx: number, cy: number, radius: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: r2(cx + radius * Math.cos(a)), y: r2(cy + radius * Math.sin(a)) };
};
