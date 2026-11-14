import type { Metadata } from "next";
import { Blob } from "@/components/Blob";
import { FlavourTabs } from "@/components/FlavourTabs";
import { WholesaleOrderForm } from "@/components/forms/WholesaleOrderForm";
import { SectionHeading } from "@/components/ui";
import { getWholesale } from "@/lib/content";
import { orderCutoff } from "@/data/wholesale";

export const metadata: Metadata = {
  title: "Wholesale",
  description:
    "Premium small-batch gelato for cafés, restaurants and retailers across Whistler, Squamish and Pemberton. Sizes, delivery schedule and quote requests.",
};

/** Bluebird, for the hero band and its curved bottom edge. */
const BLUEBIRD = "#78bdc7";

/** Anchors the header menu links to, clear of the sticky header and its wiggle. */
const anchor = "scroll-mt-28 lg:scroll-mt-44";

/**
 * Wholesale, from the website design (Figma "Lucia Website" › XX Working Zone › Wholesale):
 * a Bluebird hero band whose curved bottom edge the sizes and delivery cards sit across, then the
 * flavour list and the quote request form. No prices anywhere: Lucia quotes each request.
 */
export default async function WholesalePage() {
  const content = await getWholesale();
  const { formats: wholesaleFormats, deliverySchedule, flavourGroups: wholesaleFlavours } = content;
  // Bestsellers repeat flavours from the other lists, so count each name once.
  const flavourCount = new Set(wholesaleFlavours.flatMap((g) => g.flavours)).size;

  return (
    <>
      {/* Hero band: the header's snow wiggle bites into its top edge. */}
      <section className="bg-bluebird px-4 pt-20 pb-24 text-center sm:px-8 sm:pt-28 sm:pb-32 lg:pt-[7.3rem] lg:pb-[10rem]">
        <p className="eyebrow !text-lg text-seafoam lg:!text-xl">Wholesale</p>
        <h1 className="display mx-auto mt-5 max-w-[37rem] text-6xl leading-[0.85] text-snow [text-shadow:0_4px_4px_rgb(0_0_0/0.1)] sm:text-7xl lg:text-[5rem]">
          Put Lucia on your menu
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:mt-10">
          <a href="#order" className="btn btn-berry">
            Place an order
          </a>
          <a href="#flavours" className="btn btn-primary">
            Browse flavours
          </a>
        </div>
      </section>

      {/* Sizes and delivery, overlapping the band's curved bottom edge. */}
      <section className="relative isolate px-4 sm:px-8">
        <svg
          aria-hidden
          viewBox="0 0 1440 130"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-auto min-h-16 w-full"
        >
          <path
            d="M-38 0V75.4C339 209.6 560 45 867.4 14.7 1063-4.6 1379.8 34.9 1516.9 75.4V0Z"
            fill={BLUEBIRD}
          />
        </svg>

        <div
          id="info"
          className={`mx-auto -mt-12 grid max-w-[76.125rem] gap-6 lg:grid-cols-2 lg:gap-[4.375rem] ${anchor}`}
        >
          <div className="rounded-[2.1875rem] border border-strawberry bg-petal px-6 py-10 sm:px-[3.125rem] sm:py-[3.125rem]">
            <h2 className="display text-center text-4xl leading-[0.9] text-strawberry sm:text-[2.5rem]">
              Wholesale Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-center font-ui text-ink/80">
              Sizes we make for wholesale. Request a quote below and we&rsquo;ll send you our pricing.
            </p>
            <ul className="mt-6 divide-y divide-strawberry/30 font-ui">
              {wholesaleFormats.map((f) => (
                <li key={f.id} className="py-3.5">
                  <p className="font-extrabold text-ink">{f.label}</p>
                  {f.note ? <p className="text-sm text-ink/70">{f.note}</p> : null}
                </li>
              ))}
              <li className="py-3.5">
                <p className="font-extrabold text-ink">Other custom size</p>
                <p className="text-sm text-ink/70">
                  Choose &ldquo;Other custom size&rdquo; in the form and tell us what you need in the notes.
                </p>
              </li>
            </ul>
          </div>

          <div className="rounded-[2.1875rem] border border-lakeside bg-seafoam px-6 py-10 sm:px-[3.125rem] sm:py-[3.125rem]">
            <h2 className="display text-center text-4xl leading-[0.9] text-lakeside sm:text-[2.5rem]">
              Delivery Schedule
            </h2>
            <p className="mt-5 flex justify-center">
              <span className="rounded-full border border-lakeside bg-snow px-4 py-1.5 text-center font-ui text-sm font-extrabold text-lakeside">
                {orderCutoff}
              </span>
            </p>
            <ul className="mt-6 divide-y divide-lakeside/25 font-ui">
              {deliverySchedule.map((d) => (
                <li key={d.area} className="py-3.5">
                  <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="subhead text-2xl text-lakeside">{d.area}</span>
                    <span className="font-extrabold text-ink">{d.days}</span>
                  </p>
                  <p className="mt-1 text-sm text-ink/70">{d.terms}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="flavours" className={`relative isolate px-4 pt-24 pb-12 sm:px-8 lg:pt-32 ${anchor}`}>
        <Blob shape="pebble" color="#f3fad5" className="top-6 right-[8%] w-40 rotate-[112deg] sm:w-52" />
        <Blob shape="bean" color="#e3f4ef" className="top-[38%] -left-6 w-24 -rotate-12 sm:left-[6%]" />
        <Blob shape="bean" color="#ffeee9" className="right-[2%] bottom-24 w-24 rotate-[-88deg] sm:w-28" />
        <div className="mx-auto max-w-[76.125rem] rounded-[2.1875rem] bg-mist p-6 sm:p-10 lg:p-14">
          <SectionHeading
            eyebrow="Wholesale flavours list"
            title={flavourCount >= 100 ? "Over 100 flavours" : `${flavourCount} flavours`}
            intro="Gelato, sorbetto, vegan, boozy and cookie sandwiches. Don't see what you're after? Ask about custom flavours."
            align="left"
          />
          <div className="mt-10">
            <FlavourTabs groups={wholesaleFlavours} />
          </div>
        </div>
      </section>

      <section id="order" className={`px-4 py-12 sm:px-8 lg:pb-20 ${anchor}`}>
        <div className="mx-auto max-w-5xl rounded-[2.1875rem] bg-white p-6 shadow-soft ring-1 ring-alpine/60 sm:p-12">
          <SectionHeading
            eyebrow="Quote request"
            title="Place a wholesale order"
            intro="Tell us what you'd like and where to deliver it. We'll reply with a quote and your delivery day. New partners welcome!"
          />
          <div className="mt-10">
            <WholesaleOrderForm content={content} />
          </div>
        </div>
      </section>
    </>
  );
}
