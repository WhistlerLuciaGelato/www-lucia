import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/data/site";
import { getSiteSettings } from "@/lib/content";
import { phoneHref } from "@/lib/format";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

// Footer link columns, in the order shown in the design.
const columns = [
  ["/find-us", "/our-gelato", "/wholesale"],
  ["/order", "/events", "/about"],
].map((hrefs) => hrefs.map((href) => nav.find((n) => n.href === href)!));

export async function Footer() {
  const { contact } = await getSiteSettings();
  return (
    <footer className="mt-24 bg-petal text-sm tracking-[0.02em] text-black">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-12 sm:grid-cols-2 sm:px-8 lg:flex lg:justify-center lg:gap-16 lg:py-[4.375rem]">
        <address className="not-italic leading-normal lg:w-[17.625rem]">
          <p className="font-bold">Our kitchen at Base II</p>
          <p>{contact.kitchenStreet}</p>
          <p>{contact.kitchenCity}</p>
          <p className="mt-[1.2em]">
            <a href={`mailto:${contact.email}`} className="hover:underline">
              {contact.email}
            </a>
          </p>
          <p>
            <a href={phoneHref(contact.phone)} className="hover:underline">
              {contact.phone}
            </a>
          </p>
          <p className="mt-[1.2em]">
            <a href={contact.instagramUrl} className="hover:underline">
              <span className="font-bold">Instagram</span>
              <br />
              {contact.instagramHandle}
            </a>
          </p>
        </address>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 lg:w-[17.625rem]">
          {columns.map((column, i) => (
            <ul key={i} className="space-y-[1.2em]">
              {column.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="font-bold hover:underline">
                    {item.label}
                  </Link>
                  {item.children?.length ? (
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="hover:underline">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
              {i === 1 ? (
                <li>
                  <Link href="/contact" className="font-bold hover:underline">
                    Contact us
                  </Link>
                </li>
              ) : null}
            </ul>
          ))}
        </nav>

        <div className="lg:w-64">
          <p className="font-heading text-lg leading-[1.05] font-bold text-coral">
            New flavours, trailer sightings &amp; Lucia&rsquo;s latest adventures.
          </p>
          <p className="mt-[1.2em] text-coral">A few emails a season. No spam, just gelato.</p>
          <NewsletterForm />
        </div>

        <Image
          src="/brand/made-on-the-mountain-badge.webp"
          alt="Made on the Mountain"
          width={228}
          height={228}
          className="h-40 w-40 sm:h-[14.25rem] sm:w-[14.25rem]"
        />
      </div>
      <p className="border-t border-alpenglow/60 px-4 py-4 text-center text-xs text-black/70">
        © {process.env.NEXT_PUBLIC_BUILD_YEAR} {site.name}. Locally crafted since 2007.
      </p>
    </footer>
  );
}
