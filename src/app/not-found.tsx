import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";
import { Bear, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="pt-20">
        <Container className="text-center">
          <Bear name="snowmobile" className="mx-auto w-48" />
          <h1 className="display mt-8 text-5xl text-lakeside sm:text-6xl">Off-piste!</h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-ink/80">
            Lucia went looking, but this page has melted away.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              Back home
            </Link>
            <Link href="/find-us" className="btn btn-ghost">
              Find gelato
            </Link>
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
