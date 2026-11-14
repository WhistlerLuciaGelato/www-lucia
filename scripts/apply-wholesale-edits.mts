/**
 * One-off: applies Lucia's wholesale edits to the live Sanity content, which overrides the defaults
 * in src/data/wholesale.ts. Safe to run more than once: each change is skipped if already made, and
 * nothing else edited in the Studio is touched.
 *
 * - Bestsellers = the grocery-store pint lineup (src/data/wholesale.ts), listed first
 * - 10 L tub and Sorbetto "Dairy-free & vegan" (in case apply-lucia-edits hasn't run)
 *
 *   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --env-file-if-exists=.env.local scripts/apply-wholesale-edits.mts --dry-run
 *   SANITY_API_WRITE_TOKEN=... node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --env-file-if-exists=.env.local scripts/apply-wholesale-edits.mts
 */
import { createClient } from "@sanity/client";
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

type Format = { _key: string; label: string; kind: string; price?: number; multiple?: number; note?: string };
type Group = { _key: string; label: string; note?: string; flavours?: string[]; availableIn?: string[] };

const doc = await client.fetch<{ formats?: Format[]; flavourGroups?: Group[] } | null>(
  `*[_id == "wholesalePage"][0]{formats, flavourGroups}`,
);
if (!doc) {
  console.log("wholesalePage: no document, the site uses the defaults");
  process.exit(0);
}

const set: Record<string, unknown> = {};

/* Sizes: 10 L tub ------------------------------------------------------------ */
const formats = doc.formats ?? [];
if (!formats.some((f) => /10\s*L/i.test(f.label))) {
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

/* Flavour lists ----------------------------------------------------------- */
const groups = doc.flavourGroups ?? [];
let next = groups;

// Sorbetto is dairy-free and vegan.
if (next.some((g) => g.label === "Sorbetto" && g.note !== "Dairy-free & vegan")) {
  next = next.map((g) => (g.label === "Sorbetto" ? { ...g, note: "Dairy-free & vegan" } : g));
}

// Bestsellers: the grocery pint lineup, first in the list.
const best = wholesaleFlavours.find((g) => g.id === "bestsellers")!;
const isBest = (g: Group) => /^bestsellers?$/i.test(g.label.trim());
const existing = next.find(isBest);
const bestGroup: Group = existing
  ? { ...existing, flavours: best.flavours }
  : { _key: "bestsellers", label: best.label, flavours: best.flavours, availableIn: best.availableIn };
next = [bestGroup, ...next.filter((g) => !isBest(g))];

if (JSON.stringify(next) !== JSON.stringify(groups)) set.flavourGroups = next;

/* Apply --------------------------------------------------------------------- */
if (Object.keys(set).length === 0) {
  console.log("wholesalePage: nothing to change");
} else if (dryRun) {
  if (set.formats) console.log("formats (dry run):", JSON.stringify(set.formats, null, 2));
  if (set.flavourGroups) {
    console.log("flavourGroups (dry run), Bestsellers:");
    console.log(`  before: ${JSON.stringify(existing?.flavours ?? null)}`);
    console.log(`  after:  ${JSON.stringify(bestGroup.flavours)}`);
    console.log(`  order:  ${next.map((g) => g.label).join(" › ")}`);
    console.log(`  notes:  ${next.map((g) => `${g.label}=${g.note ?? "—"}`).join(", ")}`);
  }
} else {
  await client.patch("wholesalePage").set(set).commit();
  console.log(`wholesalePage: updated ${Object.keys(set).join(", ")}`);
}
