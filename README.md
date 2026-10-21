# Whistler Lucia Gelato — website

Marketing and e-commerce site for [Whistler Lucia Gelato](https://luciagelato.com), built on the 2025
brand guidelines (v2.0) and the proposed site map.

- **Next.js 16** (App Router, Cache Components) + **React 19** + **Tailwind CSS 4**
- **Stripe Checkout** for pint and gelato-cake orders (pickup only)
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

| Variable                         | Purpose                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Canonical URL (metadata, sitemap, Stripe redirect URLs)                                       |
| `NEXT_PUBLIC_ADOBE_FONTS_KIT_ID` | Adobe Fonts kit with **Sauna Pro** and **Oskar One**. Without it, free stand-ins are used.     |
| `STRIPE_SECRET_KEY`              | Turns on online checkout. Without it, the cart offers a pre-filled "email my order" button.   |
| `STRIPE_AUTOMATIC_TAX`           | `true` once Stripe Tax is set up on the account                                               |
| `RESEND_API_KEY`                 | Delivers form submissions. Without it, forms fall back to a pre-filled email to the inbox.    |
| `FORMS_TO_EMAIL`                 | Where form submissions go (comma-separated; defaults to luciagelato@gmail.com)                |
| `FORMS_FROM_EMAIL`               | Sender address — must be on a domain verified in Resend                                       |

Nothing breaks when a key is missing: the site degrades to email so no order or enquiry is lost.

## Site map

| Route                                     | Contents                                                                          |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| `/`                                       | Home                                                                              |
| `/find-us`                                | Seasonal locations map · schedule & hours (with weather disclaimer) · grocery stores · scoop locations |
| `/order` · `/order/pints` · `/order/cakes` | Order hub, pint shop, gelato-cake builder                                        |
| `/cart` → Stripe → `/order/success`       | Pickup date selection and checkout                                                |
| `/our-gelato`                             | Flavours in store, link to the wholesale flavours list                            |
| `/events`                                 | Packages & pricing · FAQ · booking request form (with live estimate)              |
| `/wholesale`                              | Wholesale info & delivery schedule · searchable flavours list · order form        |
| `/about` · `/contact`                     | Our story, Meet Lucia · contact details and form                                  |

## Editing content

Almost all copy and pricing lives in typed data files — no CMS required:

| File                     | What's in it                                                     |
| ------------------------ | ---------------------------------------------------------------- |
| `src/data/site.ts`       | Contact details, addresses, social links, navigation             |
| `src/data/flavours.ts`   | The retail pint lineup (copy, dietary tags, label colour, bear)  |
| `src/data/shop.ts`       | Pint & cake prices, lead times, cake options, pickup window      |
| `src/data/locations.ts`  | Seasonal spots (map pins), hours, grocery stores, scoop shops    |
| `src/data/events.ts`     | Event packages, travel fees, terms, FAQ                          |
| `src/data/wholesale.ts`  | Wholesale formats & pricing, delivery schedule, flavour list     |

Prices are in CAD cents (`1200` = $12.00), except event packages, which are whole dollars.
The server always re-prices the cart from these files, so a price can never be changed from the browser.

## Brand implementation

- Colour tokens use the guideline names (`lakeside`, `strawberry`, `snow`, `bluebird`, `alpine`, `heatwave`…)
  in `src/app/globals.css`. Body text and buttons use darker tints (`ink`, `lake-deep`, `berry`) so they pass
  WCAG AA on Snow — the pastel palette alone is too light for small text.
- Type roles follow the guidelines: Sauna Pro Black Italic for headlines (`.display`), Bold Italic for long
  headlines (`.subhead`), Oskar One for eyebrows and buttons (`.eyebrow`, `.btn`), Nunito as the backup. Until an
  Adobe Fonts kit is configured, Sansita and Josefin Sans stand in for Sauna and Oskar.
- `public/brand/` holds vector artwork traced from the guidelines PDF: primary logo, the cover mountain,
  the "Made on the Mountain" and "Since 2007" badges, the W mark and the dietary icons.
- `public/bears/` holds the Lucia illustrations and `public/pints/` the 2025 pint renders, both extracted from
  the guidelines PDF.

## Before launch — please confirm

These are placeholders or assumptions, marked `TODO(client)` in the code where relevant:

- [ ] **Retail pint price** — set to $12.00 (`src/data/shop.ts`)
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
- [ ] Stripe account, Stripe Tax decision (gelato pints are generally zero-rated basic groceries — check with
      the accountant), Resend domain verification, Adobe Fonts kit
