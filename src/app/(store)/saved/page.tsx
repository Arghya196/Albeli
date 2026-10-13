"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Trash2, ArrowRight, Heart, Share2, Check, Sparkles } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { ProductCard } from "@/components/store/ProductCard";
import { useSavedDesignsStore } from "@/lib/store/savedDesigns";
import { useAdminStore } from "@/lib/store/adminStore";
import { useInstagramOrderStore } from "@/lib/store/instagramOrderStore";
import { PLACEHOLDER_PRODUCTS, PlaceholderProduct } from "@/lib/placeholder-data";
import { formatPrice, siteConfig, cn } from "@/lib/utils";

function SavedDesignsContent() {
  const searchParams = useSearchParams();
  const sharedItemsParam = searchParams.get("items");

  const savedIds = useSavedDesignsStore((state) => state.savedIds);
  const clearAllSaved = useSavedDesignsStore((state) => state.clearAllSaved);

  const adminProducts = useAdminStore((s) => s.products);
  const storeSettings = useAdminStore((s) => s.settings);
  const openInstagramWishlist = useInstagramOrderStore((s) => s.openForWishlist);

  const allProducts =
    adminProducts && adminProducts.length > 0 ? adminProducts : PLACEHOLDER_PRODUCTS;

  // If ?items= parameter is passed, view that shared list (useful for Instagram chat owner/customer)
  const isSharedView = Boolean(sharedItemsParam);

  const displayProducts: PlaceholderProduct[] = useMemo(() => {
    if (sharedItemsParam) {
      const targetSkus = sharedItemsParam
        .split(",")
        .map((s) => s.trim().toUpperCase());
      return allProducts.filter(
        (p) => targetSkus.includes(p.sku.toUpperCase()) || targetSkus.includes(p.id.toUpperCase())
      );
    }
    return allProducts.filter((p) => savedIds.includes(p.id));
  }, [sharedItemsParam, allProducts, savedIds]);

  const cleanNumber = (storeSettings?.whatsappNumber || siteConfig.whatsappNumber).replace(/[^0-9]/g, "");
  const instagramHandle = storeSettings?.instagramHandle || siteConfig.instagramHandle;
  const orderChannel = storeSettings?.orderChannel || "instagram";

  const totalPaise = displayProducts.reduce((sum, p) => sum + p.price, 0);
  const formattedTotal = formatPrice(totalPaise);

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://albeli.in";
  const shareSkus = displayProducts.map((p) => p.sku).join(",");
  const shareUrl = `${currentOrigin}/saved?items=${encodeURIComponent(shareSkus)}`;

  // Pre-fill message with all saved designs & direct photo link
  const productListText = displayProducts
    .map((p, idx) => `${idx + 1}. ${p.name} (${formatPrice(p.price)} - SKU: ${p.sku})`)
    .join("\n");

  const enquireAllMsg = encodeURIComponent(
    `Namaste Albeli! ✨ I would like to enquire about my liked designs:\n\n${productListText}\n\nTotal: ${formattedTotal} (${displayProducts.length} pieces)\n\n📸 View all photos & pieces:\n${shareUrl}\n\nPlease let me know availability and order details!`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${enquireAllMsg}`;

  const handleInstagramClick = () => {
    openInstagramWishlist(displayProducts);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 min-h-[65vh]">
      {/* Shared Wishlist Notice Banner (When opened from Instagram link) */}
      {isSharedView && displayProducts.length > 0 && (
        <div className="mb-6 p-4 bg-[#4A0612] text-[#FCEDEA] rounded-sm border border-[#B8923A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#B8923A] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display text-base font-semibold">
                Curated Liked Designs List
              </h3>
              <p className="text-xs text-[#FCEDEA]/80 font-sans">
                Viewing {displayProducts.length} pieces selected by customer • Estimated Value: {formattedTotal}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstagramClick}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-white" />
              <span>Enquire on Instagram</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between pb-6 border-b border-[#4A0612]/10 mb-8 gap-4">
        <div>
          <span className="font-hindi text-xs sm:text-sm text-[#6B1F2E] block mb-1">
            दिल से सेव करो
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#1E1A1A] font-normal tracking-tight">
            {isSharedView ? "Curated Wishlist" : "Saved Designs"} ({displayProducts.length})
          </h1>
          <p className="font-sans text-xs text-[#1E1A1A]/60 mt-1">
            {displayProducts.length > 0
              ? `Total Value: ${formattedTotal} • Ready to enquire on Instagram or WhatsApp with photos.`
              : "Designs you've fallen in love with. Kept safe in your browser."}
          </p>
        </div>

        {displayProducts.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            {!isSharedView && (
              <button
                onClick={clearAllSaved}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-[#1E1A1A]/60 hover:text-[#6B1F2E] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            {/* Primary Order Action based on orderChannel */}
            {orderChannel === "instagram" ? (
              <button
                onClick={handleInstagramClick}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E1A1A] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-sm cursor-pointer active:scale-98"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-[#FCEDEA]" />
                <span>Enquire on Instagram DM</span>
              </button>
            ) : orderChannel === "whatsapp" ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E1A1A] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Enquire on WhatsApp</span>
              </a>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstagramClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1E1A1A] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#FCEDEA]" />
                  <span>Instagram</span>
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-white" />
                  <span>WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {displayProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 pb-20 sm:pb-0">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Sticky Bottom Bar on Mobile for Instant Inquiry */}
          <aside
            aria-label="Wishlist Actions"
            className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#4A0612]/15 p-2.5 safe-bottom-bar shadow-xl"
          >
            {orderChannel === "both" ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstagramClick}
                  className="flex-1 touch-target h-12 bg-[#4A0612] active:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4 text-[#FCEDEA]" />
                  <span>Instagram ({displayProducts.length})</span>
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 touch-target h-12 bg-[#25D366] active:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>WhatsApp</span>
                </a>
              </div>
            ) : orderChannel === "whatsapp" ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full touch-target h-12 bg-[#4A0612] active:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Enquire About All ({displayProducts.length}) on WhatsApp</span>
              </a>
            ) : (
              <button
                onClick={handleInstagramClick}
                className="w-full touch-target h-12 bg-[#4A0612] active:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <InstagramIcon className="w-4 h-4 text-[#FCEDEA]" />
                <span>Enquire About All ({displayProducts.length}) on Instagram</span>
              </button>
            )}
          </aside>
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-sm border border-[#4A0612]/10 p-6 max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 opacity-30">
            <img src="/brand/logo-peacock-dark.svg" alt="" className="w-full h-full object-contain" />
          </div>
          <h2 className="font-display text-2xl text-[#1E1A1A] font-normal mb-2">
            No designs saved yet
          </h2>
          <p className="text-xs sm:text-sm text-[#1E1A1A]/60 font-sans leading-relaxed mb-6 max-w-sm mx-auto">
            Tap the heart icon on any piece while exploring our catalogue to curate your personal Albeli wishlist.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-widest rounded-sm transition-colors"
          >
            <span>Explore Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SavedDesignsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="w-8 h-8 border-2 border-[#4A0612] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display text-lg text-[#1E1A1A]/70">Loading saved designs...</p>
        </div>
      }
    >
      <SavedDesignsContent />
    </Suspense>
  );
}
