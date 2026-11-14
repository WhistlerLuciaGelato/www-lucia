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
