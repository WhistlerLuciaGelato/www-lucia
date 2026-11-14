import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BackToTop } from "@/components/BackToTop";
import { Blob } from "@/components/Blob";
import { Wave } from "@/components/Wave";
import { PintPicker } from "@/components/shop/PintPicker";
import { DELIVERY_SCHEDULE } from "@/data/shop";
import { getPintFlavours, getShop, getStockists } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our gelato",
  description:
    "Order Whistler Lucia Gelato pints for pickup or Thursday delivery, and learn what makes gelato, dairy-free gelato and sorbetto different. Handcrafted on Blackcomb Mountain.",
};

/** The pint section's colour, for its wave edges. */
const PETAL = "#ffeee9";

/** Jump links on the hero photo (Figma: Our gelato › Frame 55). */
const shortcuts = [
  { href: "#order-pints", label: "Order pints", className: "bg-strawberry" },
  { href: "/order/cakes", label: "Order a cake", className: "bg-alpenglow" },
  { href: "#what-is-gelato", label: "What’s gelato?", className: "bg-lakeside" },
  { href: "#dairy-free-vs-sorbet", label: "Dairy-free gelato vs. sorbet", className: "bg-bluebird" },
  { href: "#lucia-difference", label: "The Lucia difference", className: "bg-heatwave" },
];

/**
 * Our gelato, from the website design (Figma "Lucia Website" › XX Working Zone › Our gelato):
 * hero photo with jump links, the pint shop with filters and one-tap add-to-cart, the allergy
 * note, gelato vs. dairy-free vs. sorbet, and the Lucia difference.
 */
