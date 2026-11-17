import Image from "next/image";
import Link from "next/link";
import { TilesMarquee } from "@/components/TilesMarquee";
import type { HomePage } from "@/data/pages/home";

/** Where each tile goes and its colours; the words and pictures come from the Studio. */
const tileStyles = [
  { key: "findUs", href: "/find-us", bg: "bg-alpine", text: "text-lakeside" },
  { key: "order", href: "/order", bg: "bg-blush", text: "text-strawberry" },
  { key: "events", href: "/events", bg: "bg-peach", text: "text-heatwave" },
  { key: "wholesale", href: "/wholesale", bg: "bg-light-green", text: "text-grass" },
] as const;

type Tiles = HomePage["tiles"];

function TileList({ content, hidden = false }: { content: Tiles; hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 gap-[3.75rem] pr-[3.75rem]" aria-hidden={hidden || undefined}>
      {tileStyles.map(({ key, ...t }) => {
        const tile = content[key];
        return (
          <li key={t.href} className="w-[20rem] shrink-0">
            <Link
              href={t.href}
              tabIndex={hidden ? -1 : undefined}
              className={`group relative flex size-[20rem] flex-col items-center overflow-hidden rounded-blob ${t.bg} pt-10`}
            >
              <span className={`eyebrow !text-2xl ${t.text}`}>{tile.label}</span>
              <Image
                src={tile.image.src}
                alt={tile.image.alt}
                width={tile.image.width}
                height={tile.image.height}
                sizes="230px"
                draggable={false}
                className="mt-4 h-[13.5rem] w-auto object-contain transition duration-300 group-hover:-translate-y-1 group-hover:rotate-2"
              />
            </Link>
            <p
              className={`mx-auto mt-5 max-w-[15.625rem] text-center font-ui text-base font-medium tracking-[0.02em] ${t.text}`}
            >
              {tile.copy}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The four section tiles from the home page design, as a slow, endless sideways drift
 * that visitors can drag, swipe or scroll. It pauses on hover or keyboard focus, and
 * only moves when pushed if the visitor prefers reduced motion.
 */
export function SectionTiles({ tiles }: { tiles: Tiles }) {
  return (
    <section className="py-16 lg:py-[7.5rem]">
      <TilesMarquee label="Explore">
        <TileList content={tiles} />
        <TileList content={tiles} hidden />
      </TilesMarquee>
    </section>
  );
}
