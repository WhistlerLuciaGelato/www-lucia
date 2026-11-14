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
  /** Pints left to sell online; undefined = no limit. 0 shows the flavour as sold out. */
  stock?: number;
  /** The round lid label, shown overlapping the pint's top-left (Figma product cards). */
  label?: string;
  /** Ingredient list for the expanded product card, e.g. "Whole Milk, Sugars (sugar, dextrose), …". */
  ingredients?: string;
  /** Allergens, e.g. "Milk". */
  contains?: string;
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
  pints: Pick<PintFlavour, "slug" | "name" | "style" | "image" | "available" | "stock">[];
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
  /** Name in the Schedule & hours table, when it differs from the card's, e.g. "Gelato trailer · Lost Lake Park". */
  scheduleName?: string;
  /** One line per set of days, e.g. { days: "Fri–Sun", time: "11am–8pm" }. */
  hours: { days: string; time: string }[];
  /** YYYY-MM-DD: shows "Closed today" on that date only. */
  closedOn?: string;
  closureNote?: string;
  seasonClosed: boolean;
  /** Short code on the Schedule & hours calendar, e.g. "RO". Without one the spot isn't on the calendar. */
  calendarCode?: string;
  /** Name in the calendar key, e.g. "Roundhouse". Falls back to the name. */
  calendarLabel?: string;
  calendarColor: CalendarColor;
  /** When the spot is open, shown on the calendar. */
  openDates: OpenDates[];
};

/** Brand colours a spot can have on the calendar. */
export type CalendarColor = "heatwave" | "lakeside" | "grass" | "alpenglow" | "sunflower" | "strawberry";

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

/** A date or a run of dates (YYYY-MM-DD), optionally only on some weekdays (empty = every day). */
export type OpenDates = { from: string; to?: string; days: Weekday[] };

/** A business with an optional link to its website. */
export type Venue = { name: string; url?: string };

export type Stockists = {
  groceryStores: { town: string; stores: string[] }[];
  scoopShops: { name: string; address: string; town: string; url?: string }[];
  onTheMenu: { group: string; places: Venue[] }[];
};

export type EventPackage = {
  id: string;
  name: string;
  /** Whole CAD dollars. */
  basePrice: number;
  baseGuests: number;
  perGuest: number;
  features: string[];
  /** The card's "More info" text. Blank lines split paragraphs; `**bold**` marks bold text. */
  moreInfo?: string;
  accent: "lakeside" | "strawberry" | "heatwave";
};

export type EventPhoto = { src: string; alt: string; width: number; height: number };

export type EventsContent = {
  packages: EventPackage[];
  travelFees: { area: string; fee: number }[];
  terms: string[];
  faq: { q: string; a: string }[];
  gallery: EventPhoto[];
};

export type WholesaleKind = "tub" | "alcohol-tub" | "pint" | "snack";

export type WholesaleFormat = {
  id: string;
  kind: WholesaleKind;
  label: string;
  /** CAD cents, for reference only (0 if unset): never shown on the site or in quote requests. */
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
