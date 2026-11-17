import type { NavItem } from "@/data/site";
import { siteText, type SiteText } from "@/data/pages/site-text";
import { getPageContent } from "@/lib/page-content";
import { HeaderBar } from "@/components/HeaderBar";

/** The site menu: where each item leads, with its words from the Studio (Header, footer & newsletter). */
export function siteNav(menu: SiteText["menu"]): NavItem[] {
  const { findUs, order, ourGelato, events, wholesale, about } = menu;
  return [
    {
      label: findUs.label,
      href: "/find-us",
      children: [
        { label: findUs.seasonal, href: "/find-us#map" },
        { label: findUs.schedule, href: "/find-us#schedule" },
        { label: findUs.grocery, href: "/find-us#grocery" },
        { label: findUs.scoops, href: "/find-us#scoops" },
      ],
    },
    {
      label: order.label,
      href: "/order",
      children: [
        { label: order.pints, href: "/our-gelato#order-pints" },
        { label: order.cakes, href: "/order/cakes" },
      ],
    },
    { label: ourGelato.label, href: "/our-gelato" },
    {
      label: events.label,
      href: "/events",
      children: [
        { label: events.packages, href: "/events#packages" },
        { label: events.faq, href: "/events#faq" },
        { label: events.book, href: "/events#book" },
      ],
    },
    {
      label: wholesale.label,
      href: "/wholesale",
      children: [
        { label: wholesale.info, href: "/wholesale#info" },
        { label: wholesale.flavours, href: "/wholesale#flavours" },
        { label: wholesale.order, href: "/wholesale#order" },
      ],
    },
    {
      label: about.label,
      href: "/about",
      children: [
        { label: about.story, href: "/about" },
        { label: about.contact, href: "/contact" },
      ],
    },
  ];
}

export async function Header() {
  const { menu } = await getPageContent("siteText", siteText);
  return <HeaderBar nav={siteNav(menu)} orderLabel={menu.order.label} cartLabel={menu.cartLabel} />;
}
