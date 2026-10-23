"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/data/site";
import { useCart } from "@/lib/cart-store";
import { Logo } from "@/components/Logo";

// "Order" lives in the pill button, so the text nav shows the other sections (as in the design).
const textNav = nav.filter((item) => item.href !== "/order");

function CartLink() {
  const items = useCart();
  const count = items.reduce((n, i) => n + i.qty, 0);
  return (
    <Link
      href="/cart"
      className="btn btn-blush relative !px-4 sm:!px-6 lg:min-w-[7.875rem]"
      aria-label={count ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
    >
      Cart
      {count > 0 ? (
        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-strawberry px-1.5 font-ui text-xs font-extrabold text-snow">
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
    <header className="sticky top-0 z-40 bg-snow">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-[6.25rem] lg:py-5">
        <Link href="/" className="shrink-0" aria-label="Whistler Lucia Gelato — home">
          <Logo className="w-36 sm:w-44 xl:w-[15.625rem]" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-2 xl:gap-4">
            {textNav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`eyebrow block rounded-full px-3 py-2 !text-lg text-lakeside transition hover:text-lake-deep xl:!text-xl ${
                    isActive(item.href) ? "underline decoration-2 underline-offset-8" : ""
                  }`}
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-56 rounded-3xl bg-snow p-2 shadow-soft ring-1 ring-alpine">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-2xl px-4 py-2.5 font-body text-ink transition hover:bg-mist hover:text-lake-deep"
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

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/order" className="btn btn-berry hidden sm:inline-flex lg:min-w-[7.875rem]">
            Order
          </Link>
          <CartLink />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-alpine text-lakeside lg:hidden"
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
          className="fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto bg-snow px-4 pb-10 sm:top-24 lg:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="divide-y divide-alpine">
              {nav.map((item) => (
                <li key={item.href} className="py-4">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="display text-4xl text-lakeside"
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="eyebrow inline-block rounded-full bg-mist px-3 py-1.5 !text-sm text-lakeside"
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
