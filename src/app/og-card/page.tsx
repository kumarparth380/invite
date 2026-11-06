import type { Metadata } from "next";
import { Ornament } from "@/components/art/Decor";
import { TempleImage } from "@/components/art/Photos";
import { invite } from "@/content/invite";

export const metadata: Metadata = {
  title: "OG card",
  robots: { index: false, follow: false },
};

/**
 * 1200×630 layout used only to produce public/og.jpg (the WhatsApp / social
 * link preview). Regenerate with `npm run og` after changing names or dates.
 */
export default function OgCard() {
  const { bride, groom, wedding } = invite;
  return (
    <div
      className="relative flex h-[630px] w-[1200px] items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(80% 90% at 70% 40%, #fdf6ea 0%, transparent 70%), #f5e6cb",
      }}
    >
      <div className="absolute inset-[18px] rounded-[14px] border-2 border-gold/50" />
      <div className="absolute inset-[28px] rounded-[10px] border border-gold/30" />

      <div className="relative ml-[70px] h-[540px] w-[380px] shrink-0 overflow-hidden rounded-t-full border-4 border-[#d4a24c] shadow-[0_20px_40px_-20px_rgba(91,38,21,.6)]">
        <TempleImage className="absolute inset-0" />
      </div>

      <div className="flex flex-1 flex-col items-center px-[40px] text-center">
        <p className="inv-label text-[26px] text-accent">॥ श्री गणेशाय नमः ॥</p>
        <p className="inv-label mt-[18px] text-[24px] text-gold">शुभ विवाह</p>
        <p className="inv-script mt-[6px] text-[104px] leading-[1.1] text-accent">{bride.name}</p>
        <p className="inv-script text-[48px] leading-none text-ink">संग</p>
        <p className="inv-script text-[104px] leading-[1.1] text-accent">{groom.name}</p>
        <Ornament className="mt-[16px] w-[200px]" />
        <p className="inv-label mt-[14px] text-[30px] text-ink">
          {wedding.dayName} · {wedding.dateText}
        </p>
        <p className="inv-serif mt-[4px] text-[30px] text-muted italic">{wedding.place}</p>
      </div>
    </div>
  );
}
