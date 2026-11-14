import Image from "next/image";
import type { PintFlavour } from "@/lib/content-types";
import { Bear } from "@/components/ui";

/**
 * A pint as in the website design: the transparent render in front of its lid, with the round
 * lid label over the top-left corner (`showLabel`). Laid out at 228×248px and scaled by `scale`,
 * so the pieces keep their Figma positions at any size.
 */
export function PintImage({
  flavour,
  scale = 1,
  showLabel = false,
  soldOut = false,
  tilt = false,
  priority = false,
}: {
  flavour: PintFlavour;
  scale?: number;
  showLabel?: boolean;
  soldOut?: boolean;
  /** Tilt the pint a little when the surrounding `group` is hovered. */
  tilt?: boolean;
  priority?: boolean;
}) {
  return (
    <div className="relative shrink-0" style={{ width: `${14.25 * scale}rem`, height: `${15.5 * scale}rem` }}>
      <div
        className="absolute top-0 left-0 h-[15.5rem] w-[14.25rem] origin-top-left"
        style={scale === 1 ? undefined : { transform: `scale(${scale})` }}
      >
        <div
          className={`relative h-full w-full overflow-hidden ${tilt ? "transition duration-300 group-hover:rotate-2" : ""}`}
        >
          {flavour.image && flavour.lid ? (
            <>
              <Image
                src={`/pints/render/lid-${flavour.lid}.webp`}
                alt=""
                width={750}
                height={500}
                priority={priority}
                className="absolute top-0 left-[calc(50%+1px)] h-[14.583rem] w-[21.875rem] max-w-none -translate-x-1/2"
              />
              <Image
                src={flavour.image}
                alt={`${flavour.name} pint`}
                width={560}
                height={551}
                sizes={`${Math.round(232 * scale)}px`}
                priority={priority}
                className="absolute top-2.5 left-1/2 h-[14.3125rem] w-[14.5rem] max-w-none -translate-x-1/2 object-contain"
              />
            </>
          ) : flavour.image ? (
            <Image
              src={flavour.image}
              alt={`${flavour.name} pint`}
              width={720}
              height={720}
              sizes={`${Math.round(228 * scale)}px`}
              priority={priority}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <Bear name={flavour.bear} className="w-3/4" />
            </div>
          )}
          {soldOut ? (
            <span className="eyebrow absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1.5 !text-xs text-snow">
              Sold out
            </span>
          ) : null}
        </div>
        {showLabel && flavour.label ? (
          // Figma: 112px label at (-15, -19) on the 260px product frame.
          <Image
            src={flavour.label}
            alt=""
            width={240}
            height={240}
            sizes={`${Math.round(98 * scale)}px`}
            className="pointer-events-none absolute -top-[1.05rem] -left-[0.8rem] w-[6.125rem] drop-shadow-[0_4px_6px_rgb(33_33_33/0.18)]"
          />
        ) : null}
      </div>
    </div>
  );
}
