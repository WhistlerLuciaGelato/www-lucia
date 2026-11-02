import Image from "next/image";
import Link from "next/link";
import { getPintFlavours } from "@/lib/content";
import { PintCard } from "@/components/shop/PintCard";
import { BackToTop } from "@/components/BackToTop";
import { OurStory } from "@/components/OurStory";
import { SectionTiles } from "@/components/SectionTiles";
import { Wave } from "@/components/Wave";

/** The flavour section's colour, for its wave edges. */
const PETAL = "#ffeee9";

const wheres = [
  {
    title: "Craving a scoop?",
    copy: "Discover our seasonal locations and local scoop partners.",
    href: "/find-us#map",
    cta: "See the map",
    icon: { src: "/find-us/icon-cone.svg", w: 27, h: 64, className: "h-[4.77rem]" },
    text: "text-lakeside",
    button: "btn-sky",
  },
  {
    title: "Fancy a pint?",
    copy: "Get pints at grocery stores around the Sea to Sky.",
    href: "/find-us#grocery",
    cta: "See stores",
    icon: { src: "/find-us/icon-basket-pink.svg", w: 70, h: 72, className: "h-[4.5rem]" },
    text: "text-strawberry",
    button: "btn-blush",
  },
  {
    title: "Where else?",
    copy: "Find Lucia at restaurants, hotels, and other vendors.",
    href: "/find-us#scoops",
    cta: "Other vendors",
    icon: { src: "/find-us/icon-cutlery.svg", w: 51, h: 65, className: "h-[4.05rem]" },
    text: "text-heatwave",
    button: "bg-peach text-heatwave",
  },
];

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
      <section className="relative bg-petal px-4 pt-16 pb-20 sm:px-8 lg:pt-[3.875rem] lg:pb-[5.5rem]">
        <Wave color={PETAL} className="absolute inset-x-0 -top-3.5" />
        <h2 className="display mx-auto max-w-[37.5rem] text-center text-6xl text-strawberry sm:text-7xl lg:text-[5rem] lg:leading-[0.85]">
          Find your flavour
        </h2>
        <div className="mx-auto mt-12 grid max-w-[71rem] justify-items-center gap-x-[3.2rem] gap-y-10 sm:grid-cols-2 lg:mt-[4.25rem] lg:grid-cols-3 lg:items-start lg:gap-y-[4.25rem]">
          {featured.map((f) => (
            <PintCard key={f.slug} flavour={f} framed />
          ))}
        </div>
        <div className="mt-14 flex flex-wrap justify-center gap-4 lg:mt-[4.5rem] lg:gap-[1.875rem]">
          <Link href="/order/pints" className="btn btn-berry">
            Order pints for pickup
          </Link>
          <Link href="/order/cakes" className="btn bg-alpenglow text-snow">
            Make it a cake
          </Link>
          <Link href="/wholesale#flavours" className="btn bg-bluebird text-snow">
            Wholesale flavours
          </Link>
        </div>
        <Wave color={PETAL} className="absolute inset-x-0 -bottom-3.5 rotate-180" />
      </section>

      {/* Where's Lucia? */}
      <section className="px-4 py-20 sm:px-8 lg:pt-[6.75rem] lg:pb-[9.5rem]">
        <div className="mx-auto grid max-w-[76.5rem] items-center gap-12 lg:grid-cols-[1fr_29.5rem] lg:gap-10">
          <div className="text-center">
            <h2 className="display text-6xl text-strawberry sm:text-7xl lg:text-[5rem] lg:leading-[0.85]">
              Where&rsquo;s Lucia?
            </h2>
            <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-4 lg:mt-[3.75rem]">
              {wheres.map((w) => (
                <li key={w.href} className={`flex flex-col items-center ${w.text}`}>
                  <span className="grid h-[5.625rem] place-items-end">
                    <Image
                      src={w.icon.src}
                      alt=""
                      width={w.icon.w}
                      height={w.icon.h}
                      className={`w-auto ${w.icon.className}`}
                    />
                  </span>
                  <p className="mt-2 text-lg font-bold tracking-[0.02em]">{w.title}</p>
                  <p className="mt-1 max-w-[15rem] text-lg tracking-[0.02em]">{w.copy}</p>
                  <Link href={w.href} className={`btn mt-4 ${w.button}`}>
                    {w.cta}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Image
            src="/home/trailer-crew.webp"
            alt="The Lucia crew waving from the gelato trailer"
            width={1100}
            height={1100}
            sizes="(min-width: 1024px) 472px, 90vw"
            className="mx-auto aspect-square w-full max-w-[29.5rem] rounded-full object-cover lg:mr-0"
          />
        </div>
      </section>

      <OurStory />

      <BackToTop />
    </>
  );
}
