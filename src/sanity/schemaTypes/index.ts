import { eventsPage } from "./eventsPage";
import { location } from "./location";
import { pintFlavour } from "./pintFlavour";
import { shopSettings } from "./shopSettings";
import { siteSettings } from "./siteSettings";
import { stockists } from "./stockists";
import { wholesalePage } from "./wholesalePage";

export const schemaTypes = [
  siteSettings,
  shopSettings,
  pintFlavour,
  location,
  stockists,
  eventsPage,
  wholesalePage,
];

/** One-of-a-kind documents, edited in place rather than created from a list. */
export const singletonTypes = new Set([
  "siteSettings",
  "shopSettings",
  "stockists",
  "eventsPage",
  "wholesalePage",
]);
