"use client";

import { useState } from "react";
import Link from "next/link";
import { cart } from "@/lib/cart-store";
import { money } from "@/lib/format";
import {
  CAKE_LEAD_DAYS,
  CAKE_MAX_QTY,
  cakeBases,
  cakeCombos,
  cakeSizes,
  type CakeBaseId,
  type CakeComboId,
  type CakeSizeId,
} from "@/data/shop";

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-blob bg-white p-6 shadow-soft ring-1 ring-alpine/60 sm:p-8">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-3" aria-hidden>
        <span className="display grid h-10 w-10 place-items-center rounded-full bg-strawberry text-xl text-[#3d1416]">
          {n}
        </span>
        <span className="subhead text-2xl text-ink">{title}</span>
      </div>
      <div className="mt-5">{children}</div>
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
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  detail?: string;
  note?: string;
}) {
  return (
    <label
      className={`relative flex cursor-pointer flex-col rounded-3xl p-4 ring-2 transition ${
        checked ? "bg-blush/70 ring-strawberry" : "bg-snow ring-alpine hover:ring-bluebird"
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
      {detail ? <span className="mt-0.5 text-ink/75">{detail}</span> : null}
      {note ? (
        <span className="mt-2 self-start rounded-full bg-light-green px-2.5 py-0.5 font-ui text-xs font-bold text-[#3d4410]">
          {note}
        </span>
      ) : null}
      {checked ? (
        <span
          className="absolute top-3 right-3 grid h-6 w-6 place-items-center rounded-full bg-berry text-xs text-white"
          aria-hidden
        >
          ✓
        </span>
      ) : null}
    </label>
  );
}

export function CakeBuilder() {
  const [size, setSize] = useState<CakeSizeId>("7in");
  const [base, setBase] = useState<CakeBaseId>("chocolate-oreo");
  const [combo, setCombo] = useState<CakeComboId>("gelato");
  const [message, setMessage] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const sizeInfo = cakeSizes.find((s) => s.id === size)!;
  const baseInfo = cakeBases.find((b) => b.id === base)!;
  const comboInfo = cakeCombos.find((c) => c.id === combo)!;

  return (
    <form
      className="grid gap-6 lg:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault();
        cart.add({ kind: "cake", size, base, combo, message: message.trim() || undefined, qty });
        setAdded(true);
      }}
    >
      <div className="space-y-6 lg:col-span-2">
        <Step n={1} title="Choose your size">
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
              />
            ))}
          </div>
        </Step>

        <Step n={2} title="Pick your base">
          <div className="grid gap-3 sm:grid-cols-3">
            {cakeBases.map((b) => (
              <Choice
                key={b.id}
                name="base"
                value={b.id}
                checked={base === b.id}
                onChange={() => setBase(b.id)}
                title={b.label}
                note={"note" in b ? b.note : undefined}
              />
            ))}
          </div>
        </Step>

        <Step n={3} title="Choose your flavours">
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
              />
            ))}
          </div>
          <p className="mt-4 font-ui text-sm text-ink/70">
            Want a different size or flavour?{" "}
            <Link href="/contact" className="font-bold text-lake-deep underline underline-offset-2">
              Ask us about a custom cake
            </Link>
            .
          </p>
        </Step>

        <Step n={4} title="Add a message">
          <label htmlFor="cake-message" className="label">
            Message on the cake{" "}
            <span className="font-normal text-ink/50">(optional, up to 60 characters)</span>
          </label>
          <input
            id="cake-message"
            className="field"
            maxLength={60}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Happy birthday, Lucy!"
          />
          <p className="mt-4 font-ui text-sm text-ink/70">
            You&rsquo;ll pick your pickup date at checkout — at least {CAKE_LEAD_DAYS} days from today.
          </p>
        </Step>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-blob bg-lake-deep p-7 text-snow shadow-soft">
          <p className="eyebrow text-alpine">Your cake</p>
          <p className="display mt-3 text-4xl">{sizeInfo.label} cake</p>
          <dl className="mt-5 space-y-3 font-ui">
            <div>
              <dt className="text-sm text-alpine">Base</dt>
              <dd className="font-bold">{baseInfo.label}</dd>
            </div>
            <div>
              <dt className="text-sm text-alpine">Flavours</dt>
              <dd className="font-bold">{comboInfo.flavours}</dd>
            </div>
            <div>
              <dt className="text-sm text-alpine">Serves</dt>
              <dd className="font-bold">{sizeInfo.serves} people</dd>
            </div>
            {message.trim() ? (
              <div>
                <dt className="text-sm text-alpine">Message</dt>
                <dd className="font-bold">&ldquo;{message.trim()}&rdquo;</dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-6 flex items-center justify-between border-t border-snow/20 pt-5">
            <label htmlFor="cake-qty" className="font-ui text-sm text-alpine">
              Quantity
            </label>
            <select
              id="cake-qty"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="rounded-full bg-snow px-4 py-2 font-ui font-bold text-ink"
            >
              {Array.from({ length: CAKE_MAX_QTY }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-5 flex items-baseline justify-between font-ui">
            <span className="text-alpine">Total</span>
            <span className="text-3xl font-extrabold">{money(sizeInfo.price * qty)}</span>
          </p>
          <button type="submit" className="btn btn-berry mt-6 w-full">
            Add to cart
          </button>
          <div aria-live="polite" className="mt-4 min-h-6 text-center font-ui font-bold">
            {added ? (
              <span>
                Cake added!{" "}
                <Link href="/cart" className="text-butter underline underline-offset-2">
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
