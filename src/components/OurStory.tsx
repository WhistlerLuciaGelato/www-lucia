import Image from "next/image";
import Link from "next/link";
import { Rich, paragraphs } from "@/components/Rich";
import type { HomePage } from "@/data/pages/home";

/** "Inspired by Italy, made in Whistler" panel linking to the About page (home page). */
export function OurStory({ story }: { story: HomePage["story"] }) {
  return (
    <section className="px-4 sm:px-8">
      <div className="mx-auto grid max-w-[79.625rem] overflow-hidden rounded-[1.25rem] bg-seafoam lg:min-h-[37.125rem] lg:grid-cols-[28.8125rem_1fr]">
        <div className="relative aspect-[4/3] lg:aspect-auto">
          <Image
            src={story.photo.src}
            alt={story.photo.alt}
            width={story.photo.width}
            height={story.photo.height}
            sizes="(min-width: 1024px) 461px, 100vw"
            className="absolute inset-0 h-full w-full object-cover object-[45%_30%]"
          />
        </div>
        <div className="mx-auto flex max-w-[37.125rem] flex-col items-center px-6 py-12 text-center lg:pt-[4.5rem] lg:pb-14">
          <p className="eyebrow !text-xl text-bluebird">{story.eyebrow}</p>
          <h2 className="display mt-10 text-5xl text-lakeside sm:text-[3.75rem] lg:mt-[3.25rem]">
            {story.title}
          </h2>
          <div className="mt-6 max-w-[35.1875rem] text-lg tracking-[0.02em] text-lakeside">
            {paragraphs(story.body).map((p) => (
              <p key={p}>
                <Rich text={p} />
              </p>
            ))}
          </div>
          <Link
            href="/about"
            className="mt-6 border-b-[3px] border-lakeside pb-0.5 font-heading text-lg font-bold tracking-[0.02em] text-lakeside italic hover:border-transparent"
          >
            {story.linkLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
