import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { BackToTop } from "@/components/BackToTop";
import { Blob } from "@/components/Blob";
import { Wave } from "@/components/Wave";
import { PintPicker } from "@/components/shop/PintPicker";
import { DELIVERY_SCHEDULE } from "@/data/shop";
import { Rich, paragraphs } from "@/components/Rich";
import { getPintFlavours, getShop, getStockists } from "@/lib/content";
import { getPageContent } from "@/lib/page-content";
import { ourGelatoPage } from "@/data/pages/our-gelato";

export async function generateMetadata(): Promise<Metadata> {
  const { metaDescription } = await getPageContent("ourGelatoPage", ourGelatoPage);
  return { title: "Our gelato", description: metaDescription };
}

/** "Nesters Market Squamish" → "Nesters Market, Squamish"; "Stong's Market" → "Stong's Market, Squamish". */
function withTown(store: string, town: string) {
  if (store.endsWith(` ${town}`)) return `${store.slice(0, -town.length - 1)}, ${town}`;
  return store.includes(town) ? store : `${store}, ${town}`;
}

/** The pint section's colour, for its wave edges. */
const PETAL = "#ffeee9";

/** Jump links on the hero photo (Figma: Our gelato › Frame 55); the labels come from the Studio. */
const shortcuts = [
  { key: "orderPints", href: "#order-pints", className: "bg-strawberry" },
  { key: "orderCake", href: "/order/cakes", className: "bg-alpenglow" },
  { key: "whatIsGelato", href: "#what-is-gelato", className: "bg-lakeside" },
  { key: "dairyFree", href: "#dairy-free-vs-sorbet", className: "bg-bluebird" },
  { key: "difference", href: "#lucia-difference", className: "bg-heatwave" },
] as const;

/**
 * Our gelato, from the website design (Figma "Lucia Website" › XX Working Zone › Our gelato):
 * hero photo with jump links, the pint shop with filters and one-tap add-to-cart, the allergy
 * note, gelato vs. dairy-free vs. sorbet, and the Lucia difference.
 */
