/**
 * One-off: brings the Sanity flavours in line with the website design (Figma "Lucia Website").
 * For the six flavours on the home page it uploads the transparent pint renders, sets the lid,
 * updates the description to the design's copy, and puts them first in the sort order.
 * Only those fields are patched; everything else edited in the Studio is left alone.
 *
 *   SANITY_API_WRITE_TOKEN=... npm run apply-figma-flavours
 *   npm run apply-figma-flavours -- --dry-run
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

for (const [i, pint] of pintFlavours.entries()) {
  const id = `pintFlavour-${pint.slug}`;
  const patch: Record<string, unknown> = { orderRank: (i + 1) * 10 };

  if (pint.render) {
    patch.blurb = pint.blurb;
    patch.lid = pint.diet.includes("dairy-free") ? "dairy-free" : "local";
    if (!dryRun) {
      const file = await readFile(new URL(`../public/pints/render/${pint.slug}.webp`, import.meta.url));
      const asset = await client.assets.upload("image", file, { filename: `${pint.slug}-render.webp` });
      patch.image = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
    } else {
      patch.image = `(upload public/pints/render/${pint.slug}.webp)`;
    }
  }

  if (dryRun) {
    console.log(id, patch);
  } else {
    await client.patch(id).set(patch).commit();
    console.log(`Updated ${id}`);
  }
}
