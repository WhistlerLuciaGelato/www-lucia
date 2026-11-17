import { defineType } from "sanity";
import { blurb, line, photo, section, seoDescription } from "./pageFields";

const INSTAGRAM_LINK = "Put [square brackets] around the words that should link to Instagram.";
const NEW_LINES = "Press Enter to start a new line.";

export const findUsPage = defineType({
  name: "findUsPage",
  title: "Find us",
  type: "document",
  description:
    "The words and photo around the Find us page. Locations and hours, and the stores and partners that carry Lucia, have their own documents.",
  fields: [
    section(
      "hero",
      "Top of the page",
      [
        line("title", "Big heading"),
        blurb("intro", "Text"),
        line("scheduleLabel", "“Schedule & hours” button"),
        section(
          "shortcuts",
          "Round shortcuts",
          [
            line("scoopShops", "Scoop shops shortcut"),
            line("pints", "Pints shortcut"),
            line("otherVendors", "Other vendors shortcut"),
          ],
          { description: "The labels under the three round icons that jump down the page." },
        ),
        photo("photo", "Photo", {
          description:
            "Shown next to the intro, cropped to a nearly square shape. Drag the hotspot to keep the important part in view.",
        }),
      ],
      { collapsed: false },
    ),
    section("seasonal", "Seasonal scoop shops (map)", [
      line("pill", "Small label", { description: "The coloured label above the heading." }),
      blurb("title", "Heading", { rows: 2, description: NEW_LINES }),
      section("mapButtons", "Buttons under the map", [
        line("nearest", "“Find scoop nearest me” button"),
        line("seeAll", "“See all on map” button"),
        line("schedule", "“Schedule & hours” button"),
      ]),
      section("cardButtons", "Buttons in an opened location card", [
        line("googleMaps", "“Show in Google Maps” button"),
        line("schedule", "“Schedule” button"),
      ]),
      section("note", "“Take note!” box", [
        line("title", "Heading"),
        blurb("text", "Text", { rows: 4, description: INSTAGRAM_LINK }),
      ]),
    ]),
    section("schedule", "Schedule & hours", [
      line("pill", "Small label", { description: "The coloured label above the heading." }),
      line("title", "Heading"),
      section(
        "calendarNote",
        "Note above the calendar",
        [
          blurb("open", "While spots are open", { rows: 2, description: INSTAGRAM_LINK }),
          blurb("closed", "When every spot is closed for the season", {
            rows: 3,
            description: `${INSTAGRAM_LINK} Wrap words in **double asterisks** to make them bold.`,
          }),
        ],
        {
          description: "The first shows while any spot has open dates coming up; the second once none do.",
        },
      ),
      blurb("intro", "Text above the hours table", { rows: 2 }),
      section("table", "Hours table", [
        line("location", "“Location” column heading"),
        line("season", "“Season” column heading"),
        line("hours", "“Hours” column heading"),
        line("noHours", "Shown when a spot has no hours yet"),
      ]),
      section("weather", "Mountain weather box", [
        line("title", "Heading"),
        blurb("text", "Text", { rows: 4, description: INSTAGRAM_LINK }),
      ]),
    ]),
    section("grocery", "Take home a pint (grocery stores)", [
      line("pill", "Small label", { description: "The coloured label above the heading." }),
      line("title", "Heading"),
      blurb("intro", "Text", { rows: 4 }),
      blurb("note", "Bold note", { rows: 2, description: NEW_LINES }),
    ]),
    section("partners", "Scoop partners", [
      line("pill", "Small label", { description: "The coloured label above the heading." }),
      line("title", "Heading"),
      blurb("intro", "Text", { rows: 4 }),
      blurb("note", "Bold note", { rows: 2, description: NEW_LINES }),
    ]),
    section("menu", "Also on the menu (restaurants and hotels)", [
      line("title", "Heading"),
      blurb("note", "Bold note under the list", { rows: 2, description: NEW_LINES }),
      line("wholesalePrompt", "Question next to the wholesale button"),
      line("wholesaleLabel", "“Become a wholesale partner” button"),
    ]),
    seoDescription(),
  ],
  preview: { prepare: () => ({ title: "Find us" }) },
});
