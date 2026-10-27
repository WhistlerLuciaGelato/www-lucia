"use client";

import dynamic from "next/dynamic";

// The Studio only runs in the browser. Loading it client-side keeps Sanity's large editor
// bundle out of the server build, which must stay small enough for Cloudflare Workers.
const StudioApp = dynamic(() => import("./StudioApp").then((m) => m.StudioApp), {
  ssr: false,
  loading: () => <p style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>Loading the Studio…</p>,
});

export function Studio() {
  return <StudioApp />;
}
