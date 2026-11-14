/**
 * One-off: applies the Events page redesign's copy (Figma "Lucia Website" › XX Working Zone ›
 * Events) to the live Sanity content, which overrides the defaults in src/data/events.ts. Safe to
 * run more than once: each field is only written if it differs, and the photo gallery and anything
 * else edited in the Studio are left alone.
 *
 * - Packages: Figma prices ($600 / $900 / $1,000), features, "More info" text and card colours
 * - Travel fees: "Squamish & Pemberton" +$100, Vancouver +$300
 * - Booking info pills: customization, $500 deposit, taxes & gratuity (travel pills come from the fees)
 * - FAQ: the Figma question list, without the four the client will answer later (trailer space,
 *   electricity, what's included, cancellation & refunds)
 *
 *   node scripts/apply-events-edits.mts --dry-run
 *   SANITY_API_WRITE_TOKEN=... node scripts/apply-events-edits.mts
 */
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";
import { eventFaq, eventPackages, eventTerms, travelFees } from "../src/data/events.ts";

const dryRun = process.argv.includes("--dry-run");
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!dryRun && !token) {
  console.error("Set SANITY_API_WRITE_TOKEN (or pass --dry-run).");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "kkqmc2m3",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token,
  apiVersion: "2025-10-01",
  useCdn: false,
});

const key = () => randomUUID().slice(0, 12);

/** Compares two arrays of Studio objects, ignoring their `_key`s. */
const same = (a: unknown, b: unknown) =>
  JSON.stringify(a, (k, v) => (k === "_key" ? undefined : v)) ===
  JSON.stringify(b, (k, v) => (k === "_key" ? undefined : v));

type Pkg = {
  _key: string;
  name: string;
  basePrice?: number;
  baseGuests?: number;
  perGuest?: number;
  features?: string[];
  moreInfo?: string;
  accent?: string;
};
type Fee = { _key: string; area: string; fee: number };
type Faq = { _key: string; question: string; answer: string };

const doc = await client.fetch<{ packages?: Pkg[]; travelFees?: Fee[]; terms?: string[]; faq?: Faq[] } | null>(
  `*[_id == "eventsPage"][0]{packages, travelFees, terms, faq}`,
);

if (!doc) {
  console.log("eventsPage: no document, the site uses the defaults");
  process.exit(0);
}

const set: Record<string, unknown> = {};

// Packages: matched by name, keeping each one's _key (the booking form submits it).
const packages = eventPackages.map(({ id, ...p }) => {
  const live = doc.packages?.find((l) => l.name.trim().toLowerCase() === p.name.toLowerCase());
  return { _key: live?._key ?? id, ...p };
});
const extraPackages = (doc.packages ?? []).filter((l) => !packages.some((p) => p._key === l._key));
if (!same(doc.packages ?? [], [...packages, ...extraPackages])) set.packages = [...packages, ...extraPackages];

// Travel fees: matched by the first word of the area ("Squamish / Pemberton" → "Squamish & Pemberton").
const firstWord = (s: string) => s.trim().split(/[\s/&,]+/)[0].toLowerCase();
const fees = travelFees.map((t) => {
  const live = doc.travelFees?.find((l) => firstWord(l.area) === firstWord(t.area));
  return { _key: live?._key ?? key(), ...t };
});
if (!same(doc.travelFees ?? [], fees)) set.travelFees = fees;

if (!same(doc.terms ?? [], eventTerms)) set.terms = eventTerms;

// FAQ: replaced with the new list; questions already there keep their _key.
const faq = eventFaq.map((f) => ({
  _key: doc.faq?.find((l) => l.question === f.q)?._key ?? key(),
  question: f.q,
  answer: f.a,
}));
if (!same(doc.faq ?? [], faq)) {
  set.faq = faq;
  const removed = (doc.faq ?? []).filter((l) => !eventFaq.some((f) => f.q === l.question));
  console.log(`FAQ: removing ${removed.length} old question(s):`);
  for (const r of removed) console.log(`  - ${r.question}`);
}

if (Object.keys(set).length === 0) {
  console.log("eventsPage: nothing to change");
} else if (dryRun) {
  console.log("eventsPage (dry run):", JSON.stringify(set, null, 2));
} else {
  await client.patch("eventsPage").set(set).commit();
  console.log(`eventsPage: updated ${Object.keys(set).join(", ")}`);
}
