/**
 * One-off: Lucia's November 2026 feedback, applied to the live Sanity content. Safe to run more
 * than once; nothing else edited in the Studio is touched.
 *
 * - Yogurt Mixed Berry gets Lucia's description (replacing the placeholder).
 * - Fresh Mint Chips uses its label render from Figma ("All Flavours") on the usual lid.
 * - Chocolate Hazelnut, Espresso, Maple Pecan and Yogurt Mixed Berry are tagged as new.
 * - Delish Cafe (also on the menu) links to its Instagram.
 * - Events FAQ: Lucia's answers on trailer size, power, what's included and cancellations.
 * - Wholesale: Lucia's top-10 bestsellers, most popular first, and her suppliers.
 *
 *   npm run apply-feedback-edits -- --dry-run
 *   SANITY_API_WRITE_TOKEN=... npm run apply-feedback-edits
 */
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";
import { eventFaq } from "../src/data/events.ts";
import { pintFlavours } from "../src/data/flavours.ts";
import { suppliers, wholesaleFlavours } from "../src/data/wholesale.ts";

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
// The label render from Figma ("All Flavours"), on the Made on the Mountain lid like the others.
// It replaces the stand-in photo used until the flat label art arrived.
{
  const doc = await client.fetch<{ _id: string; lid?: string } | null>(
    `*[_type == "pintFlavour" && slug.current == "fresh-mint-chips" && !(_id in path("drafts.**"))][0]{_id, lid}`,
  );
  if (doc && doc.lid !== "local") {
    const path = "public/pints/render/fresh-mint-chips.webp";
    let image: unknown = `(upload ${path})`;
    if (!dryRun) {
      const file = await readFile(new URL(`../${path}`, import.meta.url));
      const asset = await client.assets.upload("image", file, { filename: "fresh-mint-chips.webp" });
      image = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
    }
    await apply(doc._id, { lid: "local", image });
  } else if (doc) {
    console.log(`${doc._id}: nothing to change`);
  }
}

/* New flavours ---------------------------------------------------------------- */
// The NEW badge from Figma, for flavours the Studio hasn't set either way yet.
{
  const docs = await client.fetch<{ _id: string; slug: string; isNew: boolean | null }[]>(
    `*[_type == "pintFlavour" && !(_id in path("drafts.**"))]{_id, "slug": slug.current, isNew}`,
  );
  for (const doc of docs) {
    const isNew = pintFlavours.find((p) => p.slug === doc.slug)?.isNew === true;
    if (doc.isNew == null && isNew) await apply(doc._id, { isNew: true });
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

/* Events FAQ ---------------------------------------------------------------- */
// Lucia's answers on trailer size, power, what's included and cancellations. Questions already in
// the Studio keep their wording; the short deposit question gives way to the cancellation policy.
{
  type Faq = { _key: string; question?: string; answer?: string };
  const OLD_DEPOSIT = "Is a deposit required to secure my booking?";
  const doc = await client.fetch<{ faq?: Faq[] } | null>(`*[_id == "eventsPage"][0]{faq}`);
  const live = doc?.faq ?? [];
  const missing = eventFaq.filter((f) => !live.some((l) => l.question === f.q));
  if (doc && missing.length) {
    const faq = [
      ...eventFaq.map((f) => {
        const existing = live.find((l) => l.question === f.q);
        return existing ?? { _key: randomUUID().slice(0, 12), question: f.q, answer: f.a };
      }),
      // Anything added in the Studio that the code doesn't know about stays, at the end.
      ...live.filter((l) => l.question !== OLD_DEPOSIT && !eventFaq.some((f) => f.q === l.question)),
    ];
    console.log(`FAQ: adding ${missing.map((f) => f.q).join(" · ")}`);
    await apply("eventsPage", { faq });
  } else {
    console.log("eventsPage: nothing to change");
  }
}

/* Wholesale bestsellers ------------------------------------------------------- */
// Lucia's top 10 in order of popularity. Vegan Choco Coco leaves the bestsellers, so it joins the
// vegan list to stay orderable.
{
  type Group = { _key: string; flavours?: string[] };
  const doc = await client.fetch<{ flavourGroups?: Group[] } | null>(
    `*[_id == "wholesalePage"][0]{flavourGroups}`,
  );
  const want = (id: string) => wholesaleFlavours.find((g) => g.id === id)?.flavours ?? [];
  const set: Record<string, unknown> = {};
  const best = doc?.flavourGroups?.find((g) => g._key === "bestsellers");
  if (best && JSON.stringify(best.flavours) !== JSON.stringify(want("bestsellers"))) {
    set[`flavourGroups[_key=="bestsellers"].flavours`] = want("bestsellers");
  }
  const vegan = doc?.flavourGroups?.find((g) => g._key === "vegan");
  if (vegan && !vegan.flavours?.includes("Vegan Choco Coco")) {
    set[`flavourGroups[_key=="vegan"].flavours`] = [...(vegan.flavours ?? []), "Vegan Choco Coco"].sort();
  }
  await apply("wholesalePage", set);
}

/* Wholesale suppliers -------------------------------------------------------- */
// Lucia's supplier list, added only if the Studio has none yet.
{
  const doc = await client.fetch<{ suppliers?: unknown[] } | null>(`*[_id == "wholesalePage"][0]{suppliers}`);
  if (doc && !doc.suppliers?.length) {
    await apply("wholesalePage", {
      suppliers: suppliers.map((s) => ({ _key: randomUUID().slice(0, 12), ...s })),
    });
  } else {
    console.log("wholesalePage suppliers: nothing to change");
  }
}
