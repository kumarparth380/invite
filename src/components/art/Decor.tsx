import { polar, r2 } from "./svg";

/** Thin divider with a lotus bud in the middle. */
export function Ornament({
  className = "",
  color = "#b9853f",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 20"
      className={`mx-auto block ${className}`}
      fill="none"
      stroke={color}
      strokeWidth="0.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4,11 H44" strokeOpacity="0.7" />
      <path d="M76,11 H116" strokeOpacity="0.7" />
      <circle cx="48.5" cy="11" r="1.1" fill={color} stroke="none" />
      <circle cx="71.5" cy="11" r="1.1" fill={color} stroke="none" />
      <path d="M60,2.5 C63.5,6.5 63.5,12 60,16 C56.5,12 56.5,6.5 60,2.5 Z" />
      <path d="M60,16 C55,15 51.5,11 52,6.5 C55.5,8 58.5,11.5 60,16 Z" />
      <path d="M60,16 C65,15 68.5,11 68,6.5 C64.5,8 61.5,11.5 60,16 Z" />
      <path d="M53,17.5 H67" strokeOpacity="0.6" />
    </svg>
  );
}

/** Concentric petal rings, used as a faint watermark. */
export function Mandala({ className = "" }: { className?: string }) {
  const rings = [
    { r: 40, n: 8, rx: 9, ry: 20 },
    { r: 78, n: 12, rx: 12, ry: 26 },
    { r: 122, n: 16, rx: 14, ry: 30 },
    { r: 168, n: 24, rx: 12, ry: 26 },
  ];
  return (
    <svg
      viewBox="-200 -200 400 400"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <circle r="14" />
      <circle r="24" />
      {rings.map((ring) =>
        Array.from({ length: ring.n }, (_, i) => {
          const deg = (360 / ring.n) * i;
          const p = polar(0, 0, ring.r, deg);
          return (
            <ellipse
              key={`${ring.r}-${i}`}
              cx={p.x}
              cy={p.y}
              rx={ring.rx}
              ry={ring.ry}
              transform={`rotate(${r2(deg + 90)} ${p.x} ${p.y})`}
            />
          );
        }),
      )}
      <circle r="60" strokeOpacity="0.6" />
      <circle r="100" strokeOpacity="0.6" />
      <circle r="146" strokeOpacity="0.6" />
      <circle r="196" strokeDasharray="2 6" />
    </svg>
  );
}

/** Corner flourish for the card frame (drawn for the top-left corner). */
export function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2,58 V14 Q2,2 14,2 H58" />
      <path d="M8,58 V18 Q8,8 18,8 H58" strokeOpacity="0.55" />
      <path d="M14,14 C22,10 30,14 30,22 C30,28 24,30 20,27 C17,25 18,20 22,20" />
      <path d="M30,22 C38,20 44,24 46,30" strokeOpacity="0.7" />
      <path d="M22,30 C20,38 24,44 30,46" strokeOpacity="0.7" />
      <circle cx="14" cy="14" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="48" cy="32" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="32" cy="48" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Pointed (ogee) arch that tops each event card. */
