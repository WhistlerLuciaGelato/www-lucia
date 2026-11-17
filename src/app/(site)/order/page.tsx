import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bear, CheckList, Container, PageHeading } from "@/components/ui";
import { getPintFlavours, getShop } from "@/lib/content";
import { money } from "@/lib/format";
import { getPageContent } from "@/lib/page-content";
import { orderPage } from "@/data/pages/order";

export async function generateMetadata(): Promise<Metadata> {
  const { metaDescription } = await getPageContent("orderPage", orderPage);
  return { title: "Order", description: metaDescription };
}

/** The "How it works" steps in order; the words come from the Studio. */
const steps = ["order", "make", "collect"] as const;

export default async function OrderPage() {
  const [shop, pints, page] = await Promise.all([
    getShop(),
    getPintFlavours(),
    getPageContent("orderPage", orderPage),
  ]);
  const { hero, pintsCard, cakesCard, howItWorks } = page;
  const prices = shop.cakeSizes.map((c) => c.price);
  const serves = shop.cakeSizes.map((c) => c.serves);
  // Three round lid labels, as on the product cards.
  const preview = pints.filter((p) => p.label).slice(0, 3);
  return (
    <>
      <section className="pt-16 pb-12 sm:pt-24">
        <Container>
          <PageHeading eyebrow={hero.eyebrow} title={hero.title} tone="strawberry" intro={hero.intro} />
        </Container>
      </section>

      <section>
        <Container className="grid gap-6 lg:grid-cols-2">
          <Link
            href="/our-gelato#order-pints"
            className="group relative flex flex-col overflow-hidden rounded-[3.5rem] bg-alpine p-8 shadow-pop transition hover:-translate-y-1 sm:p-12"
          >
            <p className="eyebrow text-lake-deep">473 mL · {money(shop.pintPrice)} each</p>
            <h2 className="display mt-4 text-5xl text-lake-deep sm:text-6xl">{pintsCard.title}</h2>
            <CheckList
              className="mt-6 text-lg text-ink/85"
              items={[
                pintsCard.points.flavours,
                pintsCard.points.options,
                shop.pintLeadDays
                  ? `Ready in ${shop.pintLeadDays} day${shop.pintLeadDays === 1 ? "" : "s"}`
                  : "Ready the same day",
              ]}
            />
            <div className="relative mt-8 flex items-end justify-between">
              <span className="btn btn-primary">{pintsCard.button}</span>
              <div className="flex -space-x-8">
                {preview.map((p, i) => (
                  <Image
                    key={p.slug}
                    src={p.label!}
                    alt=""
                    width={240}
                    height={240}
                    className={`h-28 w-28 rounded-full drop-shadow-[0_4px_6px_rgb(33_33_33/0.18)] transition group-hover:-translate-y-1 sm:h-36 sm:w-36 ${i === 1 ? "z-10 -translate-y-3" : ""} ${i === 0 ? "-rotate-6" : i === 2 ? "rotate-6" : ""}`}
                  />
                ))}
              </div>
            </div>
          </Link>

          <Link
            href="/order/cakes"
            className="group relative flex flex-col overflow-hidden rounded-[3.5rem] bg-blush p-8 shadow-pop transition hover:-translate-y-1 sm:p-12"
          >
            <p className="eyebrow text-ink/70">
              From {money(Math.min(...prices))} · serves {Math.min(...serves)}–{Math.max(...serves)}
            </p>
            <h2 className="display mt-4 text-5xl text-strawberry sm:text-6xl">{cakesCard.title}</h2>
            <CheckList
              className="mt-6 text-lg text-ink/85"
              items={[
                cakesCard.points.choices,
                cakesCard.points.options,
                `Made to order with ${shop.cakeLeadDays} days' notice`,
              ]}
            />
            <div className="relative mt-8 flex items-end justify-between">
              <span className="btn btn-berry">{cakesCard.button}</span>
              <Bear name="snowboard-pink" className="w-36 transition group-hover:-rotate-6 sm:w-44" />
            </div>
          </Link>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl rounded-blob bg-mist p-8 text-center sm:p-10">
            <h2 className="subhead text-3xl text-lakeside">{howItWorks.title}</h2>
            <ol className="mt-6 grid gap-6 text-left sm:grid-cols-3">
              {steps.map((key, i) => (
                <li key={key}>
                  <span className="display grid h-12 w-12 place-items-center rounded-full bg-lake-deep text-2xl text-snow">
                    {i + 1}
                  </span>
                  <p className="mt-3 font-ui font-extrabold text-ink">{howItWorks.steps[key].title}</p>
                  <p className="mt-1 text-ink/80">{howItWorks.steps[key].text}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>
    </>
  );
}
