# Whistler Lucia Gelato — website

Marketing and e-commerce site for [Whistler Lucia Gelato](https://luciagelato.com), built on the 2025
brand guidelines (v2.0) and the proposed site map.

- **Next.js 16** (App Router, Cache Components) + **React 19** + **Tailwind CSS 4**
- **Square** for pint and gelato-cake orders (pickup only): card and Square gift card payments
- **Sanity** content editor at `/studio`, so the client can update flavours, prices, hours and more
- **Resend** for contact, event booking, wholesale order and newsletter forms
- Every page is statically prerendered; only `/api/*` and the order confirmation run on the server

## Getting started

```bash
npm install
cp .env.example .env.local   # all values are optional for local development
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

### Environment variables

| Variable                         | Purpose                                                                                                                                                                          |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Canonical URL (metadata, sitemap)                                                                                                                                                |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | Overrides the Sanity project (default `kkqmc2m3`)                                                                                                                                |
| `NEXT_PUBLIC_SANITY_DATASET`     | Overrides the Sanity dataset (default `production`)                                                                                                                              |
| `SANITY_REVALIDATE_SECRET`       | Secret for the publish webhook, so edits go live within seconds                                                                                                                  |
| `SANITY_API_WRITE_TOKEN`         | Only for the one-time `npm run seed`; don't add it to the deployed site                                                                                                          |
| `NEXT_PUBLIC_ADOBE_FONTS_KIT_ID` | Overrides the Adobe Fonts kit (default `rkt6eeo`, with Sauna and Oskar).                                                                                                         |
| `SQUARE_APPLICATION_ID`          | Square app id. With the two below, turns on online checkout; without them, the cart offers a pre-filled "email my order" button. Sandbox ids (`sandbox-…`) use Square's sandbox. |
| `SQUARE_ACCESS_TOKEN`            | Square access token for the same app and environment                                                                                                                             |
| `SQUARE_LOCATION_ID`             | The Square location orders and payments are booked to (the kitchen)                                                                                                              |
| `RESEND_API_KEY`                 | Delivers form submissions. Without it, forms fall back to a pre-filled email to the inbox.                                                                                       |
| `FORMS_TO_EMAIL`                 | Where form submissions go (comma-separated; defaults to luciagelato@gmail.com)                                                                                                   |
| `FORMS_FROM_EMAIL`               | Sender address — must be on a domain verified in Resend                                                                                                                          |

Nothing breaks when a key is missing: the site degrades to email so no order or enquiry is lost.

## Site map

| Route                                      | Contents                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `/`                                        | Home                                                                                                   |
| `/find-us`                                 | Seasonal locations map · schedule & hours (with weather disclaimer) · grocery stores · scoop locations |
| `/order` · `/order/pints` · `/order/cakes` | Order hub, pint shop, gelato-cake builder                                                              |
| `/cart` → `/order/success`                 | Pickup details, then payment by card / Square gift card (Square)                                       |
| `/our-gelato`                              | Flavours in store, link to the wholesale flavours list                                                 |
| `/events`                                  | Packages & pricing · FAQ · booking request form (with live estimate)                                   |
| `/wholesale`                               | Wholesale info & delivery schedule · searchable flavours list · order form                             |
| `/about` · `/contact`                      | Our story, Meet Lucia · contact details and form                                                       |

## Content editor (Sanity Studio)

The client edits the site at **`/studio`** (for example `https://luciagelato.com/studio`), signing in with
Google or email. Publishing a change updates the site within seconds.

What they can edit:

| In the Studio                                   | What it controls                                                                                                                                |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Announcement & contact                          | Site-wide banner ("Closed today — too windy!"), email, phone, Instagram, addresses                                                              |
| Pint flavours                                   | Name, description, dietary tags, image, Lucia illustration, sort order, **sold out** switch                                                     |
| Online shop: prices, pickup & cakes             | Pint price, notice needed, pickup hours, location and days, **closed dates**, cake sizes/prices, bases, flavour combos                          |
| **Opening hours & locations** (top of the menu) | Hours per spot (different hours for different days), **closed today** with a note (clears itself the next day), closed for the season, map pins |
| Stockists                                       | Grocery stores, scoop shops, restaurants/cafés/hotels                                                                                           |
| Weddings & events                               | Packages and prices, travel fees, terms, FAQ                                                                                                    |
| Wholesale                                       | Formats and prices, delivery schedule, flavour lists                                                                                            |

Page headlines and long-form copy (home, about) stay in the code for now.

For any document that hasn't been created in Sanity yet (or if Sanity is unreachable), the site falls back to
the built-in content in `src/data/*.ts`. Those files are also what `npm run seed` copies into Sanity.
Prices in the Studio are entered in dollars; the code works in cents.

### Setting up Sanity (one time)

The site is already connected to Sanity project **`kkqmc2m3`**, dataset **`production`** (set in
`src/sanity/env.ts`; the env vars override it). Don't run the `npm create sanity` command Sanity suggests: it
creates a separate standalone Studio, and this site already has one built in.

1. In [sanity.io/manage](https://www.sanity.io/manage) → the project → **API → CORS origins**, add
   `http://localhost:3000` and later the live site URL, both with **Allow credentials** ticked. (The Studio's
   "Add CORS origin" button goes to the same place.)
2. In **API → Tokens**, create a token with **Editor** permissions, put it in `.env.local` as
   `SANITY_API_WRITE_TOKEN`, and run `npm run seed`. This fills the Studio with everything currently on the site,
   pint images included. Running it again overwrites Studio edits, so run it only on a fresh dataset. Delete the
   token afterwards.
3. Once the site is deployed, add a webhook in **API → Webhooks** to `https://<site>/api/revalidate`, triggered on
   create, update and delete, with a secret that matches `SANITY_REVALIDATE_SECRET`. Without it, edits still appear
   within the hour.
4. In **Members**, invite the client (Editor role is plenty).

### Code-side details

- Schema: `src/sanity/schemaTypes/`, Studio layout: `src/sanity/structure.ts`, config: `sanity.config.ts`.
- All reads go through `src/lib/content.ts`, cached with `use cache` and tagged so the webhook can refresh them.
- The cart and checkout re-price every order from the live catalogue on the server, and refuse items that have
  been removed or marked sold out.
- Every online order carries 5% GST (`SALES_TAX` in `src/data/shop.ts`), added by Square to the order.
- Checkout (`src/app/api/checkout/*`, `src/components/shop/SquarePayment.tsx`): the server creates a Square
  order with a pickup fulfillment (so it shows in Square's order manager), then the cart pays it on the page
  with the Square Web Payments SDK. Gift cards are charged with partial authorization, so a card with less
  than the total covers its balance and the rest goes on another gift card or a card; all payments are
  held (delayed capture) and captured together with PayOrder once they cover the total. A hold that's
  never completed (buyer leaves) is released automatically after an hour, or right away on "Remove" /
  leaving the page. Cake options and wholesale formats are identified by their Sanity array
  keys, which the seed script sets to the same ids the site used before.

## Pickup calendar

The cart uses a calendar (react-day-picker) instead of a plain date field. It greys out days inside the
order's notice period (the longest of its items: pints vs cakes), days of the week without pickup, and
closed dates, all set in the Studio. The checkout API enforces the same rules (`src/lib/pickup.ts`).

## Brand implementation

- Colour tokens use the guideline names (`lakeside`, `strawberry`, `snow`, `bluebird`, `alpine`, `heatwave`…)
  in `src/app/globals.css`. Body text and buttons use darker tints (`ink`, `lake-deep`, `berry`) so they pass
  WCAG AA on Snow — the pastel palette alone is too light for small text.
- Type roles follow the guidelines: Sauna Black Italic for headlines (`.display`), Bold Italic for long
  headlines (`.subhead`), Sauna Regular for body copy, Oskar for eyebrows and buttons (`.eyebrow`, `.btn`), and
  Nunito for small UI text. Sauna and Oskar load from the Adobe Fonts kit `rkt6eeo` (families `sauna-new` and
  `oskar`); Sansita and Josefin Sans only show if the kit fails to load.
- The kit currently has Sauna Regular and Bold (roman and italic) but **not Sauna Black Italic**, so headlines
  render in Bold Italic. Adding Black Italic to the Adobe web project fixes that with no code change.
- Adobe web projects only serve fonts to the domains listed in the project, so add the live domain there.
- `public/brand/` holds vector artwork traced from the guidelines PDF: primary logo, the cover mountain,
  the "Made on the Mountain" and "Since 2007" badges, the W mark and the dietary icons.
- `public/bears/` holds the Lucia illustrations and `public/pints/` the 2025 pint renders, both extracted from
  the guidelines PDF.

## Before launch — please confirm

These are placeholders or assumptions, marked `TODO(client)` in the code where relevant. Once Sanity is set
up, the client can correct most of them in the Studio themselves:

- [x] **Retail pint price** — $7.00, confirmed (edit it in the Studio: Online shop › Pint price)
- [ ] **Pint lead time** (2 days) and **pickup window** (12–5pm) at the Base II kitchen
- [ ] **Seasonal hours** for each location (`src/data/locations.ts`) and exact map pins
- [ ] **Dietary tags** on each pint — taken from the label icons; Coconut Cookies & Cream is marked dairy-free
      and vegan but not gluten-free
- [ ] **Flavour descriptions** for Wildberry, Choco Coco and Fresh Mint Chips are new copy
- [ ] **Cake message** — the cake builder offers an optional message on the cake; remove if not offered
- [ ] **Instagram handle** `@whistlerluciagelato` (from the brand guide's social concepts)
- [ ] **Grocery store towns** — Green Lake Station, Whistler RV Park and Farmers on Duty are grouped under
      "Along the Sea to Sky"
- [ ] **Event FAQ** answers beyond the published terms
- [ ] **Photography** — the site reuses three photos from the current site. Swap in real Lucia photography
      (trailer, kitchen, scooping) in the brand's candid, analog style when available
- [ ] High-resolution **brand assets** — the bear illustrations and pint renders were extracted from the PDF
      at roughly 270 px; the originals from the brand asset download would look sharper
- [ ] **Pickup days and closed dates** — defaults to every day, closed Dec 25 and Jan 1
- [ ] Square: production app credentials and the kitchen's location id, Resend domain verification, Sanity CORS + seed (see above)
- [ ] **Adobe Fonts:** add Sauna Black Italic to the web project, add the live domain, and move the kit to the
      client's Adobe account (then set `NEXT_PUBLIC_ADOBE_FONTS_KIT_ID`)
