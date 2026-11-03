"use client";

import { cart, useCart } from "@/lib/cart-store";
import { PINT_MAX_PER_FLAVOUR } from "@/data/shop";

/**
 * The design's one-tap add button (Our gelato): "+ Add to cart" until the flavour is in the
 * cart, then "+N Added to cart" (filled) showing how many are in it. Each tap adds one pint.
 */
export function AddToCartPill({ flavour, name }: { flavour: string; name: string }) {
  const items = useCart();
  const inCart = items.find((i) => i.kind === "pint" && i.flavour === flavour)?.qty ?? 0;
  const full = inCart >= PINT_MAX_PER_FLAVOUR;

  return (
    <>
      <button
        type="button"
        disabled={full}
        onClick={() => cart.add({ kind: "pint", flavour, qty: 1 })}
        aria-label={
          inCart ? `Add another ${name} pint (${inCart} in cart)` : `Add a ${name} pint to the cart`
        }
        className={`eyebrow mt-1 inline-flex items-center justify-center rounded-[1.25rem] border-2 border-ink px-2.5 pt-[0.3125rem] pb-[0.4375rem] !text-sm !leading-none tracking-[0.04em] whitespace-nowrap transition hover:-translate-y-px disabled:opacity-60 ${
          inCart ? "bg-ink text-snow" : "bg-snow text-ink"
        }`}
      >
        {full ? `${inCart} in cart` : inCart ? `+${inCart} Added to cart` : "+ Add to cart"}
      </button>
      <span className="sr-only" aria-live="polite">
        {inCart ? `${inCart} ${name} in your cart` : ""}
      </span>
    </>
  );
}
