import type { Metadata } from "next";
import Link from "next/link";
import { PintCard } from "@/components/shop/PintCard";
import { Container, PageHeading } from "@/components/ui";
import { getPintFlavours, getShop } from "@/lib/content";

export const metadata: Metadata = {
  title: "Order pints",
  description: "Order 473 mL pints of Whistler Lucia Gelato and sorbet for pickup at our Base II kitchen.",
};

const groups = [
  { title: "Gelato", filter: (style: string) => style === "Gelato" },
  { title: "Dairy-free gelato", filter: (style: string) => style === "Dairy-free gelato" },
  { title: "Sorbet", filter: (style: string) => style === "Sorbet" },
];

export default async function PintsPage() {
  const [pintFlavours, shop] = await Promise.all([getPintFlavours(), getShop()]);
  const sections = groups
    .map((g) => ({ ...g, flavours: pintFlavours.filter((f) => g.filter(f.style)) }))
    .filter((g) => g.flavours.length > 0);
  return (
    <>
      <section className="pt-16 pb-10 sm:pt-24">
        <Container>
          <PageHeading
            eyebrow="Order · Pints"
            title="Pints for pickup"
            intro={`Pick your flavours, choose a pickup date at checkout (from ${shop.pintLeadDays} days out), and collect from ${shop.pickupWhere}.`}
          >
            <nav aria-label="Pint categories" className="mt-8 flex flex-wrap justify-center gap-2">
              {sections.map((g) => (
                <a
                  key={g.title}
                  href={`#${g.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-full bg-mist px-4 py-2 font-ui text-sm font-bold text-lake-deep hover:bg-alpine"
                >
                  {g.title}
                </a>
              ))}
            </nav>
          </PageHeading>
        </Container>
      </section>

      {sections.map((group) => {
        const flavours = group.flavours;
        return (
          <section
            key={group.title}
            id={group.title.toLowerCase().replace(/\s+/g, "-")}
            className="scroll-mt-24 py-10"
            aria-labelledby={`${group.title}-heading`}
          >
            <Container>
              <h2 id={`${group.title}-heading`} className="display text-4xl text-lakeside">
                {group.title}
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {flavours.map((f) => (
                  <PintCard key={f.slug} flavour={f} price={shop.pintPrice} />
                ))}
              </div>
            </Container>
          </section>
        );
      })}

      <section className="py-10">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 rounded-blob bg-blush p-8 text-center sm:flex-row sm:text-left">
            <div>
              <p className="subhead text-2xl text-berry">Feeding a crowd?</p>
              <p className="mt-1 text-ink/80">A gelato cake serves 8–12 and is made to order just for you.</p>
            </div>
            <Link href="/order/cakes" className="btn btn-berry shrink-0">
              Build a cake
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
