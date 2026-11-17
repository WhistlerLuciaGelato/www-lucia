import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPintFlavours, getShop } from "@/lib/content";
import { PintCard } from "@/components/shop/PintCard";
import { BackToTop } from "@/components/BackToTop";
import { OurStory } from "@/components/OurStory";
import { SectionTiles } from "@/components/SectionTiles";
import { getPageContent } from "@/lib/page-content";
import { homePage } from "@/data/pages/home";

/**
 * The big, smooth cream waves that the flavour section's pink bites into (Figma: Home, vectors
 * 131:260 and 131:262). Stretched to the full width; the top one is wider than the page and
 * mirrored, as in the design.
 */
function CreamWave({ edge }: { edge: "top" | "bottom" }) {
  return edge === "top" ? (
    <svg
      aria-hidden
      viewBox="0 0 1796 137"
      preserveAspectRatio="none"
      className="absolute top-0 right-0 h-[clamp(3rem,9.5vw,8.5625rem)] w-[124.7%] -scale-x-100 fill-snow"
    >
      <path d="M750.418 132.333C524.372 150.197 158.422 113.619 0 76.1915V0H1796V76.1915C1360.76 -48.121 1105.62 104.262 750.418 132.333Z" />
    </svg>
  ) : (
    <svg
      aria-hidden
      viewBox="0 0 1436 136.656"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 h-[clamp(3rem,9.5vw,8.5625rem)] w-full rotate-180 fill-snow"
    >
      <path d="M600 132C419.264 149.819 126.667 113.333 0 76V0H1436V76C1088 -48 884 104 600 132Z" />
    </svg>
  );
}

/** Where each "Where's Lucia?" card links and its colours; the words come from the Studio. */
const wheres = [
  {
    key: "scoops",
    href: "/find-us#map",
    icon: { src: "/find-us/icon-cone.svg", w: 27, h: 64, className: "h-[4.77rem]" },
    text: "text-lakeside",
    button: "btn-sky",
  },
  {
    key: "pints",
    href: "/find-us#grocery",
    icon: { src: "/find-us/icon-basket-pink.svg", w: 70, h: 72, className: "h-[4.5rem]" },
    text: "text-strawberry",
    button: "btn-blush",
  },
  {
    key: "elsewhere",
    href: "/find-us#scoops",
    icon: { src: "/find-us/icon-cutlery.svg", w: 51, h: 65, className: "h-[4.05rem]" },
    text: "text-heatwave",
    button: "bg-peach text-heatwave",
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const { metaDescription } = await getPageContent("homePage", homePage);
  return { description: metaDescription };
}

export default async function Home() {
  const [pintFlavours, shop, page] = await Promise.all([
    getPintFlavours(),
    getShop(),
    getPageContent("homePage", homePage),
  ]);
  const { hero, flavours, where } = page;
  const featured = pintFlavours.slice(0, 6);

  return (
    <>
      {/* Hero: full-bleed photo with a soft blue wash, copy bottom-left. */}
      <section className="relative isolate overflow-hidden bg-lakeside text-snow">
        <Image
          src={hero.photo.src}
          alt={hero.photo.alt}
          width={hero.photo.width}
          height={hero.photo.height}
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
          <p className="eyebrow !text-base sm:pl-2.5 lg:!text-xl">{hero.eyebrow}</p>
          <div className="max-w-[37.5rem]">
            <h1 className="display text-6xl [text-shadow:0_2px_16px_rgb(14_56_89/0.25)] sm:text-7xl lg:text-[5rem]">
              {hero.title}
            </h1>
            <p className="mt-7 max-w-[25.625rem] text-base tracking-[0.02em] sm:pl-2.5">{hero.intro}</p>
            <div className="mt-8 flex flex-wrap gap-4 sm:ml-2 sm:gap-6">
              <Link href="/find-us" className="btn btn-sky min-w-[7.875rem]">
                {hero.findUsLabel}
              </Link>
              <Link href="/order" className="btn btn-blush min-w-[7.875rem]">
                {hero.orderLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Colourful section tiles with Lucia, drifting sideways. */}
      <SectionTiles tiles={page.tiles} />

      {/* Flavours */}
      <section className="relative isolate overflow-hidden bg-petal px-4 pt-[clamp(6rem,14vw,12.5rem)] pb-[clamp(6rem,14vw,12rem)] sm:px-8">
        <CreamWave edge="top" />
        <h2 className="display mx-auto text-center text-6xl text-strawberry sm:text-7xl lg:text-[5rem]">
          {flavours.title}
        </h2>
        <div className="mx-auto mt-12 grid max-w-[71rem] justify-items-center gap-x-[3.2rem] gap-y-10 sm:grid-cols-2 lg:mt-[4.25rem] lg:grid-cols-3 lg:items-start lg:gap-y-[4.25rem]">
          {featured.map((f) => (
            // As on Our gelato (the description drops down on hover), without the add-to-cart pill.
            <PintCard
              key={f.slug}
              flavour={f}
              framed
              showSize
              listPrice={shop.pintPrice}
              showLabel
              revealBlurb
              href={`/our-gelato#${f.slug}`}
            />
          ))}
        </div>
        <div className="mt-14 flex flex-wrap justify-center gap-4 lg:mt-[4.5rem] lg:gap-[1.875rem]">
          <Link href="/our-gelato#order-pints" className="btn btn-berry">
            {flavours.orderPintsLabel}
          </Link>
          <Link href="/order/cakes" className="btn bg-alpenglow text-snow">
            {flavours.cakeLabel}
          </Link>
          <Link href="/wholesale#flavours" className="btn bg-bluebird text-snow">
            {flavours.wholesaleLabel}
          </Link>
        </div>
        <CreamWave edge="bottom" />
      </section>

      {/* Where's Lucia? */}
      <section className="relative isolate overflow-x-clip px-4 pt-6 pb-20 sm:px-8 lg:-mt-24 lg:pb-[7rem]">
        <div className="mx-auto grid max-w-[90rem] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,42rem)] lg:gap-6 lg:pl-[3.75rem]">
          <div className="text-center lg:pt-24">
            <h2 className="display text-6xl text-strawberry sm:text-7xl lg:text-[5rem]">{where.title}</h2>
            <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-4 lg:mt-[3.75rem]">
              {wheres.map((w) => (
                <li key={w.key} className={`flex flex-col items-center ${w.text}`}>
                  <span className="grid h-[5.625rem] place-items-end">
                    <Image
                      src={w.icon.src}
                      alt=""
                      width={w.icon.w}
                      height={w.icon.h}
                      className={`w-auto ${w.icon.className}`}
                    />
                  </span>
                  <p className="mt-2 text-lg font-bold tracking-[0.02em]">{where[w.key].title}</p>
                  <p className="mt-1 max-w-[15rem] text-lg tracking-[0.02em]">{where[w.key].copy}</p>
                  <Link href={w.href} className={`btn mt-4 ${w.button}`}>
                    {where[w.key].cta}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Figma: the trailer photo in a blob, running off the right edge. */}
          <Image
            src={where.photo.src}
            alt={where.photo.alt}
            width={where.photo.width}
            height={where.photo.height}
            sizes="(min-width: 1024px) 672px, 95vw"
            className="mx-auto w-full max-w-[42rem] lg:mr-[-4.3rem] lg:ml-0"
          />
        </div>
      </section>

      <OurStory story={page.story} />

      <BackToTop />
    </>
  );
}
