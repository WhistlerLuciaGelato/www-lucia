import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bear, Container, PageHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Since 2007, Whistler Lucia Gelato has been whipping up small-batch gelato and sorbets at our kitchen in Base II — the only frozen treats made right here in Whistler.",
};

const pillars = [
  {
    title: "Made here",
    body: "Since 2007, we've been whipping up small-batch gelato and sorbets at our kitchen in Base II — the only frozen treats made right here in Whistler.",
    bg: "bg-alpine",
  },
  {
    title: "Sea to Sky sourced",
    body: "We source ingredients from the Sea to Sky, celebrate the community that shaped us, and never forget where we come from.",
    bg: "bg-blush",
  },
  {
    title: "Powered by adventure",
    body: "Inspired by the peaks and powered by a love of adventure, our gelato is playful, handmade, and full of local flavour.",
    bg: "bg-peach",
  },
  {
    title: "Just like Whistler",
    body: "For us, gelato isn't just dessert — it's an experience. Bold, joyful, a little whimsical.",
    bg: "bg-light-green",
  },
];

const bears = ["bike", "kayak", "snowboard-pink", "hiker", "zipline", "ski-touring", "bmx", "whitewater"];

export default function AboutPage() {
  return (
    <>
      <section className="pt-16 pb-12 sm:pt-24">
        <Container>
          <PageHeading
            eyebrow="About us"
            title="Proudly local, since 2007"
            tone="strawberry"
            intro="It all started with a trip to Italy."
          />
        </Container>
      </section>

      <section>
        <Container>
          <div className="grid items-center gap-12 rounded-[4rem] bg-snow lg:grid-cols-2">
            <div className="relative mx-auto w-full max-w-md">
              <Image
                src="/photos/skiers-cones.webp"
                alt="Friends sharing Lucia gelato on the mountain"
                width={1200}
                height={1833}
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="aspect-[4/5] w-full rounded-[3rem] object-cover shadow-soft"
              />
              <Image
                src="/brand/since-2007-badge.svg"
                alt=""
                aria-hidden
                width={160}
                height={160}
                className="absolute -right-6 -bottom-8 h-36 w-36 rotate-6 rounded-full bg-snow p-2 shadow-soft"
              />
            </div>
            <div className="prose-lucia text-lg leading-relaxed text-ink/85">
              <h2 className="subhead text-3xl text-lakeside">How we started</h2>
              <p className="mt-4">
                The idea for Lucia Gelato started during our travels, where we discovered the simple pleasure
                of stopping for gelato — whether after a long day outside, exploring new places, or just
                enjoying the moment.
              </p>
              <p>
                Those experiences stayed with us. Back in Whistler, we kept thinking about how to bring that
                same feeling here: something simple, high-quality, and enjoyable for everyone.
              </p>
              <p>
                That curiosity led us to learn more about gelato, from traditional techniques to the
                importance of fresh, natural ingredients. Inspired by the Italian approach, we make gelato and
                sorbetto in a true artisan style — honest, clean, and full of flavour.
              </p>
              <h2 className="subhead pt-6 text-3xl text-lakeside">Our commitment</h2>
              <p className="mt-4">
                Lucia Gelato is about more than ice cream. It&rsquo;s about creating something that fits the
                Whistler lifestyle, whether you&rsquo;re finishing a bike ride, skiing, or simply enjoying a
                sunny afternoon. We hope every scoop brings a little of that experience: quality ingredients,
                craftsmanship, and good moments.
              </p>
              <p className="subhead pt-2 text-2xl text-strawberry">Ciao, Tancrede &amp; Team Lucia</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <li key={p.title} className={`rounded-blob p-7 ${p.bg}`}>
                <h2 className="subhead text-2xl text-ink">{p.title}</h2>
                <p className="mt-3 leading-relaxed text-ink/80">{p.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-[#1f3b4a] py-20 text-snow sm:py-28">
        <Image
          src="/bears/ski-jump-white.png"
          alt=""
          aria-hidden
          width={616}
          height={560}
          className="pointer-events-none absolute -top-6 -left-10 w-64 opacity-90 sm:w-96"
        />
        <Container className="relative">
          <div className="ml-auto max-w-xl">
            <p className="eyebrow text-alpine">Living the Whistler lifestyle</p>
            <h2 className="display mt-4 text-5xl sm:text-6xl">Meet Lucia</h2>
            <div className="prose-lucia mt-6 text-lg leading-relaxed text-snow/90">
              <p>
                Lucia is no ordinary bear. She&rsquo;s a Whistler bear — and our beloved mascot. No matter the
                season, you can find her eating a cone anywhere: on the slopes, at the pump track, or at one
                of her favourite lakeside spots.
              </p>
              <p>
                She&rsquo;s a true local, just like us. Every new flavour is a chance for Lucia to try a new
                mountainside adventure — look for her on every pint.
              </p>
            </div>
          </div>
        </Container>
        <Container className="relative mt-14">
          <ul className="flex flex-wrap items-end justify-center gap-6 rounded-[3rem] bg-snow p-8">
            {bears.map((b) => (
              <li key={b}>
                <Bear name={b} className="h-20 w-auto sm:h-24" />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-20">
        <Container className="text-center">
          <h2 className="display text-4xl text-lakeside sm:text-5xl">Come say hi</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink/80">
            Questions, ideas, or a flavour you&rsquo;re dreaming of? We&rsquo;d love to hear from you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">
              Contact us
            </Link>
            <Link href="/find-us" className="btn btn-ghost">
              Find Lucia
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
