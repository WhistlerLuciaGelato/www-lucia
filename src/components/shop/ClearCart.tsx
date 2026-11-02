"use client";

import { useEffect } from "react";
import { cart } from "@/lib/cart-store";

/** Empties the cart once the visitor lands back on the site after paying. */
export function ClearCart() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("order")) cart.clear();
  }, []);
  return null;
}
