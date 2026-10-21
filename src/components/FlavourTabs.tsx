"use client";

import { useState } from "react";
import type { FlavourGroup } from "@/data/wholesale";

export function FlavourTabs({ groups }: { groups: FlavourGroup[] }) {
  const [active, setActive] = useState(groups[0].id);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const visible = q
    ? groups.map((g) => ({ ...g, flavours: g.flavours.filter((f) => f.toLowerCase().includes(q)) }))
    : groups.filter((g) => g.id === active);
  const total = visible.reduce((n, g) => n + g.flavours.length, 0);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Flavour categories" className="flex flex-wrap gap-2">
          {groups.map((g) => {
            const selected = !q && g.id === active;
            return (
              <button
                key={g.id}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="flavour-panel"
                onClick={() => {
                  setActive(g.id);
                  setQuery("");
                }}
                className={`rounded-full px-4 py-2 font-ui text-sm font-bold transition ${
                  selected
                    ? "bg-lake-deep text-snow"
                    : "bg-white text-lake-deep ring-1 ring-alpine hover:bg-mist"
                }`}
              >
                {g.label} <span className="opacity-70">({g.flavours.length})</span>
              </button>
            );
          })}
        </div>
        <div className="relative lg:w-72">
          <label htmlFor="flavour-search" className="sr-only">
            Search flavours
          </label>
          <input
            id="flavour-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all flavours…"
            className="field !rounded-full pl-10"
          />
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-lake-deep"
            aria-hidden
          >
            <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M13 13l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div id="flavour-panel" role="tabpanel" className="mt-8 space-y-8" aria-live="polite">
        {total === 0 ? (
          <p className="rounded-3xl bg-white p-6 text-center font-ui text-ink/75">
            No flavours match &ldquo;{query}&rdquo; — but ask us, we&rsquo;re willing to try anything!
          </p>
        ) : (
          visible
            .filter((g) => g.flavours.length > 0)
            .map((g) => (
              <div key={g.id}>
                {q || g.note ? (
                  <p className="eyebrow mb-3 text-lake-deep">
                    {g.label}
                    {g.note ? (
                      <span className="ml-2 text-ink/60 normal-case tracking-normal">· {g.note}</span>
                    ) : null}
                  </p>
                ) : null}
                <ul className="columns-1 gap-6 font-ui sm:columns-2 lg:columns-3 xl:columns-4">
                  {g.flavours.map((f) => (
                    <li
                      key={f}
                      className="mb-2 break-inside-avoid rounded-2xl bg-white px-4 py-2.5 text-ink ring-1 ring-alpine/70"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
