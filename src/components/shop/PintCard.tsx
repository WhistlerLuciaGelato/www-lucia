import Image from "next/image";
import Link from "next/link";
import type { Diet, PintFlavour } from "@/lib/content-types";
import { dietLabels } from "@/data/flavours";
import { money } from "@/lib/format";
import { AddPintButton } from "@/components/shop/AddPintButton";
import { PintImage } from "@/components/shop/PintImage";

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
 * `framed` gives the newer look: an outlined card (mint for dairy-free) with filled tags.
 * `showSize` adds the "473mL" line (with `listPrice`, in CAD cents, beside it) and `action` goes
 * under the tags (Our gelato's add-to-cart pill).
 *
 * Home page options: `href` makes the whole card a link, `hoverBlurb` hides the description until
 * the card is hovered or focused (it shows over the pint), `sticker` puts the Made on the Mountain
 * sticker on the pint, and `large` shows the pint a bit bigger.
 *
 * Our gelato options: `showLabel` adds the round lid label, `revealBlurb` keeps the description
 * folded away until the card is hovered or focused, and `onOpen` makes the card open the
 * flavour's details (ingredients and all) when clicked.
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
  revealBlurb = false,
  showLabel = false,
  onOpen,
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
  revealBlurb?: boolean;
  showLabel?: boolean;
  onOpen?: () => void;
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
  const lifts = Boolean(href || onOpen);
  // The title's link or button stretches over the whole card (its ::after), so the card is one
  // big click target; anything interactive inside sits above it.
  const stretch =
    "after:absolute after:inset-0 after:rounded-blob focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-2 focus-visible:after:outline-lakeside";

  return (
    <article
      id={flavour.slug}
      className={`group relative flex w-full max-w-[21.875rem] scroll-mt-32 flex-col items-center gap-2.5 rounded-blob px-6 py-[3.125rem] text-center ${cardColor} ${lifts ? "transition duration-300 hover:-translate-y-1.5 hover:rotate-[-0.6deg] hover:shadow-soft focus-within:-translate-y-1.5 focus-within:shadow-soft" : ""}`}
    >
      <div className="relative shrink-0">
        <PintImage
          flavour={flavour}
          scale={large ? 1.158 : 1}
          showLabel={showLabel}
          soldOut={shop && !flavour.available}
          tilt={lifts}
        />
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
          <Link href={href} className={stretch}>
            {flavour.name}
          </Link>
        ) : onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className={`cursor-pointer text-balance ${stretch}`}
          >
            {flavour.name}
            <span className="sr-only">: ingredients and details</span>
          </button>
        ) : (
          flavour.name
        )}
      </h3>
      {showSize ? (
        <p className="eyebrow leading-[0.9] text-ink">
          473mL{listPrice !== undefined ? ` · ${money(listPrice)}` : null}
        </p>
      ) : null}
      {hoverBlurb ? null : revealBlurb ? (
        // Folded away until the card is hovered or focused (Figma: Our gelato hover state).
        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
          <p className="max-w-[18.25rem] overflow-hidden text-base leading-[1.2] text-black/80">
            {flavour.blurb}
          </p>
        </div>
      ) : (
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

      {action ? <div className="relative z-10">{action}</div> : null}

      {shop ? (
        <div className="relative z-10 mt-4 flex w-full flex-col items-center gap-3 border-t border-black/10 pt-5">
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
