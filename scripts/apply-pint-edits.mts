/**
 * One-off: brings the live Sanity pints in line with Lucia's notes and the Figma product cards.
 * Safe to run more than once, and nothing else edited in the Studio is touched.
 *
 * - Flavours still shown as a regular photo (no lid) get the transparent Figma render, the lid and
 *   the design's description: Vanilla Bean, Vegan Choco Coco and Wildberry. (Fresh Mint Chips
 *   isn't in Figma; see apply-feedback-edits.)
 * - Flavours from the Figma "All Product Cards" frame that the Studio doesn't have yet are created,
 *   after the existing ones: Chocolate Hazelnut, Espresso, Maple Pecan and Yogurt Mixed Berry.
 * - Ingredients and allergens ("Contains") are filled in where the Studio has none, from
 *   Lucia_Gelato_Ingredients_EN_FR.docx (kept in src/data/flavours.ts). Sorbets list no allergens.
 * - Pints need 3 days' notice (was 2).
 *
 * Round lid labels need no upload: the site falls back to public/pints/label/<slug>.webp.
 *
 *   npm run apply-pint-edits -- --dry-run
 *   SANITY_API_WRITE_TOKEN=... npm run apply-pint-edits
 */
import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";
import { pintFlavours } from "../src/data/flavours.ts";

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

async function uploadRender(slug: string) {
  const path = `public/pints/render/${slug}.webp`;
  if (dryRun) return `(upload ${path})`;
  const file = await readFile(new URL(`../${path}`, import.meta.url));
  const asset = await client.assets.upload("image", file, { filename: `${slug}-render.webp` });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

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

/* Pints --------------------------------------------------------------------- */
type Doc = {
  _id: string;
  slug?: string;
  lid?: string;
  ingredients?: string;
  contains?: string;
  orderRank?: number;
};
const docs = await client.fetch<Doc[]>(
  `*[_type == "pintFlavour" && !(_id in path("drafts.**"))]{_id, "slug": slug.current, lid, ingredients, contains, orderRank}`,
);
const bySlug = new Map(docs.map((d) => [d.slug, d]));
let nextRank = Math.max(0, ...docs.map((d) => d.orderRank ?? 0)) + 10;

for (const pint of pintFlavours) {
  const doc = bySlug.get(pint.slug);
  if (!doc) {
    const { render, ...p } = pint;
    const created = {
      _id: `pintFlavour-${p.slug}`,
      _type: "pintFlavour",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      available: true,
      style: p.style,
      blurb: p.blurb,
      diet: p.diet,
      ingredients: p.ingredients,
      contains: p.contains,
      color: p.color,
      activity: p.activity,
      bear: p.bear,
      orderRank: nextRank,
      ...(render
        ? { image: await uploadRender(p.slug), lid: p.diet.includes("dairy-free") ? "dairy-free" : "local" }
        : {}),
    };
    nextRank += 10;
    if (dryRun) console.log(`${p.slug}: create (dry run):`, JSON.stringify(created, null, 2));
    else {
      await client.createIfNotExists(created);
      console.log(`${p.slug}: created`);
    }
    continue;
  }
  const set: Record<string, unknown> = {};

  if (pint.render && (!doc.lid || doc.lid === "none")) {
    set.blurb = pint.blurb;
    set.lid = pint.diet.includes("dairy-free") ? "dairy-free" : "local";
    set.image = await uploadRender(pint.slug);
  }
  if (pint.ingredients && !doc.ingredients?.trim()) set.ingredients = pint.ingredients;
  if (pint.contains && !doc.contains?.trim()) set.contains = pint.contains;

  await apply(doc._id, set);
}

/* Shop ---------------------------------------------------------------------- */
{
  const shop = await client.fetch<{ pintLeadDays?: number } | null>(
    `*[_id == "shopSettings"][0]{pintLeadDays}`,
  );
  await apply("shopSettings", shop?.pintLeadDays === 3 ? {} : { pintLeadDays: 3 });
}
