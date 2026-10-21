"use client";

import { useState } from "react";
import Link from "next/link";
import { cart } from "@/lib/cart-store";
import { PINT_MAX_PER_FLAVOUR } from "@/data/shop";

export function AddPintButton({ flavour, name }: { flavour: string; name: string }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className="inline-flex items-center rounded-full bg-mist p-1"
        role="group"
        aria-label={`Quantity of ${name}`}
      >
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full font-ui text-lg font-bold text-lake-deep hover:bg-white disabled:opacity-40"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <output className="w-8 text-center font-ui font-extrabold text-ink" aria-live="polite">
          {qty}
        </output>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full font-ui text-lg font-bold text-lake-deep hover:bg-white disabled:opacity-40"
          onClick={() => setQty((q) => Math.min(PINT_MAX_PER_FLAVOUR, q + 1))}
          disabled={qty >= PINT_MAX_PER_FLAVOUR}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        className="btn btn-primary !px-5 !py-3"
        onClick={() => {
          cart.add({ kind: "pint", flavour, qty });
          setAdded(true);
          setQty(1);
          window.setTimeout(() => setAdded(false), 2500);
        }}
      >
        Add to cart
      </button>
      <p className="w-full font-ui text-sm font-bold text-lake-deep" aria-live="polite">
        {added ? (
          <>
            Added!{" "}
            <Link href="/cart" className="underline underline-offset-2">
              View cart
            </Link>
          </>
        ) : (
          " "
        )}
      </p>
    </div>
  );
}
