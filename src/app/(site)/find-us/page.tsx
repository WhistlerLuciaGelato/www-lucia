import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BackToTop } from "@/components/BackToTop";
import { LocationStatus } from "@/components/LocationStatus";
import { Wave } from "@/components/Wave";
import { SeasonalSpots } from "@/components/find-us/SeasonalSpots";
import { getLocations, getSiteSettings, getStockists } from "@/lib/content";
import type { Location } from "@/lib/content-types";

export const metadata: Metadata = {
  title: "Find us",
  description:
    "Where to find Whistler Lucia Gelato: seasonal scoop shops, the gelato trailer, grocery stores and partners across Whistler, Squamish and Pemberton.",
};

/** Section colours, for the wave edges (they need literal colours). */
const PETAL = "#ffeee9";
const SNOW = "#fffef4";
const PEACH = "#ffe1c2";

const shortcuts = [
  {
    href: "#map",
    label: "Summer scoop shops",
    circle: "circle-alpine",
    icon: "icon-cone",
    w: 27,
    h: 64,
    iconClass: "h-[3.556rem]",
    text: "text-lakeside",
  },
  {
    href: "#grocery",
    label: "Take-home pints",
    circle: "circle-blush",
    icon: "icon-basket-pink",
    w: 70,
    h: 72,
    iconClass: "h-[4.05rem]",
    text: "text-strawberry",
  },
  {
    href: "#scoops",
    label: "Other vendors",
    circle: "circle-peach",
    icon: "icon-cutlery",
    w: 51,
    h: 65,
    iconClass: "h-[2.98rem]",
    text: "text-heatwave",
  },
];

/** Codes for the schedule legend, by location id (colours from the design). */
const legend: { id: string; code: string; label: string; color: string }[] = [
  { id: "roundhouse", code: "RO", label: "Roundhouse", color: "text-heatwave" },
  { id: "blackcomb-kids", code: "B", label: "Blackcomb Base", color: "text-lakeside" },
  { id: "lost-lake", code: "L", label: "Lost Lake", color: "text-grass" },
  { id: "rainbow-park", code: "RB", label: "Rainbow", color: "text-alpenglow" },
  { id: "olympic-plaza", code: "O", label: "Olympic Plaza", color: "text-sunflower" },
];

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <p
      className={`eyebrow inline-block rounded-[0.9375rem] px-[0.9375rem] py-[0.47rem] !text-[0.9375rem] text-snow ${className}`}
    >
      {children}
    </p>
  );
}

/** "Daily, 12 – 7pm"; spots with no hours yet show "Hours TBC". */
function Hours({ spot }: { spot: Location }) {
  if (!spot.hours.length) return <span className="text-lakeside/60">Hours TBC</span>;
  return (
    <ul className="space-y-1">
      {spot.hours.map((h) => (
        <li key={`${h.days}${h.time}`}>{[h.days, h.time].filter(Boolean).join(", ")}</li>
      ))}
    </ul>
  );
}

