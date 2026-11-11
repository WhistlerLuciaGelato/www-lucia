import Image from "next/image";
import Link from "next/link";
import type { Diet, PintFlavour } from "@/lib/content-types";
import { dietLabels } from "@/data/flavours";
import { money } from "@/lib/format";
import { AddPintButton } from "@/components/shop/AddPintButton";
import { Bear } from "@/components/ui";

const dietTagColor: Record<Diet, string> = {
  "dairy-free": "text-lakeside",
  vegan: "text-grass",
  "gluten-free": "text-heatwave",
};

/** The newer design's filled pills (home page). */
const dietTagFill: Record<Diet, string> = {
  "dairy-free": "border-lakeside !bg-lakeside",
  vegan: "border-grass !bg-grass",
  "gluten-free": "border-heatwave !bg-heatwave",
};

/**
 * Flavour card from the website design. Pass `price` (CAD cents) to show add-to-cart controls.
 * `framed` gives the newer home-page look: an outlined card (mint for dairy-free) with filled tags.
 * `showSize` adds the "473mL" line (with `listPrice`, in CAD cents, beside it) and `action` goes
 * under the tags (Our gelato's add-to-cart pill).
 *
 * Home page options: `href` makes the whole card a link, `hoverBlurb` hides the description until
 * the card is hovered or focused (it shows over the pint), `sticker` puts the Made on the Mountain
 * sticker on the pint, and `large` shows the pint a bit bigger.
 */
export function PintCard({
  flavour,
  price,
  framed = false,
  showSize = false,
  listPrice,
  action,
  href,
  hoverBlurb = false,
  sticker = false,
  large = false,
}: {
  flavour: PintFlavour;
  price?: number;
  framed?: boolean;
  showSize?: boolean;
  listPrice?: number;
  action?: React.ReactNode;
  href?: string;
  hoverBlurb?: boolean;
  sticker?: boolean;
  large?: boolean;
}) {
  const shop = price !== undefined;
  const dairyFree = flavour.diet.includes("dairy-free");
  const isSorbet = flavour.style === "Sorbet";
  const cardColor = framed
    ? dairyFree
      ? "border border-bluebird bg-seafoam"
      : "border border-strawberry bg-snow"
    : dairyFree
      ? "bg-mist"
      : "bg-snow";

  return (
    <article
      id={flavour.slug}
      className={`group relative flex w-full max-w-[21.875rem] scroll-mt-32 flex-col items-center gap-2.5 rounded-blob px-6 py-[3.125rem] text-center ${cardColor} ${href ? "transition duration-300 hover:-translate-y-1.5 hover:rotate-[-0.6deg] hover:shadow-soft focus-within:-translate-y-1.5 focus-within:shadow-soft" : ""}`}
    >
      <div className={`relative shrink-0 ${large ? "h-[18rem] w-[16.5rem]" : "h-[15.5rem] w-[14.25rem]"}`}>
        <div
          className={`relative h-[15.5rem] w-[14.25rem] overflow-hidden ${large ? "origin-top-left scale-[1.158]" : ""} ${href ? "transition duration-300 group-hover:rotate-2" : ""}`}
        >
          {flavour.image && flavour.lid ? (
            <>
              <Image
                src={`/pints/render/lid-${flavour.lid}.webp`}
                alt=""
                width={750}
                height={500}
                className="absolute top-0 left-[calc(50%+1px)] h-[14.583rem] w-[21.875rem] max-w-none -translate-x-1/2"
              />
              <Image
                src={flavour.image}
                alt={`${flavour.name} pint`}
                width={560}
                height={551}
                sizes="232px"
                className="absolute top-2.5 left-1/2 h-[14.3125rem] w-[14.5rem] max-w-none -translate-x-1/2 object-contain"
              />
            </>
          ) : flavour.image ? (
            <Image
              src={flavour.image}
              alt={`${flavour.name} pint`}
              width={720}
              height={720}
              sizes="228px"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <Bear name={flavour.bear} className="w-3/4" />
            </div>
          )}
          {shop && !flavour.available ? (
            <span className="eyebrow absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1.5 !text-xs text-snow">
              Sold out
            </span>
          ) : null}
        </div>
        {sticker ? (
          <Image
            src="/brand/made-on-the-mountain-badge.webp"
            alt=""
            width={228}
            height={228}
            className="pointer-events-none absolute -top-3 -right-5 w-[5.5rem] rotate-12 drop-shadow-md transition duration-300 group-hover:rotate-[20deg] group-hover:scale-105"
          />
        ) : null}
        {hoverBlurb ? (
          <p className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 rounded-[1.75rem] bg-snow/95 p-4 text-base leading-[1.25] text-black/85 opacity-0 shadow-soft transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {flavour.blurb}
          </p>
        ) : null}
      </div>

      <h3 className="subhead max-w-[15.75rem] text-2xl leading-[0.9] text-balance text-ink">
        {href ? (
          <Link
            href={href}
            className="after:absolute after:inset-0 after:rounded-blob focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-2 focus-visible:after:outline-lakeside"
          >
            {flavour.name}
          </Link>
        ) : (
          flavour.name
        )}
      </h3>
      {showSize ? (
        <p className="eyebrow leading-[0.9] text-ink">
          473mL{listPrice !== undefined ? ` · ${money(listPrice)}` : null}
        </p>
      ) : null}
      {hoverBlurb ? null : (
        <p className="max-w-[18.25rem] text-base leading-[1.2] text-black/80">{flavour.blurb}</p>
      )}

      <ul
        className="flex max-w-[20.7rem] flex-wrap justify-center gap-2.5"
        aria-label="Type and dietary information"
      >
        <li
          className={`tag !text-snow ${isSorbet ? "border-bluebird !bg-bluebird" : "border-alpenglow !bg-alpenglow"}`}
        >
          {isSorbet ? "Sorbet" : "Gelato"}
        </li>
        {flavour.diet.map((d) => (
          <li key={d} className={`tag ${framed ? `!text-snow ${dietTagFill[d]}` : dietTagColor[d]}`}>
            {dietLabels[d]}
          </li>
        ))}
      </ul>

      {action}

      {shop ? (
        <div className="mt-4 flex w-full flex-col items-center gap-3 border-t border-black/10 pt-5">
          <p className="font-ui text-xl font-extrabold text-ink">{money(price)}</p>
          {flavour.available ? (
            <AddPintButton flavour={flavour.slug} name={flavour.name} />
          ) : (
            <p className="font-ui font-bold text-ink/60">Back soon — check our other flavours.</p>
          )}
        </div>
      ) : null}
    </article>
  );
}
