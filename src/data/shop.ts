/**
 * Online shop catalogue. All prices are in CAD cents.
 *
 * Everything here is pickup-only from the Base II kitchen: gelato doesn't survive a
 * courier ride, and cakes need to go straight into a freezer.
 */

// TODO(client): confirm retail pint price (wholesale is $6.95).
export const PINT_PRICE = 1200;
// TODO(client): confirm how much notice the kitchen needs for pint orders.
export const PINT_LEAD_DAYS = 2;
export const PINT_MAX_PER_FLAVOUR = 24;

export const CAKE_LEAD_DAYS = 4;
export const CAKE_MAX_QTY = 4;

export const cakeSizes = [
  { id: "7in", label: '7"', serves: 8, price: 6000 },
  { id: "9in", label: '9"', serves: 12, price: 8000 },
] as const;

export const cakeBases = [
  { id: "chocolate-oreo", label: "Chocolate Oreo" },
  { id: "graham", label: "Graham cracker" },
  { id: "meringue", label: "Meringue", note: "Gluten-free & dairy-free" },
] as const;

export const cakeCombos = [
  {
    id: "gelato",
    label: "Classic gelato",
    flavours: "Vanilla & Chocolate",
    note: undefined,
  },
  {
    id: "sorbet",
    label: "Sorbet",
    flavours: "Mango & Wildberry",
    note: "Dairy-free & vegan",
  },
  {
    id: "dairy-free",
    label: "Dairy-free gelato",
    flavours: "Coconut Cookies & Cream & Chocolate",
    note: "Dairy-free & vegan",
  },
] as const;

export type CakeSizeId = (typeof cakeSizes)[number]["id"];
export type CakeBaseId = (typeof cakeBases)[number]["id"];
export type CakeComboId = (typeof cakeCombos)[number]["id"];

export const pickup = {
  // TODO(client): confirm pickup window at the kitchen.
  window: "12–5pm",
  where: "Lucia kitchen, 4900 Glacier Drive (Base II), Whistler",
};
