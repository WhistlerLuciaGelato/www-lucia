import { z } from "zod";
import type { PricedLine } from "@/lib/cart";
import { money } from "@/lib/format";

/**
 * A promo code's terms, as the cart needs them to work out the discount. Amounts in CAD cents.
 * The codes themselves are kept private in the Studio (see lib/promo-codes.ts).
 */
export type PromoTerms = {
  code: string;
  kind: "percent" | "amount";
  /** Percent off (1–100) or cents off, depending on `kind`. */
  value: number;
  appliesTo: "all" | "pints" | "cakes";
  /** Smallest order (pre-tax, before delivery) the code works on, in cents. */
  minOrder: number;
};

export const promoCodeSchema = z
  .string()
  .trim()
  .max(32)
  .regex(/^[A-Za-z0-9-]+$/, "Enter a valid code")
  .transform((code) => code.toUpperCase());

export function promoLabel(terms: PromoTerms): string {
  const off = terms.kind === "percent" ? `${terms.value}% off` : `${money(terms.value)} off`;
  const what = terms.appliesTo === "pints" ? " pints" : terms.appliesTo === "cakes" ? " cakes" : "";
  return `${terms.code} (${off}${what})`;
}

/**
 * The discount in cents a code gives this cart, or why it doesn't apply. Delivery is never
 * discounted, and the discount never exceeds what it applies to.
 */
export function promoDiscount(
  terms: PromoTerms,
  lines: PricedLine[],
  subtotal: number,
): { amount: number; problem?: undefined } | { amount: 0; problem: string } {
  if (subtotal < terms.minOrder) {
    return {
      amount: 0,
      problem: `${terms.code} is for orders of ${money(terms.minOrder)} or more.`,
    };
  }
  const eligible = lines
    .filter((l) => terms.appliesTo === "all" || (terms.appliesTo === "pints") === Boolean(l.flavour))
    .reduce((sum, l) => sum + l.total, 0);
  if (eligible === 0) {
    return {
      amount: 0,
      problem: `${terms.code} is for ${terms.appliesTo === "pints" ? "pints" : "gelato cakes"} only.`,
    };
  }
  const amount =
    terms.kind === "percent" ? Math.round((eligible * terms.value) / 100) : Math.min(terms.value, eligible);
  return { amount };
}
