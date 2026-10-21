import type { Location } from "@/lib/content-types";

// Coordinates are approximate pins for the map embed.
// TODO(client): confirm days and hours for each location before launch.
export const seasonalSpots: Location[] = [
  {
    id: "roundhouse",
    name: "Roundhouse Lodge",
    area: "Top of the Whistler Village Gondola",
    season: "Winter",
    description: "Refuel mid-mountain with a scoop and a view of the Coast Mountains.",
    lat: 50.0676,
    lng: -122.9474,
    scheduleSeason: "Ski season (Nov – Apr)",
    hours: [{ days: "Daily", time: "During lift hours" }],
    seasonClosed: false,
  },
  {
    id: "blackcomb-kids",
    name: "Kids Park, Blackcomb Base",
    area: "Upper Village",
    season: "Winter",
    description: "Right by the magic carpet, for après-ski scoops with the little shredders.",
    lat: 50.1146,
    lng: -122.9485,
    scheduleSeason: "Ski season (Nov – Apr)",
    hours: [{ days: "Daily", time: "During lift hours" }],
    seasonClosed: false,
  },
  {
    id: "lost-lake",
    name: "Lost Lake Park",
    area: "Gelato trailer · rotating RMOW lakes",
    season: "Summer",
    description: "Find the trailer by the beach — swim, scoop, repeat.",
    lat: 50.1255,
    lng: -122.9392,
    scheduleSeason: "Summer (late Jun – Sep)",
    hours: [{ days: "Daily", time: "12 – 7pm" }],
    seasonClosed: false,
  },
  {
    id: "olympic-plaza",
    name: "Whistler Olympic Plaza",
    area: "Gelato trailer · Whistler Village",
    season: "Summer",
    description: "Summer concerts, festivals and lazy afternoons on the lawn.",
    lat: 50.1191,
    lng: -122.9551,
    scheduleSeason: "Summer (late Jun – Sep)",
    hours: [{ days: "Event days & weekends", time: "12 – 8pm" }],
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
