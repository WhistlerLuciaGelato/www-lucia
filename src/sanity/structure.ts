import type { StructureResolver } from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title));

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
      S.divider(),
      singleton(S, "stockists", "Stockists"),
      S.divider(),
      singleton(S, "eventsPage", "Weddings & events"),
      singleton(S, "wholesalePage", "Wholesale"),
    ]);
