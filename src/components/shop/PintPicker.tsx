"use client";

import { useState } from "react";
import type { PintFlavour } from "@/lib/content-types";
import { PintCard } from "@/components/shop/PintCard";
import { AddToCartPill } from "@/components/shop/AddToCartPill";

/** The design's filter pills (Our gelato): outlined in each tag's colour, filled when picked. */
const filters: {
  id: string;
  label: string;
  match: (f: PintFlavour) => boolean;
  on: string;
  off: string;
}[] = [
  {
    id: "all",
    label: "All",
    match: () => true,
    on: "border-strawberry !bg-strawberry",
    off: "border-strawberry text-strawberry",
  },
  {
    id: "gelato",
    label: "Gelato",
    match: (f) => f.style !== "Sorbet",
    on: "border-alpenglow !bg-alpenglow",
    off: "border-alpenglow text-alpenglow",
  },
  {
    id: "sorbet",
    label: "Sorbet",
    match: (f) => f.style === "Sorbet",
    on: "border-bluebird !bg-bluebird",
    off: "border-bluebird text-bluebird",
  },
  {
    id: "gluten-free",
    label: "Gluten-free",
    match: (f) => f.diet.includes("gluten-free"),
    on: "border-heatwave !bg-heatwave",
    off: "border-heatwave text-heatwave",
  },
  {
    id: "dairy-free",
    label: "Dairy-free",
    match: (f) => f.diet.includes("dairy-free"),
    on: "border-lakeside !bg-lakeside",
    off: "border-lakeside text-lakeside",
  },
  {
    id: "vegan",
    label: "Vegan",
    match: (f) => f.diet.includes("vegan"),
    on: "border-grass !bg-grass",
    off: "border-grass text-grass",
  },
];

const FIRST = 6;

/**
 * "Order pints for pickup" on Our gelato: filter pills, then the flavour cards with a one-tap
 * add-to-cart, six at a time ("Show more" reveals the rest).
 */
export function PintPicker({ flavours, price }: { flavours: PintFlavour[]; price: number }) {
  const [active, setActive] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const filter = filters.find((f) => f.id === active) ?? filters[0];
  const matching = flavours.filter(filter.match);
  const shown = expanded ? matching : matching.slice(0, FIRST);

  return (
    <>
      <div role="group" aria-label="Filter flavours" className="flex flex-wrap justify-center gap-2.5">
        {filters.map((f) => {
          const on = f.id === active;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(f.id)}
              className={`tag ${on ? `!text-snow ${f.on}` : `!bg-transparent ${f.off}`} cursor-pointer px-[0.9375rem] transition hover:-translate-y-px`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div
        className="mx-auto mt-10 grid max-w-[71rem] justify-items-center gap-x-[3.2rem] gap-y-10 sm:grid-cols-2 lg:mt-[2.875rem] lg:grid-cols-3 lg:items-start lg:gap-y-[3.75rem]"
        aria-live="polite"
      >
        {shown.map((f) => (
          <PintCard
            key={f.slug}
            flavour={f}
            framed
            showSize
            listPrice={price}
            action={
              f.available ? (
                <AddToCartPill flavour={f.slug} name={f.name} />
              ) : (
                <p className="eyebrow mt-1 rounded-[1.25rem] bg-ink/10 px-2.5 py-1.5 !text-sm text-ink/70">
                  Sold out
                </p>
              )
            }
          />
        ))}
      </div>
      {matching.length === 0 ? (
        <p className="mt-10 text-center text-lg text-ink/70">No pints in this group right now.</p>
      ) : null}

      {matching.length > FIRST ? (
        <div className="mt-12 text-center lg:mt-14">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className="eyebrow inline-block cursor-pointer border-b-2 border-strawberry pb-1 !text-lg text-strawberry hover:border-transparent lg:!text-xl"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        </div>
      ) : null}
    </>
  );
}
