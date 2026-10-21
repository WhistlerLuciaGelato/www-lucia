export type SeasonalSpot = {
  id: string;
  name: string;
  area: string;
  season: "Winter" | "Summer";
  description: string;
  lat: number;
  lng: number;
};

// Coordinates are approximate pins for the map embed.
export const seasonalSpots: SeasonalSpot[] = [
  {
    id: "roundhouse",
    name: "Roundhouse Lodge",
    area: "Top of the Whistler Village Gondola",
    season: "Winter",
    description: "Refuel mid-mountain with a scoop and a view of the Coast Mountains.",
    lat: 50.0676,
    lng: -122.9474,
  },
  {
    id: "blackcomb-kids",
    name: "Kids Park, Blackcomb Base",
    area: "Upper Village",
    season: "Winter",
    description: "Right by the magic carpet, for après-ski scoops with the little shredders.",
    lat: 50.1146,
    lng: -122.9485,
  },
  {
    id: "lost-lake",
    name: "Lost Lake Park",
    area: "Gelato trailer · rotating RMOW lakes",
    season: "Summer",
    description: "Find the trailer by the beach — swim, scoop, repeat.",
    lat: 50.1255,
    lng: -122.9392,
  },
  {
    id: "olympic-plaza",
    name: "Whistler Olympic Plaza",
    area: "Gelato trailer · Whistler Village",
    season: "Summer",
    description: "Summer concerts, festivals and lazy afternoons on the lawn.",
    lat: 50.1191,
    lng: -122.9551,
  },
];

export type ScheduleRow = {
  spot: string;
  season: string;
  days: string;
  hours: string;
};

// TODO(client): confirm days and hours for each location before launch.
export const schedule: ScheduleRow[] = [
  {
    spot: "Roundhouse Lodge",
    season: "Ski season (Nov – Apr)",
    days: "Daily",
    hours: "During lift hours",
  },
  {
    spot: "Kids Park, Blackcomb Base",
    season: "Ski season (Nov – Apr)",
    days: "Daily",
    hours: "During lift hours",
  },
  {
    spot: "Gelato trailer — Lost Lake Park",
    season: "Summer (late Jun – Sep)",
    days: "Daily",
    hours: "12 – 7pm",
  },
  {
    spot: "Gelato trailer — Whistler Olympic Plaza",
    season: "Summer (late Jun – Sep)",
    days: "Event days & weekends",
    hours: "12 – 8pm",
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
