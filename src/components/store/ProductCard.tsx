"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { useSavedDesignsStore } from "@/lib/store/savedDesigns";
import { useAdminStore } from "@/lib/store/adminStore";
import { useInstagramOrderStore } from "@/lib/store/instagramOrderStore";
import { formatPrice, siteConfig, cn } from "@/lib/utils";
import type { PlaceholderProduct } from "@/lib/placeholder-data";

interface ProductCardProps {
  product: PlaceholderProduct;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [popHeart, setPopHeart] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const savedInStore = useSavedDesignsStore((state) => state.isSaved(product.id));
  const isSaved = mounted && savedInStore;
  const toggleSave = useSavedDesignsStore((state) => state.toggleSave);
  const settings = useAdminStore((state) => state.settings);
  const openInstagramOrder = useInstagramOrderStore((s) => s.openForProduct);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(product.id);
    setPopHeart(true);
    setTimeout(() => setPopHeart(false), 300);
  };

  const orderChannel = settings?.orderChannel || "instagram";
  const instagramHandle = settings?.instagramHandle || siteConfig.instagramHandle;
  const cleanNumber = (settings?.whatsappNumber || siteConfig.whatsappNumber).replace(/[^0-9]/g, "");

  const whatsappMsg = encodeURIComponent(
    `Namaste Albeli! ✨ I would like to order / enquire about the *${product.name}* (Price: ${formatPrice(product.price)}). Is this available?`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${whatsappMsg}`;
  const instagramUrl = `https://ig.me/m/${instagramHandle}`;
  const isInstagram = orderChannel === "instagram";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex flex-col bg-white rounded-sm border border-[#4A0612]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-md overflow-hidden",
        className
      )}
    >
      {/* Image container with 4:5 portrait ratio on phone, hover-swap on desktop */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#FBF6EE] block select-none"
        aria-label={`View ${product.name}`}
      >
        {/* Primary Image */}
        <img
          src={product.primaryImage}
          alt={product.name}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-500",
            isHovered && product.secondaryImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
          )}
          loading={priority ? "eager" : "lazy"}
        />

        {/* Secondary Image (Cross-fades on hover) */}
        {product.secondaryImage && (
          <img
            src={product.secondaryImage}
            alt={`${product.name} alternate view`}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-500",
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            )}
            loading="lazy"
          />
        )}

        {/* Badges in Top-Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badges.map((badge) => {
            if (badge === "best_seller") {
              return (
                <span
                  key={badge}
                  className="px-2 py-0.5 bg-[#4A0612] text-[#FCEDEA] text-[9px] uppercase tracking-wider font-semibold rounded-xs shadow-xs"
                >
                  Best Seller
                </span>
              );
            }
            if (badge === "new_arrival") {
              return (
                <span
                  key={badge}
                  className="px-2 py-0.5 bg-[#6B1F2E] text-[#FCEDEA] text-[9px] uppercase tracking-wider font-semibold rounded-xs shadow-xs"
                >
                  New Drop
                </span>
              );
            }
            if (badge === "sale") {
              return (
                <span
                  key={badge}
                  className="px-2 py-0.5 bg-[#B8923A] text-[#1E1A1A] text-[9px] uppercase tracking-wider font-bold rounded-xs shadow-xs"
                >
                  Sale
                </span>
              );
            }
            return null;
          })}
        </div>

        {/* Heart / Save Design Button (Top Right, 44px min touch target on mobile) */}
        <button
          onClick={handleSaveClick}
          aria-label={isSaved ? "Remove from saved designs" : "Save this design"}
          suppressHydrationWarning
          className={cn(
            "absolute top-2 right-2 z-10 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition-all duration-200 border border-[#4A0612]/10 shadow-xs hover:bg-white active:scale-125 touch-target",
            popHeart && "scale-125"
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isSaved
                ? "fill-[#6B1F2E] text-[#6B1F2E]"
                : "text-[#1E1A1A]/70 hover:text-[#6B1F2E]"
            )}
          />
        </button>

        {/* Quick Order overlay on hover for desktop */}
        <div className="absolute bottom-2 inset-x-2 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {isInstagram ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openInstagramOrder(product);
              }}
              className="w-full py-2 bg-[#4A0612]/95 hover:bg-[#6B1F2E] text-[#FCEDEA] text-[11px] font-medium tracking-wider uppercase rounded-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-[#FCEDEA]" />
              <span>Order on Instagram</span>
            </button>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2 bg-[#4A0612]/95 hover:bg-[#6B1F2E] text-[#FCEDEA] text-[11px] font-medium tracking-wider uppercase rounded-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Order on WhatsApp</span>
            </a>
          )}
        </div>
      </Link>

      {/* Details info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#1E1A1A]/50 uppercase tracking-widest mb-1 font-sans">
            <span className="truncate pr-1">
              {product.subcategory ? `${product.category} • ${product.subcategory}` : product.category}
            </span>
            {product.stock <= 4 && product.stock > 0 && (
              <span className="text-[#6B1F2E] font-medium text-[10px]">
                Only {product.stock} left
              </span>
            )}
          </div>

          <Link href={`/product/${product.slug}`} className="block group-hover:text-[#6B1F2E] transition-colors">
            <h3 className="font-display text-sm sm:text-base text-[#1E1A1A] line-clamp-2 leading-snug font-normal min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Outfit Pairings pill */}
          {product.outfitPairings && product.outfitPairings.length > 0 && (
            <p className="text-[11px] text-[#1E1A1A]/60 font-sans mt-1 truncate">
              Pairs with: {product.outfitPairings.slice(0, 2).join(", ")}
            </p>
          )}
        </div>

        {/* Price Row */}
        <div className="mt-3 pt-2.5 border-t border-[#4A0612]/5 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-sans font-medium text-sm sm:text-base text-[#1E1A1A]">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="font-sans text-xs text-[#1E1A1A]/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Mobile Quick Action Icon */}
          {isInstagram ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openInstagramOrder(product);
              }}
              aria-label="Order on Instagram"
              className="sm:hidden text-[#6B1F2E] p-1 transition-colors cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4 text-[#6B1F2E]" />
            </button>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on WhatsApp"
              className="sm:hidden text-[#6B1F2E] p-1 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
