/* eslint-disable @next/next/no-img-element -- static export: images are pre-sized WebP files */

/**
 * Photographs used as backgrounds. The files in public/images/ are pre-cropped
 * and colour-graded (see README → Photo credits).
 */

/** Centre of the archway in temple-*.webp, used as the hero's zoom origin. */
export const TEMPLE_ZOOM_ORIGIN = "50% 80%";

export const TEMPLE_SRCSET =
  "/images/temple-720.webp 720w, /images/temple-1080.webp 1080w, /images/temple-1440.webp 1440w";
export const DOOR_SRCSET =
  "/images/door-leaf-1800.webp 472w, /images/door-leaf-2400.webp 629w";

/** Shri Ram Janmabhoomi Mandir entrance, Ayodhya, under a sunrise sky. */
export function TempleImage({ className = "" }: { className?: string }) {
  return (
    <img
      src="/images/temple-1080.webp"
      srcSet={TEMPLE_SRCSET}
      sizes="(max-width: 480px) 100vw, 480px"
      alt="श्री राम जन्मभूमि मंदिर, अयोध्या का प्रवेश द्वार"
      className={`h-full w-full object-cover select-none ${className}`}
      decoding="async"
      fetchPriority="high"
      draggable={false}
    />
  );
}

/** Left leaf of a carved wooden door; the right leaf is the same image mirrored. */
export function DoorLeafImage({ className = "" }: { className?: string }) {
  return (
    <img
      src="/images/door-leaf-1800.webp"
      srcSet={DOOR_SRCSET}
      sizes="(max-width: 480px) 50vw, 240px"
      alt=""
      className={`h-full w-full object-cover object-right select-none ${className}`}
      decoding="async"
      fetchPriority="high"
      draggable={false}
    />
  );
}

/** Soft cream haze at the top (behind the names) and shade at the bottom. */
export function TopHaze({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 h-[66%] ${className}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(251,242,228,.95) 0%, rgba(251,242,228,.88) 40%, rgba(251,242,228,.6) 62%, rgba(251,242,228,0) 100%)",
      }}
    />
  );
}

export function BottomShade({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[26%] ${className}`}
      style={{ background: "linear-gradient(0deg, rgba(48,22,10,.62) 0%, rgba(48,22,10,0) 100%)" }}
    />
  );
}
