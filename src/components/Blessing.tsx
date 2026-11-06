"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { invite } from "@/content/invite";
import { Ornament } from "./art/Decor";

function Person({
  honorific,
  fullName,
  relation,
  parents,
}: {
  honorific: string;
  fullName: string;
  relation: string;
  parents: string;
}) {
  return (
    <div>
      <p className="inv-label text-[3cqw] text-gold">{honorific}</p>
      <p className="inv-script mt-[0.5cqw] text-[12.5cqw] leading-[1.1] text-accent">{fullName}</p>
      <p className="inv-label mx-auto mt-[1.5cqw] max-w-[66cqw] text-[3.3cqw] leading-snug font-semibold text-muted">
        {relation} : {parents}
      </p>
    </div>
  );
}

/**
 * The invitation text. It is pulled up under the pinned hero and fades in,
 * rising and growing as the camera passes through the temple archway. `progress` is the hero's scroll progress.
 */
export function Blessing({ progress }: { progress: MotionValue<number> }) {
  const { bride, groom } = invite;
  const opacity = useTransform(progress, [0, 0.6, 0.88, 1], [0, 0, 1, 1]);
  // Opacity and transform only: both run on the compositor, so scrolling stays smooth.
  const scale = useTransform(progress, [0, 0.6, 0.95, 1], [0.86, 0.86, 1, 1]);
  const y = useTransform(progress, [0, 0.6, 0.95, 1], [60, 60, 0, 0]);

  return (
    <section
      id="nimantran"
      className="relative z-10 -mt-[86svh] px-[11cqw] pt-[14svh] pb-[12cqw] text-center"
    >
      <motion.div style={{ opacity, scale, y, transformOrigin: "50% 0%" }}>
        <Ornament className="w-[30cqw]" />
        <p className="inv-serif mt-[4cqw] text-[3.5cqw] leading-relaxed text-bronze italic">
          वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
          <br />
          निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
        </p>

        <p className="inv-label mt-[6cqw] text-[3cqw] text-gold">सादर निमंत्रण</p>
        <p className="inv-serif mt-[3cqw] text-[4.7cqw] leading-snug text-ink">
          परमपिता परमेश्वर की असीम अनुकम्पा से हम आपको सपरिवार सादर आमंत्रित करते हैं कि
          आप पधारकर इस मंगल बेला की शोभा बढ़ाएँ एवं नवदम्पति को अपना शुभाशीर्वाद प्रदान करें।
        </p>

        <Ornament className="my-[7cqw] w-[30cqw]" />

        <Person {...bride} />
        <p className="inv-script my-[4cqw] text-[8cqw] leading-none text-ink">संग</p>
        <Person {...groom} />

        <p className="inv-serif mt-[8cqw] text-[3.8cqw] text-muted italic">
          प्रभु श्री गणेश जी के शुभाशीर्वाद से
        </p>
      </motion.div>
    </section>
  );
}
