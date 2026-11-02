import type { Location } from "@/lib/content-types";

// Copy and locations from the "Find us" website design. Pins are from OpenStreetMap.
// Hours are left empty until Lucia confirms them; they can be added in the Studio.
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
    scheduleSeason: "Summer",
    hours: [],
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
    scheduleSeason: "Summer",
    hours: [],
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
    scheduleSeason: "Summer",
    hours: [],
    seasonClosed: false,
  },
];

export const groceryStores: { town: string; stores: string[] }[] = [
  {
    town: "Whistler",
    stores: [
      "Creekside Market",
      "Fresh Street Market",
      "Nester's Market",
      "The Grocery Store",
      "Upper Village Market",
    ],
  },
  { town: "Squamish", stores: ["Nester's Market", "Stong's Market"] },
  { town: "Pemberton", stores: ["Pemberton Valley Supermarket"] },
  {
    town: "Along the Sea to Sky",
    stores: ["Green Lake Station", "Whistler RV Park", "Farmers on Duty"],
  },
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
      "Christine's",
      "Dubh Linn Gate",
      "GLC",
      "Lorette",
      "Nagomi Sushi",
      "Nicklaus North Golf Course",
      "Pizza Antico",
      "Portobello",
      "Quattro",
      "Ravens Room",
      "Red Door",
      "Rendezvous",
      "Rimrock",
      "Roundhouse",
      "Sachi Sushi",
      "Steeps",
      "Tapley's",
    ],
  },
  {
    group: "Cafés",
    places: ["Camp", "Delish Cafe", "Forecast", "Scandinave Spa", "Squamish Adventure Centre"],
  },
  {
    group: "Catering",
    places: ["Collective Kitchen", "Harvest Catering", "Whistler Blackcomb Catering"],
  },
  {
    group: "Hotels",
    places: ["Delta Village Suites", "Fairmont", "Four Seasons", "Hilton", "The Westin"],
  },
];
