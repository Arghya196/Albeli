"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Globe,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Play,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { ProductCard } from "@/components/store/ProductCard";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data";
import { useSavedDesignsStore } from "@/lib/store/savedDesigns";
import { useAdminStore } from "@/lib/store/adminStore";
import { useInstagramOrderStore } from "@/lib/store/instagramOrderStore";
import { formatPrice, siteConfig, cn } from "@/lib/utils";

export function ProductDetailClient({ slug }: { slug: string }) {
  const adminProducts = useAdminStore((s) => s.products);
  const addEnquiry = useAdminStore((s) => s.addEnquiry);
  const storeSettings = useAdminStore((s) => s.settings);
  const openInstagramOrder = useInstagramOrderStore((s) => s.openForProduct);

  const matchedPlaceholder = PLACEHOLDER_PRODUCTS.find((p) => p.slug === slug);
  const matchedAdmin = adminProducts?.find((p) => p.slug === slug);
  const rawProduct = matchedAdmin || matchedPlaceholder;

  if (!rawProduct) {
    notFound();
  }

  // Ensure videoUrl falls back to placeholder demo video if not defined in older stored admin state
  const product = {
    ...rawProduct,
    videoUrl: rawProduct.videoUrl || matchedPlaceholder?.videoUrl,
  };

  // State for active image index in swipe gallery
  const images = [product.primaryImage, product.secondaryImage].filter(Boolean);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [fullscreenViewerOpen, setFullscreenViewerOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const handleResize = () => {
      if (window.visualViewport) {
        const isKeyboard = window.visualViewport.height < window.innerHeight * 0.75;
        setKeyboardOpen(isKeyboard);
      }
    };
    window.visualViewport.addEventListener("resize", handleResize);
    return () => window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);

  // Accordion state (closed by default on mobile)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Saved Designs Zustand store
  const isSaved = useSavedDesignsStore((state) => state.isSaved(product.id));
  const toggleSave = useSavedDesignsStore((state) => state.toggleSave);

  const whatsappNumber = storeSettings?.whatsappNumber || siteConfig.whatsappNumber;
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const instagramHandle = storeSettings?.instagramHandle || siteConfig.instagramHandle;
  const orderChannel = storeSettings?.orderChannel || "instagram";

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://albeli.in/product/${product.slug}`;

  // Pre-filled WhatsApp message
  const whatsappOrderMsg = encodeURIComponent(
    `Namaste Albeli! ✨ I would like to order this design:\n\n*${product.name}*\nPrice: ${formatPrice(product.price)}\nSKU: ${product.sku}\nLink: ${currentUrl}\n\nPlease let me know how to proceed with payment and delivery details!`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${whatsappOrderMsg}`;

  // Pre-filled Instagram DM
  const instagramOrderMsg = encodeURIComponent(
    `Namaste Albeli! ✨ I would like to order: ${product.name} (${formatPrice(product.price)}, SKU: ${product.sku}). Link: ${currentUrl}`
  );
  const instagramDmUrl = `https://ig.me/m/${instagramHandle}?text=${instagramOrderMsg}`;

  // Log enquiry action into both adminStore and localStorage
  const logEnquiry = (channel: "whatsapp" | "instagram") => {
    try {
      addEnquiry({
        productName: product.name,
        channel,
        status: "new",
        timestamp: new Date().toISOString(),
      });

      const logs = JSON.parse(localStorage.getItem("albeli_enquiries_log") || "[]");
      logs.unshift({
        productId: product.id,
        productName: product.name,
        channel,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("albeli_enquiries_log", JSON.stringify(logs.slice(0, 50)));
    } catch {
      // fallback
    }
  };

  const handleShareClick = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Related products (prioritize same subcategory, then same category)
  const pool = adminProducts && adminProducts.length > 0 ? adminProducts : PLACEHOLDER_PRODUCTS;
  const sameSub = pool.filter(
    (p) => p.id !== product.id && p.subcategorySlug && p.subcategorySlug === product.subcategorySlug
  );
  const sameCat = pool.filter(
    (p) =>
      p.id !== product.id &&
      p.categorySlug === product.categorySlug &&
      (!p.subcategorySlug || p.subcategorySlug !== product.subcategorySlug)
  );
  const other = pool.filter((p) => p.id !== product.id && p.categorySlug !== product.categorySlug);
  const relatedProducts = [...sameSub, ...sameCat, ...other].slice(0, 4);

  // JSON-LD structured data for rich Google Shopping snippets
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images.map((img) => (img.startsWith("http") ? img : `https://albeli.in${img}`)),
    sku: product.sku,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "Albeli",
    },
    offers: {
      "@type": "Offer",
      url: currentUrl,
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: "2028-12-31",
      seller: {
        "@type": "Organization",
        name: "Albeli",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "24",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-10 pb-28 sm:pb-16 overflow-x-clip">
      {/* Schema.org Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-[#1E1A1A]/50 mb-3 sm:mb-6 font-sans flex-wrap gap-y-1">
        <Link href="/" className="hover:text-[#6B1F2E] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#6B1F2E] transition-colors">
          Shop
        </Link>
        <span>/</span>
        <Link
          href={`/shop?category=${product.categorySlug}`}
          className="hover:text-[#6B1F2E] transition-colors"
        >
          {product.category}
        </Link>
        {product.subcategory && (
          <>
            <span>/</span>
            <Link
              href={`/shop?category=${product.categorySlug}&subcategory=${product.subcategorySlug}`}
              className="text-[#6B1F2E] font-medium hover:underline transition-colors"
            >
              {product.subcategory}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-[#1E1A1A] font-medium truncate max-w-[180px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 pb-8 sm:pb-16">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 -mx-4 sm:mx-0">
          {/* Vertical Thumbnail Rail (Desktop Only) */}
          {(images.length > 1 || product.videoUrl) && (
            <div className="hidden sm:flex flex-col gap-3 shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setShowVideo(false);
                    setActiveImageIdx(i);
                  }}
                  className={cn(
                    "relative w-20 h-20 rounded-sm overflow-hidden border transition-all cursor-pointer",
                    !showVideo && activeImageIdx === i
                      ? "border-[#4A0612] ring-1 ring-[#4A0612]"
                      : "border-[#4A0612]/15 hover:border-[#4A0612]/50 opacity-70 hover:opacity-100"
                  )}
                  aria-label={`View image angle ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {product.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={cn(
                    "relative w-20 h-20 rounded-sm overflow-hidden border transition-all cursor-pointer bg-[#1E1A1A] flex flex-col items-center justify-center text-white gap-1 group",
                    showVideo
                      ? "border-[#4A0612] ring-2 ring-[#4A0612]"
                      : "border-[#4A0612]/15 hover:border-[#4A0612]/50 opacity-80 hover:opacity-100"
                  )}
                  aria-label="Play product video"
                >
                  <div className="w-7 h-7 rounded-full bg-[#E1306C]/85 group-hover:bg-[#E1306C] flex items-center justify-center transition-transform group-hover:scale-110">
                    <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                  </div>
                  <span className="text-[10px] font-sans font-medium tracking-wider uppercase">Video</span>
                </button>
              )}
            </div>
          )}

          {/* Main Display Image / Phone Swipe Carousel / Video Player */}
          <div className="relative flex-1 aspect-[4/5] sm:aspect-square sm:rounded-sm overflow-hidden bg-black sm:border border-[#4A0612]/10 select-none">
            {showVideo && product.videoUrl ? (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video
                  src={product.videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover sm:object-contain"
                />
                <button
                  onClick={() => setShowVideo(false)}
                  className="absolute top-3 right-3 z-20 px-3 py-1.5 bg-black/75 hover:bg-black/90 text-white text-xs font-sans rounded-xs flex items-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Back to Photos</span>
                </button>
                <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-[#FCEDEA] text-[11px] font-sans rounded-xs flex items-center gap-1.5">
                  <Play className="w-3 h-3 fill-current text-[#E1306C]" />
                  <span>Product Reel</span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setFullscreenViewerOpen(true)}
                className="w-full h-full cursor-zoom-in relative bg-white"
              >
                <img
                  src={images[activeImageIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Tap to Zoom Hint on Phone */}
                <div className="sm:hidden absolute bottom-3 left-3 z-10 px-2 py-1 bg-black/50 backdrop-blur-xs text-white text-[10px] font-sans rounded-xs flex items-center gap-1">
                  <ZoomIn className="w-3 h-3" />
                  <span>Tap to zoom</span>
                </div>
              </div>
            )}

            {/* Mobile Video Reel Pill (when photos are showing) */}
            {!showVideo && product.videoUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVideo(true);
                }}
                className="sm:hidden absolute top-3 right-3 z-10 px-2.5 py-1 bg-black/70 hover:bg-black/90 backdrop-blur-xs text-white text-[11px] font-sans font-medium rounded-full flex items-center gap-1.5 border border-white/20 shadow-md active:scale-95"
              >
                <Play className="w-3 h-3 fill-[#E1306C] text-[#E1306C]" />
                <span>Watch Reel</span>
              </button>
            )}

            {/* Badges in Top-Left */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1 z-10">
              {product.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#4A0612] text-[#FCEDEA] text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase rounded-xs"
                >
                  {badge.replace("_", " ")}
                </span>
              ))}
            </div>

            {/* Mobile Image Indicator Badge (e.g. 1/2) */}
            {!showVideo && images.length > 1 && (
              <div className="absolute bottom-3 right-3 sm:hidden z-10 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono rounded-full">
                {activeImageIdx + 1} / {images.length}
              </div>
            )}

            {/* Mobile Carousel Swipe Arrows */}
            {!showVideo && images.length > 1 && (
              <div className="sm:hidden absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  }}
                  className="pointer-events-auto touch-target w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#1E1A1A] shadow-xs"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx((prev) => (prev + 1) % images.length);
                  }}
                  className="pointer-events-auto touch-target w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#1E1A1A] shadow-xs"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Save Heart on Desktop Main View */}
            <button
              onClick={() => toggleSave(product.id)}
              aria-label={isSaved ? "Remove from saved designs" : "Save this design"}
              className="hidden sm:flex absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs items-center justify-center border border-[#4A0612]/15 shadow-sm hover:bg-white transition-all active:scale-95"
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors",
                  isSaved ? "fill-[#6B1F2E] text-[#6B1F2E]" : "text-[#1E1A1A]/70 hover:text-[#6B1F2E]"
                )}
              />
            </button>
          </div>
        </div>

        {/* Right Column: Product Details & CTAs */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          {/* Category, Subcategory & SKU */}
          <div className="flex items-center justify-between text-[11px] text-[#1E1A1A]/60 uppercase tracking-widest font-sans mb-1 flex-wrap gap-1">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/shop?category=${product.categorySlug}`}
                className="hover:text-[#6B1F2E] transition-colors"
              >
                {product.category}
              </Link>
              {product.subcategory && (
                <>
                  <span className="text-[#1E1A1A]/30">›</span>
                  <Link
                    href={`/shop?category=${product.categorySlug}&subcategory=${product.subcategorySlug}`}
                    className="text-[#6B1F2E] font-semibold hover:underline"
                  >
                    {product.subcategory}
                  </Link>
                </>
              )}
            </div>
            <span className="font-mono text-[10px] text-[#1E1A1A]/40">SKU: {product.sku}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-2xl sm:text-4xl text-[#1E1A1A] font-normal tracking-tight leading-snug mb-2 sm:mb-3">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-2.5 mb-3 sm:mb-4 pb-3 border-b border-[#4A0612]/10">
            <span className="font-sans text-xl sm:text-2xl font-semibold text-[#1E1A1A]">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="font-sans text-sm text-[#1E1A1A]/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="text-[10px] text-[#1E1A1A]/50 font-sans ml-1">
              Inclusive of taxes
            </span>
          </div>

          {/* Stock Indicator & Ships Worldwide */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#25D366]/10 text-[#128C7E] rounded-full text-xs font-medium font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
              <span>{product.stock <= 4 ? `Only ${product.stock} left` : "Ready to Dispatch"}</span>
            </div>
            <span className="text-xs text-[#1E1A1A]/60 font-sans">
              • Ships All India & Worldwide ✈️
            </span>
          </div>

          {/* Option Chips (Wrap to next line, never overflow) */}
          <div className="mb-4">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#1E1A1A]/60 font-semibold block mb-1.5">
              Fit & Specifications
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-white border border-[#4A0612]/15 text-[11px] text-[#1E1A1A] rounded-sm font-sans shadow-2xs">
                Free Size / Adjustable
              </span>
              <span className="px-2.5 py-1 bg-white border border-[#4A0612]/15 text-[11px] text-[#1E1A1A] rounded-sm font-sans shadow-2xs">
                22k Antique Gold Polish
              </span>
              <span className="px-2.5 py-1 bg-white border border-[#4A0612]/15 text-[11px] text-[#1E1A1A] rounded-sm font-sans shadow-2xs">
                Anti-Tarnish Seal
              </span>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="p-3 bg-[#FBF6EE] border border-[#4A0612]/10 rounded-sm mb-5 text-xs text-[#1E1A1A]/80 font-sans">
            <p>
              📦 <strong>Dispatch Note:</strong> Dispatches in 24–48 hours from Delhi. Hand-checked before packing.
            </p>
          </div>

          {/* Mobile Secondary Action */}
          <div className="sm:hidden mb-4">
            {orderChannel === "instagram" ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logEnquiry("whatsapp")}
                className="w-full py-2.5 bg-white border border-[#4A0612]/20 text-[#1E1A1A] text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 active:bg-[#FBF6EE]"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Have questions? Chat on WhatsApp</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => openInstagramOrder(product)}
                className="w-full py-2.5 bg-white border border-[#4A0612]/20 text-[#1E1A1A] text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 active:bg-[#FBF6EE] cursor-pointer"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-[#6B1F2E]" />
                <span>Enquire on Instagram DM</span>
              </button>
            )}
          </div>

          {/* Desktop Direct Order Actions (Hidden on mobile where sticky bar sits) */}
          <div className="hidden sm:block space-y-3 mb-6">
            {orderChannel === "instagram" && (
              <>
                <button
                  type="button"
                  onClick={() => openInstagramOrder(product)}
                  className="w-full py-4 bg-[#1E1A1A] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-[0.18em] rounded-sm transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md active:scale-98 cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4 text-[#FCEDEA]" />
                  <span>Order on Instagram</span>
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => logEnquiry("whatsapp")}
                  className="w-full py-3 bg-white hover:bg-[#F1DFD8]/40 text-[#1E1A1A] text-xs font-medium uppercase tracking-[0.18em] rounded-sm transition-colors border border-[#4A0612]/20 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </>
            )}

            {orderChannel === "whatsapp" && (
              <>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => logEnquiry("whatsapp")}
                  className="w-full py-4 bg-[#1E1A1A] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-[0.18em] rounded-sm transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Order on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => openInstagramOrder(product)}
                  className="w-full py-3 bg-white hover:bg-[#F1DFD8]/40 text-[#1E1A1A] text-xs font-medium uppercase tracking-[0.18em] rounded-sm transition-colors border border-[#4A0612]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4 text-[#6B1F2E]" />
                  <span>Enquire on Instagram DM</span>
                </button>
              </>
            )}

            {orderChannel === "both" && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => openInstagramOrder(product)}
                  className="py-3.5 bg-[#1E1A1A] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4 text-[#FCEDEA]" />
                  <span>Instagram</span>
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => logEnquiry("whatsapp")}
                  className="py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          {/* Social Proof & Share Row */}
          <div className="flex items-center justify-between py-2.5 border-y border-[#4A0612]/10 mb-6 text-xs font-sans text-[#1E1A1A]/70">
            <button
              onClick={() => toggleSave(product.id)}
              className="inline-flex items-center gap-1.5 hover:text-[#6B1F2E] transition-colors touch-target sm:touch-auto"
            >
              <Heart className={cn("w-3.5 h-3.5", isSaved && "fill-[#6B1F2E] text-[#6B1F2E]")} />
              <span>{isSaved ? "Saved" : "Save this design"}</span>
            </button>

            <button
              onClick={handleShareClick}
              className="inline-flex items-center gap-1 hover:text-[#6B1F2E] transition-colors touch-target sm:touch-auto"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#25D366]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Link Copied!" : "Share Design"}</span>
            </button>
          </div>

          {/* Outfit Pairings Card */}
          {product.outfitPairings && product.outfitPairings.length > 0 && (
            <div className="p-3 bg-white rounded-sm border border-[#4A0612]/10 mb-4">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#6B1F2E] block mb-0.5">
                Outfit Pairing
              </span>
              <p className="text-xs text-[#1E1A1A]/80 font-sans">
                Pairs well with: <span className="font-medium text-[#1E1A1A]">{product.outfitPairings.join(", ")}</span>
              </p>
            </div>
          )}

          {/* Expandable Accordions (Closed by default on mobile) */}
          <div className="border-t border-[#4A0612]/10 divide-y divide-[#4A0612]/10 select-none">
            {/* 1. Description */}
            <div className="py-3 sm:py-4">
              <button
                onClick={() => setOpenAccordion(openAccordion === "description" ? null : "description")}
                className="w-full flex items-center justify-between text-left font-display text-base sm:text-lg text-[#1E1A1A] touch-target sm:touch-auto"
              >
                <span>Description & Craft Details</span>
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform duration-200", openAccordion === "description" && "rotate-180")}
                />
              </button>
              {openAccordion === "description" && (
                <div className="pt-2 text-xs sm:text-sm text-[#1E1A1A]/70 font-sans leading-relaxed">
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            {/* 2. Materials & Care */}
            <div className="py-3 sm:py-4">
              <button
                onClick={() => setOpenAccordion(openAccordion === "care" ? null : "care")}
                className="w-full flex items-center justify-between text-left font-display text-base sm:text-lg text-[#1E1A1A] touch-target sm:touch-auto"
              >
                <span>Materials & Care Guide</span>
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform duration-200", openAccordion === "care" && "rotate-180")}
                />
              </button>
              {openAccordion === "care" && (
                <div className="pt-2 text-xs sm:text-sm text-[#1E1A1A]/70 font-sans leading-relaxed">
                  <p>{product.materialsCare}</p>
                </div>
              )}
            </div>

            {/* 3. Shipping */}
            <div className="py-3 sm:py-4">
              <button
                onClick={() => setOpenAccordion(openAccordion === "shipping" ? null : "shipping")}
                className="w-full flex items-center justify-between text-left font-display text-base sm:text-lg text-[#1E1A1A] touch-target sm:touch-auto"
              >
                <span>Shipping & Worldwide Delivery</span>
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform duration-200", openAccordion === "shipping" && "rotate-180")}
                />
              </button>
              {openAccordion === "shipping" && (
                <div className="pt-2 text-xs sm:text-sm text-[#1E1A1A]/70 font-sans leading-relaxed">
                  <p>{product.shippingInfo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Value Proportions Strip (3 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-[#4A0612]/10 mb-12 bg-white p-4 sm:p-6 rounded-sm">
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-[#6B1F2E] shrink-0" />
          <span className="text-xs text-[#1E1A1A] font-medium font-sans">
            Handcrafted in Delhi Atelier
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-[#6B1F2E] shrink-0" />
          <span className="text-xs text-[#1E1A1A] font-medium font-sans">
            Anti-Tarnish & Hypoallergenic
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-[#6B1F2E] shrink-0" />
          <span className="text-xs text-[#1E1A1A] font-medium font-sans">
            Worldwide Delivery with Tracking
          </span>
        </div>
      </div>

      {/* You May Also Like (Horizontal Snap Scroll on Phone) */}
      <div>
        <div className="flex items-baseline justify-between mb-4 sm:mb-6 pb-2 border-b border-[#4A0612]/10">
          <h2 className="font-display text-2xl text-[#1E1A1A]">
            You May Also Like
          </h2>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-wider text-[#6B1F2E] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="flex sm:grid sm:grid-cols-4 gap-3.5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {relatedProducts.map((p) => (
            <div key={p.id} className="w-[45vw] min-w-[160px] sm:w-auto shrink-0 snap-start">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      {/* ── STICKY BOTTOM BAR (Mobile Phone Only, hides when keyboard is open) ── */}
      {!keyboardOpen && (
        <aside aria-label="Quick Actions" className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#4A0612]/15 p-2.5 safe-bottom-bar shadow-xl">
          <div className="flex items-center gap-2 max-w-md mx-auto">
            {/* Heart / Save Design Button (44x44px touch target) */}
            <button
              onClick={() => toggleSave(product.id)}
              aria-label={isSaved ? "Remove from saved designs" : "Save this design"}
              className={cn(
                "touch-target w-12 h-12 rounded-sm border flex items-center justify-center shrink-0 transition-colors active:scale-95",
                isSaved
                  ? "bg-[#6B1F2E]/10 border-[#6B1F2E]"
                  : "bg-white border-[#4A0612]/20 text-[#1E1A1A]"
              )}
            >
              <Heart
                className={cn(
                  "w-5 h-5",
                  isSaved ? "fill-[#6B1F2E] text-[#6B1F2E]" : "text-[#1E1A1A]"
                )}
              />
            </button>

            {/* Action Button(s) based on orderChannel */}
            {orderChannel === "both" ? (
              <div className="flex-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openInstagramOrder(product)}
                  className="flex-1 touch-target h-12 bg-[#4A0612] active:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4 text-[#FCEDEA]" />
                  <span>Instagram</span>
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => logEnquiry("whatsapp")}
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
                onClick={() => logEnquiry("whatsapp")}
                className="flex-1 touch-target h-12 bg-[#4A0612] active:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Order on WhatsApp</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => openInstagramOrder(product)}
                className="flex-1 touch-target h-12 bg-[#4A0612] active:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <InstagramIcon className="w-4 h-4 text-[#FCEDEA]" />
                <span>Order on Instagram</span>
              </button>
            )}
          </div>
        </aside>
      )}

      {/* ── Fullscreen Image Viewer Modal ────────────────────────────── */}
      {fullscreenViewerOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E1A1A]/95 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white pb-2 max-w-2xl mx-auto w-full">
            <span className="text-xs font-mono text-[#F1DFD8]/80">
              {activeImageIdx + 1} / {images.length}
            </span>
            <button
              onClick={() => setFullscreenViewerOpen(false)}
              aria-label="Close fullscreen view"
              className="touch-target p-2 text-white hover:text-[#FCEDEA]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-hidden p-2">
            <img
              src={images[activeImageIdx]}
              alt={product.name}
              className="max-h-[80dvh] max-w-full object-contain rounded-sm"
            />
          </div>

          {images.length > 1 && (
            <div className="flex items-center justify-center gap-4 text-white py-3">
              <button
                onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                className="touch-target px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-sm text-xs uppercase tracking-wider font-medium"
              >
                Previous
              </button>
              <button
                onClick={() => setActiveImageIdx((prev) => (prev + 1) % images.length)}
                className="touch-target px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-sm text-xs uppercase tracking-wider font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
