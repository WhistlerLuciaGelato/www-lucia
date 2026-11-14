"use client";

import { useEffect, useRef } from "react";
import type { Diet, PintFlavour } from "@/lib/content-types";
import { dietLabels } from "@/data/flavours";
import { money } from "@/lib/format";
import { pintLimit } from "@/lib/cart";
import { AddToCartPill } from "@/components/shop/AddToCartPill";
import { PintImage } from "@/components/shop/PintImage";

const dietTagFill: Record<Diet, string> = {
  "dairy-free": "border-lakeside !bg-lakeside",
  vegan: "border-grass !bg-grass",
  "gluten-free": "border-heatwave !bg-heatwave",
};

/**
 * The expanded flavour card (Figma: "Expand product on click"): a big pint on the left, and the
 * name, tags, size and price, description, ingredients and allergens, and add-to-cart on the
 * right. A modal dialog: Esc, the close button or a click outside the card closes it.
 */
export function PintDetails({
  flavour,
  price,
  onClose,
}: {
  flavour: PintFlavour;
  price: number;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    // No close() on cleanup: its close event would call onClose (and in dev, Strict Mode's
    // re-run would shut the card straight away). Unmounting removes the dialog anyway.
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const dairyFree = flavour.diet.includes("dairy-free");
  const isSorbet = flavour.style === "Sorbet";

  return (
    <dialog
      ref={ref}
      aria-labelledby="pint-details-title"
      onClose={onClose}
      onClick={(e) => {
        // A click on the backdrop lands on the dialog element itself.
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[72rem] overflow-visible bg-transparent p-0 backdrop:bg-ink/35 backdrop:backdrop-blur-[2px] open:animate-[pint-pop_220ms_cubic-bezier(0.34,1.56,0.64,1)]"
    >
      <div
        className={`relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[3rem] border shadow-[0_8px_24px_rgb(33_33_33/0.18)] sm:rounded-blob ${
          dairyFree ? "border-bluebird bg-seafoam" : "border-strawberry bg-snow"
        }`}
      >
        <div className="grid items-center gap-6 px-6 pt-14 pb-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10 md:px-16 md:py-16">
          <div className="flex justify-center">
            {/* 1.84× the card's pint: 420px wide, as in the design. */}
            <div className="hidden sm:block">
              <PintImage flavour={flavour} scale={1.84} showLabel priority />
            </div>
            <div className="sm:hidden">
              <PintImage flavour={flavour} scale={1.1} showLabel priority />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <h2 id="pint-details-title" className="subhead text-[2.125rem] leading-[0.95] text-balance text-ink">
              {flavour.name}
            </h2>
            <ul className="flex flex-wrap justify-center gap-2" aria-label="Type and dietary information">
              <li
                className={`tag !text-snow ${isSorbet ? "border-bluebird !bg-bluebird" : "border-alpenglow !bg-alpenglow"}`}
              >
                {isSorbet ? "Sorbet" : "Gelato"}
              </li>
              {flavour.diet.map((d) => (
                <li key={d} className={`tag !text-snow ${dietTagFill[d]}`}>
                  {dietLabels[d]}
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-1 !text-xl text-ink">473mL · {money(price)}</p>
            <p className="max-w-[28.75rem] text-lg leading-[1.3] text-black/85">{flavour.blurb}</p>
            {flavour.ingredients ? (
              <p className="mt-2 max-w-[28.75rem] text-sm leading-[1.35] text-black/75">
                <strong className="font-bold text-ink">Ingredients:</strong> {flavour.ingredients}
              </p>
            ) : null}
            {flavour.contains ? (
              <p className="text-sm text-black/75">
                <strong className="font-bold text-ink">Contains:</strong> {flavour.contains}
              </p>
            ) : null}
            {!flavour.ingredients && !flavour.contains ? (
              <p className="mt-2 max-w-[28.75rem] text-sm text-black/70">
                Ingredient list coming soon. Have an allergy? Ask us before ordering.
              </p>
            ) : null}
            <div className="mt-4">
              {flavour.available ? (
                <AddToCartPill flavour={flavour.slug} name={flavour.name} limit={pintLimit(flavour)} large />
              ) : (
                <p className="eyebrow rounded-[1.25rem] bg-ink/10 px-3 py-2 !text-base text-ink/70">Sold out</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <form method="dialog" className="absolute -top-4 -right-2 sm:-top-5 sm:-right-5">
        <button
          type="submit"
          aria-label="Close"
          className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border-2 border-ink bg-snow text-ink shadow-soft transition hover:rotate-90"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
          </svg>
        </button>
      </form>
    </dialog>
  );
}
