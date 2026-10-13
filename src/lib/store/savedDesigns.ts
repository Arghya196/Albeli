"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SavedDesignsState {
  savedIds: string[];
  recentlyViewedIds: string[];
  toggleSave: (productId: string) => boolean;
  isSaved: (productId: string) => boolean;
  addRecentlyViewed: (productId: string) => void;
  clearAllSaved: () => void;
}

export const useSavedDesignsStore = create<SavedDesignsState>()(
  persist(
    (set, get) => ({
      savedIds: [],
      recentlyViewedIds: [],

      toggleSave: (productId: string) => {
        const { savedIds } = get();
        const exists = savedIds.includes(productId);
        if (exists) {
          set({ savedIds: savedIds.filter((id) => id !== productId) });
          return false;
        } else {
          set({ savedIds: [productId, ...savedIds] });
          return true;
        }
      },

      isSaved: (productId: string) => {
        return get().savedIds.includes(productId);
      },

      addRecentlyViewed: (productId: string) => {
        const { recentlyViewedIds } = get();
        const filtered = recentlyViewedIds.filter((id) => id !== productId);
        set({ recentlyViewedIds: [productId, ...filtered].slice(0, 12) });
      },

      clearAllSaved: () => {
        set({ savedIds: [] });
      },
    }),
    {
      name: "albeli_saved_designs_v1",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
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