export default async function OurGelatoPage() {
  const [pintFlavours, shop, stockists, page] = await Promise.all([
    getPintFlavours(),
    getShop(),
    getStockists(),
    getPageContent("ourGelatoPage", ourGelatoPage),
  ]);
  const { hero, allergies, cakes, stores, whatIsGelato, dairyFree, difference, scoops } = page;
  // Two columns (Lucia, Nov 2026): the Whistler stores, then the rest with their town.
  const [local, ...elsewhere] = stockists.groceryStores;
  const storeColumns = [
    local?.stores ?? [],
    elsewhere.flatMap((g) => g.stores.map((store) => withTown(store, g.town))),
  ];

  return (
    <>
      <h1 className="sr-only">Our gelato</h1>

      {/* Hero: framed photo of pints in the snow, with jump links bottom-left. */}
      <section className="relative z-10 px-4 sm:px-8 lg:px-[6.6875rem]">
        <div className="relative mx-auto h-[30rem] max-w-[77.125rem] overflow-hidden rounded-[1.25rem] border-2 border-bluebird sm:h-[34rem] lg:h-auto lg:aspect-[1234/675]">
          <Image
            src={hero.photo.src}
            alt={hero.photo.alt}
            fill
            priority
            sizes="(min-width: 1440px) 1234px, 100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-black/10" />
          <nav
            aria-label="On this page"
            className="absolute bottom-6 left-4 flex flex-col items-start gap-[0.625rem] sm:left-8 lg:bottom-[4.25rem] lg:left-[2.6875rem]"
          >
            {shortcuts.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className={`eyebrow rounded-[1.5rem] px-[1.125rem] py-1.5 !text-base tracking-[0.04em] text-snow transition hover:-translate-y-px sm:!text-xl ${s.className}`}
              >
                {hero.shortcuts[s.key]}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* Order pints: the pink band starts behind the bottom of the photo. */}
      <section
        id="order-pints"
        className="relative -mt-[4.25rem] scroll-mt-24 bg-petal px-4 pt-[8.5rem] pb-20 sm:px-8 lg:pb-[5.5rem]"
      >
        <Wave color={PETAL} className="absolute inset-x-0 -top-3.5" />
        <h2 className="display mx-auto max-w-[37.5rem] text-center text-6xl text-strawberry sm:text-7xl lg:text-[5rem]">
          {page.pints.title}
        </h2>
        <p className="mx-auto mt-5 max-w-[40rem] text-center font-ui text-sm leading-[1.4] text-ink/80">
          <strong className="text-ink">
            Please order at least {shop.pintLeadDays} day{shop.pintLeadDays === 1 ? "" : "s"} ahead.
          </strong>{" "}
          Pick up free from our kitchen, or get delivery on {DELIVERY_SCHEDULE.dayName}s (order by{" "}
          {DELIVERY_SCHEDULE.cutoffName} {DELIVERY_SCHEDULE.cutoffTime}). Whistler delivery is free on orders
          over $100, and Squamish &amp; Pemberton on orders over $400.
        </p>
        <div className="mt-10 lg:mt-[3.3125rem]">
          <PintPicker flavours={pintFlavours} price={shop.pintPrice} />
        </div>
        <Wave color={PETAL} className="absolute inset-x-0 -bottom-3.5 rotate-180" />
      </section>

      {/* Allergies, cakes and where to find pints in stores (Figma: Our gelato › Group 57). */}
      <section className="relative isolate px-4 pt-24 sm:px-8 lg:pt-[8.5rem]">
        <Blob shape="puddle" color="#d1f1f4" className="top-40 -left-24 w-56 sm:w-72" />
        <Blob shape="pebble" color="#fcd5d1" className="top-8 right-[20%] w-28" />
        <Image
          src={scoops.pink.src}
          alt=""
          width={scoops.pink.width}
          height={scoops.pink.height}
          className="pointer-events-none absolute top-[24rem] -right-28 -z-10 hidden w-[24rem] lg:block xl:top-[17rem]"
        />
        <div className="mx-auto grid max-w-[73.5rem] gap-5 lg:grid-cols-[558fr_601fr] lg:gap-[1.125rem]">
          <div className="flex flex-col gap-5 lg:gap-[1.375rem]">
            <div className="flex flex-col items-center gap-2 rounded-[1.25rem] border-2 border-alpenglow bg-[#fff5ef] px-[1.875rem] py-5 text-center font-ui text-strawberry">
              <h2 className="text-lg font-extrabold">{allergies.title}</h2>
              <p className="text-[0.9375rem] leading-[1.35] font-medium">{allergies.text}</p>
              <Link href="/contact" className="mt-3 text-sm font-bold underline underline-offset-2">
                {allergies.linkLabel}
              </Link>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[1.25rem] border-2 border-heatwave bg-peach p-5 text-center">
              <h2 className="display text-[2.5rem] text-heatwave sm:text-5xl">{cakes.title}</h2>
              <Link
                href="/order/cakes"
                className="eyebrow rounded-[1.25rem] bg-heatwave px-5 py-2.5 !text-xl tracking-[0.02em] text-snow transition hover:-translate-y-px"
              >
                {cakes.button}
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center gap-7 rounded-[1.25rem] border-2 border-grass bg-pistachio px-6 py-10 sm:px-[2.625rem]">
            <h2 className="display text-center text-[2.125rem] text-grass sm:text-[2.5rem]">
              {stores.title}
            </h2>
            <div className="grid gap-x-10 gap-y-4 font-ui text-[0.9375rem] leading-[1.6] font-medium text-ink sm:grid-cols-2">
              {storeColumns.map((column, i) => (
                <ul key={i}>
                  {column.map((store) => (
                    <li key={store}>{store}</li>
                  ))}
                </ul>
              ))}
            </div>
            <Link
              href="/find-us#grocery"
              className="font-ui text-sm font-bold text-ink underline underline-offset-2"
            >
              {stores.linkLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* What is gelato? · Dairy-free gelato vs. sorbet · The Lucia difference, on one white card. */}
      <section className="relative isolate px-4 pt-28 pb-10 sm:px-8 lg:px-[4.125rem] lg:pt-36 lg:pb-32">
        <Image
          src={scoops.cream.src}
          alt=""
          width={scoops.cream.width}
          height={scoops.cream.height}
          className="pointer-events-none absolute top-6 left-[18%] z-10 w-28 sm:w-40 lg:left-[23.5%] lg:w-[12.5rem]"
        />
        <Blob shape="splash" color="#bce4e7" className="!z-0 top-10 right-[22%] hidden w-[17rem] lg:block" />
        <Blob shape="bean" color="#bce4e7" className="!z-0 top-28 right-[14%] hidden w-16 lg:block" />
        <div className="relative isolate mx-auto max-w-[81.8125rem] rounded-[1.25rem] bg-white shadow-[0_4px_24px_rgb(33_33_33/0.08)]">
          <div className="grid gap-14 px-6 pt-14 pb-10 sm:px-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0 lg:px-16 lg:pt-24 lg:pb-0">
            <div id="what-is-gelato" className="relative scroll-mt-28 text-center text-strawberry">
              <Blob
                shape="puddle"
                color="#ffd5d1"
                className="-top-16 -left-36 w-[30rem] opacity-80 lg:-left-[8.5rem] lg:w-[32rem]"
              />
              <h2 className="eyebrow !text-[2.5rem] !leading-[0.85]">{whatIsGelato.title}</h2>
              <div className="mx-auto mt-4 max-w-[28.75rem] space-y-3 text-lg leading-[1.35] text-strawberry">
                {paragraphs(whatIsGelato.text).map((p) => (
                  <p key={p}>
                    <Rich text={p} />
                  </p>
                ))}
              </div>
            </div>

            <div id="dairy-free-vs-sorbet" className="scroll-mt-28 text-center text-lakeside lg:mt-36">
              <h2 className="eyebrow !text-[2.5rem] !leading-[0.85]">
                {dairyFree.title.split("\n").map((part, i) => (
                  <Fragment key={i}>
                    {i > 0 ? <br /> : null}
                    {part.trim()}
                  </Fragment>
                ))}
              </h2>
              <div className="mx-auto mt-5 max-w-[31.75rem] space-y-3 text-lg leading-[1.35]">
                {paragraphs(dairyFree.text).map((p) => (
                  <p key={p}>
                    <Rich text={p} />
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div
            id="lucia-difference"
            className="grid scroll-mt-28 items-center gap-8 px-6 pb-14 sm:px-12 lg:mt-14 lg:grid-cols-[minmax(0,50.3rem)_minmax(0,1fr)] lg:gap-0 lg:pr-16 lg:pl-0 lg:pb-0"
          >
            <Image
              src={difference.photo.src}
              alt={difference.photo.alt}
              width={difference.photo.width}
              height={difference.photo.height}
              sizes="(min-width: 1024px) 612px, 90vw"
              className="mx-auto w-full max-w-[38.25rem] lg:-mb-32 lg:-ml-12"
            />
            <div className="text-center text-heatwave lg:pb-24">
              <h2 className="display mx-auto max-w-[26.25rem] text-5xl sm:text-[3.75rem]">
                {difference.title}
              </h2>
              <div className="mx-auto mt-6 max-w-[29rem] space-y-3 text-lg leading-[1.35] tracking-[0.02em] text-[#d97a22]">
                {paragraphs(difference.text).map((p) => (
                  <p key={p}>
                    <Rich text={p} />
                  </p>
                ))}
              </div>
              <Link
                href="/about"
                className="eyebrow mt-7 inline-block border-b-2 border-heatwave pb-1 !text-lg text-heatwave hover:border-transparent"
              >
                {difference.linkLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-3.5">
        <BackToTop />
      </div>
    </>
  );
}
