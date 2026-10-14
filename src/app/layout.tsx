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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
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
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