export default async function FindUsPage() {
  const [spots, { groceryStores, scoopShops, onTheMenu }, { contact }] = await Promise.all([
    getLocations(),
    getStockists(),
    getSiteSettings(),
  ]);
  const codes = legend.filter((l) => spots.some((s) => s.id === l.id));

  return (
    <>
      {/* Hero: intro card with section shortcuts, overlapping the trailer photo. */}
      <section className="relative z-10 px-4 pt-6 sm:px-8 lg:px-[6.25rem] lg:pt-0">
        <div className="relative mx-auto max-w-[77.5rem]">
          <div className="relative z-10 flex flex-col lg:absolute lg:top-[3.125rem] lg:left-[0.4375rem] lg:w-[37.5rem]">
            <div className="flex w-full flex-col items-center gap-6 rounded-t-[1.25rem] border border-bluebird bg-snow px-6 pt-10 pb-12 text-center sm:px-10 sm:pt-[2.4375rem]">
              <h1 className="display text-6xl leading-[0.85] text-bluebird sm:text-[5rem]">Find Lucia</h1>
              <p className="text-base tracking-[0.02em] text-lakeside">
                Handcrafted with care in Whistler, our gelato and sorbetto can be found at our seasonal
                stands, mobile trailer, and a variety of local partners throughout Whistler, Squamish, and
                Pemberton.
              </p>
              <a
                href="#schedule"
                className="btn gap-2.5 bg-seafoam text-bluebird shadow-[0_4px_4px_rgb(0_0_0/0.1)]"
              >
                <Image src="/find-us/clock.svg" alt="" width={26} height={26} className="size-6" />
                Schedule &amp; hours
              </a>
            </div>
            <nav
              aria-label="On this page"
              className="-mt-px flex items-start justify-center gap-9 rounded-b-[1.25rem] border border-bluebird bg-seafoam px-4 pt-6 pb-7"
            >
              {shortcuts.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="group flex w-[5.4rem] flex-col items-center gap-[0.5625rem] text-center"
                >
                  <span className="relative grid size-[4.77rem] place-items-center">
                    <Image
                      src={`/find-us/${s.circle}.svg`}
                      alt=""
                      fill
                      className="object-contain transition group-hover:-translate-y-0.5"
                    />
                    <Image
                      src={`/find-us/${s.icon}.svg`}
                      alt=""
                      width={s.w}
                      height={s.h}
                      className={`relative -mt-1 w-auto ${s.iconClass}`}
                    />
                  </span>
                  <span
                    className={`font-heading text-[0.9rem] leading-none font-bold tracking-[0.02em] ${s.text}`}
                  >
                    {s.label}
                  </span>
                </a>
              ))}
            </nav>
          </div>
          <div className="relative mt-8 aspect-[750/675] overflow-hidden rounded-[1.25rem] border-2 border-bluebird lg:mt-0 lg:ml-auto lg:w-[46.875rem]">
            <Image
              src="/find-us/hero-trailer.webp"
              alt="A Lucia scooper handing a cup of gelato across the counter of the gelato trailer"
              fill
              priority
              sizes="(min-width: 1024px) 750px, 100vw"
              className="object-cover object-[50%_35%]"
            />
          </div>
        </div>
      </section>

      {/* Seasonal scoop shops: pink map and location cards. */}
      <section
        id="map"
        className="relative scroll-mt-24 bg-petal px-4 pt-14 pb-20 sm:px-8 lg:-mt-[6.5rem] lg:px-[6.25rem] lg:pt-[8.5rem] lg:pb-28"
      >
        <Wave color={PETAL} className="absolute inset-x-0 -top-3.5" />
        <div className="mx-auto max-w-[77.5rem]">
          <Pill className="bg-alpenglow">Summer only!</Pill>
          <h2 className="subhead mt-[0.9375rem] text-[2.5rem] leading-[0.85] text-strawberry">
            Seasonal
            <br />
            scoop shops
          </h2>
          <div className="mt-10 lg:mt-[4.5rem]">
            <SeasonalSpots spots={spots} instagramUrl={contact.instagramUrl} />
          </div>
        </div>
      </section>

      {/* Schedule & hours */}
      <section id="schedule" className="relative scroll-mt-24 bg-snow px-4 py-20 sm:px-8 lg:px-[6.25rem]">
        <Wave color={SNOW} className="absolute inset-x-0 -top-3.5" />
        <div className="mx-auto max-w-[76.5rem]">
          <div className="flex flex-col items-center gap-[0.9375rem] text-center">
            <Pill className="bg-alpenglow">Summer only!</Pill>
            <h2 className="subhead text-6xl leading-[0.85] text-lakeside sm:text-[5rem]">
              Schedule &amp; Hours
            </h2>
          </div>
          <div className="mt-14 grid gap-12 lg:grid-cols-[31.9375rem_minmax(0,1fr)] lg:gap-[2.1875rem]">
            <div>
              <p className="text-xl text-heatwave italic">
                Check{" "}
                <a href={contact.instagramUrl} className="font-bold underline-offset-2 hover:underline">
                  Instagram
                </a>{" "}
                to confirm we&rsquo;re open before heading out!
              </p>
              <a
                href={contact.instagramUrl}
                className="mt-4 grid h-[22.9375rem] place-items-center rounded-[1.25rem] border-2 border-heatwave bg-white p-8 text-center font-ui font-bold text-heatwave transition-colors hover:bg-cream"
              >
                <span>
                  This week&rsquo;s schedule is posted on Instagram
                  <span className="mt-1 block text-lg">{contact.instagramHandle}</span>
                </span>
              </a>
              {codes.length ? (
                <ul className="mt-5 eyebrow !text-xl leading-normal">
                  {codes.map((l) => (
                    <li key={l.id} className={l.color}>
                      {l.code} = {l.label}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div>
              <p className="text-xl text-lakeside italic">
                Our outdoor spots open with the seasons and the weather. Here&rsquo;s when to find us.
              </p>
              <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-bluebird bg-snow">
                <table className="w-full text-left font-ui text-base text-lakeside">
                  <caption className="sr-only">Seasonal opening hours</caption>
                  <thead className="bg-bluebird text-snow">
                    <tr>
                      <th scope="col" className="eyebrow py-3.5 pl-[1.5625rem] !text-[1.0625rem] sm:w-[19.5rem]">
                        Location
                      </th>
                      <th scope="col" className="eyebrow hidden py-3.5 !text-[1.0625rem] sm:table-cell sm:w-[10.5rem]">
                        Season
                      </th>
                      <th scope="col" className="eyebrow py-3.5 pr-[1.5625rem] !text-[1.0625rem]">
                        Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-alpine border-t border-alpine">
                    {spots.map((spot) => (
                      <tr key={spot.id} className="align-top">
                        <th scope="row" className="py-[1.125rem] pr-5 pl-[1.5625rem] font-bold">
                          {spot.scheduleName || spot.name}
                          <span className="mt-1 block text-sm font-medium sm:hidden">
                            {spot.scheduleSeason || spot.season}
                          </span>
                        </th>
                        <td className="hidden py-[1.125rem] pr-5 font-medium sm:table-cell">
                          {spot.scheduleSeason || spot.season}
                        </td>
                        <td className="py-[1.125rem] pr-[1.5625rem] font-medium">
                          <Hours spot={spot} />
                          <LocationStatus
                            closedOn={spot.closedOn}
                            closureNote={spot.closureNote}
                            seasonClosed={spot.seasonClosed}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-[1.875rem] flex max-w-[31.9375rem] flex-col gap-3 rounded-[1.25rem] bg-butter p-5 pb-7">
                <p className="font-ui text-lg font-extrabold text-ink">Mountain weather disclaimer</p>
                <p className="font-ui text-sm leading-[1.3] font-medium text-ink/85">
                  Our outdoor spots are weather-dependent. On stormy, smoky or very cold days we may close
                  early or stay in the kitchen. Check Instagram{" "}
                  <a href={contact.instagramUrl} className="font-bold underline-offset-2 hover:underline">
                    {contact.instagramHandle}
                  </a>{" "}
                  for same-day updates before you make the trip.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Take-home pints: grocery stores */}
      <section id="grocery" className="relative scroll-mt-24 bg-peach px-4 py-20 sm:px-8 lg:px-[6.25rem]">
        <Wave color={PEACH} className="absolute inset-x-0 -top-3.5" />
        <div className="mx-auto grid max-w-[76.5rem] gap-10 lg:grid-cols-[31.75rem_37.1875rem] lg:justify-between">
          <div>
            <Pill className="bg-heatwave">Year-round</Pill>
            <h2 className="subhead mt-[0.9375rem] text-5xl leading-[0.85] text-heatwave sm:text-[3.75rem]">
              Take home a pint!
            </h2>
            <p className="mt-6 text-xl text-heatwave">
              Craving Lucia Gelato from the comfort of your own home? Find our take-home tubs at local
              grocery stores and retailers throughout Whistler, Squamish and Pemberton. Stock up on your
              favourite flavours or discover something new!
            </p>
            <p className="mt-1.5 text-xl font-bold text-heatwave italic">
              Flavours and availability vary by location.
            </p>
          </div>
          <div className="grid gap-x-[0.625rem] gap-y-[0.8125rem] sm:grid-cols-2 sm:items-start">
            {groceryStores.map((group, i) => (
              <div
                key={group.town}
                className={`flex flex-col gap-3.5 rounded-[1.25rem] border-2 border-heatwave bg-snow p-[1.5625rem] text-heatwave ${
                  i === 0 && groceryStores.length > 2 ? "sm:row-span-2 sm:self-stretch" : ""
                }`}
              >
                <h3 className="subhead text-[1.875rem]">{group.town}</h3>
                <ul className="font-ui leading-[1.5] font-medium">
                  {group.stores.map((store) => (
                    <li key={store}>{store}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoop partners and menus */}
      <section id="scoops" className="relative scroll-mt-24 bg-snow px-4 pt-20 sm:px-8 lg:px-16">
        <Wave color={SNOW} className="absolute inset-x-0 -top-3.5" />
        <div className="mx-auto max-w-[81.875rem]">
          <div className="mx-auto flex max-w-[41.875rem] flex-col items-center gap-[0.9375rem] text-center text-grass">
            <Pill className="bg-grass">Seasonal</Pill>
            <h2 className="subhead text-5xl leading-[0.85] sm:text-[3.75rem]">Scoop partners</h2>
            <p className="mt-2 text-xl">
              We&rsquo;re proud to partner with local businesses throughout the Sea to Sky corridor that serve
              Lucia Gelato by the scoop! Whether you&rsquo;re exploring Whistler, spending the day in
              Squamish, or visiting Pemberton, you can enjoy your favourite flavours at these local spots.
            </p>
            <p className="text-xl font-bold italic">
              Flavours and availability vary by location.
              <br />
              Check directly with our partners for current availability.
            </p>
          </div>

          <ul className="mx-auto mt-10 grid max-w-[58.75rem] gap-5 md:grid-cols-3 md:items-start">
            {scoopShops.map((shop) => (
              <li key={shop.name}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.address} ${shop.town} BC`)}`}
                  target="_blank"
                  rel="noreferrer"
                  title={`${shop.name}, ${shop.address} — open in Google Maps`}
                  className="flex flex-col items-start gap-3 rounded-[1.25rem] border-2 border-grass bg-pistachio p-[1.5625rem] text-grass transition-colors hover:bg-light-green/60"
                >
                  <span className="eyebrow rounded-[1.25rem] border-2 border-grass px-4 py-[0.4375rem] !text-[0.9375rem]">
                    {shop.town}
                  </span>
                  <span className="subhead text-[1.75rem]">{shop.name}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-[1.5625rem] overflow-hidden rounded-[1.25rem] border-2 border-grass bg-white pb-10">
            <div aria-hidden className="h-[3.9375rem] bg-grass" />
            <div className="px-6 sm:px-[2.625rem]">
              <h3 className="subhead mt-[1.875rem] text-center text-[2rem] leading-normal text-grass">
                Also on the menu at&hellip;
              </h3>
              <div className="mt-[1.875rem] flex flex-wrap justify-center gap-10">
                {onTheMenu.map((group, i) => (
                  <div key={group.group}>
                    <p className="eyebrow !text-[0.9375rem] text-grass">{group.group}</p>
                    <ul
                      className={`mt-2.5 font-ui text-[0.9375rem] leading-[1.6] font-medium text-black ${i === 0 ? "gap-6 sm:columns-2" : ""}`}
                    >
                      {group.places.map((place) => (
                        <li key={place}>{place}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-[1.875rem] text-center font-ui font-bold text-grass">
                Flavours, menu offerings, and availability vary by location.
                <br />
                Please check directly with each business to see how they&rsquo;re serving Lucia Gelato!
              </p>
              <div className="mt-[1.875rem] flex flex-wrap items-center justify-center gap-4">
                <p className="text-xl font-bold text-grass italic">Want Lucia on your menu?</p>
                <Link
                  href="/wholesale"
                  className="eyebrow rounded-[1.25rem] bg-grass px-5 py-2.5 !text-[0.9375rem] text-snow transition hover:brightness-95"
                >
                  Become a wholesale partner
                </Link>
              </div>
            </div>
          </div>
        </div>
        <BackToTop />
      </section>
    </>
  );
}
