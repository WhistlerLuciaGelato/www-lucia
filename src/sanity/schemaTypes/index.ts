import { aboutPage } from "./aboutPage";
import { contactPage } from "./contactPage";
import { eventsPage } from "./eventsPage";
import { findUsPage } from "./findUsPage";
import { homePage } from "./homePage";
import { location } from "./location";
import { orderPage } from "./orderPage";
import { ourGelatoPage } from "./ourGelatoPage";
import { pintFlavour } from "./pintFlavour";
import { promoCodes } from "./promoCodes";
import { shopSettings } from "./shopSettings";
import { siteSettings } from "./siteSettings";
import { siteText } from "./siteText";
import { stockists } from "./stockists";
import { wholesalePage } from "./wholesalePage";

export const schemaTypes = [
  siteSettings,
  shopSettings,
  promoCodes,
  pintFlavour,
  location,
  stockists,
  eventsPage,
  wholesalePage,
  homePage,
  aboutPage,
  ourGelatoPage,
  findUsPage,
  orderPage,
  contactPage,
  siteText,
];

/** One-of-a-kind documents, edited in place rather than created from a list. */
export const singletonTypes = new Set([
  "siteSettings",
  "shopSettings",
  "promoCodes",
  "stockists",
  "eventsPage",
  "wholesalePage",
  "homePage",
  "aboutPage",
  "ourGelatoPage",
  "findUsPage",
  "orderPage",
  "contactPage",
  "siteText",
]);
