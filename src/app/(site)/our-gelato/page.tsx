import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PintCard } from "@/components/shop/PintCard";
import { Bear, Container, DietIcons, PageHeading, SectionHeading } from "@/components/ui";
import { getPintFlavours } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our gelato",
  description:
    "Dense, smooth and intense: meet the Whistler Lucia Gelato flavour lineup — gelato, sorbet and dairy-free gelato handmade at Base II.",
};

const facts = [
  {
    title: "Milk, not cream",
    body: "Ice cream starts with cream; gelato starts with milk. That means less fat and more flavour.",
    bg: "bg-alpine",
  },
  {
    title: "Dense, not fluffy",
    body: "Gelato has far less air whipped in than ice cream, so every spoonful is dense, smooth and intense.",
    bg: "bg-blush",
  },
  {
    title: "Fresh fruit sorbetto",
    body: "Our sorbets are water-based and made with fruit purées — dairy-free and super refreshing.",
    bg: "bg-butter",
  },
  {
    title: "Dairy-free gelato",
    body: "Made with alternative milks like coconut, but following our classic formula. No compromises.",
    bg: "bg-light-green",
  },
];

export default async function OurGelatoPage() {
  const pintFlavours = await getPintFlavours();
  return (
    <>
      <section className="pt-16 pb-12 sm:pt-24">
        <Container>
          <PageHeading
            eyebrow="Our gelato"
            title="Dense, smooth & intense"
            intro="Every batch is handmade in small quantities at our kitchen in Base II, inspired by the gelaterie of Italy and the peaks outside our door."
          />
        </Container>
      </section>

      <section className="pb-8">
        <Container>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <li key={f.title} className={`rounded-blob p-7 ${f.bg}`}>
                <h2 className="subhead text-2xl text-ink">{f.title}</h2>
                <p className="mt-3 leading-relaxed text-ink/80">{f.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <div className="flex flex-col items-center gap-6 rounded-blob bg-mist p-8 text-center md:flex-row md:text-left">
            <DietIcons diet={["dairy-free", "vegan", "gluten-free"]} size={96} />
            <div>
              <h2 className="subhead text-2xl text-lakeside">Look for the badges</h2>
              <p className="mt-2 max-w-xl leading-relaxed text-ink/80">
                Every pint label calls out what&rsquo;s dairy-free, vegan and gluten-free. All of our sorbets
                are dairy-free and vegan. Have an allergy? Ask us — we&rsquo;re happy to talk ingredients.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="in-store" className="scroll-mt-24 py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Flavours in store"
            title="The pint lineup"
            tone="strawberry"
            intro="Find these 473 mL pints at grocery stores across the Sea to Sky — or order them for pickup."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pintFlavours.map((f) => (
              <PintCard key={f.slug} flavour={f} />
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link href="/order/pints" className="btn btn-primary">
              Order pints
            </Link>
            <Link href="/find-us#grocery" className="btn btn-sky">
              Find a store
            </Link>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="grid items-center gap-10 overflow-hidden rounded-[3.5rem] bg-lake-deep p-8 text-snow sm:p-12 lg:grid-cols-2 lg:p-16">
            <div>
              <p className="eyebrow text-alpine">At the trailer &amp; on the hill</p>
              <h2 className="display mt-4 text-4xl sm:text-5xl">Always something new to scoop</h2>
              <p className="mt-5 text-lg leading-relaxed text-snow/90">
                We&rsquo;re constantly trying new things at our trailer and seasonal spots, rolling with
                what&rsquo;s fresh. And if there&rsquo;s a flavour you&rsquo;d love to see, just ask —
                we&rsquo;re willing to try anything.
              </p>
              <p className="mt-5 text-lg leading-relaxed text-snow/90">
                Our full kitchen repertoire runs to over 100 gelatos, sorbettos, vegan and boozy flavours.
              </p>
              <Link href="/wholesale#flavours" className="btn mt-8 bg-snow text-lake-deep">
                See the full flavours list
              </Link>
            </div>
            <div className="relative">
              <Image
                src="/photos/gelato-tray.webp"
                alt="Trays of freshly made gelato"
                width={1407}
                height={716}
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="aspect-[4/3] w-full rounded-[2.5rem] object-cover"
              />
              <Bear name="ski-jump-white" className="absolute -top-14 -right-4 w-40 rotate-6 sm:w-52" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
