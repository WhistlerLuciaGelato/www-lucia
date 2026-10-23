import Image from "next/image";
import type { Diet } from "@/data/flavours";
import { dietLabels } from "@/data/flavours";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

type Tone = "lakeside" | "strawberry" | "snow" | "heatwave";

const toneClass: Record<Tone, string> = {
  lakeside: "text-lakeside",
  strawberry: "text-strawberry",
  snow: "text-snow",
  heatwave: "text-heatwave",
};

export function PageHeading({
  eyebrow,
  title,
  intro,
  tone = "lakeside",
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  tone?: Tone;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="eyebrow !text-lg text-lakeside lg:!text-xl">{eyebrow}</p>
      <h1 className={`display mt-5 text-6xl sm:text-7xl lg:text-[5rem] lg:leading-[0.85] ${toneClass[tone]}`}>
        {title}
      </h1>
      {intro ? (
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed tracking-[0.01em] text-black/80">
          {intro}
        </p>
      ) : null}
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "lakeside",
  align = "center",
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  tone?: Tone;
  align?: "center" | "left";
  id?: string;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className="eyebrow !text-lg text-lakeside lg:!text-xl">{eyebrow}</p> : null}
      <h2 id={id} className={`display mt-4 text-5xl sm:text-6xl ${toneClass[tone]}`}>
        {title}
      </h2>
      {intro ? <p className="mt-5 text-lg leading-relaxed text-black/80">{intro}</p> : null}
    </div>
  );
}

const dietIcon: Record<Diet, string> = {
  "dairy-free": "/brand/dairy-free.svg",
  vegan: "/brand/vegan.svg",
  "gluten-free": "/brand/gluten-free.svg",
};

export function DietIcons({ diet, size = 44 }: { diet: Diet[]; size?: number }) {
  if (!diet.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Dietary information">
      {diet.map((d) => (
        <li key={d} title={dietLabels[d]}>
          <Image src={dietIcon[d]} alt={dietLabels[d]} width={size} height={size} className="block" />
        </li>
      ))}
    </ul>
  );
}

// Intrinsic sizes of the Lucia illustrations in /public/bears.
const bearSizes: Record<string, [number, number]> = {
  bike: [136, 168],
  bmx: [169, 256],
  hiker: [136, 192],
  kayak: [416, 200],
  paddleboard: [256, 193],
  "ski-jump": [234, 232],
  "ski-jump-white": [616, 560],
  "ski-touring": [280, 224],
  "snowboard-large": [856, 656],
  "snowboard-pink": [224, 176],
  snowmobile: [296, 208],
  whitewater: [257, 232],
  zipline: [288, 200],
};

export function Bear({ name, className = "" }: { name: string; className?: string }) {
  const [width, height] = bearSizes[name] ?? [240, 240];
  return (
    <Image
      src={`/bears/${name}.png`}
      alt=""
      aria-hidden
      width={width}
      height={height}
      className={`pointer-events-none h-auto select-none ${className}`}
    />
  );
}

export function CheckList({ items, className = "" }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <svg viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0 text-lakeside" aria-hidden>
            <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.2" />
            <path
              d="M5.5 10.5l3 3 6-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
