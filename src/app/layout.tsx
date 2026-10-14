import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";

// ── Brand Fonts ──────────────────────────────────
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const tiroDevanagari = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: ["400"],
  variable: "--font-tiro-devanagari",
  display: "swap",
});

// ── Metadata ─────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "Albeli — Not so ordinary.",
    template: "%s | Albeli",
  },
  description:
    "Thoda hatke, poora desi. Handcrafted fashion jewellery from Delhi, shipped all over India and worldwide. Browse, save, and order on WhatsApp.",
  keywords: [
    "Albeli",
    "Indian jewellery",
    "fashion jewellery",
    "handcrafted",
    "Delhi",
    "desi jewellery",
    "kundan",
    "jhumka",
    "oxidised jewellery",
  ],
  authors: [{ name: "Albeli" }],
  creator: "Albeli",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Albeli",
    title: "Albeli — Not so ordinary.",
    description:
      "Handcrafted fashion jewellery from Delhi. Thoda hatke, poora desi.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Albeli — Not so ordinary.",
    description:
      "Handcrafted fashion jewellery from Delhi. Thoda hatke, poora desi.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-32x32.png?v=4", type: "image/png", sizes: "32x32" },
      { url: "/icon-16x16.png?v=4", type: "image/png", sizes: "16x16" },
      { url: "/icon-48x48.png?v=4", type: "image/png", sizes: "48x48" },
      { url: "/icon-192x192.png?v=4", type: "image/png", sizes: "192x192" },
      { url: "/icon.png?v=4", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico?v=4", sizes: "any" },
    ],
    shortcut: "/favicon.ico?v=4",
    apple: [
      { url: "/apple-touch-icon.png?v=4", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon.png?v=4", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg?v=4",
        color: "#4A0612",
      },
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon-precomposed.png?v=4",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4A0612",
  colorScheme: "light",
};

// ── Root Layout ──────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://albeli.in/#organization",
        name: "Albeli",
        url: "https://albeli.in",
        logo: "https://albeli.in/brand/logo-full-original.png",
        sameAs: ["https://instagram.com/albelihouse"],
        description:
          "Handcrafted fashion jewellery designed in Delhi. Thoda hatke, poora desi.",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Support",
          availableLanguage: ["English", "Hindi"],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://albeli.in/#website",
        url: "https://albeli.in",
        name: "Albeli",
        publisher: {
          "@id": "https://albeli.in/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://albeli.in/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${tiroDevanagari.variable} h-full antialiased`}
    >
      <head>
        {/* Schema.org Knowledge Graph & Sitelinks Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Preload brand logo */}
        <link
          rel="preload"
          href="/brand/logo-full-original.png"
          as="image"
          type="image/png"
        />

        {/* Immediate Favicons & Cache Busting (Safari & Chromium) */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png?v=4" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png?v=4" />
        <link rel="shortcut icon" href="/favicon.ico?v=4" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=4" />
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon-precomposed.png?v=4" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=4" color="#4A0612" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
