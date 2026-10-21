"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/data/site";
import { useCart } from "@/lib/cart-store";

function CartLink() {
  const items = useCart();
  const count = items.reduce((n, i) => n + i.qty, 0);
  return (
    <Link
      href="/cart"
      className="relative inline-flex h-11 items-center gap-2 rounded-full bg-blush px-4 font-ui text-sm font-extrabold text-berry transition hover:bg-alpenglow"
      aria-label={count ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        aria-hidden
      >
        <path d="M6 7h12l-1 13H7L6 7Z" strokeLinejoin="round" />
        <path d="M9 7a3 3 0 0 1 6 0" strokeLinecap="round" />
      </svg>
      <span className="hidden sm:inline">Cart</span>
      {count > 0 ? (
        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-berry px-1.5 text-xs text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu after navigating.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-alpine/70 bg-snow/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="Whistler Lucia Gelato — home">
          <Image src="/brand/logo.svg" alt="" width={132} height={56} priority className="h-14 w-auto" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`eyebrow inline-flex items-center gap-1 rounded-full px-3.5 py-2.5 transition hover:bg-mist ${
                    isActive(item.href) ? "bg-mist text-lake-deep" : "text-ink"
                  }`}
                >
                  {item.label}
                  {item.children ? (
                    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 opacity-60" aria-hidden>
                      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  ) : null}
                </Link>
                {item.children ? (
                  <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-56 rounded-3xl bg-white p-2 shadow-soft ring-1 ring-alpine">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-2xl px-4 py-2.5 font-ui font-semibold text-ink transition hover:bg-mist hover:text-lake-deep"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/order/pints" className="btn btn-primary hidden !py-3 xl:inline-flex">
            Order pints
          </Link>
          <CartLink />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-mist text-lake-deep lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-20 bottom-0 overflow-y-auto bg-snow px-4 pb-10 lg:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="divide-y divide-alpine">
              {nav.map((item) => (
                <li key={item.href} className="py-4">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="display text-3xl text-lakeside"
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="inline-block rounded-full bg-mist px-3 py-1.5 font-ui text-sm font-semibold text-lake-deep"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
