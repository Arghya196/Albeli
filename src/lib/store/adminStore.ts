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

import {
  DEFAULT_CATEGORIES,
  DEFAULT_HERO_SLIDES,
  DEFAULT_SETTINGS,
  DEFAULT_REVIEWS,
  DEFAULT_NAVIGATION,
  type AdminCategory,
  type HeroSlide,
  type NavItem,
  type NavigationData,
  type AdminReview,
  type SiteSettingsData,
} from "@/lib/default-data";

export {
  DEFAULT_CATEGORIES,
  DEFAULT_HERO_SLIDES,
  DEFAULT_SETTINGS,
  DEFAULT_REVIEWS,
  DEFAULT_NAVIGATION,
  type AdminCategory,
  type HeroSlide,
  type NavItem,
  type NavigationData,
  type AdminReview,
  type SiteSettingsData,
};

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
  restoreDefaultVariety: () => void;

  updateEnquiryStatus: (id: string, status: AdminEnquiry["status"]) => void;
  addEnquiry: (enquiry: Omit<AdminEnquiry, "id">) => void;

  addCategory: (
    name: string,
    slug: string,
    parentId?: string | null,
    description?: string,
    imageUrl?: string
  ) => void;
  updateCategory: (id: string, updates: Partial<AdminCategory>) => void;
  deleteCategory: (id: string) => void;

  updateSettings: (updates: Partial<SiteSettingsData>) => void;

  updateNavigation: (nav: Partial<NavigationData>) => void;

  addReview: (review: Omit<AdminReview, "id" | "createdAt">) => void;
  deleteReview: (id: string) => void;
  toggleReviewVisibility: (id: string) => void;

  syncFromDatabase: () => Promise<void>;
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

      categories: DEFAULT_CATEGORIES,

      settings: DEFAULT_SETTINGS,

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

      reviews: DEFAULT_REVIEWS,

      addProduct: (prod) => {
        const id = `prod-${Date.now().toString().slice(-4)}`;
        const newProduct = { ...prod, id } as PlaceholderProduct;
        set({ products: [newProduct, ...get().products] });
        if (typeof window !== "undefined") {
          fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
          }).catch((err) => console.error("Error syncing product to DB:", err));
        }
      },

      updateProduct: (id, updates) => {
        set({
          products: get().products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        });
        if (typeof window !== "undefined") {
          const updated = get().products.find((p) => p.id === id);
          if (updated) {
            fetch("/api/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updated),
            }).catch((err) => console.error("Error syncing product update to DB:", err));
          }
        }
      },

      deleteProduct: (id) => {
        set({
          products: get().products.filter((p) => p.id !== id),
        });
        if (typeof window !== "undefined") {
          fetch(`/api/products?id=${id}`, {
            method: "DELETE",
          }).catch((err) => console.error("Error syncing product delete to DB:", err));
        }
      },

      deleteAllPlaceholders: () => {
        set({
          products: get().products.filter((p) => !p.isPlaceholder),
        });
      },

      restoreDefaultVariety: () => {
        const current = get().products;
        const customProducts = current.filter((p) => !p.isPlaceholder);
        const customSlugs = new Set(customProducts.map((p) => p.slug));
        const nonConflictingPlaceholders = PLACEHOLDER_PRODUCTS.filter(
          (p) => !customSlugs.has(p.slug)
        );
        const merged = [...customProducts, ...nonConflictingPlaceholders];
        set({ products: merged });
        if (typeof window !== "undefined") {
          // Sync restored products to DB
          merged.forEach((p) => {
            fetch("/api/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(p),
            }).catch(() => {});
          });
        }
      },

      updateEnquiryStatus: (id, status) => {
        set({
          enquiries: get().enquiries.map((e) => (e.id === id ? { ...e, status } : e)),
        });
      },

      addEnquiry: (enq) => {
        const id = `enq-${Date.now().toString().slice(-4)}`;
        const newEnq = { ...enq, id };
        set({
          enquiries: [newEnq, ...get().enquiries],
        });
        if (typeof window !== "undefined") {
          fetch("/api/enquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEnq),
          }).catch((err) => console.error("Error syncing enquiry to DB:", err));
        }
      },

      addCategory: (name, slug, parentId = null, description = "", imageUrl = "") => {
        const id = parentId ? `sub-${Date.now().toString().slice(-4)}` : `cat-${Date.now().toString().slice(-4)}`;
        const newCat: AdminCategory = {
          id,
          name,
          slug,
          parentId: parentId || null,
          itemCount: 0,
          description,
          imageUrl,
        };
        set({
          categories: [...get().categories, newCat],
        });
        if (typeof window !== "undefined") {
          fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCat),
          }).catch((err) => console.error("Error syncing category to DB:", err));
        }
      },

      updateCategory: (id, updates) => {
        set({
          categories: get().categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        });
        if (typeof window !== "undefined") {
          const updated = get().categories.find((c) => c.id === id);
          if (updated) {
            fetch("/api/categories", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updated),
            }).catch((err) => console.error("Error syncing category update to DB:", err));
          }
        }
      },

      deleteCategory: (id) => {
        set({
          categories: get().categories.filter((c) => c.id !== id && c.parentId !== id),
        });
        if (typeof window !== "undefined") {
          fetch(`/api/categories?id=${id}`, {
            method: "DELETE",
          }).catch((err) => console.error("Error syncing category delete to DB:", err));
        }
      },

      updateSettings: (updates) => {
        const updated = { ...get().settings, ...updates };
        set({
          settings: updated,
        });
        if (typeof window !== "undefined") {
          fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
          }).catch((err) => console.error("Error syncing settings to DB:", err));
        }
      },

      updateNavigation: (nav) => {
        const updated = { ...get().navigation, ...nav };
        set({
          navigation: updated,
        });
        if (typeof window !== "undefined") {
          fetch("/api/navigation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
          }).catch((err) => console.error("Error syncing navigation to DB:", err));
        }
      },

      addReview: (review) => {
        const id = `rev-${Date.now().toString().slice(-4)}`;
        const newRev: AdminReview = { ...review, id, createdAt: new Date().toISOString() };
        set({
          reviews: [newRev, ...get().reviews],
        });
        if (typeof window !== "undefined") {
          fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRev),
          }).catch((err) => console.error("Error syncing review to DB:", err));
        }
      },

      deleteReview: (id) => {
        set({
          reviews: get().reviews.filter((r) => r.id !== id),
        });
        if (typeof window !== "undefined") {
          fetch(`/api/reviews?id=${id}`, {
            method: "DELETE",
          }).catch((err) => console.error("Error syncing review delete to DB:", err));
        }
      },

      toggleReviewVisibility: (id) => {
        const updatedReviews = get().reviews.map((r) =>
          r.id === id ? { ...r, visible: !r.visible } : r
        );
        set({ reviews: updatedReviews });
        if (typeof window !== "undefined") {
          const changed = updatedReviews.find((r) => r.id === id);
          if (changed) {
            fetch("/api/reviews", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(changed),
            }).catch((err) => console.error("Error syncing review update to DB:", err));
          }
        }
      },

      syncFromDatabase: async () => {
        if (typeof window === "undefined") return;
        try {
          const [pRes, cRes, sRes, rRes, nRes] = await Promise.all([
            fetch("/api/products"),
            fetch("/api/categories"),
            fetch("/api/settings"),
            fetch("/api/reviews"),
            fetch("/api/navigation"),
          ]);

          if (pRes.ok) {
            const pData = await pRes.json();
            if (Array.isArray(pData.products) && pData.products.length > 0) {
              set({ products: pData.products });
            }
          }
          if (cRes.ok) {
            const cData = await cRes.json();
            if (Array.isArray(cData.categories) && cData.categories.length > 0) {
              set({ categories: cData.categories });
            }
          }
          if (sRes.ok) {
            const sData = await sRes.json();
            if (sData.settings && Object.keys(sData.settings).length > 0) {
              set({ settings: { ...get().settings, ...sData.settings } });
            }
          }
          if (rRes.ok) {
            const rData = await rRes.json();
            if (Array.isArray(rData.reviews) && rData.reviews.length > 0) {
              set({ reviews: rData.reviews });
            }
          }
          if (nRes.ok) {
            const nData = await nRes.json();
            if (nData.navigation && (nData.navigation.header || nData.navigation.footer)) {
              set({ navigation: { ...get().navigation, ...nData.navigation } });
            }
          }
        } catch (err) {
          console.error("Database sync failed, continuing with cached data:", err);
        }
      },
    }),
    {
      name: "albeli_admin_store_v3",
      version: 3,
      migrate: (persistedState: any) => {
        if (!persistedState) return persistedState;
        const oldProducts: PlaceholderProduct[] = persistedState.products || [];
        const customProducts = oldProducts.filter((p) => !p.isPlaceholder);
        const customSlugs = new Set(customProducts.map((p) => p.slug));
        const merged = [
          ...customProducts,
          ...PLACEHOLDER_PRODUCTS.filter((p) => !customSlugs.has(p.slug)),
        ];
        return {
          ...persistedState,
          products: merged,
        };
      },
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          try {
            const v3Raw = localStorage.getItem("albeli_admin_store_v3");
            const v2Raw = localStorage.getItem("albeli_admin_store_v2");
            if (!v3Raw && v2Raw) {
              const v2Data = JSON.parse(v2Raw);
              if (v2Data?.state) {
                const oldProducts = v2Data.state.products || [];
                const customProducts = oldProducts.filter((p: any) => !p.isPlaceholder);
                const customSlugs = new Set(customProducts.map((p: any) => p.slug));
                v2Data.state.products = [
                  ...customProducts,
                  ...PLACEHOLDER_PRODUCTS.filter((p) => !customSlugs.has(p.slug)),
                ];
                localStorage.setItem("albeli_admin_store_v3", JSON.stringify(v2Data));
              }
            } else if (v3Raw) {
              const v3Data = JSON.parse(v3Raw);
              const prods: PlaceholderProduct[] = v3Data?.state?.products || [];
              const jhumkas = prods.filter(
                (p) => p.subcategorySlug === "jhumkas" || p.subcategory?.toLowerCase() === "jhumkas"
              );
              if (jhumkas.length <= 1) {
                const customProducts = prods.filter((p) => !p.isPlaceholder);
                const customSlugs = new Set(customProducts.map((p) => p.slug));
                v3Data.state.products = [
                  ...customProducts,
                  ...PLACEHOLDER_PRODUCTS.filter((p) => !customSlugs.has(p.slug)),
                ];
                localStorage.setItem("albeli_admin_store_v3", JSON.stringify(v3Data));
              }
            }
          } catch {}
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
