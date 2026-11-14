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
        className="flex w-full flex-col items-start gap-3 text-left"
      >
        <span className="eyebrow rounded-[1.25rem] border-2 border-strawberry px-5 py-2 !text-base text-strawberry sm:!text-xl">
          {spot.season}
        </span>
        <span className="subhead text-[1.75rem] text-strawberry">{spot.name}</span>
        {spot.area ? (
          <span className="font-ui text-lg leading-none font-bold text-strawberry/80">{spot.area}</span>
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
            <p className="pt-3 font-ui text-sm leading-[1.3] font-medium text-strawberry">
              <RichText text={spot.description} />
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`}
              target="_blank"
              rel="noopener noreferrer"
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

/** Straight-line distance in km, good enough to pick the closest spot. */
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

const mapButton = "btn !text-base shadow-[0_4px_4px_rgb(0_0_0/0.1)] sm:!text-lg";

/**
 * The seasonal spots from the design: a pink map with a pin per spot, next to a list of
 * cards. Picking a card (or a pin) opens that card and flies the map to it. Under the map:
 * nearest-spot, show-all and schedule buttons, and a note to check Instagram.
 */
export function SeasonalSpots({ spots, instagramUrl }: { spots: Location[]; instagramUrl: string }) {
  const [activeId, setActiveId] = useState<string | undefined>(spots[0]?.id);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState("");

  function findNearest() {
    if (!("geolocation" in navigator)) {
      setGeoError("Your browser can’t share your location.");
      return;
    }
    setLocating(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        const here = { lat: coords.latitude, lng: coords.longitude };
        const open = spots.filter((s) => !s.seasonClosed);
        const nearest = (open.length ? open : spots).reduce((best, s) =>
          distanceKm(here, s) < distanceKm(here, best) ? s : best,
        );
        setActiveId(nearest.id);
      },
      () => {
        setLocating(false);
        setGeoError("We couldn’t get your location. Pick a spot from the list instead.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_31.4375rem] lg:gap-14">
      <div className="lg:sticky lg:top-36 lg:self-start">
        <PinkMap spots={spots} activeId={activeId} onSelect={setActiveId} />
        <div className="mt-[0.9375rem] flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={findNearest}
            disabled={locating}
            className={`${mapButton} bg-strawberry text-snow`}
          >
            {locating ? "Finding you…" : "Find scoop nearest me"}
          </button>
          <button
            type="button"
            onClick={() => setActiveId(undefined)}
            className={`${mapButton} bg-lakeside text-snow`}
          >
            See all on map
          </button>
          <a href="#schedule" className={`${mapButton} gap-2.5 bg-seafoam text-bluebird`}>
            <Image src="/find-us/clock.svg" alt="" width={26} height={26} className="size-6" />
            Schedule &amp; hours
          </a>
        </div>
        {geoError ? (
          <p role="status" className="mt-2 font-ui text-sm font-bold text-ink">
            {geoError}
          </p>
        ) : null}
        <div className="mt-10 flex flex-col items-center gap-2.5 rounded-[1.25rem] bg-white p-5 text-center lg:mt-[6.25rem]">
          <p className="eyebrow px-5 py-2 !text-xl text-heatwave">Take note!</p>
          <p className="max-w-[35.5rem] text-base leading-[1.18] text-heatwave">
            Please note that locations, hours, and operating dates vary throughout the season. We try our best
            to keep this page up to date, but please check our latest updates on{" "}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              Instagram
            </a>{" "}
            before heading out to find us!
          </p>
        </div>
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
