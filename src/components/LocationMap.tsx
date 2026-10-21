"use client";

import { useState } from "react";
import type { SeasonalSpot } from "@/data/locations";

function embedUrl(spot: { lat: number; lng: number }) {
  const d = 0.012;
  const bbox = [spot.lng - d * 1.6, spot.lat - d, spot.lng + d * 1.6, spot.lat + d].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${spot.lat},${spot.lng}`;
}

export function LocationMap({ spots }: { spots: SeasonalSpot[] }) {
  const [activeId, setActiveId] = useState(spots[0]?.id);
  const active = spots.find((s) => s.id === activeId) ?? spots[0];

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <ul className="space-y-3 lg:col-span-2" aria-label="Seasonal locations">
        {spots.map((spot) => {
          const selected = spot.id === active.id;
          return (
            <li key={spot.id}>
              <button
                type="button"
                onClick={() => setActiveId(spot.id)}
                aria-pressed={selected}
                className={`w-full rounded-3xl p-5 text-left transition ${
                  selected
                    ? "bg-lake-deep text-snow shadow-soft"
                    : "bg-white ring-1 ring-alpine hover:bg-mist"
                }`}
              >
                <span
                  className={`eyebrow inline-block rounded-full px-2.5 py-1 ${
                    spot.season === "Winter"
                      ? selected
                        ? "bg-snow/15 text-alpine"
                        : "bg-alpine text-lake-deep"
                      : selected
                        ? "bg-snow/15 text-butter"
                        : "bg-butter text-[#7a5c00]"
                  }`}
                >
                  {spot.season}
                </span>
                <span className="subhead mt-2 block text-2xl">{spot.name}</span>
                <span
                  className={`mt-0.5 block font-ui text-sm font-bold ${selected ? "text-alpine" : "text-lake-deep"}`}
                >
                  {spot.area}
                </span>
                <span className={`mt-2 block text-[0.95rem] ${selected ? "text-snow/90" : "text-ink/75"}`}>
                  {spot.description}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="overflow-hidden rounded-blob bg-mist shadow-soft ring-1 ring-alpine lg:col-span-3">
        <iframe
          key={active.id}
          title={`Map showing ${active.name}`}
          src={embedUrl(active)}
          className="h-[420px] w-full lg:h-full lg:min-h-[520px]"
          loading="lazy"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-5 py-3 font-ui text-sm">
          <span className="font-bold text-ink">{active.name}</span>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${active.lat},${active.lng}`}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-lake-deep underline underline-offset-2"
          >
            Get directions ↗
          </a>
        </div>
      </div>
    </div>
  );
}
