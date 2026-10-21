import type { Metadata, Viewport } from "next";
import { Josefin_Sans, Nunito, Sansita } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

// Free stand-ins for the brand's Adobe fonts (Sauna, Oskar), used only if the kit fails to load.
const sansita = Sansita({
  variable: "--font-sansita",
  weight: ["700", "900"],
  style: ["italic"],
  subsets: ["latin"],
});
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
const josefin = Josefin_Sans({
  variable: "--font-josefin",
  weight: ["600", "700"],
  subsets: ["latin"],
});

// Adobe Fonts web project with Sauna and Oskar. Override with NEXT_PUBLIC_ADOBE_FONTS_KIT_ID
// when the kit moves to the client's own Adobe account.
const adobeKit = process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT_ID || "rkt6eeo";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_CA",
  },
};

export const viewport: Viewport = {
  themeColor: "#fffef4",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" className={`${sansita.variable} ${nunito.variable} ${josefin.variable}`}>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        {/* `precedence` lets React 19 hoist and dedupe the stylesheet. */}
        <link rel="stylesheet" href={`https://use.typekit.net/${adobeKit}.css`} precedence="default" />
      </head>
      <body>{children}</body>
    </html>
  );
}
