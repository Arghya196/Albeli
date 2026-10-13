"use client";

import { useState } from "react";
import { Save, CheckCircle2, ShieldCheck, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { useAdminStore } from "@/lib/store/adminStore";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdminStore();

  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [instagramHandle, setInstagramHandle] = useState(settings.instagramHandle);
  const [orderChannel, setOrderChannel] = useState<"instagram" | "whatsapp" | "both">(
    settings.orderChannel || "instagram"
  );
  const [splashEnabled, setSplashEnabled] = useState(settings.splashEnabled);
  const [reviewsEnabled, setReviewsEnabled] = useState(settings.reviewsEnabled);
  const [wishlistEnabled, setWishlistEnabled] = useState(settings.wishlistEnabled);
  const [cartFeatureFlag, setCartFeatureFlag] = useState(settings.cartFeatureFlag);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      whatsappNumber,
      instagramHandle,
      orderChannel,
      splashEnabled,
      reviewsEnabled,
      wishlistEnabled,
      cartFeatureFlag,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-6 border-b border-[#4A0612]/10">
        <div>
          <h1 className="font-display text-3xl text-[#1E1A1A] font-normal tracking-tight">
            Site Settings & Features
          </h1>
          <p className="font-sans text-xs text-[#1E1A1A]/60 mt-1">
            Control order acceptance channels (Instagram / WhatsApp), handles, and brand features.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Settings</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-sans flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved! Your order acceptance channel and brand toggles have been updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Order Acceptance Channel Selector */}
        <div className="bg-white p-6 rounded-sm border border-[#4A0612]/10 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#4A0612]/10">
            <div>
              <h2 className="font-display text-xl text-[#1E1A1A]">
                Order Acceptance Channel
              </h2>
              <p className="text-xs text-[#1E1A1A]/60 font-sans mt-0.5">
                Choose which channel customers use to order and enquire on the storefront.
              </p>
            </div>
            <span className="text-[10px] font-sans uppercase font-bold text-[#6B1F2E] bg-[#6B1F2E]/10 px-2.5 py-1 rounded-xs shrink-0 self-start sm:self-auto">
              Current: {orderChannel === "instagram" ? "Instagram DM" : orderChannel === "whatsapp" ? "WhatsApp" : "Both"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 font-sans">
            {/* Option 1: Instagram (Current selection) */}
            <div
              onClick={() => setOrderChannel("instagram")}
              className={cn(
                "p-4 rounded-sm border cursor-pointer transition-all",
                orderChannel === "instagram"
                  ? "border-[#6B1F2E] bg-[#FCEDEA]/30 ring-1 ring-[#6B1F2E]"
                  : "border-[#4A0612]/15 hover:border-[#4A0612]/40 bg-white"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <InstagramIcon className="w-4 h-4 text-[#6B1F2E]" />
                  <span className="font-semibold text-xs text-[#1E1A1A]">Instagram DM</span>
                </div>
                <span
                  className={cn(
                    "w-3.5 h-3.5 rounded-full border flex items-center justify-center",
                    orderChannel === "instagram"
                      ? "border-[#6B1F2E] bg-[#6B1F2E]"
                      : "border-[#1E1A1A]/30"
                  )}
                >
                  {orderChannel === "instagram" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
              </div>
              <p className="text-[11px] text-[#1E1A1A]/70 leading-relaxed">
                All product CTAs say <strong>&ldquo;Order on Instagram&rdquo;</strong> and open direct chat with @{instagramHandle}.
              </p>
            </div>

            {/* Option 2: WhatsApp */}
            <div
              onClick={() => setOrderChannel("whatsapp")}
              className={cn(
                "p-4 rounded-sm border cursor-pointer transition-all",
                orderChannel === "whatsapp"
                  ? "border-[#25D366] bg-[#25D366]/5 ring-1 ring-[#25D366]"
                  : "border-[#4A0612]/15 hover:border-[#4A0612]/40 bg-white"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span className="font-semibold text-xs text-[#1E1A1A]">WhatsApp</span>
                </div>
                <span
                  className={cn(
                    "w-3.5 h-3.5 rounded-full border flex items-center justify-center",
                    orderChannel === "whatsapp"
                      ? "border-[#25D366] bg-[#25D366]"
                      : "border-[#1E1A1A]/30"
                  )}
                >
                  {orderChannel === "whatsapp" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
              </div>
              <p className="text-[11px] text-[#1E1A1A]/70 leading-relaxed">
                All product CTAs say <strong>&ldquo;Order on WhatsApp&rdquo;</strong> with pre-filled message and price.
              </p>
            </div>

            {/* Option 3: Both Channels */}
            <div
              onClick={() => setOrderChannel("both")}
              className={cn(
                "p-4 rounded-sm border cursor-pointer transition-all",
                orderChannel === "both"
                  ? "border-[#4A0612] bg-[#FBF6EE] ring-1 ring-[#4A0612]"
                  : "border-[#4A0612]/15 hover:border-[#4A0612]/40 bg-white"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <InstagramIcon className="w-3.5 h-3.5 text-[#6B1F2E]" />
                  <span className="text-[10px] text-[#1E1A1A]/40">+</span>
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span className="font-semibold text-xs text-[#1E1A1A]">Both Channels</span>
                </div>
                <span
                  className={cn(
                    "w-3.5 h-3.5 rounded-full border flex items-center justify-center",
                    orderChannel === "both"
                      ? "border-[#4A0612] bg-[#4A0612]"
                      : "border-[#1E1A1A]/30"
                  )}
                >
                  {orderChannel === "both" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
              </div>
              <p className="text-[11px] text-[#1E1A1A]/70 leading-relaxed">
                Displays dual action buttons, letting customers pick their preferred app.
              </p>
            </div>
          </div>
        </div>
        {/* Contact & Social Links */}
        <div className="bg-white p-6 rounded-sm border border-[#4A0612]/10 shadow-xs space-y-4">
          <h2 className="font-display text-xl text-[#1E1A1A]">
            Direct Ordering & Contact Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
            <div>
              <label className="block font-medium text-[#1E1A1A] mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp Business Number *</span>
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+919876543210"
                className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
              />
              <span className="text-[10px] text-[#1E1A1A]/50 mt-1 block">
                Include country code (e.g. +91). All product CTAs pre-fill to this line.
              </span>
            </div>

            <div>
              <label className="block font-medium text-[#1E1A1A] mb-1 flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5 text-[#6B1F2E]" />
                <span>Instagram Handle *</span>
              </label>
              <input
                type="text"
                required
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="albelihouse"
                className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
              />
              <span className="text-[10px] text-[#1E1A1A]/50 mt-1 block">
                Without @ symbol. Links footer and product enquiries to your profile.
              </span>
            </div>
          </div>
        </div>

        {/* Brand Experience Feature Flags */}
        <div className="bg-white p-6 rounded-sm border border-[#4A0612]/10 shadow-xs space-y-4">
          <h2 className="font-display text-xl text-[#1E1A1A]">
            Feature Flags & Experience Toggles
          </h2>

          <div className="divide-y divide-[#4A0612]/10 font-sans text-xs">
            {/* Splash Screen */}
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-[#1E1A1A] block">
                  Brand Intro Splash Screen
                </span>
                <span className="text-[#1E1A1A]/50 text-[11px]">
                  Plays royal peacock mark & wordmark reveal once per session.
                </span>
              </div>
              <input
                type="checkbox"
                checked={splashEnabled}
                onChange={(e) => setSplashEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#6B1F2E]"
              />
            </div>

            {/* Saved Designs */}
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-[#1E1A1A] block">
                  Saved Designs (Wishlist System)
                </span>
                <span className="text-[#1E1A1A]/50 text-[11px]">
                  Allows customers to save favourites without signing in.
                </span>
              </div>
              <input
                type="checkbox"
                checked={wishlistEnabled}
                onChange={(e) => setWishlistEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#6B1F2E]"
              />
            </div>

            {/* Customer Reviews */}
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-[#1E1A1A] block">
                  Verified Reviews Carousel
                </span>
                <span className="text-[#1E1A1A]/50 text-[11px]">
                  Show customer quotes and ratings on the storefront.
                </span>
              </div>
              <input
                type="checkbox"
                checked={reviewsEnabled}
                onChange={(e) => setReviewsEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#6B1F2E]"
              />
            </div>

            {/* Future Shopping Cart Flag */}
            <div className="py-3.5 flex items-center justify-between bg-amber-50/50 p-2 rounded-xs">
              <div>
                <span className="font-medium text-amber-900 block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Future Online Shopping Cart & Checkout</span>
                </span>
                <span className="text-amber-800/70 text-[11px]">
                  Currently disabled as per requirements. Direct WhatsApp ordering is active.
                </span>
              </div>
              <input
                type="checkbox"
                checked={cartFeatureFlag}
                onChange={(e) => setCartFeatureFlag(e.target.checked)}
                className="w-4 h-4 accent-[#6B1F2E]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-xs"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
