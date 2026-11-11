"use client";

import Image from "next/image";
import { useRef } from "react";

export type CarouselImage = { src: string; alt: string; width: number; height: number };

/**
 * A swipeable row of photos that snaps to each image, with previous/next buttons. Uses native
 * scrolling, so touch, trackpad and keyboard all work.
 */
export function ImageCarousel({ images, label }: { images: CarouselImage[]; label: string }) {
  const track = useRef<HTMLUListElement>(null);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const slide = el.querySelector("li");
    const by = slide ? slide.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;
    // Loop around at either end.
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * by, behavior: "smooth" });
  };

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <ul
        ref={track}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] focus-visible:outline-offset-4 [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, i) => (
          <li
            key={img.src}
            className="w-[85%] shrink-0 snap-center sm:w-[60%] lg:w-[46%]"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${images.length}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(min-width: 1024px) 46vw, (min-width: 640px) 60vw, 85vw"
              className="aspect-[4/3] h-full w-full rounded-[2.5rem] object-cover"
              draggable={false}
            />
          </li>
        ))}
      </ul>
      <div className="mt-5 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          className="btn btn-sky !px-4"
          aria-label="Previous photo"
        >
          <span aria-hidden>←</span>
        </button>
        <button type="button" onClick={() => step(1)} className="btn btn-sky !px-4" aria-label="Next photo">
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
