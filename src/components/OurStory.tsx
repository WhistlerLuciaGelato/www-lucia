import Image from "next/image";
import Link from "next/link";

/** "Inspired by Italy, made in Whistler" panel linking to the About page (home and Find us). */
export function OurStory() {
  return (
    <section className="px-4 sm:px-8">
      <div className="mx-auto grid max-w-[72.5rem] items-center gap-10 rounded-[3.5rem] bg-mist p-6 sm:p-[2.9375rem] lg:grid-cols-[22.2rem_1fr] lg:rounded-[6.25rem] lg:gap-0">
        <div className="relative mx-auto aspect-[355/500] w-full max-w-[22.2rem] overflow-hidden rounded-[5.25rem]">
          <Image
            src="/home/story-skiers.webp"
            alt="Two skiers sharing a Lucia gelato cone on the mountain"
            width={900}
            height={1375}
            sizes="(min-width: 1024px) 355px, 90vw"
            className="h-full w-full object-cover object-[50%_35%]"
          />
        </div>
        <div className="mx-auto flex max-w-[37rem] flex-col items-center pb-6 text-center lg:py-8">
          <p className="eyebrow !text-lg text-bluebird lg:!text-xl">Our story</p>
          <h2 className="display mt-10 text-5xl leading-[1.05] text-lakeside sm:text-[3.75rem]">
            Inspired by Italy, made in Whistler
          </h2>
          <p className="mt-6 max-w-[31rem] text-base tracking-[0.02em] text-lakeside">
            Lucia Gelato&rsquo;s story began in Italy, inspired by the simple pleasure of stopping for a scoop
            of gelato along the way. A little pause after exploring, a chance to soak in somewhere new, or a
            sweet treat after a day of adventure. The idea was simple: to bring a little bit of that Italian
            feeling back to Whistler.
          </p>
          <Link href="/about" className="btn btn-primary mt-14">
            Read more…
          </Link>
        </div>
      </div>
    </section>
  );
}
