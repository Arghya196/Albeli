"use client";

import { useEffect, useState } from "react";
import {
  X,
  Check,
  Copy,
  ExternalLink,
  Share2,
  Image as ImageIcon,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { useInstagramOrderStore } from "@/lib/store/instagramOrderStore";
import { useAdminStore } from "@/lib/store/adminStore";
import { formatPrice, siteConfig, cn } from "@/lib/utils";

export function InstagramOrderModal() {
  const { isOpen, mode, product, wishlistProducts, close } = useInstagramOrderStore();
  const storeSettings = useAdminStore((s) => s.settings);
  const addEnquiry = useAdminStore((s) => s.addEnquiry);

  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [origin, setOrigin] = useState("");

  const instagramHandle = storeSettings?.instagramHandle || siteConfig.instagramHandle;
  const whatsappNumber = (storeSettings?.whatsappNumber || siteConfig.whatsappNumber).replace(/[^0-9]/g, "");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        setCanShare(true);
      }
    }
  }, []);

  // Construct message content
  let title = "";
  let messageText = "";
  let shareUrl = "";
  let primaryImage = "";
  let priceSummary = "";

  if (mode === "single" && product) {
    title = product.name;
    primaryImage = product.primaryImage;
    shareUrl = `${origin || "https://albeli.in"}/product/${product.slug}`;
    priceSummary = formatPrice(product.price);
    messageText = `Namaste Albeli! ✨ I would like to order this handcrafted design:\n\n*${product.name}*\nPrice: ${formatPrice(product.price)}\nSKU: ${product.sku}\n\n📸 Photo & Product Link:\n${shareUrl}\n\nPlease let me know availability and how to proceed with payment!`;
  } else if (mode === "wishlist" && wishlistProducts.length > 0) {
    const totalPaise = wishlistProducts.reduce((sum, p) => sum + p.price, 0);
    const skuList = wishlistProducts.map((p) => p.sku).join(",");
    title = `Liked Designs (${wishlistProducts.length} pieces)`;
    primaryImage = wishlistProducts[0]?.primaryImage || "";
    shareUrl = `${origin || "https://albeli.in"}/saved?items=${encodeURIComponent(skuList)}`;
    priceSummary = formatPrice(totalPaise);

    const listText = wishlistProducts
      .map((p, idx) => `${idx + 1}. ${p.name} (${formatPrice(p.price)} - SKU: ${p.sku})`)
      .join("\n");

    messageText = `Namaste Albeli! ✨ I would like to enquire about my liked designs:\n\n${listText}\n\nTotal: ${priceSummary} (${wishlistProducts.length} designs)\n\n📸 View All Selected Photos & Pieces:\n${shareUrl}\n\nPlease let me know availability and order details!`;
  }

  // Auto-copy message text to clipboard upon opening modal
  useEffect(() => {
    if (isOpen && messageText && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(messageText).then(() => {
        setCopiedText(true);
      }).catch(() => {
        // Fallback gracefully
      });

      // Log enquiry into admin store
      try {
        addEnquiry({
          productName: mode === "single" && product ? product.name : `Liked Designs (${wishlistProducts.length} items)`,
          channel: "instagram",
          status: "new",
          timestamp: new Date().toISOString(),
        });
      } catch {
        // Safe fallback
      }
    } else {
      setCopiedText(false);
      setCopiedImage(false);
    }
  }, [isOpen, messageText, mode, product, wishlistProducts, addEnquiry]);

  if (!isOpen) return null;

  const handleCopyText = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(messageText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    }
  };

  const handleCopyImage = async () => {
    if (!primaryImage || typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      const response = await fetch(primaryImage);
      const blob = await response.blob();
      // PNG conversion or direct blob write if supported
      const pngBlob = blob.type === "image/png" ? blob : new Blob([blob], { type: "image/png" });
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": pngBlob,
        }),
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 3000);
    } catch {
      // Fallback: Copy link with photo
      handleCopyText();
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Albeli Order Enquiry — ${title}`,
          text: messageText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  const instagramDmUrl = `https://ig.me/m/${instagramHandle}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1E1A1A]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#FBF6EE] rounded-sm border border-[#4A0612]/20 shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#4A0612] text-[#FCEDEA]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center shadow-xs">
              <InstagramIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 id="modal-headline" className="font-display text-base font-semibold leading-none">
                Order via Instagram DM
              </h2>
              <span className="text-[10px] text-[#FCEDEA]/70 font-sans">
                Chatting with @{instagramHandle}
              </span>
            </div>
          </div>
          <button
            onClick={close}
            aria-label="Close dialog"
            className="p-1 rounded-sm text-[#FCEDEA]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 font-sans text-[#1E1A1A]">
          {/* Status Banner */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-[#25D366]/10 border border-[#25D366]/30 rounded-xs text-xs text-[#128C7E]">
            <div className="w-4 h-4 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5" />
            </div>
            <p className="font-medium">
              Order details & photo link <strong>copied to your clipboard!</strong>
            </p>
          </div>

          {/* Product / Wishlist Visual Preview Card */}
          {mode === "single" && product && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-xs border border-[#4A0612]/15 shadow-2xs">
              <div className="w-20 h-20 rounded-xs overflow-hidden bg-[#FBF6EE] shrink-0 border border-[#4A0612]/10">
                <img
                  src={product.primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-[#6B1F2E] font-semibold block">
                  {product.category}
                </span>
                <h3 className="font-display text-base sm:text-lg text-[#1E1A1A] truncate leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-sans text-sm font-semibold text-[#1E1A1A]">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-[10px] text-[#1E1A1A]/50 bg-[#FBF6EE] px-1.5 py-0.5 rounded-xs border border-[#4A0612]/10 font-mono">
                    SKU: {product.sku}
                  </span>
                </div>
              </div>
            </div>
          )}

          {mode === "wishlist" && wishlistProducts.length > 0 && (
            <div className="p-3 bg-white rounded-xs border border-[#4A0612]/15 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#6B1F2E] font-semibold block">
                    Curated Wishlist
                  </span>
                  <h3 className="font-display text-base text-[#1E1A1A]">
                    {wishlistProducts.length} Liked Pieces
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#1E1A1A]/60 block text-[10px]">Total Value</span>
                  <span className="font-sans text-sm font-semibold text-[#1E1A1A]">
                    {priceSummary}
                  </span>
                </div>
              </div>

              {/* Liked Items Thumbnail Strip */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="w-14 h-14 rounded-xs overflow-hidden shrink-0 border border-[#4A0612]/15 relative group bg-[#FBF6EE]"
                    title={`${p.name} (${formatPrice(p.price)})`}
                  >
                    <img src={p.primaryImage} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simple 2-Step Instructions */}
          <div className="bg-[#FCEDEA]/60 border border-[#4A0612]/10 rounded-xs p-3 text-xs space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#4A0612] text-[#FCEDEA] text-[10px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <p className="text-[#1E1A1A]/80">
                Click <strong>"Open Instagram Chat"</strong> below to open our direct message screen.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#4A0612] text-[#FCEDEA] text-[10px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <p className="text-[#1E1A1A]/80">
                Tap <strong>Paste</strong> into the chat. The piece's photo preview & order details will appear instantly for our team!
              </p>
            </div>
          </div>

          {/* Primary Action Button: Open Instagram Chat */}
          <div className="space-y-2 pt-1">
            <a
              href={instagramDmUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="w-full py-3.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white text-xs font-semibold uppercase tracking-[0.18em] rounded-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4 text-white" />
              <span>Open Instagram Chat (@{instagramHandle})</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/80" />
            </a>

            {/* Quick Helper Actions Row */}
            <div className="grid grid-cols-2 gap-2">
              {/* Copy Image / Photo */}
              <button
                type="button"
                onClick={handleCopyImage}
                className="py-2.5 px-3 bg-white hover:bg-[#F1DFD8]/40 border border-[#4A0612]/20 rounded-xs text-[11px] font-medium text-[#1E1A1A] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedImage ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#25D366]" />
                    <span className="text-[#128C7E] font-semibold">Photo Copied!</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5 text-[#6B1F2E]" />
                    <span>Copy Photo</span>
                  </>
                )}
              </button>

              {/* Native Mobile Share Sheet if available, else Copy Text */}
              {canShare ? (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="py-2.5 px-3 bg-white hover:bg-[#F1DFD8]/40 border border-[#4A0612]/20 rounded-xs text-[11px] font-medium text-[#1E1A1A] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#6B1F2E]" />
                  <span>Share via Apps</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="py-2.5 px-3 bg-white hover:bg-[#F1DFD8]/40 border border-[#4A0612]/20 rounded-xs text-[11px] font-medium text-[#1E1A1A] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#25D366]" />
                      <span className="text-[#128C7E] font-semibold">Text Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#6B1F2E]" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Message Preview */}
          <details className="group border border-[#4A0612]/10 rounded-xs bg-white text-xs">
            <summary className="px-3 py-2 cursor-pointer font-medium text-[#1E1A1A]/70 flex items-center justify-between hover:text-[#1E1A1A]">
              <span>View message content that was copied</span>
              <span className="text-[10px] text-[#6B1F2E] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-3 border-t border-[#4A0612]/10 bg-[#FBF6EE]/60 font-mono text-[11px] text-[#1E1A1A]/80 whitespace-pre-wrap leading-relaxed select-all">
              {messageText}
            </div>
          </details>

          {/* Alternate WhatsApp Fallback */}
          <div className="pt-2 text-center border-t border-[#4A0612]/10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="inline-flex items-center gap-1.5 text-xs text-[#1E1A1A]/60 hover:text-[#128C7E] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Prefer WhatsApp? Chat on WhatsApp instead</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
