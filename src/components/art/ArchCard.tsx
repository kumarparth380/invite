"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { r2 } from "./svg";

/** Height of the arch (apex to where the straight sides begin), as a share of the card width. */
const ARCH = 0.22;
const RADIUS = 12;
/** Gap between the outer outline and the inner rule, in px. */
const INSET = 6;

/**
 * Outline of an arch-topped card, `d` px inside a w×h box. The arch is an
 * ogee: a rounded shoulder that turns concave and rises to a point.
 * Every inset shares the same shoulder line, so the rules stay parallel.
 */
function framePath(w: number, h: number, d: number) {
  const left = d;
  const right = w - d;
  const bottom = h - d;
  const apex = d * 1.6; // a pointed tip needs a deeper inset to look parallel
  const shoulder = w * ARCH;
  const rad = Math.max(RADIUS - d, 2);
  const p = (u: number, v: number) =>
    `${r2(left + u * (right - left))},${r2(apex + v * (shoulder - apex))}`;

  return [
    `M${p(0, 1)}`,
    `C${p(0, 0.6)} ${p(0.1, 0.45)} ${p(0.28, 0.36)}`,
    `C${p(0.4, 0.3)} ${p(0.47, 0.2)} ${p(0.5, 0)}`,
    `C${p(0.53, 0.2)} ${p(0.6, 0.3)} ${p(0.72, 0.36)}`,
    `C${p(0.9, 0.45)} ${p(1, 0.6)} ${p(1, 1)}`,
    `L${r2(right)},${r2(bottom - rad)}`,
    `A${r2(rad)},${r2(rad)} 0 0 1 ${r2(right - rad)},${r2(bottom)}`,
    `L${r2(left + rad)},${r2(bottom)}`,
    `A${r2(rad)},${r2(rad)} 0 0 1 ${r2(left)},${r2(bottom - rad)}`,
    "Z",
  ].join(" ");
}

/**
 * A card with a pointed-arch top. The whole outline — arch, sides and
 * rounded bottom — is one path drawn at the card's measured size, so the
 * border is continuous and the arch keeps its shape at any card height.
 */
export function ArchCard({
  fill,
  stroke,
  className = "",
  children,
}: {
  fill: string;
  stroke: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // borderBoxSize ignores the card's entrance transform and keeps sub-pixel widths.
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0];
      setSize({
        w: box?.inlineSize ?? el.offsetWidth,
        h: box?.blockSize ?? el.offsetHeight,
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {size && (
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          fill="none"
          stroke={stroke}
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={framePath(size.w, size.h, 0.5)} fill={fill} strokeWidth="1.2" />
          <path d={framePath(size.w, size.h, INSET + 0.5)} strokeWidth="0.8" strokeOpacity="0.5" />
          {/* Lotus-bud finial on the apex. */}
          <g transform={`translate(${r2(size.w / 2)} 0)`} fill={stroke} stroke="none">
            <path d="M0,-11 C3.4,-7.4 3.4,-3.6 0,-0.4 C-3.4,-3.6 -3.4,-7.4 0,-11 Z" />
            <circle cy="-13.6" r="1.3" />
          </g>
        </svg>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
