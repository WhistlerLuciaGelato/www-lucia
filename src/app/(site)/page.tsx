import Image from "next/image";
import Link from "next/link";
import { getEvents, getLocations, getPintFlavours, getShop } from "@/lib/content";
import { PintCard } from "@/components/shop/PintCard";
import { Bear, Container, Mountains, SectionHeading } from "@/components/ui";

const pathways = [
  {
    href: "/find-us",
    eyebrow: "Find us",
    title: "Chase the trailer",
    body: "Roundhouse in winter, the lakes in summer, and grocery freezers all along the Sea to Sky.",
    bg: "bg-alpine",
    bear: "bike",
  },
  {
    href: "/order",
    eyebrow: "Order",
    title: "Pints & cakes",
    body: "Pick up pints and made-to-order gelato cakes from our kitchen at Base II.",
    bg: "bg-blush",
    bear: "snowboard-pink",
  },
  {
    href: "/events",
    eyebrow: "Events",
    title: "Gelato at your party",
    body: "Weddings, birthdays and corporate days — with or without the trailer.",
    bg: "bg-peach",
    bear: "kayak",
  },
  {
    href: "/wholesale",
    eyebrow: "Wholesale",
    title: "Stock Lucia",
    body: "5 L tubs, pints and snack cups for cafés, restaurants and retailers.",
    bg: "bg-light-green",
    bear: "bmx",
  },
];

const personality = [
  { word: "Local", color: "text-lakeside" },
  { word: "Handmade", color: "text-strawberry" },
  { word: "Adventurous", color: "text-heatwave" },
  { word: "Youthful", color: "text-[#e9c429]" },
  { word: "Whimsical", color: "text-grass" },
];