export default async function OurGelatoPage() {
  const [pintFlavours, shop, stockists] = await Promise.all([getPintFlavours(), getShop(), getStockists()]);
  const stores = stockists.groceryStores.flatMap((g) => g.stores);

  return (
    <>
      <h1 className="sr-only">Our gelato</h1>

      {/* Hero: framed photo of pints in the snow, with jump links bottom-left. */}
      <section className="relative z-10 px-4 sm:px-8 lg:px-[6.6875rem]">
        <div className="relative mx-auto h-[30rem] max-w-[77.125rem] overflow-hidden rounded-[1.25rem] border-2 border-bluebird sm:h-[34rem] lg:h-auto lg:aspect-[1234/675]">
          <Image
            src="/our-gelato/hero-pints-snow.webp"
            alt="Lucia Gelato pints, Lemon Sorbet and Coconut Cookies & Cream among them, nestled in snow"
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
                {s.label}
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
        <h2 className="display mx-auto max-w-[37.5rem] text-center text-6xl leading-[0.85] text-strawberry sm:text-7xl lg:text-[5rem]">
          Order pints
        </h2>
        <p className="mx-auto mt-5 max-w-[40rem] text-center font-ui text-base leading-[1.4] text-ink/80">
          <strong className="text-ink">
            Please order at least {shop.pintLeadDays} day{shop.pintLeadDays === 1 ? "" : "s"} ahead.
          </strong>{" "}
          Pick up free from our kitchen, or get delivery on {DELIVERY_SCHEDULE.dayName}s (order by{" "}
          {DELIVERY_SCHEDULE.cutoffName} {DELIVERY_SCHEDULE.cutoffTime}): Whistler is free on orders over $100,
          and Squamish &amp; Pemberton on orders over $400.
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
          src="/our-gelato/scoop-pink.webp"
          alt=""
          width={744}
          height={694}
          className="pointer-events-none absolute top-[24rem] -right-28 -z-10 hidden w-[24rem] lg:block xl:top-[17rem]"
        />
        <div className="mx-auto grid max-w-[73.5rem] gap-5 lg:grid-cols-[558fr_601fr] lg:gap-[1.125rem]">
          <div className="flex flex-col gap-5 lg:gap-[1.375rem]">
            <div className="flex flex-col items-center gap-2 rounded-[1.25rem] border-2 border-alpenglow bg-[#fff5ef] px-[1.875rem] py-5 text-center font-ui text-[#e0676b]">
              <h2 className="text-lg font-extrabold">Have allergies or dietary restrictions?</h2>
              <p className="text-[0.9375rem] leading-[1.35] font-medium">
                Please let our team know before ordering. We&rsquo;re always happy to help you explore ingredients
                and find a suitable option, whether you&rsquo;re choosing a scoop, ordering a gelato cake, or
                planning an event.
              </p>
              <Link href="/contact" className="mt-3 text-sm font-bold underline underline-offset-2">
                Contact us
              </Link>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[1.25rem] border-2 border-heatwave bg-peach p-5 text-center">
              <h2 className="display text-[2.5rem] leading-none text-heatwave sm:text-5xl">Feeding a crowd?</h2>
              <Link
                href="/order/cakes"
                className="eyebrow rounded-[1.25rem] bg-heatwave px-5 py-2.5 !text-xl tracking-[0.02em] text-snow transition hover:-translate-y-px"
              >
                Make it a cake!
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center gap-7 rounded-[1.25rem] border-2 border-grass bg-pistachio px-6 py-10 sm:px-[2.625rem]">
            <h2 className="display text-center text-[2.125rem] leading-none text-grass sm:text-[2.5rem]">
              Find pints in stores at
            </h2>
            <ul className="columns-1 gap-6 font-ui text-[0.9375rem] leading-[1.6] font-medium text-ink sm:columns-2">
              {stores.map((store) => (
                <li key={store} className="break-inside-avoid">
                  {store}
                </li>
              ))}
            </ul>
            <Link href="/find-us#grocery" className="font-ui text-sm font-bold text-ink underline underline-offset-2">
              See all locations
            </Link>
          </div>
        </div>
      </section>

      {/* What is gelato? · Dairy-free gelato vs. sorbet · The Lucia difference, on one white card. */}
      <section className="relative isolate px-4 pt-28 pb-10 sm:px-8 lg:px-[4.125rem] lg:pt-36 lg:pb-32">
        <Image
          src="/our-gelato/scoop-cream.webp"
          alt=""
          width={318}
          height={296}
          className="pointer-events-none absolute top-6 left-[18%] z-10 w-28 sm:w-40 lg:left-[23.5%] lg:w-[12.5rem]"
        />
        <Blob shape="splash" color="#bce4e7" className="!z-0 top-10 right-[22%] hidden w-[17rem] lg:block" />
        <Blob shape="bean" color="#bce4e7" className="!z-0 top-28 right-[14%] hidden w-16 lg:block" />
        <div className="relative mx-auto max-w-[81.8125rem] rounded-[1.25rem] bg-white shadow-[0_4px_24px_rgb(33_33_33/0.08)]">
          <div className="grid gap-14 px-6 pt-14 pb-10 sm:px-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0 lg:px-16 lg:pt-24 lg:pb-0">
            <div id="what-is-gelato" className="relative isolate scroll-mt-28 text-center text-strawberry">
              <Blob
                shape="puddle"
                color="#ffd5d1"
                className="-top-16 -left-36 w-[30rem] opacity-80 lg:-left-[8.5rem] lg:w-[32rem]"
              />
              <h2 className="eyebrow !text-[2.5rem] !leading-[0.85]">What is gelato?</h2>
              <p className="mx-auto mt-4 max-w-[28.75rem] text-lg leading-[1.35] text-[#e0676b]">
                Gelato is a traditional Italian frozen dessert known for its smooth, creamy texture and rich,
                intense flavours. Made with more milk, less cream, and less air than traditional ice cream,
                gelato has a denser, silkier consistency that lets the natural flavours of its ingredients shine
                through.
              </p>
            </div>

            <div id="dairy-free-vs-sorbet" className="scroll-mt-28 text-center text-lakeside lg:mt-36">
              <h2 className="eyebrow !text-[2.5rem] !leading-[0.85]">
                Dairy-free gelato
                <br />
                vs. sorbet
              </h2>
              <p className="mx-auto mt-5 max-w-[31.75rem] text-lg leading-[1.35]">
                Our <strong>dairy-free gelato</strong> is primarily made with coconut milk, creating a rich, smooth,
                and creamy consistency without the dairy. Our <strong>fruit sorbettos</strong> are made with
                simple ingredients, combining fruit purées, water, and sugar for a light, refreshing treat bursting
                with natural fruit flavour. We love using seasonal fruits whenever possible to bring out their best.
              </p>
            </div>
          </div>

          <div
            id="lucia-difference"
            className="grid scroll-mt-28 items-center gap-8 px-6 pb-14 sm:px-12 lg:mt-14 lg:grid-cols-[minmax(0,50.3rem)_minmax(0,1fr)] lg:gap-0 lg:pr-16 lg:pl-0 lg:pb-0"
          >
            <Image
              src="/our-gelato/scooping-blob.webp"
              alt="Scooping mango sorbetto from a tray in the Lucia gelato case"
              width={900}
              height={1036}
              sizes="(min-width: 1024px) 612px, 90vw"
              className="mx-auto w-full max-w-[38.25rem] lg:-mb-32 lg:-ml-12"
            />
            <div className="text-center text-heatwave lg:pb-24">
              <h2 className="display mx-auto max-w-[26.25rem] text-5xl leading-[1.05] sm:text-[3.75rem]">
                The Lucia Difference
              </h2>
              <div className="mx-auto mt-6 max-w-[29rem] space-y-3 text-lg leading-[1.35] tracking-[0.02em] text-[#d97a22]">
                <p>
                  We believe the best gelato starts with simple, quality ingredients. That&rsquo;s why we&rsquo;re
                  passionate about making our gelato fresh, using natural ingredients and sourcing locally
                  whenever possible. Every batch is made with care, bringing together authentic Italian
                  traditions, homemade quality and a little Whistler creativity.
                </p>
                <p>
                  Alongside our signature favourites, we love experimenting with seasonal ingredients and creating
                  exciting new flavours throughout the year. Whether you&rsquo;re enjoying a scoop after a day on
                  the mountain or bringing a gelato pint home to share, you&rsquo;re enjoying a little taste of
                  Whistler, made right here in the mountains.
                </p>
              </div>
              <Link
                href="/about"
                className="eyebrow mt-7 inline-block border-b-2 border-heatwave pb-1 !text-lg text-heatwave hover:border-transparent"
              >
                Read our story
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
