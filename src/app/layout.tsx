import type { Metadata, Viewport } from "next";
import { Josefin_Sans, Nunito, Sansita } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

// Free stand-ins for the brand's Adobe fonts (Sauna Pro, Oskar One). If an Adobe Fonts
// kit id is configured, the real fonts load and take precedence in the CSS font stacks.
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

const adobeKit = process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT_ID;

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
        {adobeKit ? <link rel="stylesheet" href={`https://use.typekit.net/${adobeKit}.css`} /> : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
