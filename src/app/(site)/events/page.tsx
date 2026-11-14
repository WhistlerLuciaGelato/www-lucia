import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BackToTop } from "@/components/BackToTop";
import { Blob } from "@/components/Blob";
import { ImageCarousel } from "@/components/ImageCarousel";
import { Wave } from "@/components/Wave";
import { RequestPackageLink } from "@/components/events/RequestPackageLink";
import { Rich, paragraphs } from "@/components/events/Rich";
import { EventBookingForm } from "@/components/forms/EventBookingForm";
import { travelFeeLabel } from "@/data/events";
import { getEvents } from "@/lib/content";
import type { EventPackage } from "@/lib/content-types";

export const metadata: Metadata = {
  title: "Weddings & events",
  description:
    "Bring the Lucia Gelato trailer or our wooden gelato display to your wedding, party or corporate event. Serving Whistler, Squamish, Pemberton and Vancouver.",
};

/** Section colours, for the wave edges (they need literal colours). */
const STRAWBERRY = "#ff8f8f";
const ROSE = "#ffe2df";

/** Card colours by package accent (Figma: Events › Product Block). */
const accent = {
  strawberry: {
    card: "bg-petal border-strawberry",
    text: "text-strawberry",
    button: "bg-strawberry",
    bear: { src: "/events/bear-classic.webp", width: 162, height: 200, className: "h-[4.125rem]" },
  },
  lakeside: {
    card: "bg-seafoam border-lakeside",
    text: "text-lakeside",
    button: "bg-lakeside",
    bear: { src: "/events/bear-signature.webp", width: 260, height: 200, className: "h-[4.125rem]" },
  },
  heatwave: {
    card: "bg-peach border-heatwave",
    text: "text-heatwave",
    button: "bg-heatwave",
    bear: { src: "/events/bear-experience.webp", width: 133, height: 200, className: "h-20" },
  },
} as const;

/** Header links land on #packages, #faq and #book; keep them clear of the sticky header. */
const anchor = "scroll-mt-24 lg:scroll-mt-40";

function PackageCard({ pkg }: { pkg: EventPackage }) {
  const a = accent[pkg.accent] ?? accent.lakeside;
  const short = pkg.name.replace(/^The\s+/i, "");
  return (
    <li
      className={`flex flex-col items-center gap-[1.5625rem] rounded-[2.1875rem] border px-6 py-10 text-center sm:px-[3.125rem] sm:py-[3.125rem] lg:px-10 ${a.card}`}
    >
      <Image
        src={a.bear.src}
        alt=""
        aria-hidden
        width={a.bear.width}
        height={a.bear.height}
        className={`w-auto select-none ${a.bear.className}`}
      />
      <h2 className={`display text-[2.5rem] leading-[0.9] ${a.text}`}>{pkg.name}</h2>
      <p className="flex flex-col items-center gap-[0.3125rem] font-ui">
        <span className={`text-xs font-bold ${a.text}`}>Starting at</span>
        <span className={`text-[1.625rem] leading-none font-black ${a.text}`}>
          ${pkg.basePrice.toLocaleString("en-CA")}
        </span>
        <span className="text-xs text-black/80">
          for {pkg.baseGuests} guests &bull; ${pkg.perGuest} per additional guest
        </span>
      </p>
      <ul className="mx-auto w-fit max-w-full space-y-1 text-left font-ui text-sm leading-[1.6] text-black/80 lg:text-[0.8125rem]">
        {pkg.features.map((f) => (
          <li key={f} className="flex gap-1.5">
            <span aria-hidden>✓</span>
            <span>
              <Rich text={f} />
            </span>
          </li>
        ))}
      </ul>
      {pkg.moreInfo ? (
        <div className="w-full border-t border-black pt-1 text-left font-ui text-[0.8125rem] leading-snug text-black">
          <p className="font-bold">More info</p>
          {paragraphs(pkg.moreInfo).map((p) => (
            <p key={p} className="mb-[0.5625rem] last:mb-0">
              <Rich text={p} />
            </p>
          ))}
        </div>
      ) : null}
      <RequestPackageLink packageId={pkg.id} className={`pill-link mt-auto !text-sm ${a.button}`}>
        Request {short}
      </RequestPackageLink>
    </li>
  );
}

/**
 * Weddings & events, from the website design (Figma "Lucia Website" › XX Working Zone › Events):
 * packages on a coral band, travel & booking info, a full-bleed photo gallery with a lightbox,
 * the FAQ and the booking request form.
 */
