import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Bear, Container, PageHeading } from "@/components/ui";
import { getSiteSettings } from "@/lib/content";
import { phoneHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with Whistler Lucia Gelato — email, phone, kitchen address and contact form.",
};

export default async function ContactPage() {
  const { contact } = await getSiteSettings();
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
                href={`mailto:${contact.email}`}
                className="subhead mt-2 block text-xl break-all underline-offset-4 hover:underline"
              >
                {contact.email}
              </a>
              <p className="eyebrow mt-6 text-alpine">Phone</p>
              <a
                href={phoneHref(contact.phone)}
                className="subhead mt-2 block text-xl underline-offset-4 hover:underline"
              >
                {contact.phone}
              </a>
              <p className="eyebrow mt-6 text-alpine">Instagram</p>
              <a
                href={contact.instagramUrl}
                className="subhead mt-2 block text-xl underline-offset-4 hover:underline"
              >
                {contact.instagramHandle}
              </a>
            </div>
            <div className="relative overflow-hidden rounded-blob bg-alpine p-7">
              <p className="eyebrow text-lake-deep">Kitchen</p>
              <address className="mt-2 font-ui not-italic text-ink">
                {contact.kitchenStreet}
                <br />
                {contact.kitchenCity}
              </address>
              <p className="eyebrow mt-6 text-lake-deep">Mailing address</p>
              <address className="mt-2 font-ui not-italic text-ink">
                {contact.mailingStreet}
                <br />
                {contact.mailingCity}
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
