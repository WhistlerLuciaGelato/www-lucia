"use client";

import { useRef, useState } from "react";
import type { WholesaleContent, WholesaleFormat } from "@/lib/content-types";
import { money } from "@/lib/format";
import { useToday } from "@/lib/cart-store";
import { Field, FormNotice, Honeypot, SelectField, TextArea } from "@/components/forms/fields";
import { useFormSubmit } from "@/components/forms/useFormSubmit";

type Line = { id: number; format: string; flavour: string; qty: number };

export function WholesaleOrderForm({ content }: { content: WholesaleContent }) {
  const { formats: wholesaleFormats, flavourGroups, deliverySchedule } = content;
  const newLine = (id: number): Line => ({
    id,
    format: wholesaleFormats[0].id,
    flavour: "",
    qty: wholesaleFormats[0].multiple,
  });
  const groupsFor = (format: WholesaleFormat) =>
    flavourGroups.filter((g) => g.availableIn.includes(format.kind));
  const { state, submit, fieldError } = useFormSubmit();
  const today = useToday();
  const [lines, setLines] = useState<Line[]>(() => [newLine(0)]);
  const nextId = useRef(1);

  const update = (id: number, patch: Partial<Line>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const subtotal = lines.reduce((sum, l) => {
    const f = wholesaleFormats.find((x) => x.id === l.format);
    return sum + (f ? f.price * (l.qty || 0) : 0);
  }, 0);

  if (state.status === "success") {
    return (
      <FormNotice
        state={state}
        success={
          <>
            <p className="subhead text-2xl">Order received — thank you!</p>
            <p className="mt-2 font-normal">We&rsquo;ll confirm your order and delivery day by email.</p>
          </>
        }
      />
    );
  }

  return (
    <form
      noValidate
      className="relative grid gap-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        const get = (k: string) => String(d.get(k) ?? "");
        submit({
          type: "wholesale",
          business: get("business"),
          name: get("name"),
          email: get("email"),
          phone: get("phone"),
          area: get("area"),
          address: get("address"),
          deliveryDate: get("deliveryDate"),
          newAccount: d.get("newAccount") === "on",
          lines: lines.map(({ format, flavour, qty }) => ({ format, flavour, qty })),
          message: get("message"),
          website: get("website"),
        });
      }}
    >
      <Honeypot />
      <Field
        label="Business name"
        name="business"
        required
        autoComplete="organization"
        error={fieldError("business")}
      />
      <Field label="Contact name" name="name" required autoComplete="name" error={fieldError("name")} />
      <Field
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        error={fieldError("email")}
      />
      <Field label="Phone" name="phone" type="tel" required autoComplete="tel" error={fieldError("phone")} />
      <SelectField label="Delivery area" name="area" error={fieldError("area")}>
        {deliverySchedule.map((d) => (
          <option key={d.area}>{d.area}</option>
        ))}
      </SelectField>
      <Field
        label="Preferred delivery date"
        name="deliveryDate"
        type="date"
        min={today ?? undefined}
        hint="Leave blank for your next scheduled delivery day"
        error={fieldError("deliveryDate")}
      />
      <Field
        label="Delivery address"
        name="address"
        required
        autoComplete="street-address"
        className="sm:col-span-2"
        error={fieldError("address")}
      />

      <fieldset className="sm:col-span-2">
        <legend className="label">Your order</legend>
        <ul className="space-y-3">
          {lines.map((line, index) => {
            const format = wholesaleFormats.find((f) => f.id === line.format) ?? wholesaleFormats[0];
            const groups = groupsFor(format);
            const qtyError = fieldError(`lines.${index}.qty`);
            const flavourError = fieldError(`lines.${index}.flavour`);
            const badMultiple = line.qty > 0 && line.qty % format.multiple !== 0;
            return (
              <li
                key={line.id}
                className="grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-alpine sm:grid-cols-12 sm:items-start"
              >
                <div className="sm:col-span-4">
                  <label className="sr-only" htmlFor={`format-${line.id}`}>
                    Format
                  </label>
                  <select
                    id={`format-${line.id}`}
                    className="field"
                    value={line.format}
                    onChange={(e) => {
                      const nextFormat = e.target.value;
                      const f = wholesaleFormats.find((x) => x.id === nextFormat) ?? wholesaleFormats[0];
                      update(line.id, { format: nextFormat, flavour: "", qty: f.multiple });
                    }}
                  >
                    {wholesaleFormats.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label} — {money(f.price)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-4">
                  <label className="sr-only" htmlFor={`flavour-${line.id}`}>
                    Flavour
                  </label>
                  <select
                    id={`flavour-${line.id}`}
                    className="field"
                    value={line.flavour}
                    onChange={(e) => update(line.id, { flavour: e.target.value })}
                    aria-invalid={flavourError ? true : undefined}
                  >
                    <option value="">Choose a flavour…</option>
                    {groups.map((g) => (
                      <optgroup key={g.id} label={g.label}>
                        {g.flavours.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {flavourError ? (
                    <p className="mt-1 font-ui text-sm font-semibold text-berry">{flavourError}</p>
                  ) : null}
                </div>
                <div className="sm:col-span-2">
                  <label className="sr-only" htmlFor={`qty-${line.id}`}>
                    Quantity
                  </label>
                  <input
                    id={`qty-${line.id}`}
                    type="number"
                    inputMode="numeric"
                    min={format.multiple}
                    step={format.multiple}
                    className="field"
                    value={line.qty || ""}
                    onChange={(e) => update(line.id, { qty: Number(e.target.value) })}
                    aria-invalid={qtyError || badMultiple ? true : undefined}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 sm:col-span-2 sm:justify-end sm:pt-2.5">
                  <span className="font-ui font-bold text-ink">{money(format.price * (line.qty || 0))}</span>
                  {lines.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setLines((ls) => ls.filter((l) => l.id !== line.id))}
                      className="grid h-8 w-8 place-items-center rounded-full bg-mist text-berry hover:bg-blush"
                      aria-label="Remove this item"
                    >
                      ×
                    </button>
                  ) : null}
                </div>
                {format.note || qtyError ? (
                  <p
                    className={`font-ui text-sm sm:col-span-12 ${qtyError || badMultiple ? "font-semibold text-berry" : "text-ink/60"}`}
                  >
                    {qtyError ?? format.note}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => setLines((ls) => [...ls, newLine(nextId.current++)])}
          className="mt-3 font-ui font-bold text-lake-deep underline underline-offset-2"
        >
          + Add another item
        </button>
      </fieldset>

      <label className="flex items-center gap-3 font-ui text-ink sm:col-span-2">
        <input type="checkbox" name="newAccount" className="h-5 w-5 accent-[#2f6e7e]" />
        This is our first order — please set us up as a new wholesale account
      </label>

      <TextArea label="Notes" name="message" className="sm:col-span-2" error={fieldError("message")} />

      <div className="flex flex-col gap-4 rounded-3xl bg-mist p-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-ui">
          <p className="text-sm text-ink/70">Estimated subtotal</p>
          <p className="text-2xl font-extrabold text-ink" aria-live="polite">
            {money(subtotal)}
          </p>
          <p className="text-xs text-ink/60">
            Before delivery fees &amp; tax. We&rsquo;ll confirm the final total.
          </p>
        </div>
        <button type="submit" className="btn btn-primary" disabled={state.status === "submitting"}>
          {state.status === "submitting" ? "Sending…" : "Send order"}
        </button>
      </div>
      <div className="sm:col-span-2">
        <FormNotice state={state} success={null} />
      </div>
    </form>
  );
}
