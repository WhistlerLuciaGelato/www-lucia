/**
 * Lets Node scripts import the site's TypeScript modules as written: resolves the `@/` alias to
 * src/ and adds the `.ts`/`.tsx` extension that Next.js lets the source leave out.
 * Registered by src-imports.mjs.
 */
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const src = new URL("../../src/", import.meta.url);
const candidates = ["", ".ts", ".tsx", "/index.ts"];

export async function resolve(specifier, context, next) {
  let base = null;
  if (specifier.startsWith("@/")) base = new URL(specifier.slice(2), src);
  else if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    context.parentURL?.startsWith(pathToFileURL(fileURLToPath(src)).href)
  )
    base = new URL(specifier, context.parentURL);
  if (base) {
    for (const ext of candidates) {
      const url = new URL(base.href + ext);
      if (existsSync(url) && (ext !== "" || /\.[cm]?[jt]sx?$/.test(url.pathname))) {
        return next(url.href, context);
      }
    }
  }
  return next(specifier, context);
}
