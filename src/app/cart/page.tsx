import type { Metadata } from "next";
import { CartView } from "@/components/shop/CartView";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <section className="pt-16 sm:pt-20">
      <Container>
        <h1 className="display text-center text-5xl text-lakeside sm:text-6xl">Your cart</h1>
        <div className="mt-12">
          <CartView />
        </div>
      </Container>
    </section>
  );
}
