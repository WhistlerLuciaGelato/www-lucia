"use client";

import { useEffect, useRef, type ReactNode } from "react";

const SPEED = 34; // px per second
const RESUME_AFTER = 1500; // ms after the visitor stops dragging or scrolling
const CLICK_SLOP = 6; // px a drag can move before it stops counting as a click

/**
 * Horizontal scroller that drifts on its own and can be dragged (mouse), swiped (touch)
 * or scrolled (trackpad). `children` must be two identical copies of the content side
 * by side, so wrapping by half the width loops endlessly in either direction.
 */
export function TilesMarquee({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let pos = el.scrollLeft;
    let lastSet = pos;
    let pauseUntil = 0;
    let hovering = false;
    let drag: { x: number; moved: number } | null = null;
    let last = performance.now();
    let frame = 0;

    const half = () => el.scrollWidth / 2;
    const wrap = (x: number) => {
      const h = half();
      if (h <= 0) return x;
      return ((x % h) + h) % h;
    };
    const setPos = (x: number) => {
      pos = wrap(x);
      el.scrollLeft = pos;
      lastSet = el.scrollLeft;
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      const paused =
        drag || hovering || el.querySelector(":focus-visible") || now < pauseUntil || reducedMotion.matches;
      if (!paused) {
        setPos(pos + (SPEED * dt) / 1000);
      } else if (!drag && el.scrollLeft !== lastSet) {
        // The visitor scrolled natively; carry on from where they left it.
        setPos(el.scrollLeft);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onScroll = () => {
      if (Math.abs(el.scrollLeft - lastSet) > 1) pauseUntil = performance.now() + RESUME_AFTER;
    };
    const onPointerDown = (e: PointerEvent) => {
      pauseUntil = performance.now() + RESUME_AFTER;
      if (e.pointerType !== "mouse" || e.button !== 0) return; // touch and pens scroll natively
      drag = { x: e.clientX, moved: 0 };
      dragged.current = false;
      el.dataset.dragging = "";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      drag.x = e.clientX;
      drag.moved += Math.abs(dx);
      if (drag.moved > CLICK_SLOP) dragged.current = true;
      setPos(pos - dx);
    };
    const onPointerUp = () => {
      if (!drag) return;
      drag = null;
      delete el.dataset.dragging;
      pauseUntil = performance.now() + RESUME_AFTER;
    };
    const onEnter = () => (hovering = true);
    const onLeave = () => (hovering = false);

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      className="tiles-marquee"
      onDragStart={(e) => e.preventDefault()}
      onClickCapture={(e) => {
        // A drag that ends on a tile shouldn't also open it.
        if (dragged.current) {
          e.preventDefault();
          e.stopPropagation();
          dragged.current = false;
        }
      }}
    >
      <div className="flex w-max">{children}</div>
    </div>
  );
}
