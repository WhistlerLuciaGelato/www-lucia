import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlFor } from "@/sanity/image";
import type {
  Announcement,
  Bear,
  Catalogue,
  Diet,
  EventsContent,
  Location,
  PintFlavour,
  PintStyle,
  Shop,
  SiteSettings,
  Stockists,
  WholesaleContent,
  WholesaleKind,
} from "@/lib/content-types";
import { site } from "@/data/site";
import { pintFlavours as defaultPints } from "@/data/flavours";
import { defaultShop } from "@/data/shop";
import { groceryStores, onTheMenu, scoopShops, seasonalSpots } from "@/data/locations";
import { eventFaq, eventPackages, eventTerms, travelFees } from "@/data/events";
import { deliverySchedule, wholesaleFlavours, wholesaleFormats } from "@/data/wholesale";

/**
 * Every cached read carries this tag; the Sanity publish webhook revalidates it.
 * Reads refresh hourly as a safety net. A failed read falls back to the defaults and is
 * retried within minutes, so a brief Sanity outage doesn't pin old content for an hour.
 */
export const CONTENT_TAG = "sanity";

/** Call inside a `use cache` scope: retry soon after a failed read, otherwise refresh hourly. */
function setLifetime(failed: boolean) {
  if (failed) cacheLife("minutes");
  else cacheLife("hours");
}

const cents = (dollars: unknown) => Math.round(Number(dollars) * 100);

/** Returns the result, null if Sanity isn't set up, or undefined if the request failed. */
async function fetchDoc<T>(query: string): Promise<T | null | undefined> {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch<T | null>(query);
  } catch (err) {
    // Never take the site down because the CMS is unreachable: serve the defaults.
    console.error("Sanity fetch failed", err);
    return undefined;
  }
}

/* -------------------------------------------------------------------------- */
/* Site settings                                                              */
/* -------------------------------------------------------------------------- */

type SiteSettingsDoc = {
  announcement?: {
    enabled?: boolean;
    message?: string;
    tone?: "info" | "alert";
    linkLabel?: string;
    linkUrl?: string;
  };
  email?: string;
  phone?: string;
  instagramHandle?: string;
  instagramUrl?: string;
  kitchenStreet?: string;
  kitchenCity?: string;
  mailingStreet?: string;
  mailingCity?: string;
};

