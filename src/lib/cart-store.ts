"use client";

import { useSyncExternalStore } from "react";
import { cartItemSchema, itemKey, type CartItem } from "@/lib/cart";
import { todayInWhistler } from "@/lib/format";
import { CAKE_MAX_QTY, PINT_MAX_PER_FLAVOUR } from "@/data/shop";

const STORAGE_KEY = "lucia-cart-v1";
const EMPTY: CartItem[] = [];

let items: CartItem[] | null = null;
const listeners = new Set<() => void>();

function read(): CartItem[] {
  if (items) return items;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    items = Array.isArray(parsed)
      ? parsed.flatMap((entry) => {
          const result = cartItemSchema.safeParse(entry);
          return result.success ? [result.data] : [];
        })
      : [];
  } catch {
    items = [];
  }
  return items;
}

function write(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or storage full: the cart still works for this page view.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      items = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const cart = {
  add(item: CartItem) {
    const current = read();
    const key = itemKey(item);
    const existing = current.find((i) => itemKey(i) === key);
    if (existing) {
      cart.setQty(key, existing.qty + item.qty);
    } else {
      write([...current, item]);
    }
  },
  setQty(key: string, qty: number) {
    write(
      read().flatMap((i) => {
        if (itemKey(i) !== key) return [i];
        if (qty <= 0) return [];
        const max = i.kind === "pint" ? PINT_MAX_PER_FLAVOUR : CAKE_MAX_QTY;
        return [{ ...i, qty: Math.min(qty, max) }];
      }),
    );
  },
  remove(key: string) {
    write(read().filter((i) => itemKey(i) !== key));
  },
  clear() {
    write([]);
  },
};

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

const noopSubscribe = () => () => {};

/** Today's date in Whistler, or null while prerendering (so nothing time-based is baked in). */
export function useToday(): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => todayInWhistler(),
    () => null,
  );
}
