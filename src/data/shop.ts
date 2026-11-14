import type { Shop } from "@/lib/content-types";

/**
 * Default online-shop settings, used until the Sanity Studio has its own.
 * All prices are in CAD cents.
 *
 * Orders are picked up from the Base II kitchen or delivered by the Lucia team (see
 * DELIVERY_ZONES); there's no courier, since gelato and cakes need to go straight into a freezer.
 */

/** GST on every online order (pints and cakes). Square adds it to the order; the cart shows it up front. */
export const SALES_TAX = { name: "GST", percentage: 5 };

/**
 * GST in cents on a subtotal in cents, for the cart preview. Square's figure on the payment step is
 * the one charged; with whole-dollar prices 5% is always whole cents, so the two match.
 */
export function salesTax(subtotal: number): number {
  return Math.round((subtotal * SALES_TAX.percentage) / 100);
}

/**
 * Delivery by the Lucia team, priced on the pre-tax subtotal (CAD cents): a flat `fee`, free from
 * `freeOver` up, and only offered from `minOrder` up. Pickup is always free.
 *
 * Whistler: $10, free from $100. Squamish & Pemberton: free, on orders of $400 or more only.
 */
export type DeliveryZone = { id: string; label: string; fee: number; freeOver: number; minOrder: number };

export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: "whistler", label: "Whistler", fee: 1000, freeOver: 10000, minOrder: 0 },
  { id: "squamish-pemberton", label: "Squamish or Pemberton", fee: 0, freeOver: 0, minOrder: 40000 },
];

/** Delivery fee in cents for a zone and pre-tax subtotal, or null for an unknown zone. */
export function deliveryFee(zoneId: string, subtotal: number): number | null {
  const zone = DELIVERY_ZONES.find((z) => z.id === zoneId);
  if (!zone) return null;
  return subtotal >= zone.freeOver ? 0 : zone.fee;
}

/** A zone's terms in a phrase, e.g. "Whistler $10 (free over $100)". */
export function deliveryZoneSummary(zone: DeliveryZone): string {
  const dollars = (cents: number) => `$${cents / 100}`;
  if (zone.minOrder) return `${zone.label} free on orders over ${dollars(zone.minOrder)}`;
  return `${zone.label} ${dollars(zone.fee)} (free over ${dollars(zone.freeOver)})`;
}

/** Why a zone can't take this order (below its minimum), or null if it can. */
export function deliveryZoneProblem(zone: DeliveryZone, subtotal: number): string | null {
  if (subtotal >= zone.minOrder) return null;
  const short = zone.minOrder - subtotal;
  return `Delivery to ${zone.label} is for orders of $${zone.minOrder / 100} or more (add $${Math.ceil(short / 100)} more), or choose pickup.`;
}

/**
 * Deliveries go out once a week: the gelato is made fresh for Thursday, and orders close the
 * Sunday before at 11:59pm (Whistler time). An order placed after that goes the following week.
 */
export const DELIVERY_SCHEDULE = {
  /** 0 = Sunday … 4 = Thursday. */
  weekday: 4,
  dayName: "Thursday",
  cutoffName: "Sunday",
  cutoffTime: "11:59pm",
  /** Days from the cut-off (Sunday) to delivery (Thursday). */
  cutoffDaysBefore: 4,
};

// Hard limits per cart line (not editable content).
export const PINT_MAX_PER_FLAVOUR = 18;
export const CAKE_MAX_QTY = 4;

export const defaultShop: Shop = {
  // Retail pint price, raised to $8 by Lucia (Nov 2026). The live value is the Studio's.
  pintPrice: 800,
  // Pint orders need 3 days' notice (Lucia, Nov 2026). The live value is the Studio's.
  pintLeadDays: 3,
  cakeLeadDays: 4,
  // TODO(client): confirm pickup window and days at the kitchen.
  pickupWindow: "12–5pm",
  pickupWhere: "Lucia kitchen, 4900 Glacier Drive (Base II), Whistler",
  pickupDays: [0, 1, 2, 3, 4, 5, 6],
  blackoutDates: [
    { date: "2026-12-25", note: "Christmas Day" },
    { date: "2027-01-01", note: "New Year's Day" },
  ],
  cakeSizes: [
    { id: "7in", label: '7"', serves: 8, price: 6000 },
    { id: "9in", label: '9"', serves: 12, price: 8000 },
  ],
  cakeBases: [
    { id: "chocolate-oreo", label: "Chocolate Oreo" },
    { id: "graham", label: "Graham cracker" },
    { id: "meringue", label: "Meringue", note: "Gluten-free & dairy-free" },
  ],
  cakeCombos: [
    { id: "gelato", label: "Classic gelato", flavours: "Vanilla & Chocolate" },
    { id: "sorbet", label: "Sorbet", flavours: "Mango & Wildberry", note: "Dairy-free & vegan" },
    {
      id: "dairy-free",
      label: "Dairy-free gelato",
      flavours: "Coconut Cookies & Cream & Chocolate",
      note: "Dairy-free & vegan",
    },
  ],
};