const siteSettingsQuery = defineQuery(`*[_id == "siteSettings"][0]`);

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag(CONTENT_TAG);

  const doc = await fetchDoc<SiteSettingsDoc>(siteSettingsQuery);

  setLifetime(doc === undefined);
  const a = doc?.announcement;
  const announcement: Announcement | null =
    a?.enabled && a.message
      ? { message: a.message, tone: a.tone ?? "info", linkLabel: a.linkLabel, linkUrl: a.linkUrl }
      : null;

  return {
    announcement,
    contact: {
      email: doc?.email || site.email,
      phone: doc?.phone || site.phone,
      instagramHandle: doc?.instagramHandle || site.instagramHandle,
      instagramUrl: doc?.instagramUrl || site.instagram,
      kitchenStreet: doc?.kitchenStreet || site.kitchen.street,
      kitchenCity: doc?.kitchenCity || site.kitchen.city,
      mailingStreet: doc?.mailingStreet || site.mailing.street,
      mailingCity: doc?.mailingCity || site.mailing.city,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Pints & shop                                                               */
/* -------------------------------------------------------------------------- */

type PintDoc = {
  name: string;
  slug: string;
  style: PintStyle;
  blurb?: string;
  diet?: Diet[];
  color?: string;
  activity?: string;
  bear?: Bear;
  available?: boolean;
  image?: { asset?: { _ref: string } };
  lid?: "local" | "dairy-free" | "none";
};

const pintsQuery = defineQuery(
  `*[_type == "pintFlavour" && defined(slug.current)] | order(orderRank asc, name asc) {
    name, "slug": slug.current, style, blurb, diet, color, activity, bear, available, image, lid
  }`,
);

export async function getPintFlavours(): Promise<PintFlavour[]> {
  "use cache";
  cacheTag(CONTENT_TAG);

  const docs = await fetchDoc<PintDoc[]>(pintsQuery);

  setLifetime(docs === undefined);
  if (!docs?.length) {
    return defaultPints.map(({ render, ...p }) => ({
      ...p,
      image: render ? `/pints/render/${p.slug}.webp` : `/pints/${p.slug}.webp`,
      lid: render ? (p.diet.includes("dairy-free") ? "dairy-free" : "local") : undefined,
      available: true,
    }));
  }
  return docs.map((d) => ({
    slug: d.slug,
    name: d.name,
    style: d.style ?? "Gelato",
    blurb: d.blurb ?? "",
    diet: d.diet ?? [],
    color: d.color || "#4e92a3",
    activity: d.activity ?? "",
    bear: d.bear ?? "bike",
    available: d.available !== false,
    // Transparent renders (shown with a lid) keep their transparency; other photos sit on Snow.
    image: d.image?.asset
      ? d.lid === "local" || d.lid === "dairy-free"
        ? urlFor(d.image).width(700).url()
        : urlFor(d.image).width(720).height(720).fit("fill").bg("fffef4").url()
      : "",
    lid: d.lid === "local" || d.lid === "dairy-free" ? d.lid : undefined,
  }));
}

type ShopDoc = {
  pintPrice?: number;
  pintLeadDays?: number;
  cakeLeadDays?: number;
  pickupWindow?: string;
  pickupWhere?: string;
  pickupDays?: string[];
  blackoutDates?: { date: string; note?: string }[];
  cakeSizes?: { _key: string; label: string; serves: number; price: number }[];
  cakeBases?: { _key: string; label: string; note?: string }[];
  cakeCombos?: { _key: string; label: string; flavours: string; note?: string }[];
};

const shopQuery = defineQuery(`*[_id == "shopSettings"][0]`);

export async function getShop(): Promise<Shop> {
  "use cache";
  cacheTag(CONTENT_TAG);

  const d = await fetchDoc<ShopDoc>(shopQuery);

  setLifetime(d === undefined);
  if (!d) return defaultShop;
  return {
    pintPrice: d.pintPrice != null ? cents(d.pintPrice) : defaultShop.pintPrice,
    pintLeadDays: d.pintLeadDays ?? defaultShop.pintLeadDays,
    cakeLeadDays: d.cakeLeadDays ?? defaultShop.cakeLeadDays,
    pickupWindow: d.pickupWindow || defaultShop.pickupWindow,
    pickupWhere: d.pickupWhere || defaultShop.pickupWhere,
    pickupDays: d.pickupDays?.length ? d.pickupDays.map(Number) : defaultShop.pickupDays,
    blackoutDates: (d.blackoutDates ?? []).filter((b) => b?.date),
    cakeSizes: d.cakeSizes?.length
      ? d.cakeSizes.map((s) => ({ id: s._key, label: s.label, serves: s.serves, price: cents(s.price) }))
      : defaultShop.cakeSizes,
    cakeBases: d.cakeBases?.length
      ? d.cakeBases.map((b) => ({ id: b._key, label: b.label, note: b.note || undefined }))
      : defaultShop.cakeBases,
    cakeCombos: d.cakeCombos?.length
      ? d.cakeCombos.map((c) => ({
          id: c._key,
          label: c.label,
          flavours: c.flavours,
          note: c.note || undefined,
        }))
      : defaultShop.cakeCombos,
  };
}

export async function getCatalogue(): Promise<Catalogue> {
  const [shop, pints] = await Promise.all([getShop(), getPintFlavours()]);
  return {
    shop,
    pints: pints.map(({ slug, name, style, image, available }) => ({ slug, name, style, image, available })),
  };
}

/* -------------------------------------------------------------------------- */
/* Locations & stockists                                                      */
/* -------------------------------------------------------------------------- */

const locationsQuery = defineQuery(
  `*[_type == "location" && active != false] | order(orderRank asc, name asc) {
    "id": _id, name, area, season, description, lat, lng, scheduleSeason,
    "hours": hours[]{ days, time }, closedOn, closureNote, seasonClosed
  }`,
);

export async function getLocations(): Promise<Location[]> {
  "use cache";
  cacheTag(CONTENT_TAG);

  const docs = await fetchDoc<Location[]>(locationsQuery);

  setLifetime(docs === undefined);
  if (!docs?.length) return seasonalSpots;
  return docs.map((d) => ({
    ...d,
    area: d.area ?? "",
    description: d.description ?? "",
    scheduleSeason: d.scheduleSeason ?? "",
    hours: (d.hours ?? [])
      .filter((h) => h?.days || h?.time)
      .map((h) => ({ days: h.days ?? "", time: h.time ?? "" })),
    closedOn: d.closedOn || undefined,
    closureNote: d.closureNote || undefined,
    seasonClosed: Boolean(d.seasonClosed),
  }));
}

const stockistsQuery = defineQuery(`*[_id == "stockists"][0]`);

export async function getStockists(): Promise<Stockists> {
  "use cache";
  cacheTag(CONTENT_TAG);

  const d = await fetchDoc<Partial<Stockists>>(stockistsQuery);

  setLifetime(d === undefined);
  return {
    groceryStores: d?.groceryStores?.map((g) => ({ town: g.town, stores: g.stores ?? [] })) ?? groceryStores,
    scoopShops: d?.scoopShops ?? scoopShops,
    onTheMenu: d?.onTheMenu?.map((g) => ({ group: g.group, places: g.places ?? [] })) ?? onTheMenu,
  };
}

/* -------------------------------------------------------------------------- */
/* Events                                                                     */
/* -------------------------------------------------------------------------- */

type EventsDoc = {
  packages?: (Omit<EventsContent["packages"][number], "id"> & { _key: string })[];
  travelFees?: { area: string; fee: number }[];
  terms?: string[];
  faq?: { question: string; answer: string }[];
};

const eventsQuery = defineQuery(`*[_id == "eventsPage"][0]`);

export async function getEvents(): Promise<EventsContent> {
  "use cache";
  cacheTag(CONTENT_TAG);

  const d = await fetchDoc<EventsDoc>(eventsQuery);

  setLifetime(d === undefined);
  return {
    packages: d?.packages?.length
      ? d.packages.map(({ _key, ...p }) => ({
          ...p,
          id: _key,
          features: p.features ?? [],
          accent: p.accent ?? "lakeside",
        }))
      : eventPackages,
    travelFees: d?.travelFees?.length ? d.travelFees : travelFees,
    terms: d?.terms ?? eventTerms,
    faq: d?.faq?.length ? d.faq.map((f) => ({ q: f.question, a: f.answer })) : eventFaq,
  };
}

/* -------------------------------------------------------------------------- */
/* Wholesale                                                                  */
/* -------------------------------------------------------------------------- */

type WholesaleDoc = {
  formats?: {
    _key: string;
    label: string;
    kind: WholesaleKind;
    price: number;
    multiple?: number;
    note?: string;
  }[];
  deliverySchedule?: WholesaleContent["deliverySchedule"];
  flavourGroups?: {
    _key: string;
    label: string;
    note?: string;
    flavours?: string[];
    availableIn?: WholesaleKind[];
  }[];
};

const wholesaleQuery = defineQuery(`*[_id == "wholesalePage"][0]`);

export async function getWholesale(): Promise<WholesaleContent> {
  "use cache";
  cacheTag(CONTENT_TAG);

  const d = await fetchDoc<WholesaleDoc>(wholesaleQuery);

  setLifetime(d === undefined);
  return {
    formats: d?.formats?.length
      ? d.formats.map((f) => ({
          id: f._key,
          kind: f.kind,
          label: f.label,
          price: cents(f.price),
          multiple: f.multiple ?? 1,
          note: f.note || undefined,
        }))
      : wholesaleFormats,
    deliverySchedule: d?.deliverySchedule?.length ? d.deliverySchedule : deliverySchedule,
    flavourGroups: d?.flavourGroups?.length
      ? d.flavourGroups.map((g) => ({
          id: g._key,
          label: g.label,
          note: g.note || undefined,
          flavours: g.flavours ?? [],
          availableIn: g.availableIn ?? [],
        }))
      : wholesaleFlavours,
  };
}
