"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps a package card's bear so it hops up with a little wobble the first time it scrolls into
 * view (Lucia, Nov 2026). `delay` (ms) staggers the cards in a row.
 */
export function BearInView({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Also show it if the page opened scrolled past it (e.g. a link to a section below).
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={seen ? "animate-[bear-hop_900ms_cubic-bezier(0.34,1.56,0.64,1)_both]" : "opacity-0"}
      style={seen ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
