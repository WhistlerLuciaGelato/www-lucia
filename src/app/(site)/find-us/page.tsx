import type { Metadata } from "next";
import Link from "next/link";
import { LocationMap } from "@/components/LocationMap";
import { LocationStatus } from "@/components/LocationStatus";
import { Bear, Container, PageHeading, SectionHeading } from "@/components/ui";
import { getLocations, getSiteSettings, getStockists } from "@/lib/content";

export const metadata: Metadata = {
  title: "Find us",
  description:
    "Where to find Whistler Lucia Gelato: seasonal trailer locations, hours, grocery stores and scoop shops across Whistler, Squamish and Pemberton.",
};

export default async function FindUsPage() {
  const [seasonalSpots, { groceryStores, scoopShops, onTheMenu }, { contact }] = await Promise.all([
    getLocations(),
    getStockists(),
    getSiteSettings(),
  ]);
  return (
    <>
      <section className="pt-16 pb-12 sm:pt-24">
        <Container>
          <PageHeading
            eyebrow="Find us"
            title="Where's Lucia?"
            intro="Scoop us on the mountain, at the lake, or grab a pint from your local grocer — across Whistler, Squamish and Pemberton."
          >
            <nav aria-label="On this page" className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                ["#map", "Seasonal map"],
                ["#schedule", "Schedule & hours"],
                ["#grocery", "Grocery stores"],
                ["#scoops", "Scoop locations"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-full bg-mist px-4 py-2 font-ui text-sm font-bold text-lake-deep hover:bg-alpine"
                >
                  {label}
                </a>
              ))}
            </nav>
          </PageHeading>
        </Container>
      </section>

      <section id="map" className="scroll-mt-24 py-8">
        <Container>
          <SectionHeading eyebrow="Seasonal locations" title="Our spots" align="left" />
          <div className="mt-8">
            <LocationMap spots={seasonalSpots} />
          </div>
        </Container>
      </section>

      <section id="schedule" className="scroll-mt-24 py-16">
        <Container>
          <div className="grid gap-8 rounded-[3.5rem] bg-mist p-6 sm:p-10 lg:grid-cols-3 lg:p-14">
            <div>
              <SectionHeading eyebrow="Schedule" title="Hours" align="left" />
              <div className="relative mt-6 rounded-3xl bg-butter p-5">
                <p className="font-ui font-extrabold text-ink">Mountain weather disclaimer</p>
                <p className="mt-1.5 leading-relaxed text-ink/85">
                  Our outdoor spots are weather-dependent. On stormy, smoky or very cold days we may close
                  early or stay in the kitchen. Check{" "}
                  <a
                    href={contact.instagramUrl}
                    className="font-bold text-lake-deep underline underline-offset-2"
                  >
                    Instagram
                  </a>{" "}
                  for same-day updates before you make the trip.
                </p>
              </div>
              <Bear name="ski-touring" className="mt-8 hidden w-44 lg:block" />
            </div>
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-alpine">
                <table className="w-full text-left font-ui">
                  <caption className="sr-only">Seasonal opening hours</caption>
                  <thead className="bg-lake-deep text-snow">
                    <tr>
                      <th scope="col" className="px-5 py-3.5 text-sm font-bold">
                        Location
                      </th>
                      <th scope="col" className="hidden px-5 py-3.5 text-sm font-bold sm:table-cell">
                        Season
                      </th>
                      <th scope="col" className="px-5 py-3.5 text-sm font-bold">
                        Open
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-alpine">
                    {seasonalSpots.map((row) => (
                      <tr key={row.id} className="align-top">
                        <th scope="row" className="px-5 py-4 font-bold text-ink">
                          {row.name}
                          <span className="mt-1 block text-sm font-normal text-ink/70 sm:hidden">
                            {row.scheduleSeason}
                          </span>
                        </th>
                        <td className="hidden px-5 py-4 text-ink/80 sm:table-cell">{row.scheduleSeason}</td>
                        <td className="px-5 py-4 text-ink/80">
                          <ul className="space-y-1">
                            {row.hours.map((h) => (
                              <li key={`${h.days}${h.time}`}>
                                <span className="font-semibold text-ink">{h.days}</span>
                                {h.days && h.time ? " · " : null}
                                {h.time}
                              </li>
                            ))}
                          </ul>
                          <LocationStatus
                            closedOn={row.closedOn}
                            closureNote={row.closureNote}
                            seasonClosed={row.seasonClosed}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 font-ui text-sm text-ink/70">
                Want Lucia at your event instead?{" "}
                <Link href="/events" className="font-bold text-lake-deep underline underline-offset-2">
                  Book the trailer
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="grocery" className="scroll-mt-24 py-12">
        <Container>
          <SectionHeading
            eyebrow="Take-home pints"
            title="Grocery stores"
            intro="Look for our 473 mL pints in the freezer aisle. Stock changes with the seasons — call ahead if you're after a specific flavour."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {groceryStores.map((group, i) => (
              <div
                key={group.town}
                className={`rounded-blob p-7 ${["bg-alpine", "bg-blush", "bg-peach", "bg-light-green"][i % 4]}`}
              >
                <h3 className="subhead text-2xl text-ink">{group.town}</h3>
                <ul className="mt-4 space-y-2 font-ui text-ink/85">
                  {group.stores.map((store) => (
                    <li key={store} className="flex gap-2">
                      <span aria-hidden className="text-lake-deep">
                        •
                      </span>
                      {store}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="scoops" className="scroll-mt-24 py-12">
        <Container>
          <SectionHeading eyebrow="Scoop locations" title="Get a cone" tone="strawberry" />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {scoopShops.map((shop) => (
              <li key={shop.name} className="rounded-blob bg-white p-7 shadow-soft ring-1 ring-alpine/60">
                <p className="eyebrow text-berry">{shop.town}</p>
                <h3 className="subhead mt-2 text-2xl text-ink">{shop.name}</h3>
                <p className="mt-1 font-ui text-ink/75">{shop.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.address} ${shop.town} BC`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block font-ui font-bold text-lake-deep underline underline-offset-2"
                >
                  Map ↗
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-16 rounded-[3.5rem] bg-mist p-8 sm:p-12">
            <h3 className="subhead text-center text-3xl text-lakeside">Also on the menu at</h3>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {onTheMenu.map((group, i) => (
                <div key={group.group} className={i === 0 ? "sm:col-span-2" : ""}>
                  <p className="eyebrow text-lake-deep">{group.group}</p>
                  <ul className={`mt-3 space-y-1 font-ui text-ink/85 ${i === 0 ? "columns-2 gap-6" : ""}`}>
                    {group.places.map((place) => (
                      <li key={place}>{place}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-10 text-center font-ui text-ink/80">
              Want Lucia on your menu?{" "}
              <Link href="/wholesale" className="font-bold text-lake-deep underline underline-offset-2">
                Become a wholesale partner
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
