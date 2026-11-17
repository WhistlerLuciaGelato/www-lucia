/**
 * Lets Node scripts import the site's TypeScript modules as written: resolves the `@/` alias to
 * src/ and adds the `.ts`/`.tsx` extension that Next.js lets the source leave out.
 *
 *   node --import ./scripts/lib/src-imports.mjs scripts/some-script.mts
 */
import { register } from "node:module";

register("./src-imports-hooks.mjs", import.meta.url);
