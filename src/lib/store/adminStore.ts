"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PLACEHOLDER_PRODUCTS, PlaceholderProduct } from "@/lib/placeholder-data";

export interface AdminEnquiry {
  id: string;
  customerName?: string;
  customerContact?: string;
  productName: string;
  channel: "whatsapp" | "instagram" | "custom_design";
  status: "new" | "contacted" | "converted" | "lost";
  notes?: string;
  timestamp: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  visible: boolean;
}

export interface NavigationData {
  header: NavItem[];
  footer: NavItem[];
}

export interface AdminReview {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  comment: string;
  productName: string;
  verified: boolean;
  visible: boolean;
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  badge?: string;
  headline: string;
  hindiTagline?: string;
  desktopDesc?: string;
  ctaText: string;
  ctaLink: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    image: "/images/hero-1.jpg",
    badge: "Delhi • Handcrafted • Authentic",
    headline: "Jewellery that refuses to be ordinary.",
    hindiTagline: "अलबेली — थोड़ा हटके, पूरा देसी।",
    desktopDesc: "Bold artisanal polki, meenakari and antique jewellery designed in Delhi for modern celebrations and everyday flair.",
    ctaText: "Explore Drop",
    ctaLink: "/shop",
  },
  {
    id: "slide-2",
    image: "/images/product-5-a.jpg",
    badge: "Limited Artisan Batch • Heritage",
    headline: "Heirloom Haslis & Royal Peacock Motifs.",
    hindiTagline: "शाही नक्काशी, दिल्ली का हुनर।",
    desktopDesc: "Hand-engraved by generational karigars in Delhi with heritage repoussé brass techniques and 22k antique gold plating.",
    ctaText: "Shop Hasli Edit",
    ctaLink: "/shop?category=necklaces",
  },
  {
    id: "slide-3",
    image: "/images/product-2-a.jpg",
    badge: "Festive Edit 2026 • Bridal & Occasion",
    headline: "Noorani Polki Chokers & Lustrous Pearls.",
    hindiTagline: "नूरानी पोलकी, महफ़िल का नूर।",
    desktopDesc: "Exquisite hand-strung emerald bead drops and uncut polki glass stones that capture the candlelit radiance of royal evenings.",
    ctaText: "Discover Festive Edit",
    ctaLink: "/collections/festive-edit",
  },
];

export interface SiteSettingsData {
  whatsappNumber: string;
  instagramHandle: string;
  orderChannel: "instagram" | "whatsapp" | "both";
  announcementMessages: string[];
  heroHeadline: string;
  heroTagline: string;
  heroSlides?: HeroSlide[];
  storyPhilosophy: string;
  splashEnabled: boolean;
  reviewsEnabled: boolean;
  wishlistEnabled: boolean;
  cartFeatureFlag: boolean;
}

interface AdminState {
  products: PlaceholderProduct[];
  enquiries: AdminEnquiry[];
  categories: AdminCategory[];
  settings: SiteSettingsData;
  navigation: NavigationData;
  reviews: AdminReview[];

  // Actions
  addProduct: (product: Omit<PlaceholderProduct, "id">) => void;
  updateProduct: (id: string, updates: Partial<PlaceholderProduct>) => void;
  deleteProduct: (id: string) => void;
  deleteAllPlaceholders: () => void;

  updateEnquiryStatus: (id: string, status: AdminEnquiry["status"]) => void;
  addEnquiry: (enquiry: Omit<AdminEnquiry, "id">) => void;

  addCategory: (name: string, slug: string) => void;
  deleteCategory: (id: string) => void;

  updateSettings: (updates: Partial<SiteSettingsData>) => void;

  updateNavigation: (nav: Partial<NavigationData>) => void;

