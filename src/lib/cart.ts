import { z } from "zod";
import { CAKE_MAX_QTY, PINT_MAX_PER_FLAVOUR } from "@/data/shop";
import type { Catalogue } from "@/lib/content-types";

/**
 * Cart items carry only ids and quantities. Names and prices are always looked up
 * in the catalogue, so the server never trusts a price sent by the browser.
 */
export const pintItemSchema = z.object({
  kind: z.literal("pint"),
  flavour: z.string().min(1).max(96),
  qty: z.number().int().min(1).max(PINT_MAX_PER_FLAVOUR),
});

export const cakeItemSchema = z.object({
  kind: z.literal("cake"),
  size: z.string().min(1).max(64),
  base: z.string().min(1).max(64),
  combo: z.string().min(1).max(64),
  /** Allergies, dietary restrictions or anything else the kitchen should know (was a cake message). */
  message: z.string().trim().max(300).optional(),
  qty: z.number().int().min(1).max(CAKE_MAX_QTY),
});

export const cartItemSchema = z.discriminatedUnion("kind", [pintItemSchema, cakeItemSchema]);
export const cartSchema = z.array(cartItemSchema).min(1).max(30);

export type PintItem = z.infer<typeof pintItemSchema>;
export type CakeItem = z.infer<typeof cakeItemSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

export type PricedLine = {
  key: string;
  name: string;
  detail: string;
  image?: string;
  unitPrice: number;
  qty: number;
  total: number;
  leadDays: number;
  /** The pint flavour's slug (pints only). */
  flavour?: string;
};

/** Stable identity for merging identical items in the cart. */
export function itemKey(item: CartItem): string {
  return item.kind === "pint"
    ? `pint:${item.flavour}`
    : `cake:${item.size}:${item.base}:${item.combo}:${item.message ?? ""}`;
}

/** Most pints of one flavour a single order can have: 18, or fewer when stock is low. */
export function pintLimit(flavour: { stock?: number }): number {
  return Math.min(PINT_MAX_PER_FLAVOUR, flavour.stock ?? PINT_MAX_PER_FLAVOUR);
}

/**
 * Prices one item, or returns null if it's no longer for sale (removed, sold out, or fewer left
 * than the cart asks for).
 */
export function priceItem(item: CartItem, { shop, pints }: Catalogue): PricedLine | null {
  if (item.kind === "pint") {
    const flavour = pints.find((p) => p.slug === item.flavour);
    if (!flavour || !flavour.available || item.qty > pintLimit(flavour)) return null;
    return {
      key: itemKey(item),
      name: `${flavour.name} pint`,
      detail: `${flavour.style} · 473 mL`,
      image: flavour.image || undefined,
      unitPrice: shop.pintPrice,
      qty: item.qty,
      total: shop.pintPrice * item.qty,
      leadDays: shop.pintLeadDays,
      flavour: flavour.slug,
    };
  }
  const size = shop.cakeSizes.find((s) => s.id === item.size);
  const base = shop.cakeBases.find((b) => b.id === item.base);
  const combo = shop.cakeCombos.find((c) => c.id === item.combo);
  if (!size || !base || !combo) return null;
  const parts = [combo.flavours, `${base.label} base`, `serves ${size.serves}`];
  if (item.message) parts.push(`Allergies / dietary: ${item.message}`);
  return {
    key: itemKey(item),
    name: `${size.label} gelato cake`,
    detail: parts.join(" · "),
    unitPrice: size.price,
    qty: item.qty,
    total: size.price * item.qty,
    leadDays: shop.cakeLeadDays,
  };
}

export function priceCart(items: CartItem[], catalogue: Catalogue) {
  const lines: PricedLine[] = [];
  const unavailable: CartItem[] = [];
  for (const item of items) {
    const line = priceItem(item, catalogue);
    if (line) lines.push(line);
    else unavailable.push(item);
  }
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const leadDays = lines.reduce((max, l) => Math.max(max, l.leadDays), 0);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  return { lines, unavailable, subtotal, leadDays, count };
}
