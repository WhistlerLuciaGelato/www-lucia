// Copies MapLibre's web worker next to the site's static files. The map loads it with
// setWorkerUrl(), because the bundler doesn't emit the worker that maplibre-gl expects
// to find beside its own module. Runs after `npm install`.
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync(new URL("../public/vendor/", import.meta.url), { recursive: true });
copyFileSync(
  new URL("../node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url),
  new URL("../public/vendor/maplibre-gl-worker.mjs", import.meta.url),
);