export default async function EventsPage() {
  const events = await getEvents();
  const { packages, faq, gallery } = events;
  const pills = [...new Set([...events.travelFees.map(travelFeeLabel), ...events.terms])];
  const half = Math.ceil(faq.length / 2);
  const faqColumns = [faq.slice(0, half), faq.slice(half)];

  return (
    <>
      {/* Packages & pricing: a coral band with the package cards overlapping its wavy bottom. */}
      <section id="packages" className={`relative isolate overflow-x-clip ${anchor}`}>
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[24rem] bg-strawberry sm:h-[26rem] lg:h-[37.5rem]">
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className="absolute top-full left-0 h-12 w-full lg:h-24"
          >
            <path
              d="M0 0H1440V30C1330 34 1220 8 1040 4S700 22 520 44 180 98 0 92Z"
              fill={STRAWBERRY}
            />
          </svg>
        </div>
        <Blob shape="puddle" color="#ffe1c2" className="-bottom-40 -left-32 w-[22rem] -rotate-12 lg:w-[30rem]" />

        <div className="px-4 pt-16 text-center sm:px-8 lg:pt-[5.8rem]">
          <p className="eyebrow !text-lg text-rose lg:!text-xl">Packages &amp; pricing</p>
          <h1 className="subhead mt-5 text-6xl leading-[0.85] text-snow [text-shadow:0_4px_4px_rgb(0_0_0/0.1)] sm:text-7xl lg:mt-7 lg:text-[5rem]">
            Bring gelato
            <br />
            to your party
          </h1>
        </div>

        <ul className="relative mx-auto mt-10 grid max-w-md items-start gap-8 px-4 sm:px-8 lg:mt-[3.4rem] lg:max-w-[81rem] lg:grid-cols-3 lg:gap-[2.8125rem]">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
          <Blob shape="pebble" color="#ffe1c2" className="-bottom-16 left-10 hidden w-10 rotate-45 lg:block" />
        </ul>

        {/* Travel & booking info */}
        <div className="mx-auto max-w-[56rem] px-4 pt-16 pb-12 text-center sm:px-8 lg:pt-[3.75rem]">
          <h2 className="subhead text-[2.5rem] leading-[0.95] text-lakeside">Travel &amp; Booking Info</h2>
          <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
            {pills.map((t) => (
              <li key={t} className="rounded-[1.25rem] bg-seafoam px-5 py-2.5 font-ui text-sm leading-tight text-black">
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-5 font-ui text-sm text-black">
            More questions? See{" "}
            <a href="#faq" className="font-bold hover:underline">
              FAQ
            </a>{" "}
            below or{" "}
            <Link href="/contact" className="font-bold hover:underline">
              contact us
            </Link>
          </p>
        </div>
      </section>

      {/* Photo gallery, edge to edge. */}
      {gallery.length ? (
        <section aria-label="Lucia at events" className="pt-2">
          <ImageCarousel label="Lucia at events" images={gallery} />
        </section>
      ) : null}

      {/* FAQ */}
      <section id="faq" className={`relative isolate overflow-x-clip px-4 pt-12 sm:px-8 lg:pt-[3.2rem] ${anchor}`}>
        <Blob shape="bean" color="#e3f4ef" className="top-20 -left-40 w-[26rem] lg:-left-28 lg:w-[32rem]" />
        <Blob shape="pebble" color="#fcd5d1" className="top-14 right-[6%] hidden w-14 lg:block" />
        <Blob shape="splash" color="#ffe2df" className="-right-40 bottom-0 w-[24rem] lg:w-[26rem]" />
        <h2 className="subhead text-center text-6xl leading-[0.85] text-strawberry lg:text-[5rem]">FAQ</h2>
        <div className="mx-auto mt-10 grid max-w-[70.625rem] gap-[0.9375rem] lg:mt-[2.8rem] lg:grid-cols-2 lg:gap-x-[2.0625rem]">
          {faqColumns.map((col, c) => (
            <div key={c} className="flex flex-col gap-[0.9375rem]">
              {col.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-[1.25rem] border-2 border-seafoam bg-white transition-colors open:border-alpine"
                >
                  <summary className="flex min-h-[4.3125rem] cursor-pointer list-none items-center justify-between gap-4 rounded-[1.125rem] py-3 pr-5 pl-6 font-ui text-base leading-[1.1] font-bold text-black lg:pl-9 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      aria-hidden
                      className="grid h-[1.8125rem] w-[1.8125rem] shrink-0 place-items-center rounded-full bg-seafoam text-lakeside transition group-open:rotate-45"
                    >
                      <svg viewBox="0 0 12 12" className="h-3 w-3">
                        <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="px-6 pb-5 font-ui text-[0.9375rem] leading-relaxed text-black/80 lg:px-9">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-6 text-center font-ui text-sm text-black">
          More questions?{" "}
          <Link href="/contact" className="font-bold hover:underline">
            Contact us
          </Link>
        </p>
      </section>

      {/* Booking request: a rose band with wavy edges. */}
      <section
        id="book"
        className={`relative mt-24 bg-rose px-4 pt-14 pb-14 sm:px-8 lg:mt-[8rem] lg:pt-[3.75rem] lg:pb-[3.3rem] ${anchor}`}
      >
        <Wave color={ROSE} className="absolute inset-x-0 -top-3.5" />
        <h2 className="eyebrow text-center !text-[2.5rem] !leading-[0.95] text-strawberry">Request a booking</h2>
        <p className="mx-auto mt-4 max-w-[22.625rem] text-center font-ui text-sm text-black">
          Tell us a little about your event and we&rsquo;ll get back to you with availability and a quote.
        </p>
        <div className="mx-auto mt-8 max-w-[48.75rem]">
          <EventBookingForm packages={packages} travelFees={events.travelFees} />
        </div>
        <p className="mx-auto mt-6 max-w-[45.625rem] text-center font-ui text-sm text-black">
          Please note that event requests are subject to our availability. Our team will be in touch to confirm
          your event booking.
        </p>
        <Wave color={ROSE} className="absolute inset-x-0 -bottom-3.5 rotate-180" />
      </section>

      <div className="pb-4">
        <BackToTop />
      </div>
    </>
  );
}
