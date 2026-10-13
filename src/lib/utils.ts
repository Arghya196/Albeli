// ═══════════════════════════════════════════════
// ALBELI — Design Tokens & Utility Library
// ═══════════════════════════════════════════════
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Brand Colour Tokens ──────────────────────────
export const colors = {
  cream: "#FBF6EE",       // Malmal Cream — page background
  white: "#FFFFFF",        // Cards
  kajal: "#1E1A1A",        // Body text
  oxblood: "#4A0612",      // Splash, footer, dark sections, headings
  maroon: "#6B1F2E",       // Buttons, links, badges, hover
  blush: "#FCEDEA",        // Text on dark, soft surfaces
  rose: "#F1DFD8",         // Secondary surfaces, badges
  gold: "#B8923A",         // Hairlines and tiny details only
  teal: "#0F6B6B",         // Used very rarely
} as const;

// ── Typography Tokens ────────────────────────────
export const fonts = {
  display: "var(--font-display)",      // Cormorant Garamond
  body: "var(--font-body)",            // DM Sans
  hindi: "var(--font-hindi)",          // Tiro Devanagari Hindi
} as const;

// ── Motion Tokens ────────────────────────────────
export const motion = {
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  durationFast: "200ms",
  durationBase: "300ms",
  durationSlow: "500ms",
  durationSplash: "600ms",
} as const;

// ── Spacing Tokens ───────────────────────────────
export const spacing = {
  headerHeight: "72px",
  headerHeightMobile: "60px",
  announcementHeight: "36px",
  maxWidth: "1440px",
  contentWidth: "1200px",
} as const;

// ── Feature Flags ────────────────────────────────
export const featureFlags = {
  cart: false,                    // Cart/checkout disabled for now
  savedDesigns: true,
  reviews: true,
  languageToggle: false,          // English/Hindi toggle
  customCursor: true,
  splash: true,
  reducedAnimations: false,
} as const;

// ── Site Configuration ───────────────────────────
export const siteConfig = {
  name: "ALBELI",
  tagline: "Not so ordinary.",
  taglineHindi: "थोड़ा हटके, पूरा देसी।",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+91XXXXXXXXXX",
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "albelihouse",
};

// ── Social Links ─────────────────────────────────
export function getWhatsAppUrl(message: string = "") {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+91XXXXXXXXXX";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function getInstagramUrl() {
  const handle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "albelihouse";
  return `https://instagram.com/${handle}`;
}

export function getInstagramDmUrl() {
  const handle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "albelihouse";
  return `https://ig.me/m/${handle}`;
}

// ── Price Formatting ─────────────────────────────
/** Format paise to INR display string */
export function formatPrice(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/** Format paise to USD (approximate) */
export function formatPriceUSD(paise: number, rate: number = 83): string {
  const usd = paise / 100 / rate;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(usd);
}

// ── Slug Helpers ─────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
