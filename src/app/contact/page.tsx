import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Bear, Container, PageHeading } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with Whistler Lucia Gelato — email, phone, kitchen address and contact form.",
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-16 pb-12 sm:pt-24">
        <Container>
          <PageHeading
            eyebrow="Contact us"
            title="Say hello"
            intro="Questions, custom orders, collaborations or flavour requests — drop us a line."
          />
        </Container>
      </section>
      <section>
        <Container className="grid gap-6 lg:grid-cols-3">
          <aside className="space-y-5">
            <div className="rounded-blob bg-lake-deep p-7 text-snow">
              <p className="eyebrow text-alpine">Email</p>
              <a
                href={`mailto:${site.email}`}
                className="subhead mt-2 block text-xl break-all underline-offset-4 hover:underline"
              >
                {site.email}
              </a>
              <p className="eyebrow mt-6 text-alpine">Phone</p>
              <a
                href={site.phoneHref}
                className="subhead mt-2 block text-xl underline-offset-4 hover:underline"
              >
                {site.phone}
              </a>
              <p className="eyebrow mt-6 text-alpine">Instagram</p>
              <a
                href={site.instagram}
                className="subhead mt-2 block text-xl underline-offset-4 hover:underline"
              >
                {site.instagramHandle}
              </a>
            </div>
            <div className="relative overflow-hidden rounded-blob bg-alpine p-7">
              <p className="eyebrow text-lake-deep">Kitchen</p>
              <address className="mt-2 font-ui not-italic text-ink">
                {site.kitchen.street}
                <br />
                {site.kitchen.city}
              </address>
              <p className="eyebrow mt-6 text-lake-deep">Mailing address</p>
              <address className="mt-2 font-ui not-italic text-ink">
                {site.mailing.street}
                <br />
                {site.mailing.city}
              </address>
              <Bear name="bike" className="absolute right-4 bottom-4 w-16" />
            </div>
          </aside>
          <div className="rounded-[3rem] bg-white p-6 shadow-soft ring-1 ring-alpine/60 sm:p-10 lg:col-span-2">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
