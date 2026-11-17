/**
 * The Studio's page documents and the website defaults they're seeded from. `otherFields` are
 * fields of the same document that aren't page copy (lists, prices…), skipped by the schema check.
 */
import type { SchemaTypeDefinition } from "sanity";
import { aboutPage } from "@/data/pages/about";
import { contactPage } from "@/data/pages/contact";
import { eventsPageText } from "@/data/pages/events";
import { findUsPage } from "@/data/pages/find-us";
import { homePage } from "@/data/pages/home";
import { orderPage } from "@/data/pages/order";
import { ourGelatoPage } from "@/data/pages/our-gelato";
import { siteText } from "@/data/pages/site-text";
import { wholesalePageText } from "@/data/pages/wholesale";
import { aboutPage as aboutPageSchema } from "@/sanity/schemaTypes/aboutPage";
import { contactPage as contactPageSchema } from "@/sanity/schemaTypes/contactPage";
import { eventsPage as eventsPageSchema } from "@/sanity/schemaTypes/eventsPage";
import { findUsPage as findUsPageSchema } from "@/sanity/schemaTypes/findUsPage";
import { homePage as homePageSchema } from "@/sanity/schemaTypes/homePage";
import { orderPage as orderPageSchema } from "@/sanity/schemaTypes/orderPage";
import { ourGelatoPage as ourGelatoPageSchema } from "@/sanity/schemaTypes/ourGelatoPage";
import { siteText as siteTextSchema } from "@/sanity/schemaTypes/siteText";
import { wholesalePage as wholesalePageSchema } from "@/sanity/schemaTypes/wholesalePage";

type Schema = SchemaTypeDefinition & { fields: { name: string; group?: string | string[] }[] };
type Page = { id: string; schema: Schema; defaults: object; otherFields?: string[] };

/** Fields of a shared document that hold lists and prices rather than page copy. */
const listFields = (schema: Schema) => schema.fields.filter((f) => f.group !== "pageText").map((f) => f.name);

export const pages: Page[] = [
  { id: "homePage", schema: homePageSchema as Schema, defaults: homePage },
  { id: "aboutPage", schema: aboutPageSchema as Schema, defaults: aboutPage },
  { id: "ourGelatoPage", schema: ourGelatoPageSchema as Schema, defaults: ourGelatoPage },
  { id: "findUsPage", schema: findUsPageSchema as Schema, defaults: findUsPage },
  { id: "orderPage", schema: orderPageSchema as Schema, defaults: orderPage },
  { id: "contactPage", schema: contactPageSchema as Schema, defaults: contactPage },
  { id: "siteText", schema: siteTextSchema as Schema, defaults: siteText },
  {
    id: "eventsPage",
    schema: eventsPageSchema as Schema,
    defaults: eventsPageText,
    otherFields: listFields(eventsPageSchema as Schema),
  },
  {
    id: "wholesalePage",
    schema: wholesalePageSchema as Schema,
    defaults: wholesalePageText,
    otherFields: listFields(wholesalePageSchema as Schema),
  },
];
