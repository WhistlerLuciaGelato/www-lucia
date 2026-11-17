/**
 * Shared shapes for page copy and photos that Lucia edits in the Studio. Each page keeps its
 * current words and pictures as defaults in src/data/pages; anything left empty in the Studio
 * falls back to them (see getPageContent in src/lib/page-content.ts).
 *
 * Kept free of server-only imports so the seed script can read the defaults.
 */

/** A photo or illustration: a file in /public by default, or a Sanity CDN URL once replaced. */
export type Img = { src: string; alt: string; width: number; height: number };

/** A default image: a file in /public, its description for screen readers, and its pixel size. */
export const img = (src: string, alt: string, width: number, height: number): Img => ({
  src,
  alt,
  width,
  height,
});

export const isImg = (v: unknown): v is Img =>
  typeof v === "object" && v !== null && "src" in v && "width" in v && "height" in v && "alt" in v;
