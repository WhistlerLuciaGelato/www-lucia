import { z } from "zod";
import { getPintFlavour } from "@/data/flavours";
import {
  CAKE_LEAD_DAYS,
  CAKE_MAX_QTY,
  PINT_LEAD_DAYS,
  PINT_MAX_PER_FLAVOUR,
  PINT_PRICE,
  cakeBases,
  cakeCombos,
  cakeSizes,
} from "@/data/shop";

/**
 * Cart items carry only ids and quantities. Names and prices are always looked up
 * from the catalogue, so the server never trusts a price sent by the browser.
 */
export const pintItemSchema = z.object({
  kind: z.literal("pint"),
  flavour: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(PINT_MAX_PER_FLAVOUR),
});

export const cakeItemSchema = z.object({
  kind: z.literal("cake"),
  size: z.enum(cakeSizes.map((s) => s.id) as [string, ...string[]]),
  base: z.enum(cakeBases.map((b) => b.id) as [string, ...string[]]),
  combo: z.enum(cakeCombos.map((c) => c.id) as [string, ...string[]]),
  message: z.string().trim().max(60).optional(),
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
  unitPrice: number;
  qty: number;
  total: number;
  leadDays: number;
};

/** Stable identity for merging identical items in the cart. */
export function itemKey(item: CartItem): string {
  return item.kind === "pint"
    ? `pint:${item.flavour}`
    : `cake:${item.size}:${item.base}:${item.combo}:${item.message ?? ""}`;
}

export function priceItem(item: CartItem): PricedLine | null {
  if (item.kind === "pint") {
    const flavour = getPintFlavour(item.flavour);
    if (!flavour) return null;
    return {
      key: itemKey(item),
      name: `${flavour.name} pint`,
      detail: `${flavour.style} · 473 mL`,
      unitPrice: PINT_PRICE,
      qty: item.qty,
      total: PINT_PRICE * item.qty,
      leadDays: PINT_LEAD_DAYS,
    };
  }
  const size = cakeSizes.find((s) => s.id === item.size);
  const base = cakeBases.find((b) => b.id === item.base);
  const combo = cakeCombos.find((c) => c.id === item.combo);
  if (!size || !base || !combo) return null;
  const parts = [`${combo.flavours}`, `${base.label} base`, `serves ${size.serves}`];
  if (item.message) parts.push(`“${item.message}”`);
  return {
    key: itemKey(item),
    name: `${size.label} gelato cake`,
    detail: parts.join(" · "),
    unitPrice: size.price,
    qty: item.qty,
    total: size.price * item.qty,
    leadDays: CAKE_LEAD_DAYS,
  };
}

export function priceCart(items: CartItem[]) {
  const lines = items.map(priceItem).filter((l): l is PricedLine => l !== null);
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const leadDays = lines.reduce((max, l) => Math.max(max, l.leadDays), 0);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  return { lines, subtotal, leadDays, count };
}
