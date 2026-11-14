"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { EventPhoto } from "@/lib/content-types";

export type CarouselImage = EventPhoto;

/** Strip height (px) at each breakpoint, for the `sizes` hint. Matches the h-* classes below. */
const STRIP_HEIGHT = { base: 256, lg: 400 };

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const roundButton =
  "grid h-11 w-11 place-items-center rounded-full bg-snow/90 text-lakeside shadow-soft transition hover:bg-snow active:scale-95";

/**
 * A full-bleed, swipeable row of photos at their natural shapes (Figma: Events › Group 24), with
 * previous/next buttons. Clicking a photo opens it full screen in a lightbox: Esc closes it, the
 * arrow keys (or a swipe) move between photos, and focus returns to the photo you opened.
 */
export function ImageCarousel({ images, label }: { images: CarouselImage[]; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const count = images.length;

  const scrollStrip = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;
    // Loop around at either end.
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  };

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };

  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + count) % count)),
    [count],
  );

  // Keep the page behind the lightbox from scrolling while it's open.
  const isOpen = index !== null;
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = before;
    };
  }, [isOpen]);

  const onClose = () => {
    // Return focus to the photo last shown, scrolled into view in the strip.
    const thumb = index === null ? null : thumbs.current[index];
    setIndex(null);
    if (thumb) {
      thumb.focus({ preventScroll: true });
      thumb.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    }
  };

  const current = index === null ? null : images[index];

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <ul
        ref={track}
        className="flex snap-x snap-proximity gap-2.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, i) => {
          const ratio = img.width / img.height;
          return (
            <li
              key={`${img.src}-${i}`}
              className="shrink-0 snap-start"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
            >
              <button
                ref={(el) => {
                  thumbs.current[i] = el;
                }}
                type="button"
                onClick={() => open(i)}
                aria-haspopup="dialog"
                className="group block h-64 overflow-hidden focus-visible:rounded-none focus-visible:outline-offset-[-4px] lg:h-[25rem]"
                style={{ aspectRatio: `${img.width} / ${img.height}` }}
              >
                <Image
                  src={img.src}
                  alt={img.alt ? `${img.alt} (open full screen)` : `Photo ${i + 1} (open full screen)`}
                  width={img.width}
                  height={img.height}
                  sizes={`(min-width: 1024px) ${Math.round(STRIP_HEIGHT.lg * ratio)}px, ${Math.round(STRIP_HEIGHT.base * ratio)}px`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  draggable={false}
                />
              </button>
            </li>
          );
        })}
      </ul>
      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => scrollStrip(-1)}
            className={`${roundButton} absolute top-1/2 left-3 -translate-y-1/2 sm:left-6`}
            aria-label="Scroll photos back"
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            onClick={() => scrollStrip(1)}
            className={`${roundButton} absolute top-1/2 right-3 -translate-y-1/2 sm:right-6`}
            aria-label="Scroll photos forward"
          >
            <Arrow dir="right" />
          </button>
        </>
      ) : null}

      <dialog
        ref={dialog}
        aria-label={`${label}: photo viewer`}
        onClose={onClose}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          }
        }}
        onClick={(e) => {
          // A click on the dark area around the photo closes the viewer.
          if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.backdrop !== undefined) {
            dialog.current?.close();
          }
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchX.current;
          const end = e.changedTouches[0]?.clientX;
          touchX.current = null;
          if (start === null || end === undefined || Math.abs(end - start) < 50) return;
          step(end < start ? 1 : -1);
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-black/95 p-0 text-snow backdrop:bg-black/70"
      >
        {current ? (
          <div className="relative h-full w-full" data-backdrop>
            <div className="absolute inset-0" data-backdrop>
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
                draggable={false}
              />
            </div>

            <button
              type="button"
              autoFocus
              onClick={() => dialog.current?.close()}
              className={`${roundButton} absolute top-4 right-4 sm:top-6 sm:right-6`}
              aria-label="Close photo viewer"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </button>

            {count > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className={`${roundButton} absolute top-1/2 left-3 -translate-y-1/2 sm:left-6`}
                  aria-label="Previous photo"
                >
                  <Arrow dir="left" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className={`${roundButton} absolute top-1/2 right-3 -translate-y-1/2 sm:right-6`}
                  aria-label="Next photo"
                >
                  <Arrow dir="right" />
                </button>
              </>
            ) : null}

            <p
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pt-10 pb-5 text-center font-ui text-sm"
              aria-live="polite"
            >
              <span className="font-bold">
                {(index ?? 0) + 1} / {count}
              </span>
              {current.alt ? <span className="ml-3 text-snow/85">{current.alt}</span> : null}
            </p>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
