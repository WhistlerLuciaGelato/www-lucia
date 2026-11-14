"use client";

import { useState } from "react";
import { promoLabel, type PromoTerms } from "@/lib/promo";

/**
 * "Promo code" in the cart: checks a code with /api/promo and hands its terms to the cart, which
 * works out the discount. The server checks the code again when the order is created.
 */
export function PromoCodeField({
  applied,
  problem,
  onApply,
  onRemove,
}: {
  applied: PromoTerms | null;
  /** Why the applied code doesn't fit this cart (e.g. below its minimum), if it doesn't. */
  problem: string | null;
  onApply: (terms: PromoTerms) => void;
  onRemove: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    const wanted = code.trim();
    if (!wanted) return;
    setChecking(true);
    setError("");
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: wanted }),
      });
      const data = (await res.json().catch(() => ({}))) as Partial<PromoTerms> & { error?: string };
      if (res.ok && data.code) {
        onApply(data as PromoTerms);
        setCode("");
      } else {
        setError(data.error ?? "That code isn't valid.");
      }
    } catch {
      setError("We couldn't check that code. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  if (applied) {
    return (
      <div className="mt-5">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3 font-ui text-sm">
          <span className="font-bold text-ink">{promoLabel(applied)}</span>
          <button
            type="button"
            onClick={onRemove}
            className="cursor-pointer font-bold text-lake-deep underline underline-offset-2"
          >
            Remove
          </button>
        </div>
        {problem ? (
          <p role="alert" className="mt-2 font-ui text-sm font-bold text-berry">
            {problem}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={apply} className="mt-5">
      <label htmlFor="promo-code" className="label">
        Promo code <span className="font-normal text-ink/50">(optional)</span>
      </label>
      <div className="flex gap-2">
        <input
          id="promo-code"
          className="field min-w-0 flex-1 uppercase"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={32}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "promo-code-error" : undefined}
        />
        <button
          type="submit"
          disabled={!code.trim() || checking}
          className="btn btn-sky shrink-0 !min-h-0 self-stretch"
        >
          {checking ? "Checking…" : "Apply"}
        </button>
      </div>
      {error ? (
        <p id="promo-code-error" role="alert" className="mt-2 font-ui text-sm font-bold text-berry">
          {error}
        </p>
      ) : null}
    </form>
  );
}
