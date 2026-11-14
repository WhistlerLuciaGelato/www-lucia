import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ClearCart } from "@/components/shop/ClearCart";
import { Bear, Container } from "@/components/ui";
import { getShop, getSiteSettings } from "@/lib/content";
import { emailConfigured } from "@/lib/email";
import { money, phoneHref, prettyDate } from "@/lib/format";
import {
  describeCard,
  getSquareConfig,
  isDelivery,
  isPaid,
  orderRecipient,
  receiptUrls,
  retrieveOrder,
} from "@/lib/square";

export const metadata: Metadata = {
  title: "Thank you!",
  robots: { index: false },
};

async function OrderSummary({
  searchParams,
  pickupWindow,
}: {
  searchParams: Promise<{ order?: string }>;
  pickupWindow: string;
}) {
  const { order: orderId } = await searchParams;
  const square = getSquareConfig();
  if (!orderId || !square || !/^[\w-]{1,192}$/.test(orderId)) return null;

  const order = await retrieveOrder(square, orderId).catch(() => null);
  if (!order || order.location_id !== square.locationId || !isPaid(order)) return null;

  const pickupDate = order.metadata?.pickup_date;
  const email = orderRecipient(order)?.email_address;
  const delivery = isDelivery(order);
  // Streams in behind Suspense, so a short wait for the receipt doesn't hold up the page.
  const receipts = await receiptUrls(square, order, 5_000);
  return (
    <div className="mx-auto mt-10 max-w-lg rounded-blob bg-white p-7 text-left shadow-soft ring-1 ring-alpine/60">
      {pickupDate ? (
        <p className="font-ui">
          <span className="block text-sm text-ink/70">{delivery ? "Delivery" : "Pickup"}</span>
          <span className="text-lg font-extrabold text-ink">
            {delivery ? prettyDate(pickupDate) : `${prettyDate(pickupDate)}, ${pickupWindow}`}
          </span>
          {delivery && order.metadata?.delivery_address ? (
            <span className="block text-sm text-ink/70">
              To {order.metadata.delivery_address}. Your gelato is freshly prepared for our weekly Thursday
              delivery; we&rsquo;ll be in touch to arrange a time on the day.
            </span>
          ) : null}
        </p>
      ) : null}
      <ul className="mt-5 divide-y divide-alpine border-y border-alpine font-ui">
        {order.line_items?.map((li, i) => (
          <li key={li.uid ?? i} className="flex justify-between gap-3 py-3">
            <span>
              {li.quantity} × {li.name}
              {li.note ? <span className="block text-sm text-ink/70">{li.note}</span> : null}
            </span>
            {/* Pre-tax, so the lines plus the GST row below add up to the total. */}
            <span className="font-bold">
              {money(
                li.gross_sales_money?.amount ??
                  (li.total_money?.amount ?? 0) - (li.total_tax_money?.amount ?? 0),
              )}
            </span>
          </li>
        ))}
      </ul>
      {order.service_charges?.map((c, i) => (
        <p key={i} className="mt-4 flex justify-between font-ui text-sm text-ink/70">
          <span>{c.name ?? "Delivery"}</span>
          <span>{money(c.amount_money?.amount ?? 0)}</span>
        </p>
      ))}
      {order.total_tax_money?.amount ? (
        <p className="mt-4 flex justify-between font-ui text-sm text-ink/70">
          <span>GST</span>
          <span>{money(order.total_tax_money.amount)}</span>
        </p>
      ) : null}
      <p className="mt-4 flex justify-between font-ui text-lg font-extrabold">
        <span>Total paid</span>
        <span>{money(order.total_money?.amount ?? 0)}</span>
      </p>
      {(order.tenders?.length ?? 0) > 1 ||
      order.tenders?.some((t) => t.card_details?.card?.card_brand === "SQUARE_GIFT_CARD") ? (
        <ul className="mt-2 space-y-1 font-ui text-sm text-ink/70">
          {order.tenders?.map((t, i) => (
            <li key={t.id ?? i} className="flex justify-between">
              <span>{describeCard(t.card_details)}</span>
              <span>{money(t.amount_money?.amount ?? 0)}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {receipts.length > 0 ? (
        <p className="mt-4 flex flex-wrap gap-x-4 font-ui text-sm">
          {receipts.map((url, i) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-lake-deep underline underline-offset-2"
            >
              View your receipt{receipts.length > 1 ? ` ${i + 1}` : ""}
            </a>
          ))}
        </p>
      ) : null}
      {email ? (
        <p className="mt-3 font-ui text-sm text-ink/70">
          {emailConfigured() ? (
            <>
              We&rsquo;ve emailed a confirmation to {email}, and we&rsquo;ll be in touch there if anything
              changes.
            </>
          ) : (
            <>We&rsquo;ll be in touch at {email} if anything changes.</>
          )}
        </p>
      ) : null}
    </div>
  );
}

export default async function SuccessPage({ searchParams }: PageProps<"/order/success">) {
  const [shop, { contact }] = await Promise.all([getShop(), getSiteSettings()]);
  return (
    <section className="pt-16 sm:pt-24">
      <Container className="text-center">
        <ClearCart />
        <Bear name="ski-jump" className="mx-auto w-40" />
        <h1 className="display mt-6 text-5xl text-strawberry sm:text-6xl">Thank you!</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/85">Your order is in and Lucia is on it.</p>
        <Suspense fallback={null}>
          <OrderSummary
            searchParams={searchParams as Promise<{ order?: string }>}
            pickupWindow={shop.pickupWindow}
          />
        </Suspense>
        <p className="mt-10 font-ui text-ink/80">
          Questions or need to change something? Email{" "}
          <a
            href={`mailto:${contact.email}`}
            className="font-bold text-lake-deep underline underline-offset-2"
          >
            {contact.email}
          </a>{" "}
          or call{" "}
          <a
            href={phoneHref(contact.phone)}
            className="font-bold text-lake-deep underline underline-offset-2"
          >
            {contact.phone}
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
