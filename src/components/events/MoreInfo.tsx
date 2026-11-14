"use client";

import { useId, useState } from "react";

/** A package's "More info": closed at first, and drops open when tapped (Lucia, Nov 2026). */
export function MoreInfo({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="w-full border-t border-black pt-1 text-left font-ui text-[0.8125rem] leading-snug text-black">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 py-1 font-bold"
      >
        More info
        <svg
          aria-hidden
          viewBox="0 0 12 8"
          className={`h-2 w-3 transition duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 1.5 6 6.5l5-5" />
        </svg>
      </button>
      <div
        id={id}
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        inert={!open}
      >
        <div className="overflow-hidden">
          <div className="pt-1.5">{children}</div>
        </div>
      </div>
    </div>
  );
}
