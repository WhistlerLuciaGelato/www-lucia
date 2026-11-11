/**
 * One-off: applies Lucia's Nov 2026 content edits to the live Sanity content, which overrides
 * the defaults in src/data. Safe to run more than once: each change is skipped if already made,
 * and nothing else edited in the Studio is touched.
 *
 * - Pint price $8
 * - The Classic: "5 gelato flavours" → "5 flavours"
 * - Events FAQ: what's included, trailer space, trailer power, cancellation & refunds
 * - Wholesale: 10 L tub, Sorbetto "Dairy-free & vegan", Bestsellers list first
 *
 *   npm run apply-lucia-edits -- --dry-run
 *   SANITY_API_WRITE_TOKEN=... npm run apply-lucia-edits
 */
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";
import { eventFaq } from "../src/data/events.ts";
import { wholesaleFlavours, wholesaleFormats } from "../src/data/wholesale.ts";

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

async function apply(id: string, set: Record<string, unknown>) {
  if (Object.keys(set).length === 0) {
    console.log(`${id}: nothing to change`);
    return;
  }
  if (dryRun) {
    console.log(`${id} (dry run):`, JSON.stringify(set, null, 2));
    return;
  }
  await client.patch(id).set(set).commit();
  console.log(`${id}: updated ${Object.keys(set).join(", ")}`);
}

/* Shop ---------------------------------------------------------------------- */
{
  const shop = await client.fetch<{ pintPrice?: number } | null>(`*[_id == "shopSettings"][0]{pintPrice}`);
  await apply("shopSettings", shop?.pintPrice === 8 ? {} : { pintPrice: 8 });
}

/* Events -------------------------------------------------------------------- */
{
  type Pkg = { _key: string; name: string; features?: string[] };
  type Faq = { _key: string; question: string; answer: string };
  const doc = await client.fetch<{ packages?: Pkg[]; faq?: Faq[] } | null>(
    `*[_id == "eventsPage"][0]{packages, faq}`,
  );
  const set: Record<string, unknown> = {};

  const packages = doc?.packages ?? [];
  const classic = packages.find((p) => p.name === "The Classic");
  if (classic?.features?.includes("5 gelato flavours")) {
    set.packages = packages.map((p) =>
      p === classic
        ? { ...p, features: p.features!.map((f) => (f === "5 gelato flavours" ? "5 flavours" : f)) }
        : p,
    );
  }

  const faq = doc?.faq ?? [];
  const have = new Set(faq.map((f) => f.question));
  const newQuestions = [
    "What's included?",
    "How much space is required for the gelato trailer?",
    "What are the electricity requirements for the trailer?",
    "What is your cancellation and refund policy?",
  ];
  const additions = eventFaq
    .filter((f) => newQuestions.includes(f.q) && !have.has(f.q))
    .map((f) => ({ _key: key(), question: f.q, answer: f.a }));
  if (doc && additions.length) set.faq = [...faq, ...additions];

  if (doc) await apply("eventsPage", set);
  else console.log("eventsPage: no document, the site uses the defaults");
}

/* Wholesale ----------------------------------------------------------------- */
{
  type Format = {
    _key: string;
    label: string;
    kind: string;
    price: number;
    multiple?: number;
    note?: string;
  };
  type Group = { _key: string; label: string; note?: string; flavours?: string[]; availableIn?: string[] };
  const doc = await client.fetch<{ formats?: Format[]; flavourGroups?: Group[] } | null>(
    `*[_id == "wholesalePage"][0]{formats, flavourGroups}`,
  );
  const set: Record<string, unknown> = {};

  const formats = doc?.formats ?? [];
  if (doc && !formats.some((f) => /10\s*L/i.test(f.label))) {
    const ten = wholesaleFormats.find((f) => f.id === "tub-10l")!;
    const entry = {
      _key: "tub-10l",
      label: ten.label,
      kind: ten.kind,
      price: ten.price / 100,
      multiple: ten.multiple,
    };
    const after = formats.findIndex((f) => f.kind === "tub");
    set.formats = [...formats.slice(0, after + 1), entry, ...formats.slice(after + 1)];
  }

  let groups = doc?.flavourGroups ?? [];
  if (groups.some((g) => g.label === "Sorbetto" && g.note === "Dairy-free")) {
    groups = groups.map((g) => (g.label === "Sorbetto" ? { ...g, note: "Dairy-free & vegan" } : g));
    set.flavourGroups = groups;
  }
  if (doc && !groups.some((g) => g.label === "Bestsellers")) {
    const best = wholesaleFlavours.find((g) => g.id === "bestsellers")!;
    groups = [
      {
        _key: "bestsellers",
        label: best.label,
        flavours: best.flavours,
        availableIn: best.availableIn,
      } as Group,
      ...groups,
    ];
    set.flavourGroups = groups;
  }

  if (doc) await apply("wholesalePage", set);
  else console.log("wholesalePage: no document, the site uses the defaults");
}
