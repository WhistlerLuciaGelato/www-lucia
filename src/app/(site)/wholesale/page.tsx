import type { Metadata } from "next";
import { Blob } from "@/components/Blob";
import { FlavourTabs } from "@/components/FlavourTabs";
import { WholesaleOrderForm } from "@/components/forms/WholesaleOrderForm";
import { SectionHeading } from "@/components/ui";
import { getWholesale } from "@/lib/content";
import type { Supplier } from "@/lib/content-types";
import { getPageContent } from "@/lib/page-content";
import { wholesalePageText } from "@/data/pages/wholesale";

export async function generateMetadata(): Promise<Metadata> {
  const { metaDescription } = await getPageContent("wholesalePage", wholesalePageText);
  return { title: "Wholesale", description: metaDescription };
}

/** Bluebird, for the hero band and its curved bottom edge. */
const BLUEBIRD = "#78bdc7";

/** Supplier cards cycle through the site's pastel and text pairs. */
const supplierTones = [
  "border-grass bg-pistachio text-grass",
  "border-strawberry bg-petal text-strawberry",
  "border-lakeside bg-seafoam text-lakeside",
  "border-heatwave bg-peach text-heatwave",
];

/** Anchors the header menu links to, clear of the sticky header and its wiggle. */
const anchor = "scroll-mt-28 lg:scroll-mt-44";

/**
 * Wholesale, from the website design (Figma "Lucia Website" › XX Working Zone › Wholesale):
 * a Bluebird hero band whose curved bottom edge the sizes and delivery cards sit across, then the
 * flavour list and the quote request form. No prices anywhere: Lucia quotes each request.
 */
export default async function WholesalePage() {
  const [content, page] = await Promise.all([
    getWholesale(),
    getPageContent("wholesalePage", wholesalePageText),
  ]);
  const { hero, pricing, delivery, flavoursText, suppliersText, order } = page;
  const { formats: wholesaleFormats, deliverySchedule, flavourGroups: wholesaleFlavours } = content;
  // Bestsellers repeat flavours from the other lists, so count each name once.
  const flavourCount = new Set(wholesaleFlavours.flatMap((g) => g.flavours)).size;
  // One card per ingredient, in the order Lucia lists her suppliers.
  const supplierGroups: { supplies: string; names: Supplier[] }[] = [];
  for (const s of content.suppliers) {
    const group = supplierGroups.find((g) => g.supplies.toLowerCase() === s.supplies.toLowerCase());
    if (group) group.names.push(s);
    else supplierGroups.push({ supplies: s.supplies, names: [s] });
  }

  return (
    <>
      {/* Hero band: the header's snow wiggle bites into its top edge. */}
      <section className="bg-bluebird px-4 pt-20 pb-24 text-center sm:px-8 sm:pt-28 sm:pb-32 lg:pt-[7.3rem] lg:pb-[10rem]">
        <p className="eyebrow !text-lg text-seafoam lg:!text-xl">{hero.eyebrow}</p>
        <h1 className="display mx-auto mt-5 max-w-[37rem] text-6xl text-snow [text-shadow:0_4px_4px_rgb(0_0_0/0.1)] sm:text-7xl lg:text-[5rem]">
          {hero.title}
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:mt-10">
          <a href="#order" className="btn btn-berry">
            {hero.orderButton}
          </a>
          <a href="#flavours" className="btn btn-primary">
            {hero.flavoursButton}
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
            <h2 className="display text-center text-4xl text-strawberry sm:text-[2.5rem]">{pricing.title}</h2>
            <p className="mx-auto mt-4 max-w-sm text-center font-ui text-ink/80">{pricing.intro}</p>
            <ul className="mt-6 divide-y divide-strawberry/30 font-ui">
              {wholesaleFormats.map((f) => (
                <li key={f.id} className="py-3.5">
                  <p className="font-extrabold text-ink">{f.label}</p>
                  {f.note ? <p className="text-sm text-ink/70">{f.note}</p> : null}
                </li>
              ))}
              <li className="py-3.5">
                <p className="font-extrabold text-ink">{pricing.customSize}</p>
                <p className="text-sm text-ink/70">{pricing.customSizeNote}</p>
              </li>
            </ul>
          </div>

          <div className="rounded-[2.1875rem] border border-lakeside bg-seafoam px-6 py-10 sm:px-[3.125rem] sm:py-[3.125rem]">
            <h2 className="display text-center text-4xl text-lakeside sm:text-[2.5rem]">{delivery.title}</h2>
            <p className="mt-5 flex justify-center">
              <span className="rounded-full border border-lakeside bg-snow px-4 py-1.5 text-center font-ui text-sm font-extrabold text-lakeside">
                {delivery.cutoff}
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
            eyebrow={flavoursText.eyebrow}
            title={flavourCount >= 100 ? "Over 100 flavours" : `${flavourCount} flavours`}
            intro={flavoursText.intro}
            align="left"
          />
          <div className="mt-10">
            <FlavourTabs groups={wholesaleFlavours} />
          </div>
        </div>
      </section>

      {supplierGroups.length ? (
        <section id="suppliers" className={`px-4 py-12 sm:px-8 ${anchor}`}>
          <div className="mx-auto max-w-[76.125rem]">
            <SectionHeading
              eyebrow={suppliersText.eyebrow}
              title={suppliersText.title}
              intro={suppliersText.intro}
            />
            <ul className="mt-10 flex flex-wrap justify-center gap-5">
              {supplierGroups.map((group, i) => {
                const tone = supplierTones[i % supplierTones.length];
                return (
                  <li
                    key={group.supplies}
                    className={`flex w-full flex-col items-start gap-3 rounded-[1.25rem] border-2 p-[1.5625rem] sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)] ${tone}`}
                  >
                    <span className="eyebrow rounded-[1.25rem] border-2 border-current px-4 py-[0.4375rem] !text-[0.9375rem]">
                      {group.supplies}
                    </span>
                    <ul className="flex flex-col gap-1.5">
                      {group.names.map((s) => (
                        <li key={s.name} className="subhead text-[1.625rem]">
                          {s.url ? (
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline decoration-2 decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
                            >
                              {s.name}
                            </a>
                          ) : (
                            s.name
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <section id="order" className={`px-4 py-12 sm:px-8 lg:pb-20 ${anchor}`}>
        <div className="mx-auto max-w-5xl rounded-[2.1875rem] bg-white p-6 shadow-soft ring-1 ring-alpine/60 sm:p-12">
          <SectionHeading eyebrow={order.eyebrow} title={order.title} intro={order.intro} />
          <div className="mt-10">
            <WholesaleOrderForm
              content={content}
              text={{
                cutoff: delivery.cutoff,
                replyNote: order.replyNote,
                successTitle: order.successTitle,
                successMessage: order.successMessage,
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
