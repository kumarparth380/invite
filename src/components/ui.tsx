"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Ornament } from "./art/Decor";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades content up once it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="text-center">
      <p className="inv-label text-[2.9cqw] text-gold">{label}</p>
      <h2 className="inv-script mt-[1.5cqw] text-[8.5cqw] leading-[1.15] text-ink">{title}</h2>
      <Ornament className="mt-[2.5cqw] w-[30cqw]" />
    </div>
  );
}

/**
 * An address that, if it has to wrap, breaks after the place name
 * ("…बैंक्वेट एंड लॉन," / "बेलइसा, आजमगढ़") rather than in the middle of it.
 */
export function Address({ text }: { text: string }) {
  const cut = text.indexOf(", ");
  if (cut < 0) return text;
  return (
    <>
      <span className="inline-block">{text.slice(0, cut + 1)}</span>{" "}
      <span className="inline-block">{text.slice(cut + 2)}</span>
    </>
  );
}

export function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.1em]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.1em]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.1em]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" />
    </svg>
  );
}
