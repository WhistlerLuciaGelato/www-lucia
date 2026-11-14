import type { Location, Stockists } from "@/lib/content-types";

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
    calendarCode: "RO",
    calendarLabel: "Roundhouse",
    calendarColor: "heatwave",
    openDates: [],
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
    calendarCode: "B",
    calendarLabel: "Blackcomb Base",
    calendarColor: "lakeside",
    openDates: [],
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
    scheduleSeason: "Summer",
    hours: [],
    seasonClosed: false,
    calendarCode: "L",
    calendarLabel: "Lost Lake",
    calendarColor: "grass",
    openDates: [],
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
    scheduleSeason: "Summer",
    hours: [],
    seasonClosed: false,
    calendarCode: "RB",
    calendarLabel: "Rainbow",
    calendarColor: "alpenglow",
    openDates: [],
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
    scheduleSeason: "Summer",
    hours: [{ days: "Special events", time: "dates & hours TBC" }],
    seasonClosed: false,
    calendarCode: "O",
    calendarLabel: "Olympic Plaza",
    calendarColor: "sunflower",
    openDates: [],
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

export const scoopShops: Stockists["scoopShops"] = [
  { name: "North Arm Farm", address: "1888 BC-99", town: "Pemberton", url: "https://www.northarmfarm.com/" },
  {
    name: "Narwhals",
    address: "38220 Highway 99",
    town: "Squamish",
    url: "https://www.instagram.com/narwhalsicecream/?hl=en",
  },
  {
    name: "Cross Country Connection",
    address: "7400 Fitzsimmons Rd S",
    town: "Whistler",
    url: "https://www.crosscountryconnection.ca/",
  },
];

const wb = (page: string) =>
  `https://www.whistlerblackcomb.com/explore-the-resort/the-village/dining/${page}.aspx`;

// Each place links to its own website (or its operator's page for it) where we could confirm one.
export const onTheMenu: Stockists["onTheMenu"] = [
  {
    group: "Restaurants",
    places: [
      { name: "All Seasons Grill", url: "https://allseasonsgrillwhistler.ca/" },
      { name: "Brew Creek Lodge", url: "https://www.thebrewcreekcentre.com/" },
      { name: "Caramba", url: "https://www.carambarestaurant.com/" },
      { name: "Christine’s (Blackcomb)", url: wb("christines") },
      { name: "Dubh Linn Gate", url: "https://whistler.dubhlinngate.com/" },
      { name: "GLC", url: wb("glc") },
      { name: "Lorette Brasserie", url: "https://lorettebrasserie.com/" },
      { name: "Nagomi Sushi", url: "https://nagomisushi.com/" },
      { name: "Nicklaus North Golf Course", url: "https://www.nicklausnorth.com/" },
      { name: "Pizzeria Antico", url: "https://www.pizzeriaantico.ca/" },
      { name: "Stonesedge Kitchen", url: "https://gibbonswhistler.com/venue/stonesedge-kitchen/" },
      {
        name: "Portobello",
        url: "https://www.fairmont.com/en/hotels/whistler/fairmont-chateau-whistler/dining/portobello.restaurant.html",
      },
      { name: "Quattro", url: "https://quattrorestaurants.com/" },
      { name: "Red Door Bistro", url: "https://www.reddoorbistro.ca/" },
      { name: "Rendezvous (Blackcomb)", url: wb("rendezvous") },
      { name: "Rimrock", url: "https://www.rimrockcafe.com/" },
      { name: "Roundhouse Lodge (Whistler)", url: wb("roundhouse-lodge") },
      { name: "Sachi Sushi", url: "http://www.sachisushi.com/" },
      { name: "Steeps Grill (Whistler)", url: wb("steeps") },
      { name: "Tapley’s", url: "https://gibbonswhistler.com/venue/tapleys-neighbourhood-pub/" },
      { name: "Pasta Lupino", url: "https://pastalupino.com/" },
    ],
  },
  {
    group: "Cafés",
    places: [
      { name: "Camp Lifestyle & Coffee Co.", url: "https://www.camplifestyle.ca/" },
      { name: "Delish Cafe" },
      { name: "Forecast Coffee", url: "https://forecastcoffee.ca/" },
      { name: "Scandinave Spa", url: "https://www.scandinave.com/whistler" },
      {
        name: "Squamish Adventure Centre",
        url: "https://www.exploresquamish.com/discover/about-squamish/squamish-adventure-centre/",
      },
    ],
  },
  {
    group: "Catering",
    places: [
      { name: "Collective Kitchen", url: "https://www.thecollectivekitchen.ca/" },
      { name: "Harvest Catering", url: "https://www.harvestchefsociety.com/" },
      {
        name: "Whistler Blackcomb Catering",
        url: "https://www.whistlerblackcomb.com/explore-the-resort/about-the-resort/groups-and-weddings.aspx",
      },
    ],
  },
  {
    group: "Hotel",
    places: [
      {
        name: "Delta Whistler Village Suites",
        url: "https://www.marriott.com/en-us/hotels/ysewv-delta-hotels-whistler-village-suites/overview/",
      },
      {
        name: "Fairmont Chateau Whistler",
        url: "https://www.fairmont.com/en/hotels/whistler/fairmont-chateau-whistler.html",
      },
      { name: "Four Seasons Resort Whistler", url: "https://www.fourseasons.com/whistler/" },
      {
        name: "Hilton Whistler Resort & Spa",
        url: "https://www.hilton.com/en/hotels/ywsvrhf-hilton-whistler-resort-and-spa/",
      },
      {
        name: "The Westin Resort & Spa, Whistler",
        url: "https://www.marriott.com/en-us/hotels/ysewi-the-westin-resort-and-spa-whistler/overview/",
      },
    ],
  },
];
