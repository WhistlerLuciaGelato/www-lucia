/**
 * One-off: applies the Find us page edits (Lucia's Nov 2026 notes + the Figma working zone) to the
 * live Sanity content, which overrides the defaults in src/data. Safe to run more than once: each
 * change is skipped if already made, and nothing else edited in the Studio is touched.
 *
 * - Locations: card copy from the design, "Summer" / "Hours TBC" in the hours table, and the
 *   calendar code, key label and colour (no open dates: the season's dates are added in the Studio)
 * - Stockists: a website for each scoop partner and each "Also on the menu" place. The old
 *   plain-name lists move to the new name + website lists.
 *
 *   node --env-file-if-exists=.env.local scripts/apply-find-us-edits.mts --dry-run
 *   SANITY_API_WRITE_TOKEN=... node --env-file-if-exists=.env.local scripts/apply-find-us-edits.mts
 */
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";
import { onTheMenu, scoopShops, seasonalSpots } from "../src/data/locations.ts";

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

/** Names compare without case, accents or apostrophe style ("Christine's" = "Christine’s"). */
const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’‘`]/g, "'").toLowerCase().trim();

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

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

/* Locations ----------------------------------------------------------------- */
{
  type Hours = { _key?: string; days?: string; time?: string };
  type Doc = {
    _id: string;
    name?: string;
    area?: string;
    description?: string;
    scheduleSeason?: string;
    hours?: Hours[];
    calendarCode?: string;
    calendarLabel?: string;
    calendarColor?: string;
  };
  const docs = await client.fetch<Doc[]>(
    `*[_type == "location" && !(_id in path("drafts.**"))]{
      _id, name, area, description, scheduleSeason, hours, calendarCode, calendarLabel, calendarColor
    }`,
  );

  for (const spot of seasonalSpots) {
    const doc =
      docs.find((d) => d._id === `location-${spot.id}`) ??
      docs.find((d) => d.name && norm(d.name) === norm(spot.name));
    if (!doc) {
      console.log(`location ${spot.name}: no document, skipped`);
      continue;
    }
    const set: Record<string, unknown> = {};
    if (doc.area !== spot.area) set.area = spot.area;
    if (doc.description !== spot.description) set.description = spot.description;
    if (doc.scheduleSeason !== spot.scheduleSeason) set.scheduleSeason = spot.scheduleSeason;
    // The design shows every spot as "Hours TBC" (Olympic Plaza: "Special events, dates & hours TBC").
    const hours = (doc.hours ?? []).map((h) => ({ days: h.days ?? "", time: h.time ?? "" }));
    if (!same(hours, spot.hours)) {
      set.hours = spot.hours.map((h, i) => ({ _key: `hours${i}`, ...h }));
    }
    // Calendar fields: only filled in when empty, so later Studio edits stay.
    if (!doc.calendarCode && spot.calendarCode) set.calendarCode = spot.calendarCode;
    if (!doc.calendarLabel && spot.calendarLabel) set.calendarLabel = spot.calendarLabel;
    if (!doc.calendarColor) set.calendarColor = spot.calendarColor;
    await apply(doc._id, set);
  }
}

/* Stockists ----------------------------------------------------------------- */
{
  type Shop = { _key: string; name: string; address?: string; town?: string; url?: string };
  type Venue = { _key: string; _type?: string; name: string; url?: string };
  type Group = { _key: string; group: string; places?: string[]; venues?: Venue[] };
  const doc = await client.fetch<{ scoopShops?: Shop[]; onTheMenu?: Group[] } | null>(
    `*[_id == "stockists"][0]{scoopShops, onTheMenu}`,
  );

  if (!doc) {
    console.log("stockists: no document, the site uses the defaults");
  } else {
    const set: Record<string, unknown> = {};

    const shops = doc.scoopShops ?? [];
    const withUrls = shops.map((s) => {
      const url = scoopShops.find((d) => norm(d.name) === norm(s.name))?.url;
      return !s.url && url ? { ...s, url } : s;
    });
    if (!same(withUrls, shops)) set.scoopShops = withUrls;

    const urlFor = (name: string) =>
      onTheMenu.flatMap((g) => g.places).find((p) => norm(p.name) === norm(name))?.url;
    const groups = doc.onTheMenu ?? [];
    let menuChanged = false;
    const newGroups = groups.map((g) => {
      const venues: Venue[] = [...(g.venues ?? [])];
      // Move the old plain names across (once each; the design's lists have no repeats).
      for (const name of g.places ?? []) {
        if (!venues.some((v) => norm(v.name) === norm(name))) {
          venues.push({ _key: key(), _type: "venue", name });
        }
      }
      const linked = venues.map((v) => {
        const url = urlFor(v.name);
        return !v.url && url ? { ...v, url } : v;
      });
      const { places, ...rest } = g;
      if (places || !same(linked, g.venues ?? [])) menuChanged = true;
      return { ...rest, venues: linked };
    });
    // Setting the whole array also drops the old `places` lists.
    if (menuChanged) set.onTheMenu = newGroups;

    const linkedCount = newGroups.flatMap((g) => g.venues).filter((v) => v.url).length;
    const unlinked = newGroups
      .flatMap((g) => g.venues)
      .filter((v) => !v.url)
      .map((v) => v.name);
    console.log(
      `stockists: ${linkedCount} menu places linked; no website for: ${unlinked.join(", ") || "none"}`,
    );
    await apply("stockists", set);
  }
}
