import type { Shop } from "@/lib/content-types";

/**
 * Default online-shop settings, used until the Sanity Studio has its own.
 * All prices are in CAD cents.
 *
 * Everything is pickup-only from the Base II kitchen: gelato doesn't survive a
 * courier ride, and cakes need to go straight into a freezer.
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

// Hard limits per cart line (not editable content).
export const PINT_MAX_PER_FLAVOUR = 24;
export const CAKE_MAX_QTY = 4;

export const defaultShop: Shop = {
  // TODO(client): confirm retail pint price (wholesale is $6.95).
  pintPrice: 1200,
  // TODO(client): confirm how much notice the kitchen needs for pint orders.
  pintLeadDays: 2,
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
