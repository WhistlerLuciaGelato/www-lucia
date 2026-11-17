/**
 * Fills the Studio's page documents (Pages › …) with the website's current copy and photos, so
 * Lucia starts from what's on the site rather than empty fields. Safe to run more than once:
 * it only fills fields that are empty, so nothing edited in the Studio is overwritten.
 *
 * Before writing, it checks that every default in src/data/pages has a matching Studio field
 * (and the other way round), and stops if not.
 *
 *   npm run seed-page-text -- --dry-run
 *   SANITY_API_WRITE_TOKEN=... npm run seed-page-text
 */
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";
import { isImg, type Img } from "@/lib/page-text";
import { pages } from "./lib/page-registry.mts";

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

/* Schema check -------------------------------------------------------------- */

type Field = { name: string; type: string; fields?: Field[]; of?: { type: string; fields?: Field[] }[] };

function check(path: string, value: unknown, field: Field | undefined, problems: string[]) {
  if (!field) return problems.push(`${path}: no Studio field`);
  if (typeof value === "string") {
    if (field.type !== "string" && field.type !== "text")
      problems.push(`${path}: text, but the field is ${field.type}`);
  } else if (isImg(value)) {
    if (field.type !== "image") problems.push(`${path}: image, but the field is ${field.type}`);
  } else if (Array.isArray(value)) {
    if (field.type !== "array") return problems.push(`${path}: list, but the field is ${field.type}`);
    const member = field.of?.[0];
    for (const [i, item] of value.entries()) {
      if (typeof item === "string") {
        if (member?.type !== "string")
          problems.push(`${path}[${i}]: text, but the list holds ${member?.type}`);
      } else if (isImg(item)) {
        if (member?.type !== "image")
          problems.push(`${path}[${i}]: image, but the list holds ${member?.type}`);
      } else {
        checkObject(`${path}[${i}]`, item as Record<string, unknown>, member?.fields, problems);
      }
    }
  } else if (value && typeof value === "object") {
    if (field.type !== "object") return problems.push(`${path}: group, but the field is ${field.type}`);
    checkObject(path, value as Record<string, unknown>, field.fields, problems);
  }
}

function checkObject(
  path: string,
  value: Record<string, unknown>,
  fields: Field[] | undefined,
  problems: string[],
) {
  for (const [key, v] of Object.entries(value)) {
    check(
      path ? `${path}.${key}` : key,
      v,
      fields?.find((f) => f.name === key),
      problems,
    );
  }
  // Studio fields with no default would never reach the website.
  for (const f of fields ?? []) {
    if (!(f.name in value) && f.name !== "alt")
      problems.push(`${path ? `${path}.` : ""}${f.name}: Studio field with no default`);
  }
}

let failed = false;
for (const page of pages) {
  const problems: string[] = [];
  const fields = (page.schema.fields as Field[]).filter((f) => !page.otherFields?.includes(f.name));
  checkObject("", page.defaults as Record<string, unknown>, fields, problems);
  if (problems.length) {
    failed = true;
    console.error(`${page.id} doesn't match its Studio fields:\n  ${problems.join("\n  ")}`);
  }
}
if (failed) process.exit(1);
console.log(`Studio fields match the defaults for ${pages.length} documents.`);

/* Seed ------------------------------------------------------------------------ */

const uploads = new Map<string, unknown>();

async function upload(image: Img) {
  if (!uploads.has(image.src)) {
    let ref: unknown = `(upload public${image.src})`;
    if (!dryRun) {
      const file = await readFile(new URL(`../public${image.src}`, import.meta.url));
      const asset = await client.assets.upload("image", file, { filename: image.src.split("/").pop() });
      ref = { _type: "reference", _ref: asset._id };
    }
    uploads.set(image.src, ref);
  }
  return { _type: "image", asset: uploads.get(image.src), ...(image.alt ? { alt: image.alt } : {}) };
}

/** A default value as Studio data: images uploaded, list items keyed. */
async function toSanity(value: unknown): Promise<unknown> {
  if (isImg(value)) return upload(value);
  if (Array.isArray(value)) {
    return Promise.all(
      value.map(async (item) => {
        const v = await toSanity(item);
        return v && typeof v === "object" && !Array.isArray(v)
          ? { _key: randomUUID().slice(0, 12), ...v }
          : v;
      }),
    );
  }
  if (value && typeof value === "object") {
    const entries = await Promise.all(
      Object.entries(value).map(async ([k, v]) => [k, await toSanity(v)] as const),
    );
    return Object.fromEntries(entries);
  }
  return value;
}

const isEmpty = (v: unknown) =>
  v == null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && v.length === 0);

/**
 * Fields of `defaults` that `doc` leaves empty, as patch paths. Groups are filled field by field,
 * so text Lucia already changed in a group stays.
 */
function emptyPaths(
  defaults: Record<string, unknown>,
  doc: Record<string, unknown> | undefined,
  prefix = "",
) {
  const out: [string, unknown][] = [];
  for (const [key, def] of Object.entries(defaults)) {
    const current = doc?.[key];
    const path = prefix ? `${prefix}.${key}` : key;
    if (
      def &&
      typeof def === "object" &&
      !Array.isArray(def) &&
      !isImg(def) &&
      current &&
      typeof current === "object"
    ) {
      out.push(...emptyPaths(def as Record<string, unknown>, current as Record<string, unknown>, path));
    } else if (isImg(def) ? !(current as { asset?: unknown } | undefined)?.asset : isEmpty(current)) {
      out.push([path, def]);
    }
  }
  return out;
}

for (const page of pages) {
  // Fill the published document and any unpublished draft, so publishing a draft doesn't drop the copy.
  const docs = await client.fetch<Record<string, unknown>[]>(`*[_id in [$id, "drafts." + $id]]`, {
    id: page.id,
  });
  const targets = docs.length ? docs : [{ _id: page.id }];
  for (const doc of targets) {
    const id = doc._id as string;
    const todo = emptyPaths(page.defaults as Record<string, unknown>, doc);
    if (!todo.length) {
      console.log(`${id}: nothing to fill`);
      continue;
    }
    const set: Record<string, unknown> = {};
    for (const [path, value] of todo) set[path] = await toSanity(value);
    if (dryRun) {
      console.log(`${id} (dry run): would fill ${Object.keys(set).join(", ")}`);
      continue;
    }
    await client
      .transaction()
      .createIfNotExists({ _id: id, _type: page.schema.name })
      .patch(id, (p) => p.set(set))
      .commit();
    console.log(`${id}: filled ${Object.keys(set).length} fields`);
  }
}
