import Image from "next/image";
import Link from "next/link";
import { getPintFlavours } from "@/lib/content";
import { PintCard } from "@/components/shop/PintCard";
import { BackToTop } from "@/components/BackToTop";
import { SectionTiles } from "@/components/SectionTiles";

export default async function Home() {
  const pintFlavours = await getPintFlavours();
  const featured = pintFlavours.slice(0, 6);

  return (
    <>
      {/* Hero: full-bleed photo with a soft blue wash, copy bottom-left. */}
      <section className="relative isolate overflow-hidden bg-lakeside text-snow">
        <Image
          src="/home/hero-mango-cone.webp"
          alt="A mango sorbet cone held up against snowy mountains"
          width={2560}
          height={1707}
          priority
          sizes="(min-width: 1024px) 168vw, 100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[38%_center] lg:inset-auto lg:top-[calc(50%+3rem)] lg:left-0 lg:h-auto lg:w-[168%] lg:max-w-none lg:-translate-y-1/2"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 mix-blend-multiply"
          style={{
            backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(14,56,89,0.3) 72%)",
          }}
        />
        <div className="mx-auto flex min-h-[38rem] max-w-[90rem] flex-col justify-between px-4 pt-8 pb-14 sm:px-8 lg:h-[47.6875rem] lg:px-[6.25rem] lg:pt-[3.125rem] lg:pb-[6.25rem]">
          <p className="eyebrow !text-base sm:pl-2.5 lg:!text-xl">Locally crafted since 2007</p>
          <div className="max-w-[37.5rem]">
            <h1 className="display text-6xl [text-shadow:0_2px_16px_rgb(14_56_89/0.25)] sm:text-7xl lg:text-[5rem] lg:leading-[0.85]">
              Made on the Mountain
            </h1>
            <p className="mt-7 max-w-[25.625rem] text-base tracking-[0.02em] sm:pl-2.5">
              Small-batch gelato and sorbet, handmade in our kitchen at Base II — the only frozen treats made
              right here in Whistler.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 sm:ml-2 sm:gap-6">
              <Link href="/find-us" className="btn btn-sky min-w-[7.875rem]">
                Find us
              </Link>
              <Link href="/order" className="btn btn-blush min-w-[7.875rem]">
                Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Colourful section tiles with Lucia, drifting sideways. */}
      <SectionTiles />

      {/* Flavours */}
      <section className="bg-rose px-4 pt-16 pb-20 sm:px-8 lg:pt-[3.875rem] lg:pb-[4.5rem]">
        <h2 className="display mx-auto max-w-[37.5rem] text-center text-6xl text-strawberry sm:text-7xl lg:text-[5rem] lg:leading-[0.85]">
          Find your flavour
        </h2>
        <div className="mx-auto mt-12 grid max-w-[71rem] justify-items-center gap-x-[3.2rem] gap-y-10 sm:grid-cols-2 lg:mt-[4.25rem] lg:grid-cols-3 lg:items-start lg:gap-y-[4.25rem]">
          {featured.map((f) => (
            <PintCard key={f.slug} flavour={f} />
          ))}
        </div>
        <div className="mt-14 flex flex-wrap justify-center gap-4 lg:mt-[6.5rem] lg:gap-[1.875rem]">
          <Link href="/our-gelato" className="btn btn-berry">
            See all flavours
          </Link>
          <Link href="/order/pints" className="btn btn-ghost">
            Order pints for pickup
          </Link>
        </div>
      </section>

      {/* Where's Lucia? */}
      <section className="px-4 py-20 sm:px-8 lg:pt-[6.25rem] lg:pb-[7.5rem]">
        <div className="mx-auto grid max-w-[70.5rem] items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow !text-lg text-lakeside lg:!text-xl">Where&rsquo;s Lucia?</p>
            <h2 className="display mt-6 max-w-[37.5rem] text-6xl text-strawberry sm:text-7xl lg:mt-10 lg:text-[5rem] lg:leading-[0.85]">
              Find your next scoop or pint
            </h2>
            <div className="mt-12 max-w-[20rem] space-y-11 lg:mt-16">
              <div>
                <p className="text-base tracking-[0.02em] text-lakeside">
                  Craving a scoop? Discover our seasonal locations and local scoop partners.
                </p>
                <Link href="/find-us#map" className="btn btn-sky mt-3.5">
                  See the map
                </Link>
              </div>
              <div>
                <p className="text-base tracking-[0.02em] text-strawberry">
                  Explore our grocery stockists &amp; restaurant vendors throughout the Sea to Sky.
                </p>
                <Link href="/find-us#grocery" className="btn btn-blush mt-3.5">
                  See vendors
                </Link>
              </div>
            </div>
          </div>
          <Image
            src="/home/trailer-crew.webp"
            alt="The Lucia crew waving from the gelato trailer"
            width={1100}
            height={1100}
            sizes="(min-width: 1024px) 549px, 90vw"
            className="mx-auto aspect-square w-full max-w-[34.3125rem] lg:mr-0"
          />
        </div>
      </section>

      {/* Our story */}
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
              Lucia Gelato&rsquo;s story began in Italy, inspired by the simple pleasure of stopping for a
              scoop of gelato along the way. A little pause after exploring, a chance to soak in somewhere
              new, or a sweet treat after a day of adventure. The idea was simple: to bring a little bit of
              that Italian feeling back to Whistler.
            </p>
            <Link href="/about" className="btn btn-primary mt-14">
              Read more…
            </Link>
          </div>
        </div>
      </section>

      <BackToTop />
    </>
  );
}
