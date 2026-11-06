"use client";

import { motion } from "motion/react";
import { invite } from "@/content/invite";
import { GateDoorLeaf } from "./art/GateDoor";
import { TempleScene } from "./art/TempleScene";

const DOOR_EASE = [0.65, 0, 0.35, 1] as const;

/**
 * Closed temple doors with a gold seal. Tapping the seal swings the doors
 * open onto the same temple scene the hero shows, so the hand-off is seamless.
 */
export function Gate({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  const doorTransition = { duration: 1.7, ease: DOOR_EASE, delay: 0.25 };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeOut" } }}
    >
      <div className="@container relative h-full w-full max-w-[480px] overflow-hidden bg-maroon [perspective:140cqw]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15 }}
          animate={opening ? { scale: 1 } : { scale: 1.15 }}
          transition={{ duration: 2.2, ease: DOOR_EASE }}
        >
          <TempleScene className="absolute inset-0 h-full w-full" />
        </motion.div>

        {/* Door leaves */}
        <motion.div
          className="absolute inset-y-0 left-0 w-[calc(50%+1px)] origin-left [transform-style:preserve-3d]"
          animate={opening ? { rotateY: -108 } : { rotateY: 0 }}
          transition={doorTransition}
        >
          <GateDoorLeaf className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-y-0 right-0 w-[8%] bg-gradient-to-l from-black/35 to-transparent" />
        </motion.div>
        <motion.div
          className="absolute inset-y-0 right-0 w-[calc(50%+1px)] origin-right [transform-style:preserve-3d]"
          animate={opening ? { rotateY: 108 } : { rotateY: 0 }}
          transition={doorTransition}
        >
          <div className="absolute inset-0 -scale-x-100">
            <GateDoorLeaf className="absolute inset-0 h-full w-full" />
          </div>
          <div className="absolute inset-y-0 left-0 w-[8%] bg-gradient-to-r from-black/35 to-transparent" />
        </motion.div>

        {/* Seal */}
        <motion.button
          type="button"
          onClick={onOpen}
          disabled={opening}
          aria-label="निमंत्रण खोलें"
          className="absolute top-1/2 left-1/2 z-10 grid size-[27cqw] -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[#f3d98a]/70"
          animate={opening ? { scale: 1.25, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeIn" }}
          whileTap={{ scale: 0.94 }}
        >
          <span className="inv-ping absolute inset-0 rounded-full bg-[#f3d98a]/35" />
          <span
            className="absolute inset-0 rounded-full shadow-[0_12px_30px_-6px_rgba(0,0,0,.65)]"
            style={{ background: "radial-gradient(circle at 35% 30%, #fbecb8, #ddb055 50%, #93681f)" }}
          />
          <span className="absolute inset-[2cqw] rounded-full border border-[#7a5414]/45" />
          <span className="absolute inset-[3.2cqw] rounded-full border border-dashed border-[#7a5414]/30" />
          <span className="inv-latin relative text-[9.5cqw] leading-none tracking-tight text-[#4a2c08] italic">
            {invite.monogram}
          </span>
        </motion.button>

        <motion.p
          className="inv-label absolute inset-x-[16%] bottom-[7%] rounded-full bg-black/40 py-[2cqw] text-center text-[3.2cqw] text-white backdrop-blur-sm"
          animate={{ opacity: opening ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          खोलने के लिए स्पर्श करें
        </motion.p>
      </div>
    </motion.div>
  );
}
