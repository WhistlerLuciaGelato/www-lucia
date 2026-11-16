import type { EventPackage, EventPhoto } from "@/lib/content-types";

// Default events content, used until the Sanity Studio has its own. Copy from the website design
// (Figma "Lucia Website" › XX Working Zone › Events). `**bold**` marks bold text.
export const eventPackages: EventPackage[] = [
  {
    id: "classic",
    name: "The Classic",
    basePrice: 600,
    baseGuests: 50,
    perGuest: 7,
    features: [
      "Wooden gelato display with portable table",
      "Choice of 5 gelato and sorbetto flavours (5 L each)",
      "Ice-chilled setup with no electricity required",
      "Up to 1.5 hours of service",
    ],
    moreInfo:
      "A simple and charming way to bring Lucia Gelato to your celebration! Our Classic package features a beautiful wooden gelato display, complete with five 5 L containers of your chosen gelato or sorbetto flavours, kept chilled over ice.\n\nThe display sits on a portable table, requiring very little space and **no access to electricity**, making it a great option for outdoor celebrations and venues with limited setup space.",
    accent: "strawberry",
  },
  {
    id: "signature",
    name: "The Signature",
    basePrice: 900,
    baseGuests: 75,
    perGuest: 8,
    features: [
      "Full mobile gelato trailer setup",
      "Choice of 7 gelato or sorbetto flavours",
      "Up to 2.5 hours of service",
    ],
    moreInfo:
      "Bring the full Lucia Gelato experience to your celebration with our mobile gelato trailer! Perfect for weddings, corporate events, and larger gatherings, this package features our full-sized gelato trailer, offering guests a fun and memorable dessert experience.\n\nOur trailer arrives equipped with a powered gelato freezer to keep your selected flavours at the perfect serving temperature throughout your event.\n\n**Please note:** This package **requires access to electricity** at your event venue to power the gelato freezer. Also, as our trailer is towed by a vehicle, the venue must also have sufficient space and vehicle access for us to deliver, position and collect the trailer.",
    accent: "lakeside",
  },
  {
    id: "experience",
    name: "The Experience",
    basePrice: 1000,
    baseGuests: 75,
    perGuest: 9,
    features: [
      "Everything included in **The Signature** package",
      "Full mobile gelato trailer setup",
      "Choice of 7 gelato and sorbetto flavours",
      "Additional selection of toppings and sauces",
      "Interactive build-your-own sundae bar",
      "Extended service time of up to 3 hours",
    ],
    moreInfo:
      "Everything you love about The Signature package, with a little something extra! Enjoy our full mobile gelato trailer experience, complete with seven delicious gelato or sorbetto flavours, plus an interactive sundae bar featuring a selection of toppings and sauces.\n\nLet your guests get creative and build their own delicious gelato sundaes!\n\n**Please note:** This package requires **access to electricity** at your event venue to power the gelato freezer. Also, as our trailer is towed by a vehicle, the venue must also have sufficient space and vehicle access for us to deliver, position and collect the trailer.",
    accent: "heatwave",
  },
];

/** Areas for the booking form and the estimate. They also make the travel pills on the page. */
export const travelFees: { area: string; fee: number }[] = [
  { area: "Whistler", fee: 0 },
  { area: "Squamish & Pemberton", fee: 100 },
  { area: "Vancouver", fee: 300 },
];

/** The other pills under "Travel & Booking Info", after the travel fees. */
export const eventTerms = [
  "Customization available",
  "Minimum $500 deposit required",
  "Taxes & gratuity not included",
];

/** "No travel fee within Whistler", "+ $100 travel fee for Squamish & Pemberton", … */
export function travelFeeLabel({ area, fee }: { area: string; fee: number }) {
  return fee > 0
    ? `+ $${fee.toLocaleString("en-CA")} travel fee for ${area}`
    : `No travel fee within ${area}`;
}

export function estimateEvent(pkg: EventPackage, guests: number, travelFee: number) {
  const extra = Math.max(0, guests - pkg.baseGuests);
  return pkg.basePrice + extra * pkg.perGuest + travelFee;
}

/**
 * Photos for the events gallery, until the Studio has its own (up to 20). From Lucia's event
 * photos (Nov 2026), wide and tall shots alternating.
 */
