import type { Metadata } from "next";
import Image from "next/image";
import { EventBookingForm } from "@/components/forms/EventBookingForm";
import { Bear, CheckList, Container, PageHeading, SectionHeading } from "@/components/ui";
import { getEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Weddings & events",
  description:
    "Bring the Lucia Gelato trailer to your wedding, party or corporate event. Packages from $500, serving Whistler, Squamish, Pemberton and Vancouver.",
};

const accent = {
  lakeside: { card: "bg-alpine", title: "text-lake-deep", price: "text-lake-deep" },
  strawberry: { card: "bg-blush", title: "text-berry", price: "text-berry" },
  heatwave: { card: "bg-peach", title: "text-[#a2490b]", price: "text-[#a2490b]" },
} as const;

const accentBear = { lakeside: "bike", strawberry: "snowboard-pink", heatwave: "hiker" } as const;

export default async function EventsPage() {
  const events = await getEvents();
  const { packages: eventPackages, terms: eventTerms, faq: eventFaq } = events;
  return (
    <>
      <section className="pt-16 pb-12 sm:pt-24">
        <Container>
          <PageHeading
            eyebrow="Weddings & events"
            title="Bring the gelato to the party"
            tone="strawberry"
            intro="From mountaintop weddings to company barbecues, we bring a unique, refreshing gelato experience to your event — trailer, smiles and all."
          >
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="#book" className="btn btn-berry">
                Request a booking
              </a>
              <a href="#packages" className="btn btn-sky">
                See packages
              </a>
            </div>
          </PageHeading>
        </Container>
      </section>

      <section id="packages" className="scroll-mt-24 py-12">
        <Container>
          <SectionHeading eyebrow="Packages & pricing" title="Pick your package" />
          <ul className="mt-12 grid gap-6 lg:grid-cols-3">
            {eventPackages.map((pkg) => {
              const a = accent[pkg.accent];
              return (
                <li
                  key={pkg.id}
                  className={`relative flex flex-col overflow-hidden rounded-[3rem] p-8 ${a.card}`}
                >
                  <h3 className={`display text-4xl ${a.title}`}>{pkg.name}</h3>
                  <p className="mt-5 font-ui">
                    <span className="text-sm text-ink/70">Starting at</span>
                    <span className={`block text-4xl font-extrabold ${a.price}`}>${pkg.basePrice}</span>
                    <span className="text-ink/80">
                      for {pkg.baseGuests} guests · ${pkg.perGuest} per additional guest
                    </span>
                  </p>
                  <CheckList items={pkg.features} className="mt-6 flex-1 text-ink/90" />
                  <div className="mt-6 flex items-end justify-between">
                    <a href="#book" className="btn btn-primary">
                      Book {pkg.name.replace("The ", "")}
                    </a>
                    <Bear name={accentBear[pkg.accent]} className="w-24" />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 rounded-blob bg-white p-6 ring-1 ring-alpine sm:p-8">
            <p className="subhead text-xl text-lakeside">Good to know</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {eventTerms.map((t) => (
                <li key={t} className="rounded-full bg-mist px-4 py-2 font-ui text-sm font-semibold text-ink">
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-ink/80">
              Looking for something different? We can mix and match to find the perfect fit for you and your
              event.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["/photos/kids-cones.webp", "Kids enjoying gelato cones outdoors", 1600, 900],
              ["/photos/skiers-cones.webp", "Friends sharing gelato", 1200, 1833],
              ["/photos/gelato-tray.webp", "Gelato in the display case", 1407, 716],
            ].map(([src, alt, w, h], i) => (
              <li key={src as string} className={i === 0 ? "col-span-2" : ""}>
                <Image
                  src={src as string}
                  alt={alt as string}
                  width={w as number}
                  height={h as number}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[4/3] h-full w-full rounded-[2.5rem] object-cover"
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="faq" className="scroll-mt-24 py-12">
        <Container className="max-w-4xl">
          <SectionHeading eyebrow="FAQ" title="Questions? We've got scoops." />
          <div className="mt-10 space-y-3">
            {eventFaq.map((item) => (
              <details
                key={item.q}
                className="group rounded-3xl bg-white p-6 ring-1 ring-alpine open:bg-mist open:ring-bluebird"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-ui text-lg font-extrabold text-ink">
                  {item.q}
                  <span
                    aria-hidden
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mist text-lake-deep transition group-open:rotate-45 group-open:bg-white"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink/85">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section id="book" className="scroll-mt-24 py-12">
        <Container className="max-w-4xl">
          <div className="rounded-[3.5rem] bg-blush/60 p-6 sm:p-12">
            <SectionHeading
              eyebrow="Booking request"
              title="Let's plan your event"
              tone="strawberry"
              intro="Tell us a little about your day and we'll get back to you with availability and a quote."
            />
            <div className="mt-10">
              <EventBookingForm packages={eventPackages} travelFees={events.travelFees} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
