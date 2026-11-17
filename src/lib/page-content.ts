import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { CONTENT_TAG } from "@/lib/content";
import { mergeContent } from "@/lib/page-merge";

/** The published document with this id, null if there is none, or undefined if Sanity failed. */
async function getPageDoc(id: string): Promise<Record<string, unknown> | null | undefined> {
  "use cache";
  cacheTag(CONTENT_TAG);

  if (!isSanityConfigured) {
    cacheLife("hours");
    return null;
  }
  try {
    const doc = await client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]`, { id });
    cacheLife("hours");
    return doc;
  } catch (err) {
    // Never take the site down because the CMS is unreachable: serve the defaults, retry soon.
    console.error(`Sanity fetch failed for ${id}`, err);
    cacheLife("minutes");
    return undefined;
  }
}

/**
 * A page's copy and photos: the published Studio document `id` laid over `defaults`.
 * Several page documents also hold other settings (prices, lists); only the defaults' fields are read.
 */
export async function getPageContent<T>(id: string, defaults: T): Promise<T> {
  return mergeContent(defaults, await getPageDoc(id));
}
