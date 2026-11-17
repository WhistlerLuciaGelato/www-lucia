import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";
import { Bear, Container } from "@/components/ui";
import { siteText } from "@/data/pages/site-text";
import { getPageContent } from "@/lib/page-content";

export default async function NotFound() {
  const { notFound } = await getPageContent("siteText", siteText);
  return (
    <SiteChrome>
      <section className="pt-20">
        <Container className="text-center">
          <Bear name="snowmobile" className="mx-auto w-48" />
          <h1 className="display mt-8 text-5xl text-lakeside sm:text-6xl">{notFound.title}</h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-ink/80">{notFound.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              {notFound.homeLabel}
            </Link>
            <Link href="/find-us" className="btn btn-sky">
              {notFound.findUsLabel}
            </Link>
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
