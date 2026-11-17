import type { Metadata } from "next";
import { CartView } from "@/components/shop/CartView";
import { Container } from "@/components/ui";
import { getCatalogue, getSiteSettings } from "@/lib/content";
import { getPageContent } from "@/lib/page-content";
import { orderPage } from "@/data/pages/order";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

export default async function CartPage() {
  const [catalogue, settings, { cart }] = await Promise.all([
    getCatalogue(),
    getSiteSettings(),
    getPageContent("orderPage", orderPage),
  ]);
  return (
    <section className="pt-16 sm:pt-20">
      <Container>
        <h1 className="display text-center text-5xl text-lakeside sm:text-6xl">{cart.title}</h1>
        <div className="mt-12">
          <CartView catalogue={catalogue} contactEmail={settings.contact.email} content={cart} />
        </div>
      </Container>
    </section>
  );
}
