import type { StructureResolver } from "sanity/structure";
import { PROMO_CODES_ID } from "./promo-codes-id";

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string, id = type) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(id).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Lucia Gelato")
    .items([
      S.listItem()
        .title("Opening hours & locations")
        .id("opening-hours")
        .child(
          S.documentTypeList("location")
            .title("Opening hours")
            .defaultOrdering([{ field: "orderRank", direction: "asc" }]),
        ),
      singleton(S, "siteSettings", "Announcement & contact"),
      S.listItem()
        .title("Pages: text & photos")
        .id("pages")
        .child(
          S.list()
            .title("Pages: text & photos")
            .items([
              singleton(S, "homePage", "Home"),
              singleton(S, "aboutPage", "About"),
              singleton(S, "ourGelatoPage", "Our gelato"),
              singleton(S, "findUsPage", "Find us"),
              singleton(S, "orderPage", "Order, cakes & cart"),
              singleton(S, "contactPage", "Contact"),
              singleton(S, "siteText", "Header, footer & newsletter"),
              S.divider(),
              S.listItem()
                .title("Weddings & events: see its “Page text & photos” tab")
                .id("events-text")
                .child(
                  S.document().schemaType("eventsPage").documentId("eventsPage").title("Weddings & events"),
                ),
              S.listItem()
                .title("Wholesale: see its “Page text & photos” tab")
                .id("wholesale-text")
                .child(
                  S.document().schemaType("wholesalePage").documentId("wholesalePage").title("Wholesale"),
                ),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("pintFlavour").title("Pint flavours"),
      singleton(S, "shopSettings", "Online shop: prices, pickup & cakes"),
      singleton(S, "promoCodes", "Promo codes", PROMO_CODES_ID),
      S.divider(),
      singleton(S, "stockists", "Stockists"),
      S.divider(),
      singleton(S, "eventsPage", "Weddings & events"),
      singleton(S, "wholesalePage", "Wholesale"),
    ]);