export const eventGallery: EventPhoto[] = [
  {
    src: "/events/gallery/trailer-1.webp",
    alt: "Smiling from the serving window of the Lucia gelato trailer",
    width: 2048,
    height: 1365,
  },
  {
    src: "/events/gallery/img-4699.webp",
    alt: "Scooping gelato at a mountaintop event, with snowy trees outside",
    width: 1800,
    height: 2400,
  },
  {
    src: "/events/gallery/gelato-events.webp",
    alt: "The Lucia gelato bar at an evening wedding",
    width: 2400,
    height: 1801,
  },
  {
    src: "/events/gallery/katcraats-0158.webp",
    alt: "The Lucia crew waving from the trailer door",
    width: 1600,
    height: 2400,
  },
  {
    src: "/events/gallery/gelato-affogato.webp",
    alt: "Espresso pouring over a cup of gelato for an affogato",
    width: 1734,
    height: 2400,
  },
  {
    src: "/events/gallery/gelato-events-pemberton.webp",
    alt: "An evening event set up in a Pemberton field under string lights and mountains",
    width: 2400,
    height: 1801,
  },
  {
    src: "/events/gallery/img-8467.webp",
    alt: "A gelato display on a pink table, set up on a patio with red Adirondack chairs",
    width: 1800,
    height: 2400,
  },
  {
    src: "/events/gallery/katcraats-0101.webp",
    alt: "The side of the Whistler Lucia Gelato trailer, painted with colourful mountains",
    width: 1600,
    height: 2400,
  },
  {
    src: "/events/gallery/gelato-close.webp",
    alt: "A close-up of creamy berry gelato",
    width: 1734,
    height: 2400,
  },
  {
    src: "/events/gallery/katcraats-0096.webp",
    alt: "The front of the gelato trailer beside its menu board",
    width: 1600,
    height: 2400,
  },
];

/**
 * The FAQ, in reading order: the first half fills the left column on wide screens. Trailer size,
 * power, what's included and cancellations are Lucia's own answers (Nov 2026). Blank lines
 * start a new paragraph.
 */
export const eventFaq: { q: string; a: string }[] = [
  {
    q: "What types of events do you cater?",
    a: "From mountaintop weddings to company barbecues: weddings, birthdays and private parties, corporate events, and festivals and community events. If you're planning a celebration, we'd love to hear about it.",
  },
  {
    q: "What's the difference between your catering packages?",
    a: "The Classic is our wooden gelato display on a portable table, with 5 flavours kept chilled over ice, so it needs no electricity. The Signature brings our full mobile gelato trailer with 7 flavours. The Experience is everything in The Signature plus toppings, sauces and a build-your-own sundae bar, with service for up to 3 hours. See each package above for the details.",
  },
  {
    q: "What's included?",
    a: "All event packages include cups, spoons, napkins, serving staff, and serving utensils.",
  },
  {
    q: "How many flavours can we choose?",
    a: "Five with The Classic, and seven with The Signature or The Experience. Choose any mix of gelato and sorbetto from our seasonal lineup, or ask about a custom flavour to match your theme or colours.",
  },
  {
    q: "Do you offer dairy-free or vegan options?",
    a: "Yes. Our sorbets are dairy-free and vegan, and we make dairy-free gelatos with coconut milk. Every package can include them.",
  },
  {
    q: "Do you cater events outside of Whistler?",
    a: "Yes, anywhere in the Sea to Sky and down to Vancouver. There's no travel fee within Whistler, + $100 for Squamish and Pemberton, and + $300 for Vancouver.",
  },
  {
    q: "Can we customize a catering package?",
    a: "Absolutely. Tell us about your event and we'll find the perfect fit: more flavours, longer service, toppings, whatever you need.",
  },
  {
    q: "What does the venue need to provide?",
    a: "The Classic needs only a little space for its portable table, and no electricity. The Signature and The Experience need access to electricity to power the gelato freezer, plus enough space and vehicle access for us to deliver, position and collect the trailer. We'll confirm the details with you before your event.",
  },
  {
    q: "What are the dimensions of the mobile gelato trailer?",
    a: "Our mobile gelato trailer is 14 ft long, 92 inches (7 ft 8 in) wide and 87 inches (7 ft 3 in) high. Please note that some additional space will be required to accommodate the trailer hitch and allow comfortable access around the serving area.\n\nOur trailer is transported by truck, which can be detached and moved away during your event, as needed. The dimensions above are for the gelato trailer only and do not include the towing vehicle.",
  },
  {
    q: "What are the power requirements for the mobile gelato trailer?",
    a: "Ideally, our mobile gelato trailer operates best with an L14-30 (120/240V, 30-amp) power connection, which provides the most efficient power supply for our equipment.\n\nDon't have this connection available? No problem! We can also operate using a standard electrical outlet.\n\nIf you're unsure about the power available at your venue, feel free to reach out. We're happy to help determine the best setup for your event!",
  },
  {
    q: "How do I book Lucia Gelato for my event?",
    a: "Send us a booking request with the form below. Our team will be in touch to confirm availability and your event booking. Summer weekends, especially in wedding season, fill up early, so reach out as soon as you have a date.",
  },
  {
    q: "What is the cancellation and deposit refund policy?",
    a: "A $500 deposit is required to confirm your booking and secure your event date.\n\nWe understand that plans can change! If you cancel more than 14 days before your event, you'll receive a full refund of your $500 deposit. If you cancel 14 days or less before your event, your $500 deposit is non-refundable.\n\nWe recommend letting us know as early as possible if your plans change.",
  },
  {
    q: "Are taxes and gratuity included in the package prices?",
    a: "No. Taxes and gratuity are not included in package prices.",
  },
];
