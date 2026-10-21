import Image from "next/image";
import type { PintFlavour } from "@/lib/content-types";
import { money } from "@/lib/format";
import { AddPintButton } from "@/components/shop/AddPintButton";
import { Bear, DietPills } from "@/components/ui";

/** Pass `price` (CAD cents) to show the add-to-cart controls. */
export function PintCard({ flavour, price }: { flavour: PintFlavour; price?: number }) {
  const shop = price !== undefined;
  return (
    <article
      id={flavour.slug}
      className="group flex scroll-mt-28 flex-col overflow-hidden rounded-blob bg-white shadow-soft ring-1 ring-alpine/60"
    >
      <div className="relative bg-snow">
        {flavour.image ? (
          <Image
            src={flavour.image}
            alt={`${flavour.name} pint${flavour.activity ? ` — ${flavour.activity.toLowerCase()} on the label` : ""}`}
            width={720}
            height={720}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="aspect-square w-full object-contain p-4 transition duration-300 group-hover:scale-[1.03] group-hover:-rotate-1"
          />
        ) : (
          <div
            className="grid aspect-square w-full place-items-center"
            style={{ backgroundColor: `${flavour.color}22` }}
          >
            <Bear name={flavour.bear} className="w-1/2" />
          </div>
        )}
        {shop && !flavour.available ? (
          <span className="eyebrow absolute top-4 left-4 rounded-full bg-ink px-3 py-1.5 text-snow">
            Sold out
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow flex items-center gap-2 text-ink/70">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: flavour.color }} aria-hidden />
          {flavour.style}
        </p>
        <h3 className="subhead mt-1.5 text-2xl text-ink">{flavour.name}</h3>
        <p className="mt-3 flex-1 leading-relaxed text-ink/80">{flavour.blurb}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <DietPills diet={flavour.diet} />
          {shop ? <p className="font-ui text-xl font-extrabold text-ink">{money(price)}</p> : null}
        </div>
        {shop ? (
          <div className="mt-5 border-t border-alpine pt-5">
            {flavour.available ? (
              <AddPintButton flavour={flavour.slug} name={flavour.name} />
            ) : (
              <p className="font-ui font-bold text-ink/60">Back soon — check our other flavours.</p>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}
