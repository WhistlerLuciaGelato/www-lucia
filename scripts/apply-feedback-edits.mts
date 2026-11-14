/**
 * One-off: Lucia's November 2026 feedback, applied to the live Sanity content. Safe to run more
 * than once; nothing else edited in the Studio is touched.
 *
 * - Yogurt Mixed Berry gets Lucia's description (replacing the placeholder).
 * - Fresh Mint Chips is shown as its own pint photo, with no lid drawn behind it (the photo
 *   already has one, so the two used to show at once). It isn't in Figma; a flat label render
 *   like the other flavours' would replace this.
 * - Delish Cafe (also on the menu) links to its Instagram.
 *
 *   npm run apply-feedback-edits -- --dry-run
 *   SANITY_API_WRITE_TOKEN=... npm run apply-feedback-edits
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

/* Yogurt Mixed Berry -------------------------------------------------------- */
{
  const PLACEHOLDER =
    "Tangy Greek yogurt gelato swirled with strawberries, blueberries and raspberries. Bright, creamy and bursting with berries.";
  const blurb = pintFlavours.find((p) => p.slug === "yogurt-mixed-berry")?.blurb;
  const doc = await client.fetch<{ _id: string; blurb?: string } | null>(
    `*[_type == "pintFlavour" && slug.current == "yogurt-mixed-berry" && !(_id in path("drafts.**"))][0]{_id, blurb}`,
  );
  if (doc && blurb) await apply(doc._id, !doc.blurb || doc.blurb === PLACEHOLDER ? { blurb } : {});
}

/* Fresh Mint Chips ---------------------------------------------------------- */
{
  const doc = await client.fetch<{ _id: string; lid?: string } | null>(
    `*[_type == "pintFlavour" && slug.current == "fresh-mint-chips" && !(_id in path("drafts.**"))][0]{_id, lid}`,
  );
  if (doc && doc.lid !== "none") {
    const path = "public/pints/fresh-mint-chips.webp";
    let image: unknown = `(upload ${path})`;
    if (!dryRun) {
      const file = await readFile(new URL(`../${path}`, import.meta.url));
      const asset = await client.assets.upload("image", file, { filename: "fresh-mint-chips-pint.webp" });
      image = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
    }
    await apply(doc._id, { lid: "none", image });
  } else if (doc) {
    console.log(`${doc._id}: nothing to change`);
  }
}

/* Delish Cafe --------------------------------------------------------------- */
{
  const DELISH = "https://www.instagram.com/delish_cafe_whistler/?hl=en";
  const doc = await client.fetch<{
    onTheMenu?: { _key: string; venues?: { _key: string; name?: string; url?: string }[] }[];
  } | null>(`*[_id == "stockists"][0]{onTheMenu}`);
  const set: Record<string, unknown> = {};
  for (const group of doc?.onTheMenu ?? []) {
    for (const venue of group.venues ?? []) {
      if (/^delish/i.test(venue.name ?? "") && !venue.url) {
        set[`onTheMenu[_key=="${group._key}"].venues[_key=="${venue._key}"].url`] = DELISH;
      }
    }
  }
  await apply("stockists", set);
}
