import Image from "next/image";
import Link from "next/link";

const tiles = [
  {
    href: "/find-us",
    label: "Find us",
    copy: "Seasonal spots, opening hours and where to grab a pint near you.",
    bg: "bg-alpine",
    text: "text-lakeside",
    img: { src: "/home/bear-findus.webp", w: 567, h: 700 },
  },
  {
    href: "/order",
    label: "Order",
    copy: "Pints and custom gelato cakes, ready for pickup at Base II.",
    bg: "bg-blush",
    text: "text-strawberry",
    img: { src: "/home/bear-order.webp", w: 700, h: 635 },
  },
  {
    href: "/events",
    label: "Events",
    copy: "Weddings, parties and corporate days, with or without the trailer.",
    bg: "bg-peach",
    text: "text-heatwave",
    img: { src: "/home/bear-events.webp", w: 470, h: 700 },
  },
  {
    href: "/wholesale",
    label: "Wholesale",
    copy: "Premium gelato for cafés, restaurants and retailers in the Sea to Sky.",
    bg: "bg-light-green",
    text: "text-grass",
    img: { src: "/home/bear-wholesale.webp", w: 700, h: 539 },
  },
];

function TileList({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 gap-[3.75rem] pr-[3.75rem]" aria-hidden={hidden || undefined}>
      {tiles.map((t) => (
        <li key={t.href} className="w-[20rem] shrink-0">
          <Link
            href={t.href}
            tabIndex={hidden ? -1 : undefined}
            className={`group relative flex size-[20rem] flex-col items-center overflow-hidden rounded-blob ${t.bg} pt-10`}
          >
            <span className={`eyebrow !text-2xl ${t.text}`}>{t.label}</span>
            <Image
              src={t.img.src}
              alt=""
              width={t.img.w}
              height={t.img.h}
              sizes="230px"
              className="mt-4 h-[13.5rem] w-auto object-contain transition duration-300 group-hover:-translate-y-1 group-hover:rotate-2"
            />
          </Link>
          <p
            className={`mx-auto mt-5 max-w-[15.625rem] text-center font-ui text-base font-medium tracking-[0.02em] ${t.text}`}
          >
            {t.copy}
          </p>
        </li>
      ))}
    </ul>
  );
}

/**
 * The four section tiles from the home page design, as a slow, endless sideways drift.
 * It pauses on hover or keyboard focus, and becomes a plain scrollable row when the
 * visitor prefers reduced motion.
 */
export function SectionTiles() {
  return (
    <section aria-label="Explore" className="tiles-marquee overflow-hidden py-16 lg:py-[7.5rem]">
      <div className="tiles-track flex w-max">
        <TileList />
        <TileList hidden />
      </div>
    </section>
  );
}
