import { CornerFlourish, Mandala } from "./art/Decor";

/** Cream card stock that stays put while the invitation scrolls over it. */
export function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className="sticky top-0 h-svh w-full overflow-hidden"
        style={{
          background:
            "radial-gradient(70% 45% at 100% 0%, rgba(246,190,196,.28) 0%, transparent 70%), radial-gradient(70% 45% at 0% 100%, rgba(246,190,196,.24) 0%, transparent 70%), radial-gradient(120% 70% at 50% 0%, #fbf3e3 0%, transparent 60%), radial-gradient(140% 90% at 50% 120%, #ecd7b2 0%, transparent 60%), #f7ebd5",
        }}
      >
        <Mandala className="absolute top-1/2 left-1/2 w-[120cqw] -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.07]" />

        <div className="absolute inset-[3cqw] rounded-[2cqw] border border-gold/45" />
        <div className="absolute inset-[4.6cqw] rounded-[1.5cqw] border border-gold/25" />
        <CornerFlourish className="absolute top-[3cqw] left-[3cqw] size-[13cqw] text-gold/70" />
        <CornerFlourish className="absolute top-[3cqw] right-[3cqw] size-[13cqw] -scale-x-100 text-gold/70" />
        <CornerFlourish className="absolute bottom-[3cqw] left-[3cqw] size-[13cqw] -scale-y-100 text-gold/70" />
        <CornerFlourish className="absolute right-[3cqw] bottom-[3cqw] size-[13cqw] -scale-100 text-gold/70" />
      </div>
    </div>
  );
}
