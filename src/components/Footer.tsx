import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/data/site";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Container, Mountains } from "@/components/ui";

export function Footer() {
  return (
    <footer className="mt-24">
      <Mountains className="-mb-px" />
      <div className="bg-mist">
        <Container className="grid gap-5 py-12 lg:grid-cols-12">
          <div className="rounded-blob bg-lake-deep p-8 text-snow lg:col-span-4">
            <Image
              src="/brand/logo.svg"
              alt="Whistler Lucia Gelato"
              width={180}
              height={76}
              className="h-16 w-auto rounded-2xl bg-snow p-2"
            />
            <address className="mt-6 not-italic leading-relaxed">
              <p className="font-bold">{site.kitchen.label}</p>
              <p>{site.kitchen.street}</p>
              <p>{site.kitchen.city}</p>
              <p className="mt-4">
                <a
                  href={`mailto:${site.email}`}
                  className="underline decoration-2 underline-offset-4 hover:decoration-snow/50"
                >
                  {site.email}
                </a>
              </p>
              <p>
                <a
                  href={site.phoneHref}
                  className="underline decoration-2 underline-offset-4 hover:decoration-snow/50"
                >
                  {site.phone}
                </a>
              </p>
              <p className="mt-4">
                <a
                  href={site.instagram}
                  className="underline decoration-2 underline-offset-4 hover:decoration-snow/50"
                >
                  Instagram {site.instagramHandle}
                </a>
              </p>
            </address>
          </div>

          <nav aria-label="Footer" className="rounded-blob bg-snow p-8 lg:col-span-4">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-6">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="subhead text-xl text-lakeside hover:text-lake-deep">
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="mt-1.5 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="font-ui text-sm text-ink/80 hover:text-lake-deep hover:underline"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative overflow-hidden rounded-blob bg-strawberry p-8 lg:col-span-4">
            <p className="subhead text-3xl text-[#4a1418]">
              New flavours, trailer sightings &amp; Lucia&rsquo;s latest adventures
            </p>
            <p className="mt-3 font-ui text-[#3d1416]">A few emails a season. No spam, just gelato.</p>
            <NewsletterForm />
            <Image
              src="/brand/made-on-the-mountain.svg"
              alt="Made on the Mountain"
              width={140}
              height={140}
              className="mt-6 ml-auto h-28 w-28 rounded-full bg-snow p-1.5"
            />
          </div>
        </Container>
        <Container className="flex flex-col items-center justify-between gap-2 pb-10 font-ui text-sm text-ink/70 sm:flex-row">
          <p>
            © {process.env.NEXT_PUBLIC_BUILD_YEAR} {site.name}. Locally crafted since 2007.
          </p>
          <p>Made on the Mountain in Whistler, BC.</p>
        </Container>
      </div>
    </footer>
  );
}
