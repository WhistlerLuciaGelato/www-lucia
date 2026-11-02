/**
 * One-off: brings the Sanity seasonal locations in line with the website design (Figma "Find us").
 * Sets the name, subtitle, description, season and map pin of each spot, adds Rainbow Park,
 * clears the old (wrong) opening hours and puts the spots in the design's order. Closure
 * settings and anything else edited in the Studio are left alone.
 *
 *   SANITY_API_WRITE_TOKEN=... npm run apply-figma-locations
 *   npm run apply-figma-locations -- --dry-run
 */
import { createClient } from "@sanity/client";
import { seasonalSpots } from "../src/data/locations.ts";

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
    hours: [],
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
