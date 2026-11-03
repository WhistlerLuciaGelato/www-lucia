import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BackToTop } from "@/components/BackToTop";
import { Wave } from "@/components/Wave";
import { PintPicker } from "@/components/shop/PintPicker";
import { getPintFlavours, getShop } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our gelato",
  description:
    "Order Whistler Lucia Gelato pints for pickup, and learn what makes gelato, dairy-free gelato and sorbetto different. Handcrafted on Blackcomb Mountain.",
};

/** The pint section's colour, for its wave edges. */
const PETAL = "#ffeee9";

/** Jump links on the hero photo (Figma: Our gelato › Frame 55). */
const shortcuts = [
  { href: "#order-pints", label: "Order pints for pickup", className: "bg-strawberry" },
  { href: "/order/cakes", label: "Order a cake", className: "bg-alpenglow" },
  { href: "#what-is-gelato", label: "What’s gelato?", className: "bg-lakeside" },
  { href: "#dairy-free-vs-sorbet", label: "Dairy-free gelato vs. sorbet", className: "bg-bluebird" },
  { href: "#lucia-difference", label: "The Lucia difference", className: "bg-heatwave" },
];

/**
 * Our gelato, from the website design (Figma "Lucia Website" › XX Working Zone › Our gelato):
 * hero photo with jump links, the pint shop with filters and one-tap add-to-cart, the allergy
 * note, gelato vs. dairy-free vs. sorbet, and the Lucia difference.
 */
