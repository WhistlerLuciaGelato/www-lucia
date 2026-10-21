import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bear, CheckList, Container, PageHeading } from "@/components/ui";
import { getPintFlavours, getShop } from "@/lib/content";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Order",
  description: "Order Lucia Gelato pints and made-to-order gelato cakes for pickup in Whistler.",
};

export default async function OrderPage() {
  const [shop, pints] = await Promise.all([getShop(), getPintFlavours()]);
  const prices = shop.cakeSizes.map((c) => c.price);
  const serves = shop.cakeSizes.map((c) => c.serves);
  const preview = pints.filter((p) => p.image).slice(0, 3);
  return (
    <>
      <section className="pt-16 pb-12 sm:pt-24">
        <Container>
          <PageHeading
            eyebrow="Order online"
            title="Take Lucia home"
            tone="strawberry"
            intro="Order ahead and pick up from our kitchen at Base II. Pay online, skip the wait."
          />
        </Container>
      </section>

      <section>
        <Container className="grid gap-6 lg:grid-cols-2">
          <Link
            href="/order/pints"
            className="group relative flex flex-col overflow-hidden rounded-[3.5rem] bg-alpine p-8 shadow-pop transition hover:-translate-y-1 sm:p-12"
          >
            <p className="eyebrow text-lake-deep">473 mL · {money(shop.pintPrice)} each</p>
            <h2 className="display mt-4 text-5xl text-lake-deep sm:text-6xl">Pints</h2>
            <CheckList
              className="mt-6 text-lg text-ink/85"
              items={[
                `${pints.length} flavours from the current lineup`,
                "Gelato, sorbet & dairy-free options",
                shop.pintLeadDays
                  ? `Ready in ${shop.pintLeadDays} day${shop.pintLeadDays === 1 ? "" : "s"}`
                  : "Ready the same day",
              ]}
            />
            <div className="relative mt-8 flex items-end justify-between">
              <span className="btn btn-primary">Shop pints</span>
              <div className="flex -space-x-12">
                {preview.map((p, i) => (
                  <Image
                    key={p.slug}
                    src={p.image}
                    alt=""
                    width={200}
                    height={200}
                    className={`h-28 w-28 rounded-3xl bg-snow object-contain shadow-soft transition group-hover:-translate-y-1 sm:h-36 sm:w-36 ${i === 1 ? "z-10 -translate-y-3" : ""}`}
                  />
                ))}
              </div>
            </div>
          </Link>

          <Link
            href="/order/cakes"
            className="group relative flex flex-col overflow-hidden rounded-[3.5rem] bg-blush p-8 shadow-pop transition hover:-translate-y-1 sm:p-12"
          >
            <p className="eyebrow text-berry">
              From {money(Math.min(...prices))} · serves {Math.min(...serves)}–{Math.max(...serves)}
            </p>
            <h2 className="display mt-4 text-5xl text-berry sm:text-6xl">Gelato cakes</h2>
            <CheckList
              className="mt-6 text-lg text-ink/85"
              items={[
                "Choose your size, base and flavours",
                "Gluten-free & dairy-free options",
                `Made to order with ${shop.cakeLeadDays} days' notice`,
              ]}
            />
            <div className="relative mt-8 flex items-end justify-between">
              <span className="btn btn-berry">Build a cake</span>
              <Bear name="snowboard-pink" className="w-36 transition group-hover:-rotate-6 sm:w-44" />
            </div>
          </Link>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl rounded-blob bg-mist p-8 text-center sm:p-10">
            <h2 className="subhead text-3xl text-lakeside">How pickup works</h2>
            <ol className="mt-6 grid gap-6 text-left sm:grid-cols-3">
              {[
                ["1", "Order & pay online", "Choose your gelato and a pickup date at checkout."],
                ["2", "We make it", "Every cake is made fresh; pints are packed from our freezer."],
                [
                  "3",
                  "Pick it up",
                  `${shop.pickupWhere}, ${shop.pickupWindow}. Bring a cooler bag on warm days!`,
                ],
              ].map(([n, title, body]) => (
                <li key={n}>
                  <span className="display grid h-12 w-12 place-items-center rounded-full bg-lake-deep text-2xl text-snow">
                    {n}
                  </span>
                  <p className="mt-3 font-ui font-extrabold text-ink">{title}</p>
                  <p className="mt-1 text-ink/80">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>
    </>
  );
}
