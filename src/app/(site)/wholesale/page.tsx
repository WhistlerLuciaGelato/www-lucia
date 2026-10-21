import type { Metadata } from "next";
import { FlavourTabs } from "@/components/FlavourTabs";
import { WholesaleOrderForm } from "@/components/forms/WholesaleOrderForm";
import { Bear, Container, PageHeading, SectionHeading } from "@/components/ui";
import { getWholesale } from "@/lib/content";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Wholesale",
  description:
    "Premium small-batch gelato for cafés, restaurants and retailers across Whistler, Squamish and Pemberton. Wholesale pricing, delivery schedule and order form.",
};

export default async function WholesalePage() {
  const content = await getWholesale();
  const { formats: wholesaleFormats, deliverySchedule, flavourGroups: wholesaleFlavours } = content;
  const flavourCount = wholesaleFlavours.reduce((n, g) => n + g.flavours.length, 0);

  return (
    <>
      <section className="pt-16 pb-12 sm:pt-24">
        <Container>
          <PageHeading
            eyebrow="Wholesale"
            title="Put Lucia on your menu"
            intro="We supply small-batch artisan gelato to cafés, restaurants, hotels and retailers across Whistler, Squamish and Pemberton. Consistent quality, flexible formats, and flavours your customers will love."
          >
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="#order" className="btn btn-primary">
                Place an order
              </a>
              <a href="#flavours" className="btn btn-ghost">
                Browse {flavourCount} flavours
              </a>
            </div>
          </PageHeading>
        </Container>
      </section>

      <section id="info" className="scroll-mt-24 py-12">
        <Container className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[3rem] bg-alpine p-8 sm:p-10">
            <h2 className="display text-4xl text-lake-deep">Wholesale pricing</h2>
            <ul className="mt-6 divide-y divide-lakeside/25">
              {wholesaleFormats.map((f) => (
                <li key={f.id} className="flex items-start justify-between gap-4 py-4">
                  <div>
                    <p className="font-ui font-extrabold text-ink">{f.label}</p>
                    {f.note ? <p className="font-ui text-sm text-ink/70">{f.note}</p> : null}
                  </div>
                  <p className="font-ui text-xl font-extrabold text-lake-deep">{money(f.price)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-[3rem] bg-light-green p-8 sm:p-10">
            <h2 className="display text-4xl text-[#5c6114]">Delivery schedule</h2>
            <ul className="mt-6 space-y-5">
              {deliverySchedule.map((d) => (
                <li key={d.area}>
                  <p className="subhead text-2xl text-ink">{d.area}</p>
                  <p className="font-ui font-extrabold text-[#5c6114]">{d.days}</p>
                  <p className="mt-0.5 font-ui text-sm text-ink/75">{d.terms}</p>
                </li>
              ))}
            </ul>
            <Bear name="bmx" className="absolute top-6 right-8 hidden w-20 sm:block" />
          </div>
        </Container>
      </section>

      <section id="flavours" className="scroll-mt-24 py-16">
        <Container>
          <div className="rounded-[3.5rem] bg-mist p-6 sm:p-10 lg:p-14">
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
        </Container>
      </section>

      <section id="order" className="scroll-mt-24 py-12">
        <Container className="max-w-5xl">
          <div className="rounded-[3.5rem] bg-white p-6 shadow-soft ring-1 ring-alpine/60 sm:p-12">
            <SectionHeading
              eyebrow="Order form"
              title="Place a wholesale order"
              intro="Send us your order and we'll confirm it, along with your delivery day. New partners welcome!"
            />
            <div className="mt-10">
              <WholesaleOrderForm content={content} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