  addReview: (review: Omit<AdminReview, "id" | "createdAt">) => void;
  deleteReview: (id: string) => void;
  toggleReviewVisibility: (id: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: PLACEHOLDER_PRODUCTS,

      enquiries: [
        {
          id: "enq-01",
          customerName: "Pooja Malhotra",
          customerContact: "+91 98112 45890",
          productName: "Mayura Peacock Chandbali Earrings",
          channel: "whatsapp",
          status: "converted",
          notes: "Ordered 2 pairs for Delhi wedding. Dispatched via Bluedart.",
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: "enq-02",
          customerName: "Kavita Singhal",
          customerContact: "@kavita.singhal",
          productName: "Noorani Polki Emerald Choker",
          channel: "instagram",
          status: "contacted",
          notes: "Enquired about custom emerald bead length.",
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: "enq-03",
          customerName: "Simran Kaur",
          customerContact: "+91 99881 23456",
          productName: "Hansak Peacock Carved Hasli Collar",
          channel: "whatsapp",
          status: "new",
          notes: "Wants urgent delivery in Chandigarh for Friday event.",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ],

      categories: [
        { id: "cat-1", name: "Earrings", slug: "earrings", itemCount: 4 },
        { id: "cat-2", name: "Necklaces", slug: "necklaces", itemCount: 3 },
        { id: "cat-3", name: "Rings", slug: "rings", itemCount: 2 },
        { id: "cat-4", name: "Chokers", slug: "chokers", itemCount: 2 },
      ],

      settings: {
        whatsappNumber: "+91XXXXXXXXXX",
        instagramHandle: "albelihouse",
        orderChannel: "instagram",
        announcementMessages: [
          "Ships all over India & worldwide ✈️ Handcrafted in Delhi",
          "New drop is live ✨ Thoda hatke, poora desi.",
          "Custom design requests open — share your vision on WhatsApp",
        ],
        heroHeadline: "Jewellery that refuses to be ordinary.",
        heroTagline: "अलबेली — थोड़ा हटके, पूरा देसी।",
        heroSlides: DEFAULT_HERO_SLIDES,
        storyPhilosophy:
          "Born in Old Delhi, crafted for the fearless modern desi. No middle-tier markups, no five-figure diamond prices.",
        splashEnabled: true,
        reviewsEnabled: true,
        wishlistEnabled: true,
        cartFeatureFlag: false,
      },

      navigation: {
        header: [
          { id: "nav-h1", label: "Shop", href: "/shop", visible: true },
          { id: "nav-h2", label: "Collections", href: "/collections/all", visible: true },
          { id: "nav-h3", label: "Lookbook", href: "/lookbook", visible: true },
          { id: "nav-h4", label: "Journal", href: "/journal", visible: true },
          { id: "nav-h5", label: "About", href: "/about", visible: true },
          { id: "nav-h6", label: "Contact", href: "/contact", visible: true },
        ],
        footer: [
          { id: "nav-f1", label: "Shop All", href: "/shop", visible: true },
          { id: "nav-f2", label: "About", href: "/about", visible: true },
          { id: "nav-f3", label: "Contact", href: "/contact", visible: true },
          { id: "nav-f4", label: "Shipping", href: "/shipping", visible: true },
          { id: "nav-f5", label: "Care Guide", href: "/materials-care", visible: true },
          { id: "nav-f6", label: "Privacy Policy", href: "/privacy", visible: true },
          { id: "nav-f7", label: "Terms", href: "/terms", visible: true },
        ],
      },

      reviews: [
        {
          id: "rev-1",
          customerName: "Ananya Sharma",
          location: "South Delhi",
          rating: 5,
          comment: "The Mayura Chandbalis are even more gorgeous in person than on Instagram! The meenakari detailing is so neat and they aren't heavy at all. Wore them for my cousin's sangeet and received non-stop compliments.",
          productName: "Mayura Peacock Chandbali",
          verified: true,
          visible: true,
          createdAt: "2026-10-07T10:00:00.000Z",
        },
        {
          id: "rev-2",
          customerName: "Rhea Sen",
          location: "London, UK",
          rating: 5,
          comment: "Ordered the Hansak hasli collar from the UK via WhatsApp. Arrived in 6 days in a beautiful maroon box! Incredible quality, feels like an heirloom antique piece.",
          productName: "Hansak Peacock Hasli Collar",
          verified: true,
          visible: true,
          createdAt: "2026-10-01T10:00:00.000Z",
        },
        {
          id: "rev-3",
          customerName: "Meher Gill",
          location: "Chandigarh",
          rating: 5,
          comment: "The ordering experience on WhatsApp was so seamless and polite. The finish of the Noorani choker looks like real jadau polki without the five-figure price tag. Will definitely order again!",
          productName: "Noorani Polki Choker",
          verified: true,
          visible: true,
          createdAt: "2026-09-23T10:00:00.000Z",
        },
      ],

      addProduct: (prod) => {
        const id = `prod-${Date.now().toString().slice(-4)}`;
        const newProduct = { ...prod, id } as PlaceholderProduct;
        set({ products: [newProduct, ...get().products] });
      },

      updateProduct: (id, updates) => {
        set({
          products: get().products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        });
      },

      deleteProduct: (id) => {
        set({
          products: get().products.filter((p) => p.id !== id),
        });
      },

      deleteAllPlaceholders: () => {
        set({
          products: get().products.filter((p) => !p.isPlaceholder),
        });
      },

      updateEnquiryStatus: (id, status) => {
        set({
          enquiries: get().enquiries.map((e) => (e.id === id ? { ...e, status } : e)),
        });
      },

      addEnquiry: (enq) => {
        const id = `enq-${Date.now().toString().slice(-4)}`;
        set({
          enquiries: [{ ...enq, id }, ...get().enquiries],
        });
      },

      addCategory: (name, slug) => {
        const id = `cat-${Date.now().toString().slice(-4)}`;
        set({
          categories: [...get().categories, { id, name, slug, itemCount: 0 }],
        });
      },

      deleteCategory: (id) => {
        set({
          categories: get().categories.filter((c) => c.id !== id),
        });
      },

      updateSettings: (updates) => {
        set({
          settings: { ...get().settings, ...updates },
        });
      },

      updateNavigation: (nav) => {
        set({
          navigation: { ...get().navigation, ...nav },
        });
      },

      addReview: (review) => {
        const id = `rev-${Date.now().toString().slice(-4)}`;
        set({
          reviews: [{ ...review, id, createdAt: new Date().toISOString() }, ...get().reviews],
        });
      },

      deleteReview: (id) => {
        set({
          reviews: get().reviews.filter((r) => r.id !== id),
        });
      },

      toggleReviewVisibility: (id) => {
        set({
          reviews: get().reviews.map((r) =>
            r.id === id ? { ...r, visible: !r.visible } : r
          ),
        });
      },
    }),
    {
      name: "albeli_admin_store_v1",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
