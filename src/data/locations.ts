import type { Location } from "@/lib/content-types";

// Copy, locations and hours from the "Find us" website design. Pins are from OpenStreetMap.
// Spots with no hours show "Hours TBC" until Lucia confirms them in the Studio.
export const seasonalSpots: Location[] = [
  {
    id: "roundhouse",
    name: "Roundhouse Lodge",
    area: "Top of Whistler Village Gondola",
    season: "Summer",
    description:
      "Enjoy a scoop with a view at the top of Whistler Mountain, just outside the Roundhouse Lodge. The perfect treat after a day of exploring the alpine or before descending into the Whistler Mountain Bike Park!",
    lat: 50.06974,
    lng: -122.94661,
    scheduleSeason: "Summer",
    hours: [],
    seasonClosed: false,
  },
  {
    id: "blackcomb-kids",
    name: "Blackcomb Base",
    area: "Upper Village Family Adventure Zone (Kids Park)",
    season: "Summer",
    description:
      "Take a break and cool off with a delicious scoop in Upper Village, right at the base of the Blackcomb Gondola. Surrounded by fun activities for kids of all ages, it’s the perfect spot for the whole family to enjoy a sweet treat!",
    lat: 50.1148,
    lng: -122.9482,
    scheduleSeason: "Summer",
    hours: [],
    seasonClosed: false,
  },
  {
    id: "lost-lake",
    name: "Lost Lake",
    area: "Gelato Trailer – Rotating RMOW Lakes",
    season: "Summer",
    description:
      "Find us by the lake! Swim, scoop, repeat.\nFollow @whistlerluciagelato for this week’s spot.",
    lat: 50.12666,
    lng: -122.93519,
    scheduleName: "Gelato trailer · Lost Lake Park",
    scheduleSeason: "Late Jun – Sep",
    hours: [{ days: "Daily", time: "12 – 7pm" }],
    seasonClosed: false,
  },
  {
    id: "rainbow-park",
    name: "Rainbow Park",
    area: "Gelato Trailer – Rotating RMOW Lakes",
    season: "Summer",
    description:
      "Find us by the lake! Swim, scoop, repeat.\nFollow @whistlerluciagelato for this week’s spot.",
    lat: 50.12053,
    lng: -122.98436,
    scheduleName: "Gelato trailer · Rainbow Park",
    scheduleSeason: "Late Jun – Sep",
    hours: [{ days: "Daily", time: "12 – 7pm" }],
    seasonClosed: false,
  },
  {
    id: "olympic-plaza",
    name: "Whistler Olympic Plaza",
    area: "Find us at select summer events",
    season: "Summer",
    description:
      "Find us at select summer events hosted by the **Resort Municipality of Whistler (RMOW), including the Whistler Summer Concert Series and Free Movies at Olympic Plaza!** Whether you’re enjoying live music under the mountains or a movie night under the stars, grab a scoop of Lucia Gelato to make your summer evening even sweeter. Be sure to check our schedule for the specific event dates we’ll be attending!\n\nFollow @whistlerluciagelato for this week’s spot.",
    lat: 50.11871,
    lng: -122.9545,
    scheduleName: "Gelato trailer · Whistler Olympic Plaza",
    scheduleSeason: "Late Jun – Sep",
    hours: [{ days: "Special events", time: "dates & hours TBC" }],
    seasonClosed: false,
  },
];

export const groceryStores: { town: string; stores: string[] }[] = [
  {
    town: "Whistler area",
    stores: [
      "Creekside Market",
      "Green Lake Station",
      "Fresh St. Market",
      "Nesters Market Whistler",
      "The Grocery Store",
      "Upper Village Market",
      "Whistler RV Park",
      "Scandinave Spa",
    ],
  },
  { town: "Squamish", stores: ["Nesters Market Squamish", "Stong's Market", "Farmers on Duty"] },
  { town: "Pemberton", stores: ["Pemberton Valley Supermarket"] },
];

export const scoopShops: { name: string; address: string; town: string }[] = [
  { name: "North Arm Farm", address: "1888 BC-99", town: "Pemberton" },
  { name: "Narwhals", address: "38220 Highway 99", town: "Squamish" },
  { name: "Cross Country Connection", address: "7400 Fitzsimmons Rd S", town: "Whistler" },
];

export const onTheMenu: { group: string; places: string[] }[] = [
  {
    group: "Restaurants",
    places: [
      "All Seasons Grill",
      "Brew Creek Lodge",
      "Caramba",
      "Christine's (Blackcomb)",
      "Dubh Linn Gate",
      "GLC",
      "Lorette Brasserie",
      "Nagomi Sushi",
      "Nicklaus North Golf Course",
      "Pizzeria Antico",
      "Stonesedge Kitchen",
      "Portobello",
      "Quattro",
      "Ravens Room",
      "Red Door Bistro",
      "Rendezvous (Blackcomb)",
      "Rimrock",
      "Roundhouse Lodge (Whistler)",
      "Sachi Sushi",
      "Steeps Grill (Whistler)",
      "Tapley's",
      "Pasta Lupino",
    ],
  },
  {
    group: "Cafés",
    places: [
      "Camp Lifestyle & Coffee Co.",
      "Delish Cafe",
      "Forecast Coffee",
      "Scandinave Spa",
      "Squamish Adventure Centre",
    ],
  },
  {
    group: "Catering",
    places: ["Collective Kitchen", "Harvest Catering", "Whistler Blackcomb Catering"],
  },
  {
    group: "Hotel",
    places: [
      "Delta Whistler Village Suites",
      "Fairmont Chateau Whistler",
      "Four Seasons Resort Whistler",
      "Hilton Whistler Resort & Spa",
      "The Westin Resort & Spa, Whistler",
    ],
  },
];
