"use client";

import { create } from "zustand";
import { PlaceholderProduct } from "@/lib/placeholder-data";

export interface InstagramOrderState {
  isOpen: boolean;
  mode: "single" | "wishlist";
  product: PlaceholderProduct | null;
  wishlistProducts: PlaceholderProduct[];
  openForProduct: (product: PlaceholderProduct) => void;
  openForWishlist: (products: PlaceholderProduct[]) => void;
  close: () => void;
}

export const useInstagramOrderStore = create<InstagramOrderState>((set) => ({
  isOpen: false,
  mode: "single",
  product: null,
  wishlistProducts: [],

  openForProduct: (product: PlaceholderProduct) =>
    set({
      isOpen: true,
      mode: "single",
      product,
      wishlistProducts: [],
    }),

  openForWishlist: (products: PlaceholderProduct[]) =>
    set({
      isOpen: true,
      mode: "wishlist",
      product: null,
      wishlistProducts: products,
    }),

  close: () =>
    set({
      isOpen: false,
      product: null,
      wishlistProducts: [],
    }),
}));
