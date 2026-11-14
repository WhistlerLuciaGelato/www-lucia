"use client";

import { useState } from "react";
import Link from "next/link";
import { cart } from "@/lib/cart-store";
import { money } from "@/lib/format";
import { CAKE_MAX_QTY } from "@/data/shop";
import type { Shop } from "@/lib/content-types";
import { Bear } from "@/components/ui";

/** Each step gets one of the pastel card colourways from the redesigned pages. */
const accents = {
  strawberry: {
    card: "border-strawberry bg-petal",
    text: "text-strawberry",
    badge: "bg-strawberry",
    tile: "border-strawberry",
    idle: "border-strawberry/35 hover:border-strawberry/70",
  },
  lakeside: {
    card: "border-lakeside bg-seafoam",
    text: "text-lakeside",
    badge: "bg-lakeside",
    tile: "border-lakeside",
    idle: "border-lakeside/35 hover:border-lakeside/70",
  },
  heatwave: {
    card: "border-heatwave bg-[#ffecd9]",
    text: "text-heatwave",
    badge: "bg-heatwave",
    tile: "border-heatwave",
    idle: "border-heatwave/35 hover:border-heatwave/70",
  },
} as const;

type Accent = keyof typeof accents;

function Step({
  n,
  title,
  accent,
  children,
}: {
  n: number;
  title: string;
  accent: Accent;
  children: React.ReactNode;
}) {
  const a = accents[accent];
  return (
    <fieldset className={`rounded-[2.1875rem] border p-6 sm:p-8 ${a.card}`}>
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-3" aria-hidden>
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-heading text-xl font-black text-snow italic ${a.badge}`}
        >
          {n}
        </span>
        <span className={`display text-3xl sm:text-4xl ${a.text}`}>{title}</span>
      </div>
      <div className="mt-6">{children}</div>
    </fieldset>
  );
}

function Choice({
  name,
  value,
  checked,
  onChange,
  title,
  detail,
  note,
  accent,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  detail?: string;
  note?: string;
  accent: Accent;
}) {
  const a = accents[accent];
  return (
    <label
      className={`relative flex cursor-pointer flex-col rounded-[1.25rem] border-2 bg-snow p-4 pr-11 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lake-deep ${
        checked ? `${a.tile} shadow-pop` : a.idle
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="font-ui font-extrabold text-ink">{title}</span>
      {detail ? <span className="mt-0.5 font-ui text-ink/75">{detail}</span> : null}
      {note ? <span className={`tag mt-3 self-start ${a.text}`}>{note}</span> : null}
      <span
        aria-hidden
        className={`absolute top-3.5 right-3.5 grid h-6 w-6 place-items-center rounded-full border-2 text-xs font-black text-snow transition ${
          checked ? `${a.tile} ${a.badge}` : "border-ink/15 bg-snow"
        }`}
      >
        {checked ? "✓" : null}
      </span>
    </label>
  );
}

export function CakeBuilder({ shop }: { shop: Shop }) {
  const { cakeSizes, cakeBases, cakeCombos, cakeLeadDays } = shop;
  const [size, setSize] = useState(cakeSizes[0].id);
  const [base, setBase] = useState(cakeBases[0].id);
  const [combo, setCombo] = useState(cakeCombos[0].id);
  // Allergies & dietary restrictions. Stored as the cart item's `message`.
  const [dietary, setDietary] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const sizeInfo = cakeSizes.find((s) => s.id === size) ?? cakeSizes[0];
  const baseInfo = cakeBases.find((b) => b.id === base) ?? cakeBases[0];
  const comboInfo = cakeCombos.find((c) => c.id === combo) ?? cakeCombos[0];

  return (
    <form
      className="grid gap-6 lg:grid-cols-3 lg:gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        cart.add({ kind: "cake", size, base, combo, message: dietary.trim() || undefined, qty });
        setAdded(true);
      }}
    >
      <div className="space-y-6 lg:col-span-2">
        <Step n={1} title="Choose your size" accent="strawberry">
          <div className="grid gap-3 sm:grid-cols-2">
            {cakeSizes.map((s) => (
              <Choice
                key={s.id}
                name="size"
                value={s.id}
                checked={size === s.id}
                onChange={() => setSize(s.id)}
                title={`${s.label} cake — ${money(s.price)}`}
                detail={`Serves ${s.serves}`}
                accent="strawberry"
              />
            ))}
          </div>
        </Step>

        <Step n={2} title="Pick your base" accent="lakeside">
          <div className="grid gap-3 sm:grid-cols-3">
            {cakeBases.map((b) => (
              <Choice
                key={b.id}
                name="base"
                value={b.id}
                checked={base === b.id}
                onChange={() => setBase(b.id)}
                title={b.label}
                note={b.note}
                accent="lakeside"
              />
            ))}
          </div>
        </Step>

        <Step n={3} title="Choose your flavours" accent="heatwave">
          <div className="grid gap-3 sm:grid-cols-3">
            {cakeCombos.map((c) => (
              <Choice
                key={c.id}
                name="combo"
                value={c.id}
                checked={combo === c.id}
                onChange={() => setCombo(c.id)}
                title={c.label}
                detail={c.flavours}
                note={c.note}
                accent="heatwave"
              />
            ))}
          </div>
          <p className="mt-5 font-ui text-sm text-ink/75">
            Want a different size or flavour?{" "}
            <Link href="/contact" className="font-bold text-lake-deep underline underline-offset-2">
              Ask us about a custom cake
            </Link>
            .
          </p>
        </Step>

        <Step n={4} title="Allergies or dietary needs?" accent="lakeside">
          <label htmlFor="cake-dietary" className="label">
            Let us know about any allergies or dietary restrictions{" "}
            <span className="font-normal text-ink/50">(optional)</span>
          </label>
          <textarea
            id="cake-dietary"
            className="field"
            rows={3}
            maxLength={300}
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            placeholder="e.g. nut allergy, gluten-free, no coconut"
          />
          <p className="mt-4 font-ui text-sm text-ink/75">
            You&rsquo;ll pick your pickup date at checkout — at least {cakeLeadDays} days from today.
          </p>
        </Step>
      </div>

      <aside className="lg:sticky lg:top-40 lg:self-start">
        <div className="relative rounded-[2.1875rem] border border-strawberry bg-rose p-7 sm:p-8">
          <Bear name="snowboard-pink" className="absolute top-5 right-5 w-20 sm:w-24" />
          <p className="eyebrow text-strawberry">Your cake</p>
          <p className="display mt-3 text-5xl text-strawberry">{sizeInfo.label} cake</p>
          <dl className="mt-6 space-y-3 font-ui text-ink">
            <div>
              <dt className="text-sm text-ink/65">Base</dt>
              <dd className="font-bold">{baseInfo.label}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink/65">Flavours</dt>
              <dd className="font-bold">{comboInfo.flavours}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink/65">Serves</dt>
              <dd className="font-bold">{sizeInfo.serves} people</dd>
            </div>
            {dietary.trim() ? (
              <div>
                <dt className="text-sm text-ink/65">Allergies &amp; dietary needs</dt>
                <dd className="font-bold break-words">{dietary.trim()}</dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-6 flex items-center justify-between border-t border-strawberry/30 pt-5">
            <label htmlFor="cake-qty" className="font-ui text-sm font-bold text-ink/75">
              Quantity
            </label>
            <select
              id="cake-qty"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="rounded-full border-2 border-strawberry/50 bg-snow px-4 py-1.5 font-ui font-bold text-ink focus:border-strawberry focus:outline-none"
            >
              {Array.from({ length: CAKE_MAX_QTY }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-5 flex items-baseline justify-between font-ui text-ink">
            <span className="font-bold text-ink/75">Total</span>
            <span className="text-3xl font-extrabold">{money(sizeInfo.price * qty)}</span>
          </p>
          <button type="submit" className="btn btn-berry mt-6 w-full">
            Add to cart
          </button>
          <div aria-live="polite" className="mt-4 min-h-6 text-center font-ui font-bold text-ink">
            {added ? (
              <span>
                Cake added!{" "}
                <Link href="/cart" className="text-lake-deep underline underline-offset-2">
                  Go to checkout →
                </Link>
              </span>
            ) : null}
          </div>
        </div>
      </aside>
    </form>
  );
}
