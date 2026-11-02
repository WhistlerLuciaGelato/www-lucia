/**
 * One-off: brings the Sanity "Find us" content in line with the website design (Figma "Find us").
 * For each seasonal spot it sets the name, subtitle, description, season, map pin, season dates
 * and hours, adds Rainbow Park and puts the spots in the design's order. Closure settings are
 * left alone. It also replaces the grocery stores, scoop partners and "Also on the menu at"
 * lists with the design's.
 *
 *   SANITY_API_WRITE_TOKEN=... npm run apply-figma-locations
 *   npm run apply-figma-locations -- --dry-run
 */
import { createClient } from "@sanity/client";
import { groceryStores, onTheMenu, scoopShops, seasonalSpots } from "../src/data/locations.ts";

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

for (const [i, spot] of seasonalSpots.entries()) {
  const id = `location-${spot.id}`;
  const fields = {
    name: spot.name,
    area: spot.area,
    season: spot.season,
    description: spot.description,
    lat: spot.lat,
    lng: spot.lng,
    scheduleSeason: spot.scheduleSeason,
    scheduleName: spot.scheduleName ?? "",
    hours: spot.hours.map((h, j) => ({ _key: `hours${j}`, ...h })),
    active: true,
    orderRank: (i + 1) * 10,
  };

  if (dryRun) {
    console.log(id, fields);
    continue;
  }
  await client
    .transaction()
    .createIfNotExists({ _id: id, _type: "location", ...fields, seasonClosed: false })
    .patch(id, (p) => p.set(fields))
    .commit();
  console.log(`Updated ${id}`);
}

const stockists = {
  groceryStores: groceryStores.map((g, i) => ({ _key: `town${i}`, ...g })),
  scoopShops: scoopShops.map((s, i) => ({ _key: `scoop${i}`, ...s })),
  onTheMenu: onTheMenu.map((g, i) => ({ _key: `menu${i}`, ...g })),
};
if (dryRun) {
  console.log("stockists", JSON.stringify(stockists, null, 2));
} else {
  await client
    .transaction()
    .createIfNotExists({ _id: "stockists", _type: "stockists" })
    .patch("stockists", (p) => p.set(stockists))
    .commit();
  console.log("Updated stockists");
}
