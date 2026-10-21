/**
 * Copies the built-in content (src/data) into a Sanity dataset, so the Studio starts
 * filled in with everything currently on the site, pint images included.
 *
 *   SANITY_API_WRITE_TOKEN=... npm run seed
 *   node scripts/seed-sanity.mts --dry-run     # print the documents without writing
 *
 * Safe to re-run: documents use fixed ids and are replaced. Re-running overwrites
 * edits made in the Studio, so only run it to set up a new dataset.
 */
import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";
import { pintFlavours } from "../src/data/flavours.ts";
import { defaultShop } from "../src/data/shop.ts";
import { groceryStores, onTheMenu, scoopShops, seasonalSpots } from "../src/data/locations.ts";
import { eventFaq, eventPackages, eventTerms, travelFees } from "../src/data/events.ts";
import { deliverySchedule, wholesaleFlavours, wholesaleFormats } from "../src/data/wholesale.ts";
import { site } from "../src/data/site.ts";

const dryRun = process.argv.includes("--dry-run");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "kkqmc2m3";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!dryRun && !token) {
  console.error("Set SANITY_API_WRITE_TOKEN (or pass --dry-run).");
  process.exit(1);
}

const client = createClient({
  projectId: projectId ?? "dry-run",
  dataset,
  token,
  apiVersion: "2025-10-01",
  useCdn: false,
});

const dollars = (cents: number) => cents / 100;
const keyed = <T extends object>(items: T[], prefix: string) =>
  items.map((item, i) => ({ _key: `${prefix}${i}`, ...item }));

async function uploadPint(slug: string) {
  if (dryRun) return { _type: "image", asset: { _type: "reference", _ref: `image-${slug}` } };
  const file = await readFile(new URL(`../public/pints/${slug}.webp`, import.meta.url));
  const asset = await client.assets.upload("image", file, { filename: `${slug}.webp` });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

const docs: Record<string, unknown>[] = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    announcement: { enabled: false, tone: "info", message: "" },
    email: site.email,
    phone: site.phone,
    instagramHandle: site.instagramHandle,
    instagramUrl: site.instagram,
    kitchenStreet: site.kitchen.street,
    kitchenCity: site.kitchen.city,
    mailingStreet: site.mailing.street,
    mailingCity: site.mailing.city,
  },
  {
    _id: "shopSettings",
    _type: "shopSettings",
    pintPrice: dollars(defaultShop.pintPrice),
    pintLeadDays: defaultShop.pintLeadDays,
    cakeLeadDays: defaultShop.cakeLeadDays,
    pickupWindow: defaultShop.pickupWindow,
    pickupWhere: defaultShop.pickupWhere,
    pickupDays: defaultShop.pickupDays.map(String),
    blackoutDates: keyed(defaultShop.blackoutDates, "closed"),
    // Array keys double as the ids stored in customers' carts, so keep them stable.
    cakeSizes: defaultShop.cakeSizes.map(({ id, price, ...s }) => ({
      _key: id,
      ...s,
      price: dollars(price),
    })),
    cakeBases: defaultShop.cakeBases.map(({ id, ...b }) => ({ _key: id, ...b })),
    cakeCombos: defaultShop.cakeCombos.map(({ id, ...c }) => ({ _key: id, ...c })),
  },
  {
    _id: "stockists",
    _type: "stockists",
    groceryStores: keyed(groceryStores, "town"),
    scoopShops: keyed(scoopShops, "scoop"),
    onTheMenu: keyed(onTheMenu, "menu"),
  },
  {
    _id: "eventsPage",
    _type: "eventsPage",
    packages: eventPackages.map(({ id, ...p }) => ({ _key: id, ...p })),
    travelFees: keyed(travelFees, "travel"),
    terms: eventTerms,
    faq: keyed(
      eventFaq.map((f) => ({ question: f.q, answer: f.a })),
      "faq",
    ),
  },
  {
    _id: "wholesalePage",
    _type: "wholesalePage",
    formats: wholesaleFormats.map(({ id, price, ...f }) => ({ _key: id, ...f, price: dollars(price) })),
    deliverySchedule: keyed(deliverySchedule, "delivery"),
    flavourGroups: wholesaleFlavours.map(({ id, ...g }) => ({ _key: id, ...g })),
  },
  ...seasonalSpots.map(({ id, hours, ...spot }, i) => ({
    _id: `location-${id}`,
    _type: "location",
    ...spot,
    hours: keyed(hours, "hours"),
    active: true,
    orderRank: (i + 1) * 10,
  })),
];

for (const [i, pint] of pintFlavours.entries()) {
  docs.push({
    _id: `pintFlavour-${pint.slug}`,
    _type: "pintFlavour",
    name: pint.name,
    slug: { _type: "slug", current: pint.slug },
    style: pint.style,
    blurb: pint.blurb,
    diet: pint.diet,
    color: pint.color,
    activity: pint.activity,
    bear: pint.bear,
    available: true,
    orderRank: (i + 1) * 10,
    image: await uploadPint(pint.slug),
  });
}

if (dryRun) {
  console.log(JSON.stringify(docs, null, 2));
  console.error(`\n${docs.length} documents (dry run, nothing written).`);
} else {
  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc as { _id: string; _type: string });
  await tx.commit();
  console.log(`Seeded ${docs.length} documents into ${projectId}/${dataset}.`);
}
