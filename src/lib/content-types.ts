/**
 * The shape of everything the client can edit in the Studio. The content layer
 * (src/lib/content.ts) returns these whether data comes from Sanity or from the
 * built-in defaults in src/data.
 */
import type { Bear, Diet } from "@/data/flavours";

export type { Bear, Diet };

export type Contact = {
  email: string;
  phone: string;
  instagramHandle: string;
  instagramUrl: string;
  kitchenStreet: string;
  kitchenCity: string;
  mailingStreet: string;
  mailingCity: string;
};

export type Announcement = {
  message: string;
  tone: "info" | "alert";
  linkLabel?: string;
  linkUrl?: string;
};

export type SiteSettings = {
  contact: Contact;
  announcement: Announcement | null;
};

export type PintStyle = "Gelato" | "Sorbet" | "Dairy-free gelato";

export type PintFlavour = {
  slug: string;
  name: string;
  style: PintStyle;
  blurb: string;
  diet: Diet[];
  color: string;
  activity: string;
  bear: Bear;
  image: string;
  /**
   * Show a lid behind the image. Used with transparent pint renders, as in the website
   * design: "local" is the Made on the Mountain lid, "dairy-free" the Hello I'm dairy-free one.
   */
  lid?: "local" | "dairy-free";
  /** False = shown as sold out in the shop. */
  available: boolean;
};

export type CakeSize = { id: string; label: string; serves: number; price: number };
export type CakeBase = { id: string; label: string; note?: string };
export type CakeCombo = { id: string; label: string; flavours: string; note?: string };

export type Shop = {
  /** CAD cents. */
  pintPrice: number;
  pintLeadDays: number;
  cakeLeadDays: number;
  pickupWindow: string;
  pickupWhere: string;
  /** Days of the week pickup is possible, 0 = Sunday. */
  pickupDays: number[];
  blackoutDates: { date: string; note?: string }[];
  cakeSizes: CakeSize[];
  cakeBases: CakeBase[];
  cakeCombos: CakeCombo[];
};

/** Everything the cart and checkout need to price and validate an order. */
export type Catalogue = {
  shop: Shop;
  pints: Pick<PintFlavour, "slug" | "name" | "style" | "image" | "available">[];
};

export type Location = {
  id: string;
  name: string;
  area: string;
  season: "Winter" | "Summer";
  description: string;
  lat: number;
  lng: number;
  scheduleSeason: string;
  /** One line per set of days, e.g. { days: "Fri–Sun", time: "11am–8pm" }. */
  hours: { days: string; time: string }[];
  /** YYYY-MM-DD: shows "Closed today" on that date only. */
  closedOn?: string;
  closureNote?: string;
  seasonClosed: boolean;
};

export type Stockists = {
  groceryStores: { town: string; stores: string[] }[];
  scoopShops: { name: string; address: string; town: string }[];
  onTheMenu: { group: string; places: string[] }[];
};

export type EventPackage = {
  id: string;
  name: string;
  /** Whole CAD dollars. */
  basePrice: number;
  baseGuests: number;
  perGuest: number;
  features: string[];
  accent: "lakeside" | "strawberry" | "heatwave";
};

export type EventsContent = {
  packages: EventPackage[];
  travelFees: { area: string; fee: number }[];
  terms: string[];
  faq: { q: string; a: string }[];
};

export type WholesaleKind = "tub" | "alcohol-tub" | "pint" | "snack";

export type WholesaleFormat = {
  id: string;
  kind: WholesaleKind;
  label: string;
  /** CAD cents. */
  price: number;
  multiple: number;
  note?: string;
};

export type FlavourGroup = {
  id: string;
  label: string;
  note?: string;
  flavours: string[];
  /** Which formats these flavours can be ordered in. Empty = list only. */
  availableIn: WholesaleKind[];
};

export type WholesaleContent = {
  formats: WholesaleFormat[];
  deliverySchedule: { area: string; days: string; terms: string }[];
  flavourGroups: FlavourGroup[];
};
