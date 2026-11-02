"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
import type { Location } from "@/lib/content-types";
import { LocationStatus } from "@/components/LocationStatus";
import { PinkMap } from "@/components/find-us/PinkMap";

/** Description text: **double asterisks** and @handles are bold, line breaks are kept. */
function RichText({ text }: { text: string }) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {line.split(/(\*\*[^*]+\*\*|@\w+)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        ) : part.startsWith("@") ? (
          <strong key={j} className="font-bold">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </Fragment>
  ));
}

function SpotCard({ spot, active, onSelect }: { spot: Location; active: boolean; onSelect: () => void }) {
  const panelId = `spot-${spot.id}`;
  return (
    <li
      className={`relative rounded-[1.25rem] border-2 border-strawberry p-5 transition-colors ${
        active ? "bg-snow" : "hover:bg-snow/60"
      }`}
    >
      {active ? (
        <Image
          src="/find-us/pointer.svg"
          alt=""
          width={54}
          height={25}
          className="absolute top-1/2 -left-[3.3rem] hidden h-[1.5625rem] w-[3.375rem] -translate-y-1/2 -rotate-90 lg:block"
        />
      ) : null}
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={active}
        aria-controls={panelId}
        className="flex w-full flex-col items-start gap-2.5 text-left"
      >
        <span className="eyebrow rounded-[1.25rem] border-2 border-strawberry px-5 py-2 !text-base text-strawberry sm:!text-xl">
          {spot.season}
        </span>
        <span className="subhead text-[1.75rem] text-strawberry">{spot.name}</span>
        {spot.area ? (
          <span className="font-heading text-lg leading-none font-bold text-strawberry/80 sm:text-xl">
            {spot.area}
          </span>
        ) : null}
      </button>
      <LocationStatus
        closedOn={spot.closedOn}
        closureNote={spot.closureNote}
        seasonClosed={spot.seasonClosed}
      />
      <div
        id={panelId}
        inert={!active}
        className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${
          active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {spot.description ? (
            <p className="pt-2.5 font-ui text-[0.9375rem] leading-[1.3] font-medium text-strawberry">
              <RichText text={spot.description} />
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-berry !text-base shadow-[0_4px_4px_rgb(0_0_0/0.1)] sm:!text-lg"
            >
              Show in Google Maps
            </a>
            <a
              href="#schedule"
              className="btn btn-berry !text-base shadow-[0_4px_4px_rgb(0_0_0/0.1)] sm:!text-lg"
            >
              Schedule
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * The seasonal spots from the design: a pink map with a pin per spot, next to a list of
 * cards. Picking a card (or a pin) opens that card and flies the map to it.
 */
export function SeasonalSpots({ spots }: { spots: Location[] }) {
  const [activeId, setActiveId] = useState(spots[0]?.id);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_31.4375rem] lg:gap-14">
      <div className="lg:sticky lg:top-36 lg:self-start">
        <PinkMap spots={spots} activeId={activeId} onSelect={setActiveId} />
      </div>
      <ul className="space-y-5" aria-label="Seasonal scoop shops">
        {spots.map((spot) => (
          <SpotCard
            key={spot.id}
            spot={spot}
            active={spot.id === activeId}
            onSelect={() => setActiveId(spot.id)}
          />
        ))}
      </ul>
    </div>
  );
}
