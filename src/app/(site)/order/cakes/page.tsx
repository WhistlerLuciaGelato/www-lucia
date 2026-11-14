import type { Metadata } from "next";
import { Blob } from "@/components/Blob";
import { CakeBuilder } from "@/components/shop/CakeBuilder";
import { getShop } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gelato cakes",
  description:
    "Custom gelato cakes for birthdays, weddings and special moments. Choose your size, base and flavours — made to order in Whistler.",
};

/** Strawberry, for the hero band and its curved bottom edge. */
const STRAWBERRY = "#ff8f8f";

/**
 * Make a cake, in the style of the redesigned pages (Wholesale, Events): a coloured hero band with
 * a curved bottom edge, then the four steps as pastel cards beside the cake summary.
 */
export default async function CakesPage() {
  const shop = await getShop();
  return (
    <>
      {/* Hero band: the header's snow wiggle bites into its top edge. */}
      <section className="bg-strawberry px-4 pt-20 pb-10 text-center sm:px-8 sm:pt-28 lg:pt-[7.3rem]">
        <p className="eyebrow !text-lg text-petal lg:!text-xl">Order · Gelato cakes</p>
        <h1 className="display mx-auto mt-5 max-w-[37rem] text-6xl leading-[0.85] text-snow [text-shadow:0_4px_4px_rgb(0_0_0/0.1)] sm:text-7xl lg:text-[5rem]">
          Make it a cake
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-ui text-lg leading-relaxed font-semibold text-ink/80">
          Custom-made for birthdays, weddings and special moments. Two layers of gelato or sorbet on your
          choice of base — made to order with {shop.cakeLeadDays} days&rsquo; notice.
        </p>
      </section>

      <section className="relative isolate px-4 pb-20 sm:px-8">
        {/* The band's curved bottom edge (mirrors the Wholesale hero). */}
        <svg
          aria-hidden
          viewBox="0 0 1440 130"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-auto min-h-12 w-full -scale-x-100"
        >
          <path
            d="M-38 0V75.4C339 209.6 560 45 867.4 14.7 1063-4.6 1379.8 34.9 1516.9 75.4V0Z"
            fill={STRAWBERRY}
          />
        </svg>
        <Blob shape="puddle" color="#e3f4ef" className="top-[30%] -left-10 w-40 sm:w-56" />
        <Blob shape="pebble" color="#ffe1c2" className="-right-8 bottom-16 w-36 rotate-45 sm:w-48" />

        <div className="mx-auto max-w-[76.125rem] pt-16 sm:pt-24 lg:pt-28">
          <CakeBuilder shop={shop} />
        </div>
      </section>
    </>
  );
}
