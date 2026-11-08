"use client";

import { motion } from "motion/react";
import { invite } from "@/content/invite";
import { DoorLeafImage, TempleImage, TopHaze } from "./art/Photos";
import { SealFace, SealWreath } from "./art/Seal";

const DOOR_EASE = [0.65, 0, 0.35, 1] as const;

/**
 * Closed carved doors with a gold seal. Tapping the seal swings the doors
 * open onto the same temple view the hero shows, so the hand-off is seamless.
 */
export function Gate({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  const doorTransition = { duration: 1.8, ease: DOOR_EASE, delay: 0.2 };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeOut" } }}
    >
      <div className="@container relative h-full w-full max-w-[480px] overflow-hidden bg-[#3a1a10] [perspective:140cqw]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12 }}
          animate={opening ? { scale: 1 } : { scale: 1.12 }}
          transition={{ duration: 2.3, ease: DOOR_EASE }}
        >
          <TempleImage />
          <TopHaze />
        </motion.div>

        {/* Door leaves: one photo, mirrored for the right side. */}
        <motion.div
          className="absolute inset-y-0 left-0 w-[calc(50%+1px)] origin-left [backface-visibility:hidden]"
          animate={opening ? { rotateY: -100 } : { rotateY: 0 }}
          transition={doorTransition}
        >
          <DoorLeafImage />
          <div className="absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-black/30 to-transparent" />
        </motion.div>
        <motion.div
          className="absolute inset-y-0 right-0 w-[calc(50%+1px)] origin-right [backface-visibility:hidden]"
          animate={opening ? { rotateY: 100 } : { rotateY: 0 }}
          transition={doorTransition}
        >
          <DoorLeafImage className="-scale-x-100" />
          <div className="absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-black/30 to-transparent" />
        </motion.div>

        {/* Seal */}
        <motion.button
          type="button"
          onClick={onOpen}
          disabled={opening}
          aria-label="निमंत्रण खोलें"
          className="@container absolute top-1/2 left-1/2 z-10 grid size-[25cqw] -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full outline-none will-change-transform focus-visible:ring-4 focus-visible:ring-[#f3d98a]/70"
          animate={opening ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeIn" }}
          whileTap={{ scale: 0.94 }}
        >
          <SealWreath className="absolute top-1/2 left-1/2 size-[176%] -translate-x-1/2 -translate-y-1/2" />
          {/* A ring of light that keeps pulsing out over the roses: "tap here". */}
          <span className="inv-ping absolute inset-0 rounded-full border-2 border-[#fbe9b4] shadow-[0_0_14px_rgba(251,233,180,.9)]" />
          <SealFace monogram={invite.monogram} />
        </motion.button>

        {/* Uneven padding centres the Devanagari ink, which sits high in its line box. */}
        <motion.p
          className="inv-label absolute inset-x-[16%] bottom-[6%] rounded-full bg-black/45 pt-[calc(2cqw+0.22em)] pb-[calc(2cqw-0.22em)] text-center text-[3.2cqw] text-white"
          animate={{ opacity: opening ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          खोलने के लिए स्पर्श करें
        </motion.p>
      </div>
    </motion.div>
  );
}
