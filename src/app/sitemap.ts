import type { MetadataRoute } from "next";
import { site } from "@/data/site";

const routes = [
  "",
  "/find-us",
  "/order",
  "/order/pints",
  "/order/cakes",
  "/our-gelato",
  "/events",
  "/wholesale",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
