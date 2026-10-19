"use client";

import { useEffect } from "react";
import { useAdminStore } from "@/lib/store/adminStore";

/**
 * StoreSync: Runs on client hydration to sync products, categories,
 * reviews, and settings from Supabase database across all devices and browsers.
 */
export function StoreSync() {
  const syncFromDatabase = useAdminStore((s) => s.syncFromDatabase);

  useEffect(() => {
    // Immediate initial sync
    syncFromDatabase();

    // Re-sync on window focus to ensure cross-device / cross-tab changes appear immediately
    const handleFocus = () => {
      syncFromDatabase();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [syncFromDatabase]);

  return null;
}
