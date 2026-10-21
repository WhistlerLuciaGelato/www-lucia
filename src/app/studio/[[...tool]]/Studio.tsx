"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export function Studio() {
  if (!isSanityConfigured) {
    return (
      <main
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: 560,
          margin: "15vh auto",
          padding: 24,
          lineHeight: 1.6,
        }}
      >
        <h1>The content editor isn&rsquo;t connected yet</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and optionally{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code>) to connect a Sanity project. Until then the website shows
          its built-in content. See the README for setup steps.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
