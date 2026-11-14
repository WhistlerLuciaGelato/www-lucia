"use client";

import { cart, useCart } from "@/lib/cart-store";
import { PINT_MAX_PER_FLAVOUR } from "@/data/shop";

/**
 * The design's one-tap add button (Our gelato): "+ Add to cart" until the flavour is in the
 * cart, then "+N Added to cart" (filled) showing how many are in it. Each tap adds one pint.
 */
export function AddToCartPill({
  flavour,
  name,
  limit = PINT_MAX_PER_FLAVOUR,
  large = false,
}: {
  flavour: string;
  name: string;
  /** Most pints of this flavour one order can have (18, or less when stock is low). */
  limit?: number;
  /** The expanded card's bigger pill. */
  large?: boolean;
}) {
  const items = useCart();
  const inCart = items.find((i) => i.kind === "pint" && i.flavour === flavour)?.qty ?? 0;
  const full = inCart >= limit;

  return (
    <>
      <button
        type="button"
        disabled={full}
        onClick={() => cart.add({ kind: "pint", flavour, qty: 1 })}
        aria-label={
          inCart ? `Add another ${name} pint (${inCart} in cart)` : `Add a ${name} pint to the cart`
        }
        className={`eyebrow mt-1 inline-flex cursor-pointer items-center justify-center rounded-[1.25rem] border-2 border-ink tracking-[0.04em] whitespace-nowrap transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${
          large ? "px-4 pt-2 pb-2.5 !text-xl !leading-none" : "px-2.5 pt-[0.3125rem] pb-[0.4375rem] !text-sm !leading-none"
        } ${
          inCart ? "bg-ink text-snow" : "bg-snow text-ink"
        }`}
      >
        {full
          ? inCart
            ? `${inCart} in cart (max)`
            : "Sold out"
          : inCart
            ? `+${inCart} Added to cart`
            : "+ Add to cart"}
      </button>
      <span className="sr-only" aria-live="polite">
        {inCart ? `${inCart} ${name} in your cart` : ""}
      </span>
    </>
  );
}
