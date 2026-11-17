import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bear, Container, PageHeading } from "@/components/ui";
import { Rich, paragraphs } from "@/components/Rich";
import { getPageContent } from "@/lib/page-content";
import { aboutPage } from "@/data/pages/about";

/** The bubbles under the story: a pale brand colour with its darker shade for the text. */
const pillars = [
  { key: "madeHere", bg: "bg-alpine text-lakeside" },
  { key: "seaToSky", bg: "bg-blush text-strawberry" },
  { key: "adventure", bg: "bg-peach text-heatwave" },
  { key: "whistler", bg: "bg-light-green text-grass" },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const { metaDescription } = await getPageContent("aboutPage", aboutPage);
  return { title: "Our story", description: metaDescription };
}

const bears = ["bike", "kayak", "snowboard-pink", "hiker", "zipline", "ski-touring", "bmx", "whitewater"];

export default async function AboutPage() {
  const { heading, story, pillars: bubbles, lucia, sayHi } = await getPageContent("aboutPage", aboutPage);
  return (
    <>
      <section className="pt-16 pb-12 sm:pt-24">
        <Container>
          <PageHeading eyebrow={heading.eyebrow} title={heading.title} tone="strawberry" intro={heading.intro} />
        </Container>
      </section>

      <section>
        <Container>
          <div className="grid items-center gap-12 rounded-[4rem] bg-snow lg:grid-cols-2">
            <div className="relative mx-auto w-full max-w-md">
              <Image
                src={story.photo.src}
                alt={story.photo.alt}
                width={story.photo.width}
                height={story.photo.height}
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
              <h2 className="subhead text-3xl text-lakeside">{story.startedTitle}</h2>
              {paragraphs(story.started).map((p, i) => (
                <p key={p} className={i === 0 ? "mt-4" : undefined}>
                  <Rich text={p} />
                </p>
              ))}
              <h2 className="subhead pt-6 text-3xl text-lakeside">{story.commitmentTitle}</h2>
              {paragraphs(story.commitment).map((p, i) => (
                <p key={p} className={i === 0 ? "mt-4" : undefined}>
                  <Rich text={p} />
                </p>
              ))}
              <p className="subhead pt-2 text-2xl text-strawberry">{story.signOff}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              // Each bubble's text is the darker shade of its own colour (brand guidelines).
              <li key={p.key} className={`rounded-[1.875rem] p-7 ${p.bg}`}>
                <h2 className="subhead text-2xl">{bubbles[p.key].title}</h2>
                <p className="mt-3 leading-relaxed">{bubbles[p.key].body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-lakeside py-20 text-snow sm:py-28">
        <Image
          src={lucia.illustration.src}
          alt={lucia.illustration.alt}
          aria-hidden={lucia.illustration.alt ? undefined : true}
          width={lucia.illustration.width}
          height={lucia.illustration.height}
          className="pointer-events-none absolute -top-6 -left-10 w-64 opacity-90 sm:w-96"
        />
        <Container className="relative">
          <div className="ml-auto max-w-xl">
            <p className="eyebrow text-alpine">{lucia.eyebrow}</p>
            <h2 className="display mt-4 text-5xl sm:text-6xl">{lucia.title}</h2>
            <div className="prose-lucia mt-6 text-lg leading-relaxed text-snow/90">
              {paragraphs(lucia.body).map((p) => (
                <p key={p}>
                  <Rich text={p} />
                </p>
              ))}
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
          <h2 className="display text-4xl text-lakeside sm:text-5xl">{sayHi.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink/80">{sayHi.intro}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">
              {sayHi.contactLabel}
            </Link>
            <Link href="/find-us" className="btn btn-sky">
              {sayHi.findUsLabel}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
