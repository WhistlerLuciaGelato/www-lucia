import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BackToTop } from "@/components/BackToTop";
import { LocationStatus } from "@/components/LocationStatus";
import { OurStory } from "@/components/OurStory";
import { Wave } from "@/components/Wave";
import { SeasonalSpots } from "@/components/find-us/SeasonalSpots";
import { getLocations, getSiteSettings, getStockists } from "@/lib/content";

export const metadata: Metadata = {
  title: "Find us",
  description:
    "Where to find Whistler Lucia Gelato: seasonal scoop shops, the gelato trailer, grocery stores and partners across Whistler, Squamish and Pemberton.",
};

/** Section colours, for the wave edges (they need literal colours). */
const PETAL = "#ffeee9";
const SEAFOAM = "#e3f4ef";
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
    text: "text-lakeside",
  },
  {
    href: "#grocery",
    label: "Take-home pints",
    circle: "circle-blush",
    icon: "icon-basket-pink",
    w: 70,
    h: 72,
    text: "text-strawberry",
  },
  {
    href: "#scoops",
    label: "Other vendors",
    circle: "circle-peach",
    icon: "icon-basket-orange",
    w: 70,
    h: 72,
    text: "text-heatwave",
  },
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

function SectionTitle({
  pill,
  pillClass,
  title,
  className,
}: {
  pill: string;
  pillClass: string;
  title: React.ReactNode;
  className: string;
}) {
  return (
    <div>
      <Pill className={pillClass}>{pill}</Pill>
      <h2 className={`subhead mt-[0.9375rem] text-[2.5rem] leading-[0.85] ${className}`}>{title}</h2>
    </div>
  );
}

