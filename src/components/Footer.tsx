import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { siteText } from "@/data/pages/site-text";
import { getSiteSettings } from "@/lib/content";
import { getPageContent } from "@/lib/page-content";
import { phoneHref } from "@/lib/format";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { siteNav } from "@/components/Header";

// Footer link columns, in the order shown in the design.
const columnHrefs = [
  ["/find-us", "/our-gelato", "/wholesale"],
  ["/order", "/events", "/about"],
];

export async function Footer() {
  const [{ contact }, { menu, footer, newsletter }] = await Promise.all([
    getSiteSettings(),
    getPageContent("siteText", siteText),
  ]);
  const nav = siteNav(menu);
  const columns = columnHrefs.map((hrefs) => hrefs.map((href) => nav.find((n) => n.href === href)!));
  return (
    <footer className="relative mt-24 bg-petal text-base tracking-[0.02em] text-black lg:text-lg">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-12 sm:grid-cols-2 sm:px-8 lg:flex lg:justify-center lg:gap-14 lg:py-24">
        <address className="not-italic leading-normal lg:w-[16rem]">
          <p className="font-bold">{footer.kitchenHeading}</p>
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
              <span className="font-bold">{footer.instagramLabel}</span>
              <br />
              {contact.instagramHandle}
            </a>
          </p>
        </address>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 lg:w-[26rem]">
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
                    {menu.about.contact}
                  </Link>
                </li>
              ) : null}
            </ul>
          ))}
        </nav>

        <div className="lg:w-80">
          <p className="font-heading text-2xl leading-[1.05] font-bold text-strawberry">
            {newsletter.heading}
          </p>
          <p className="mt-[1.2em] text-strawberry">{newsletter.intro}</p>
          <NewsletterForm buttonLabel={newsletter.buttonLabel} success={newsletter.success} />
        </div>

        <Image
          src="/brand/made-on-the-mountain-badge.svg"
          alt="Made on the Mountain"
          width={288}
          height={288}
          className="h-48 w-48 sm:h-[18rem] sm:w-[18rem]"
        />
      </div>
      <p className="border-t border-alpenglow/60 px-4 py-5 text-center text-sm text-black/70">
        © {process.env.NEXT_PUBLIC_BUILD_YEAR} {site.name}. Locally crafted since 2007.
      </p>
    </footer>
  );
}
