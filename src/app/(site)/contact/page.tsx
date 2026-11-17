import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Bear, Container, PageHeading } from "@/components/ui";
import { getSiteSettings } from "@/lib/content";
import { phoneHref } from "@/lib/format";
import { getPageContent } from "@/lib/page-content";
import { contactPage } from "@/data/pages/contact";

export async function generateMetadata(): Promise<Metadata> {
  const { metaDescription } = await getPageContent("contactPage", contactPage);
  return { title: "Contact us", description: metaDescription };
}

export default async function ContactPage() {
  const [{ contact }, { heading, details, form }] = await Promise.all([
    getSiteSettings(),
    getPageContent("contactPage", contactPage),
  ]);
  return (
    <>
      <section className="pt-16 pb-12 sm:pt-24">
        <Container>
          <PageHeading eyebrow={heading.eyebrow} title={heading.title} intro={heading.intro} />
        </Container>
      </section>
      <section>
        <Container className="grid gap-6 lg:grid-cols-3">
          <aside className="space-y-5">
            <div className="rounded-blob bg-lake-deep p-7 text-snow">
              <p className="eyebrow text-alpine">{details.emailLabel}</p>
              <a
                href={`mailto:${contact.email}`}
                className="subhead mt-2 block text-xl break-all underline-offset-4 hover:underline"
              >
                {contact.email}
              </a>
              <p className="eyebrow mt-6 text-alpine">{details.phoneLabel}</p>
              <a
                href={phoneHref(contact.phone)}
                className="subhead mt-2 block text-xl underline-offset-4 hover:underline"
              >
                {contact.phone}
              </a>
              <p className="eyebrow mt-6 text-alpine">{details.instagramLabel}</p>
              <a
                href={contact.instagramUrl}
                className="subhead mt-2 block text-xl underline-offset-4 hover:underline"
              >
                {contact.instagramHandle}
              </a>
            </div>
            <div className="relative overflow-hidden rounded-blob bg-alpine p-7">
              <p className="eyebrow text-lake-deep">{details.kitchenLabel}</p>
              <address className="mt-2 font-ui not-italic text-ink">
                {contact.kitchenStreet}
                <br />
                {contact.kitchenCity}
              </address>
              <p className="eyebrow mt-6 text-lake-deep">{details.mailingLabel}</p>
              <address className="mt-2 font-ui not-italic text-ink">
                {contact.mailingStreet}
                <br />
                {contact.mailingCity}
              </address>
              <Bear name="bike" className="absolute right-4 bottom-4 w-16" />
            </div>
          </aside>
          <div className="rounded-[3rem] bg-white p-6 shadow-soft ring-1 ring-alpine/60 sm:p-10 lg:col-span-2">
            <ContactForm copy={form} />
          </div>
        </Container>
      </section>
    </>
  );
}
