import { urlFor } from "@/sanity/image";
import { isImg, type Img } from "@/lib/page-text";

type SanityImage = {
  asset?: { _ref?: string };
  alt?: string;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: unknown;
};

/** Pixel size of a Sanity image, read from its asset id ("image-<hash>-2400x1600-jpg"), after the Studio crop. */
function imageSize(image: SanityImage) {
  const [, w = "1600", h = "1200"] = /-(\d+)x(\d+)-/.exec(image.asset?._ref ?? "") ?? [];
  const c = image.crop;
  return {
    width: Math.round(Number(w) * (1 - (c ? c.left + c.right : 0))),
    height: Math.round(Number(h) * (1 - (c ? c.top + c.bottom : 0))),
  };
}

function toImg(fallback: Img, value: unknown): Img {
  const image = value as SanityImage | undefined;
  if (!image?.asset?._ref) return fallback;
  const size = imageSize(image);
  return {
    src: urlFor(image as never)
      .width(Math.min(size.width, 2560))
      .fit("max")
      .url(),
    // A replaced photo needs its own description; the old one would describe the wrong picture.
    alt: image.alt?.trim() ?? "",
    ...size,
  };
}

/**
 * The Studio's values laid over the defaults, field by field: an empty field, list or image
 * keeps the default. Only fields the defaults have are read, so the result always has their shape.
 */
export function mergeContent<T>(fallback: T, value: unknown): T {
  if (typeof fallback === "string") {
    return (typeof value === "string" && value.trim() ? value.trim() : fallback) as T;
  }
  if (typeof fallback === "number" || typeof fallback === "boolean") {
    return (typeof value === typeof fallback ? value : fallback) as T;
  }
  if (isImg(fallback)) return toImg(fallback, value) as T;
  if (Array.isArray(fallback)) {
    if (!Array.isArray(value) || value.length === 0) return fallback;
    const template = fallback[0];
    // Each item fills its gaps from the default at the same position (or the first one).
    const items = value.map((item, i) => mergeContent(fallback[i] ?? template, item));
    return (template === undefined ? value : items) as T;
  }
  if (fallback && typeof fallback === "object") {
    const doc = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(fallback).map(([key, def]) => [key, mergeContent(def, doc[key])]),
    ) as T;
  }
  return fallback;
}