export default async function OurGelatoPage() {
  const [pintFlavours, shop] = await Promise.all([getPintFlavours(), getShop()]);

  return (
    <>
      <h1 className="sr-only">Our gelato</h1>

      {/* Hero: framed photo of pints in the snow, with jump links bottom-left. */}
      <section className="relative z-10 px-4 sm:px-8 lg:px-[6.6875rem]">
        <div className="relative mx-auto h-[30rem] max-w-[77.125rem] overflow-hidden rounded-[1.25rem] border-2 border-bluebird sm:h-[34rem] lg:h-auto lg:aspect-[1234/675]">
          <Image
            src="/our-gelato/hero-pints-snow.webp"
            alt="Lucia Gelato pints, Lemon Sorbet and Coconut Cookies & Cream among them, nestled in snow"
            fill
            priority
            sizes="(min-width: 1440px) 1234px, 100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-black/10" />
          <nav
            aria-label="On this page"
            className="absolute bottom-6 left-4 flex flex-col items-start gap-[0.625rem] sm:left-8 lg:bottom-[4.25rem] lg:left-[2.6875rem]"
          >
            {shortcuts.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className={`eyebrow rounded-[1.5rem] px-[1.125rem] py-1.5 !text-base tracking-[0.04em] text-snow transition hover:-translate-y-px sm:!text-xl ${s.className}`}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* Order pints for pickup: the pink band starts behind the bottom of the photo. */}
      <section
        id="order-pints"
        className="relative -mt-[4.25rem] scroll-mt-24 bg-petal px-4 pt-[8.5rem] pb-20 sm:px-8 lg:pb-[5.5rem]"
      >
        <Wave color={PETAL} className="absolute inset-x-0 -top-3.5" />
        <h2 className="display mx-auto max-w-[37.5rem] text-center text-6xl leading-[0.85] text-strawberry sm:text-7xl lg:text-[5rem]">
          Order pints
          <br />
          for pickup
        </h2>
        <div className="mt-10 lg:mt-[3.3125rem]">
          <PintPicker flavours={pintFlavours} price={shop.pintPrice} />
        </div>
        <Wave color={PETAL} className="absolute inset-x-0 -bottom-3.5 rotate-180" />
      </section>

      {/* Allergies & dietary restrictions */}
      <section className="px-4 pt-[6.25rem] sm:px-8">
        <div className="mx-auto flex max-w-[34.875rem] flex-col gap-3 rounded-[1.25rem] bg-seafoam p-5 pb-[1.625rem] font-ui">
          <h2 className="text-lg font-extrabold text-ink">Have allergies or dietary restrictions?</h2>
          <p className="text-sm leading-[1.3] font-medium text-ink/85">
            Please let our team know before ordering. We&rsquo;re always happy to help you explore ingredients
            and find a suitable option, whether you&rsquo;re choosing a scoop, ordering a gelato cake, or
            planning an event.
          </p>
          <Link href="/contact" className="mt-[1.125rem] self-start text-sm font-bold text-ink underline">
            Contact us
          </Link>
        </div>
      </section>

      {/* What is gelato? | Dairy-free gelato v. sorbet */}
      <section className="px-4 pt-[3.25rem] sm:px-8">
        <div className="mx-auto grid max-w-[76.375rem] gap-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-[3.75rem]">
          <div id="what-is-gelato" className="scroll-mt-28 text-center text-strawberry">
            <h2 className="eyebrow !text-[2.5rem] !leading-[0.85]">What is gelato?</h2>
            <p className="mt-[1.6875rem] font-heading text-xl font-bold">
              Dense &amp; silky, gelato lets its ingredients shine
            </p>
            <div className="mx-auto mt-[0.9375rem] max-w-[34.25rem] space-y-3 text-xl">
              <p>
                Gelato is a traditional Italian frozen dessert known for its smooth, creamy texture and rich,
                intense flavours.
              </p>
              <p>
                Made with more milk, less cream, and less air than traditional ice cream, gelato has a denser,
                silkier consistency that lets the natural flavours of its ingredients shine through.
              </p>
              <p>
                Served at a slightly warmer temperature and traditionally scooped with a spatula, gelato has a
                signature soft, velvety texture.
              </p>
            </div>
          </div>

          <div aria-hidden className="hidden w-px bg-strawberry/60 lg:block" />

          <div id="dairy-free-vs-sorbet" className="scroll-mt-28 text-center text-lakeside">
            <h2 className="eyebrow !text-[2.5rem] !leading-[0.85]">Dairy-free gelato v. sorbet</h2>
            <p className="mt-[1.6875rem] font-heading text-xl font-bold">
              Dense &amp; silky, gelato lets its natural flavours shine
            </p>
            <div className="mx-auto mt-[0.9375rem] max-w-[31.25rem] space-y-3 text-xl">
              <p>
                Our dairy-free gelato is primarily made with coconut milk, creating a rich, smooth, and creamy
                consistency without the dairy.
              </p>
              <p>
                Our fruit sorbettos are made with simple ingredients, combining fruit purées, water, and sugar
                for a light, refreshing treat bursting with natural fruit flavour. We love using seasonal
                fruits whenever possible to bring out their best.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Lucia difference */}
      <section className="px-4 pt-[9.75rem] sm:px-8 lg:px-[5.1875rem]">
        <div
          id="lucia-difference"
          className="mx-auto grid max-w-[79.625rem] scroll-mt-28 overflow-hidden rounded-[1.25rem] bg-[#ffedda] lg:grid-cols-[28.8125rem_1fr]"
        >
          {/* The design crops in on the scoop; the percentages keep that framing at any size. */}
          <div className="relative aspect-[477/640] max-h-[40rem] w-full overflow-hidden lg:-ml-[0.9375rem] lg:w-[29.8125rem] lg:max-h-none">
            <Image
              src="/our-gelato/scooping-gelato.webp"
              alt="Scooping mango sorbetto from a tray in the Lucia gelato case"
              width={1800}
              height={2700}
              sizes="(min-width: 1024px) 870px, 180vw"
              className="absolute top-[-74.24%] left-[-75.68%] h-[203.88%] w-[182.39%] max-w-none"
            />
          </div>
          <div className="px-6 py-12 text-center text-heatwave sm:px-12 lg:px-[4.6875rem] lg:pt-[3.4375rem] lg:pb-14">
            <h2 className="display text-5xl leading-[1.05] sm:text-[3.75rem]">The Lucia Difference</h2>
            <div className="mx-auto mt-6 max-w-[37.125rem] space-y-3 text-lg tracking-[0.02em] lg:mt-7">
              <p>
                At Lucia Gelato, we&rsquo;re proud to be truly local. Our gelato and sorbetto are handcrafted
                right here on Blackcomb Mountain in Whistler, inspired by traditional Italian gelato-making
                and the beautiful mountain community we call home.
              </p>
              <p>
                We believe the best gelato starts with simple, quality ingredients. That&rsquo;s why
                we&rsquo;re passionate about making our gelato fresh, using natural ingredients and sourcing
                locally whenever possible. Every batch is made with care, bringing together authentic Italian
                traditions, homemade quality and a little Whistler creativity.
              </p>
              <p>
                From rich and creamy classics to indulgent chocolate and nut flavours, refreshing fruit
                sorbettos, and dairy-free options made with alternative milks, there&rsquo;s something for
                everyone. We focus on real flavour, smooth textures and letting our ingredients speak for
                themselves.
              </p>
              <p>
                Alongside our signature favourites, we love experimenting with seasonal ingredients and
                creating exciting new flavours throughout the year. Whether you&rsquo;re enjoying a scoop
                after a day on the mountain or bringing a gelato pint home to share, you&rsquo;re enjoying a
                little taste of Whistler, made right here in the mountains.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-3.5">
        <BackToTop />
      </div>
    </>
  );
}
