// Sanity project for the content editor. The id isn't secret (it's in every browser request);
// override with NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET if the project ever moves.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "kkqmc2m3";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2025-10-01";

/** Until a Sanity project is connected, the site serves the built-in content in src/data. */
export const isSanityConfigured = Boolean(projectId);