export default async function Home() {
  const [pintFlavours, seasonalSpots, shop, events] = await Promise.all([
    getPintFlavours(),
    getLocations(),
    getShop(),
    getEvents(),
  ]);
  const featured = pintFlavours.slice(0, 6);
  const cheapestPackage = [...events.packages].sort((a, b) => a.basePrice - b.basePrice)[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Container className="relative grid items-center gap-10 pt-12 pb-4 lg:grid-cols-2 lg:pt-20">
          <div className="relative z-10 text-center lg:text-left">
            <p className="eyebrow text-berry">Locally crafted · Since 2007</p>
            <h1 className="display mt-5 text-6xl text-lakeside sm:text-7xl xl:text-8xl">
              Made on the Mountain
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/85 sm:text-xl lg:mx-0">
              Small-batch gelato and sorbetto, handmade in our kitchen at Base II — the only frozen treats
              made right here in Whistler.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href="/find-us" className="btn btn-primary">
                Find Lucia today
              </Link>
              <Link href="/order/pints" className="btn btn-berry">
                Order pints
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute inset-6 rounded-full bg-alpine/60 blur-2xl" aria-hidden />
            <Image
              src="/bears/snowboard-large.png"
              alt="Lucia the bear snowboarding"
              width={856}
              height={656}
              priority
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="relative w-full -rotate-3 drop-shadow-[0_18px_24px_rgba(31,59,66,0.18)]"
            />
          </div>
        </Container>
        <Mountains className="-mt-10 sm:-mt-24" />
      </section>

      {/* Pathways */}
      <section className="bg-mist py-16 sm:py-20">
        <Container>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pathways.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className={`group relative flex h-full min-h-72 flex-col overflow-hidden rounded-blob ${p.bg} p-7 shadow-pop transition hover:-translate-y-1`}
                >
                  <p className="eyebrow text-ink/70">{p.eyebrow}</p>
                  <h2 className="subhead mt-2 text-3xl text-ink">{p.title}</h2>
                  <p className="mt-3 max-w-[16rem] leading-relaxed text-ink/80">{p.body}</p>
                  <span className="mt-auto pt-6 font-ui font-extrabold text-lake-deep">
                    Let&rsquo;s go{" "}
                    <span aria-hidden className="inline-block transition group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                  <Bear
                    name={p.bear}
                    className="absolute -right-4 -bottom-2 w-32 opacity-90 transition group-hover:-translate-y-1 group-hover:rotate-3"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Lineup */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="The pint lineup"
            title="Find your flavour"
            tone="strawberry"
            intro="Dense, smooth and intense — gelato the Italian way, with a little Whistler whimsy on every label."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((f) => (
              <PintCard key={f.slug} flavour={f} />
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link href="/our-gelato" className="btn btn-ghost">
              See every flavour
            </Link>
            <Link href="/order/pints" className="btn btn-primary">
              Order pints for pickup
            </Link>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="py-8">
        <Container>
          <div className="grid items-center gap-10 overflow-hidden rounded-[4rem] bg-blush/60 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            <div>
              <p className="eyebrow text-berry">Our story</p>
              <h2 className="display mt-4 text-5xl text-strawberry sm:text-6xl">Proudly local, since 2007</h2>
              <div className="prose-lucia mt-6 text-lg leading-relaxed text-ink/85">
                <p>
                  It all started with a trip to Italy and a simple pleasure: stopping for gelato after a long
                  day outside. Back home in Whistler, we set out to bring that feeling to the mountain.
                </p>
                <p>
                  We source from the Sea to Sky, celebrate the community that shaped us, and never forget
                  where we come from. Bold, joyful, a little whimsical. <strong>Just like Whistler.</strong>
                </p>
              </div>
              <Link href="/about" className="btn btn-primary mt-8">
                Read our story
              </Link>
            </div>
            <div className="relative mx-auto w-full max-w-sm">
              <Image
                src="/photos/skiers-cones.webp"
                alt="Two skiers sharing gelato cones in the snow"
                width={1200}
                height={1833}
                sizes="(min-width: 1024px) 30vw, 80vw"
                className="aspect-[4/5] w-full rounded-[3rem] object-cover shadow-soft"
              />
              <Image
                src="/brand/made-on-the-mountain.svg"
                alt=""
                aria-hidden
                width={160}
                height={160}
                className="absolute -bottom-8 -left-8 h-32 w-32 rotate-[-8deg] rounded-full bg-snow p-2 shadow-soft"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Seasons */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Where's Lucia?"
            title="Winter on the hill, summer by the lake"
            intro="We follow the seasons — and the sunshine. Check the schedule before you go: mountain weather has a mind of its own."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {(["Winter", "Summer"] as const).map((season) => (
              <div
                key={season}
                className={`relative overflow-hidden rounded-blob p-8 sm:p-10 ${season === "Winter" ? "bg-alpine" : "bg-butter"}`}
              >
                <p className="eyebrow text-ink/70">{season}</p>
                <ul className="mt-4 space-y-5">
                  {seasonalSpots
                    .filter((s) => s.season === season)
                    .map((s) => (
                      <li key={s.id}>
                        <p className="subhead text-2xl text-ink">{s.name}</p>
                        <p className="font-ui text-sm font-bold text-lake-deep">{s.area}</p>
                      </li>
                    ))}
                </ul>
                <Bear
                  name={season === "Winter" ? "ski-jump" : "kayak"}
                  className="absolute -right-3 bottom-0 w-36 sm:w-44"
                />
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/find-us" className="btn btn-primary">
              Map, hours &amp; stockists
            </Link>
          </div>
        </Container>
      </section>

      {/* Cakes + events */}
      <section>
        <Container className="grid gap-5 lg:grid-cols-5">
          <div className="relative overflow-hidden rounded-blob bg-lake-deep p-8 text-snow sm:p-12 lg:col-span-3">
            <p className="eyebrow text-alpine">Gelato cakes</p>
            <h2 className="display mt-4 text-5xl sm:text-6xl">Make it a cake</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-snow/90">
              Two layers of gelato or sorbet on your choice of base.{" "}
              {shop.cakeSizes.map((c) => `${c.label} serves ${c.serves}`).join(", ")} — made to order with{" "}
              {shop.cakeLeadDays} days&rsquo; notice.
            </p>
            <Link href="/order/cakes" className="btn mt-8 bg-snow text-lake-deep">
              Build your cake
            </Link>
            <Bear name="zipline" className="absolute right-4 -bottom-4 hidden w-48 sm:block" />
          </div>
          <div className="flex flex-col justify-between rounded-blob bg-peach p-8 sm:p-12 lg:col-span-2">
            <div>
              <p className="eyebrow text-ink/70">Weddings &amp; events</p>
              <h2 className="subhead mt-3 text-3xl text-ink">Bring the trailer to your big day</h2>
              <p className="mt-4 leading-relaxed text-ink/80">
                {cheapestPackage
                  ? `Packages from $${cheapestPackage.basePrice} for ${cheapestPackage.baseGuests} guests, served from our gelato trailer or a simple table setup.`
                  : "Gelato for weddings, parties and corporate events."}
              </p>
            </div>
            <Link href="/events" className="btn btn-primary mt-8 self-start">
              See packages
            </Link>
          </div>
        </Container>
      </section>

      {/* Personality */}
      <section className="py-24" aria-label="What we're about">
        <Container>
          <p className="flex flex-wrap items-baseline justify-center gap-x-6 gap-y-1 text-center">
            {personality.map((p) => (
              <span key={p.word} className={`display text-5xl sm:text-6xl lg:text-7xl ${p.color}`}>
                {p.word}
              </span>
            ))}
          </p>
        </Container>
      </section>
    </>
  );
}
