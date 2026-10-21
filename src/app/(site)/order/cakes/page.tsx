import type { Metadata } from "next";
import { CakeBuilder } from "@/components/shop/CakeBuilder";
import { Container, PageHeading } from "@/components/ui";
import { getShop } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gelato cakes",
  description:
    "Custom gelato cakes for birthdays, weddings and special moments. Choose your size, base and flavours — made to order in Whistler.",
};

export default async function CakesPage() {
  const shop = await getShop();
  return (
    <>
      <section className="pt-16 pb-12 sm:pt-24">
        <Container>
          <PageHeading
            eyebrow="Order · Gelato cakes"
            title="Make it a cake"
            tone="strawberry"
            intro={`Custom-made for birthdays, weddings and special moments. Two layers of gelato or sorbet on your choice of base — made to order with ${shop.cakeLeadDays} days' notice.`}
          />
        </Container>
      </section>
      <section>
        <Container>
          <CakeBuilder shop={shop} />
        </Container>
      </section>
    </>
  );
}