export default async function FindUsPage() {
  const [spots, { groceryStores, scoopShops, onTheMenu }, { contact }] = await Promise.all([
    getLocations(),
    getStockists(),
    getSiteSettings(),
  ]);

  return (
    <>
      {/* Hero: intro card overlapping the trailer photo, with shortcuts to each section. */}
      <section className="relative z-10 px-4 pt-6 sm:px-8 lg:px-[6.25rem] lg:pt-0">
        <div className="relative mx-auto max-w-[77.5rem]">
          <div className="relative z-10 flex flex-col items-center lg:absolute lg:top-[2.6875rem] lg:left-[0.4375rem] lg:w-[37.5rem]">
            <div className="flex w-full flex-col items-center gap-6 rounded-[1.25rem] border border-bluebird bg-snow px-6 py-10 text-center sm:p-[3.125rem]">
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
            <nav aria-label="On this page" className="mt-9 flex items-start gap-5">
              {shortcuts.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="group flex w-24 flex-col items-center gap-2.5 text-center"
                >
                  <span className="relative grid h-[5.3rem] w-[5.55rem] place-items-center">
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
                      className="relative -mt-1 max-h-[4.5rem] w-auto"
                    />
                  </span>
                  <span
                    className={`font-heading text-base leading-none font-bold tracking-[0.02em] ${s.text}`}
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
          <SectionTitle
            pill="Summer only!"
            pillClass="bg-alpenglow"
            title={
              <>
                Seasonal
                <br />
                scoop shops
              </>
            }
            className="text-strawberry"
          />
          <div className="mt-10 lg:mt-[4.5rem]">
            <SeasonalSpots spots={spots} />
          </div>
        </div>
      </section>

      {/* Schedule & hours */}
      <section id="schedule" className="relative scroll-mt-24 bg-seafoam px-4 py-20 sm:px-8 lg:px-[6.25rem]">
        <Wave color={SEAFOAM} className="absolute inset-x-0 -top-3.5" />
        <div className="mx-auto max-w-[77.5rem]">
          <div className="grid gap-6 lg:grid-cols-[30rem_1fr] lg:items-end">
            <SectionTitle
              pill="Plan your visit"
              pillClass="bg-bluebird"
              title={
                <>
                  Schedule
                  <br />
                  &amp; hours
                </>
              }
              className="text-lakeside"
            />
            <p className="max-w-[35rem] text-base tracking-[0.02em] text-lakeside">
              Our outdoor spots open with the seasons and the weather. Here&rsquo;s when to find us.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_26.1875rem]">
            <div className="overflow-hidden rounded-[1.25rem] border border-bluebird bg-snow">
              <table className="w-full text-left font-ui text-lakeside">
                <caption className="sr-only">Seasonal opening hours</caption>
                <thead className="bg-bluebird text-snow">
                  <tr>
                    <th scope="col" className="eyebrow px-6 py-3.5 !text-sm">
                      Location
                    </th>
                    <th scope="col" className="eyebrow hidden px-6 py-3.5 !text-sm sm:table-cell">
                      Season
                    </th>
                    <th scope="col" className="eyebrow px-6 py-3.5 !text-sm">
                      Hours
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-alpine">
                  {spots.map((spot) => (
                    <tr key={spot.id} className="align-top">
                      <th scope="row" className="px-6 py-4 font-bold">
                        {spot.name}
                        <span className="mt-1 block text-sm font-medium sm:hidden">
                          {spot.scheduleSeason || spot.season}
                        </span>
                      </th>
                      <td className="hidden px-6 py-4 sm:table-cell">{spot.scheduleSeason || spot.season}</td>
                      <td className="px-6 py-4">
                        {spot.hours.length ? (
                          <ul className="space-y-1">
                            {spot.hours.map((h) => (
                              <li key={`${h.days}${h.time}`}>
                                <span className="font-semibold">{h.days}</span>
                                {h.days && h.time ? " · " : null}
                                {h.time}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <a
                            href={contact.instagramUrl}
                            className="text-lakeside/80 underline underline-offset-2 hover:text-lake-deep"
                          >
                            This week&rsquo;s hours on Instagram
                          </a>
                        )}
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
            <div className="flex flex-col items-start gap-3 self-start rounded-[1.25rem] bg-butter p-[1.875rem]">
              <p className="font-ui text-lg font-extrabold text-ink">Mountain weather disclaimer</p>
              <p className="font-ui leading-[1.3] text-ink/85">
                Our outdoor spots are weather-dependent. On stormy, smoky or very cold days we may close early
                or stay in the kitchen. Check Instagram{" "}
                <a
                  href={contact.instagramUrl}
                  className="font-bold text-lake-deep underline underline-offset-2"
                >
                  {contact.instagramHandle}
                </a>{" "}
                for same-day updates before you make the trip.
              </p>
              <Link href="/events" className="btn btn-sky mt-2">
                Book the trailer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Take-home pints: grocery stores */}
      <section id="grocery" className="relative scroll-mt-24 bg-snow px-4 py-20 sm:px-8 lg:px-[6.25rem]">
        <Wave color={SNOW} className="absolute inset-x-0 -top-3.5" />
        <div className="mx-auto max-w-[77.5rem]">
          <div className="grid gap-6 lg:grid-cols-[30rem_1fr] lg:items-end">
            <SectionTitle
              pill="Grocery stores"
              pillClass="bg-alpenglow"
              title={
                <>
                  Take-home
                  <br />
                  pints
                </>
              }
              className="text-strawberry"
            />
            <p className="max-w-[35rem] text-base tracking-[0.02em] text-strawberry">
              Look for our 473 mL pints in the freezer aisle. Stock changes with the seasons, so call ahead if
              you&rsquo;re after a specific flavour.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
            {groceryStores.map((group) => (
              <div
                key={group.town}
                className="rounded-[1.25rem] border-2 border-strawberry bg-snow p-[1.5625rem]"
              >
                <h3 className="subhead text-[1.875rem] text-strawberry">{group.town}</h3>
                <ul className="mt-3.5 font-ui leading-[1.5] text-strawberry">
                  {group.stores.map((store) => (
                    <li key={store}>{store}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link href="/order/pints" className="btn btn-berry mt-10">
            Order pints for pickup
          </Link>
        </div>
      </section>

      {/* Other vendors: scoop shops and menus */}
      <section id="scoops" className="relative scroll-mt-24 bg-peach px-4 py-20 sm:px-8 lg:px-[6.25rem]">
        <Wave color={PEACH} className="absolute inset-x-0 -top-3.5" />
        <div className="mx-auto max-w-[77.5rem]">
          <div className="grid gap-6 lg:grid-cols-[30rem_1fr] lg:items-end">
            <SectionTitle
              pill="Other vendors"
              pillClass="bg-heatwave"
              title={
                <>
                  Scoops around
                  <br />
                  the Sea to Sky
                </>
              }
              className="text-heatwave"
            />
            <p className="max-w-[35rem] text-base tracking-[0.02em] text-ink/80">
              Grab a cone at one of our scoop partners, or look for Lucia on the dessert menu at restaurants,
              cafés and hotels near you.
            </p>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-3 md:items-start">
            {scoopShops.map((shop) => (
              <li
                key={shop.name}
                className="flex flex-col items-start gap-3 rounded-[1.25rem] border-2 border-heatwave bg-snow p-[1.5625rem]"
              >
                <span className="eyebrow rounded-[1.25rem] border-2 border-heatwave px-4 py-1.5 !text-sm text-heatwave">
                  {shop.town}
                </span>
                <h3 className="subhead text-[1.875rem] text-heatwave">{shop.name}</h3>
                <p className="font-ui text-ink/80">{shop.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.address} ${shop.town} BC`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="eyebrow text-heatwave underline underline-offset-4 hover:text-ink"
                >
                  Map ↗
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-[1.25rem] border-2 border-heatwave bg-snow p-6 sm:p-10">
            <h3 className="subhead text-center text-[2rem] text-heatwave">Also on the menu at</h3>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
              {onTheMenu.map((group, i) => (
                <div key={group.group}>
                  <p className="eyebrow !text-sm text-heatwave">{group.group}</p>
                  <ul
                    className={`mt-2.5 font-ui text-[0.9375rem] leading-[1.6] text-ink/85 ${i === 0 ? "columns-2 gap-6" : ""}`}
                  >
                    {group.places.map((place) => (
                      <li key={place}>{place}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <p className="font-ui font-bold text-ink/85">Want Lucia on your menu?</p>
              <Link href="/wholesale" className="btn bg-heatwave text-snow">
                Become a wholesale partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative bg-snow pt-20 lg:pt-24">
        <Wave color={SNOW} className="absolute inset-x-0 -top-3.5" />
        <OurStory />
        <BackToTop />
      </div>
    </>
  );
}
