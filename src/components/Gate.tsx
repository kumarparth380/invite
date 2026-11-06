"use client";

import { motion } from "motion/react";
import { invite } from "@/content/invite";
import { DoorLeafImage, TempleImage, TopHaze } from "./art/Photos";

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
          className="absolute top-1/2 left-1/2 z-10 grid size-[25cqw] -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[#f3d98a]/70"
          animate={opening ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeIn" }}
          whileTap={{ scale: 0.94 }}
        >
          <span className="inv-ping absolute inset-0 rounded-full bg-[#f3d98a]/35" />
          <span
            className="absolute inset-0 rounded-full shadow-[0_14px_34px_-6px_rgba(0,0,0,.7)]"
            style={{ background: "radial-gradient(circle at 35% 30%, #fbecb8, #d9a94e 50%, #8c6219)" }}
          />
          <span className="absolute inset-[2cqw] rounded-full border border-[#7a5414]/45" />
          <span className="absolute inset-[3.2cqw] rounded-full border border-dashed border-[#7a5414]/30" />
          <span className="inv-latin relative text-[9cqw] leading-none tracking-tight text-[#4a2c08] italic">
            {invite.monogram}
          </span>
        </motion.button>

        <motion.p
          className="inv-label absolute inset-x-[16%] bottom-[6%] rounded-full bg-black/45 py-[2cqw] text-center text-[3.2cqw] text-white"
          animate={{ opacity: opening ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          खोलने के लिए स्पर्श करें
        </motion.p>
      </div>
    </motion.div>
  );
}