export function ArchTop({
  fill,
  stroke,
  className = "",
}: {
  fill: string;
  stroke: string;
  className?: string;
}) {
  const outline =
    "M0.5,40 L0.5,24 C0.5,14 14,11 30,7.5 C41,5 47,3.5 50,0.6 C53,3.5 59,5 70,7.5 C86,11 99.5,14 99.5,24 L99.5,40";
  const inner =
    "M4.5,27 L4.5,25.5 C4.5,17.5 16,15 31,11.6 C41,9.4 46.5,8 50,5.4 C53.5,8 59,9.4 69,11.6 C84,15 95.5,17.5 95.5,25.5 L95.5,27";
  return (
    <svg
      viewBox="0 -0.5 100 40.5"
      preserveAspectRatio="none"
      className={`block w-full ${className}`}
      aria-hidden="true"
    >
      <path d={`${outline} Z`} fill={fill} />
      <path
        d={outline}
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={inner}
        fill="none"
        stroke={stroke}
        strokeOpacity="0.45"
        strokeWidth="1"
        strokeDasharray="2 3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Small line icons for each ceremony. */
export function EventIcon({
  kind,
  className = "",
  color,
}: {
  kind: "haldi" | "mehndi" | "wedding";
  className?: string;
  color: string;
}) {
  const common = {
    viewBox: "0 0 48 48",
    className,
    fill: "none",
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (kind === "haldi") {
    // A bowl of turmeric paste with a sprig of leaves.
    return (
      <svg {...common}>
        <path d="M8,26 H40 C40,35 33,41 24,41 C15,41 8,35 8,26 Z" fill={color} fillOpacity="0.14" />
        <path d="M13,26 C15,20 33,20 35,26" fill={color} fillOpacity="0.35" />
        <path d="M18,41 L17,44 H31 L30,41" />
        <path d="M30,20 C31,13 35,9 40,8 C40,14 36,18 30,20 Z" />
        <path d="M30,20 C27,15 22,13 18,14 C20,19 24,21 30,20 Z" />
        <circle cx="24" cy="32" r="1.4" fill={color} stroke="none" />
        <circle cx="18" cy="31" r="1" fill={color} stroke="none" />
        <circle cx="30" cy="31" r="1" fill={color} stroke="none" />
      </svg>
    );
  }

  if (kind === "mehndi") {
    // A hand with a mehndi motif, next to a dholak.
    return (
      <svg {...common}>
        <path d="M14,42 C9,38 7,32 8,27 L9,18 C9,16.5 11.5,16.5 11.5,18 V25 M11.5,25 V12 C11.5,10.3 14.5,10.3 14.5,12 V23 M14.5,23 V9.5 C14.5,7.8 17.5,7.8 17.5,9.5 V23 M17.5,23 V11 C17.5,9.3 20.5,9.3 20.5,11 V26 L22.5,22.5 C23.5,20.8 26,21.8 25.2,23.6 L21.5,33 C20,37 18,40 18,42" />
        <circle cx="15.5" cy="30" r="2.6" />
        <circle cx="15.5" cy="30" r="0.8" fill={color} stroke="none" />
        <path d="M11.5,36 C13.5,35 17.5,35 19.5,36" strokeOpacity="0.7" />
        <ellipse cx="34" cy="31" rx="7" ry="9" fill={color} fillOpacity="0.14" />
        <ellipse cx="34" cy="22" rx="5.5" ry="1.8" />
        <ellipse cx="34" cy="40" rx="5.5" ry="1.8" />
        <path d="M28.6,23 L39.4,39 M39.4,23 L28.6,39" strokeOpacity="0.6" />
      </svg>
    );
  }

  // A kalash: round pot, five mango leaves fanned behind a coconut.
  return (
    <svg {...common}>
      {[-64, -32, 0, 32, 64].map((a) => (
        <path
          key={a}
          transform={`translate(24 19) rotate(${a})`}
          d="M0,0 C-3,-4 -3,-10 0,-14 C3,-10 3,-4 0,0 Z"
          fill={color}
          fillOpacity="0.18"
        />
      ))}
      <path d="M24,7.5 C28,10 29.5,14.5 27.6,17.6 C26.2,19.6 21.8,19.6 20.4,17.6 C18.5,14.5 20,10 24,7.5 Z" fill="#fdf6ec" />
      <path d="M24,7.5 C28,10 29.5,14.5 27.6,17.6 C26.2,19.6 21.8,19.6 20.4,17.6 C18.5,14.5 20,10 24,7.5 Z" fill={color} fillOpacity="0.3" />
      <path d="M13,20 H35" />
      <path d="M16,20 L18,24 H30 L32,20" />
      <path d="M18,24 C9,27 8,39 15,43 H33 C40,39 39,27 30,24" fill={color} fillOpacity="0.14" />
      <path d="M11.5,32 H36.5" strokeOpacity="0.6" />
      <circle cx="19" cy="37" r="1.2" fill={color} stroke="none" />
      <circle cx="24" cy="38" r="1.2" fill={color} stroke="none" />
      <circle cx="29" cy="37" r="1.2" fill={color} stroke="none" />
    </svg>
  );
}
