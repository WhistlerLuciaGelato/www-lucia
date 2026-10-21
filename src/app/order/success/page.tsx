import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ClearCart } from "@/components/shop/ClearCart";
import { Bear, Container } from "@/components/ui";
import { pickup } from "@/data/shop";
import { site } from "@/data/site";
import { money, prettyDate } from "@/lib/format";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Thank you!",
  robots: { index: false },
};

async function OrderSummary({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  const stripe = getStripe();
  if (!sessionId || !stripe || !sessionId.startsWith("cs_")) return null;

  const session = await stripe.checkout.sessions
    .retrieve(sessionId, { expand: ["line_items"] })
    .catch(() => null);
  if (!session || session.payment_status !== "paid") return null;
  {
    const pickupDate = session.metadata?.pickup_date;
    return (
      <div className="mx-auto mt-10 max-w-lg rounded-blob bg-white p-7 text-left shadow-soft ring-1 ring-alpine/60">
        {pickupDate ? (
          <p className="font-ui">
            <span className="block text-sm text-ink/70">Pickup</span>
            <span className="text-lg font-extrabold text-ink">
              {prettyDate(pickupDate)}, {pickup.window}
            </span>
          </p>
        ) : null}
        <ul className="mt-5 divide-y divide-alpine border-y border-alpine font-ui">
          {session.line_items?.data.map((li) => (
            <li key={li.id} className="flex justify-between gap-3 py-3">
              <span>
                {li.quantity} × {li.description}
              </span>
              <span className="font-bold">{money(li.amount_total)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between font-ui text-lg font-extrabold">
          <span>Total paid</span>
          <span>{money(session.amount_total ?? 0)}</span>
        </p>
        {session.customer_details?.email ? (
          <p className="mt-3 font-ui text-sm text-ink/70">
            A receipt is on its way to {session.customer_details.email}.
          </p>
        ) : null}
      </div>
    );
  }
}

export default function SuccessPage({ searchParams }: PageProps<"/order/success">) {
  return (
    <section className="pt-16 sm:pt-24">
      <Container className="text-center">
        <ClearCart />
        <Bear name="ski-jump" className="mx-auto w-40" />
        <h1 className="display mt-6 text-5xl text-strawberry sm:text-6xl">Thank you!</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/85">
          Your order is in and Lucia is on it. We&rsquo;ll have everything ready at {pickup.where}.
        </p>
        <Suspense fallback={null}>
          <OrderSummary searchParams={searchParams as Promise<{ session_id?: string }>} />
        </Suspense>
        <p className="mt-10 font-ui text-ink/80">
          Questions or need to change something? Email{" "}
          <a href={`mailto:${site.email}`} className="font-bold text-lake-deep underline underline-offset-2">
            {site.email}
          </a>{" "}
          or call{" "}
          <a href={site.phoneHref} className="font-bold text-lake-deep underline underline-offset-2">
            {site.phone}
          </a>
          .
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Back home
        </Link>
      </Container>
    </section>
  );
}
