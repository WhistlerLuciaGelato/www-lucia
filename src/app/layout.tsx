import type { Metadata, Viewport } from "next";
import { Josefin_Sans, Nunito, Sansita } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
    <html lang="en-CA" className={`${sansita.variable} ${nunito.variable} ${josefin.variable} h-full`}>
      <head>
        {adobeKit ? <link rel="stylesheet" href={`https://use.typekit.net/${adobeKit}.css`} /> : null}
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-lake-deep focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
