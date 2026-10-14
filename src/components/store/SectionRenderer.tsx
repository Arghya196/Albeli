"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  Sparkles,
  Globe,
  MessageCircle,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { ProductCard } from "@/components/store/ProductCard";
import { VideoReelsSection } from "@/components/store/VideoReelsSection";
import { PLACEHOLDER_PRODUCTS, THEME_COLLECTIONS, REVIEWS } from "@/lib/placeholder-data";
import { useAdminStore, DEFAULT_HERO_SLIDES, HeroSlide } from "@/lib/store/adminStore";
import { siteConfig } from "@/lib/utils";

export function SectionRenderer() {
  const [mounted, setMounted] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const heroTouchStartX = useRef<number | null>(null);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  const storeSettings = useAdminStore((s) => s.settings);
  const storeReviews = useAdminStore((s) => s.reviews);
  const storeProducts = useAdminStore((s) => s.products);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reviewsList =
    mounted && storeReviews && storeReviews.length > 0
      ? storeReviews.filter((r) => r.visible !== false)
      : REVIEWS;

  const productsList =
    mounted && storeProducts && storeProducts.length > 0
      ? storeProducts
      : PLACEHOLDER_PRODUCTS;

  const slides: HeroSlide[] =
    mounted && storeSettings?.heroSlides && storeSettings.heroSlides.length > 0
      ? storeSettings.heroSlides
      : DEFAULT_HERO_SLIDES;

  // Auto-play timer for hero slides (4.8s interval, pauses when user hovers)
  useEffect(() => {
    if (!mounted || isHeroHovered || slides.length <= 1) return;

    const interval = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % slides.length);
    }, 4800);

    return () => clearInterval(interval);
  }, [mounted, isHeroHovered, slides.length]);

  const storyPhilosophy =
    mounted && storeSettings?.storyPhilosophy
      ? storeSettings.storyPhilosophy
      : "We grew tired of fashion jewellery that looked identical — mass-produced, flimsy, and lacking spirit. Albeli was born with a singular intention: to make pieces with genuine character, rich Indian heritage, and an unapologetic twist.";
  const instagramHandle =
    mounted && storeSettings?.instagramHandle ? storeSettings.instagramHandle : siteConfig.instagramHandle;
  const reviewsEnabled =
    mounted && storeSettings ? storeSettings.reviewsEnabled !== false : true;

  const prevHero = () => {
    setHeroIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextHero = () => {
    setHeroIdx((prev) => (prev + 1) % slides.length);
  };

  const handleHeroTouchStart = (e: React.TouchEvent) => {
    heroTouchStartX.current = e.touches[0].clientX;
  };

  const handleHeroTouchEnd = (e: React.TouchEvent) => {
    if (heroTouchStartX.current === null) return;
    const diff = heroTouchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextHero();
    } else if (diff < -45) {
      prevHero();
    }
    heroTouchStartX.current = null;
  };

  const prevReview = () => {
    if (!reviewsList.length) return;
    setActiveReviewIdx((prev) => (prev - 1 + reviewsList.length) % reviewsList.length);
  };

  const nextReview = () => {
    if (!reviewsList.length) return;
    setActiveReviewIdx((prev) => (prev + 1) % reviewsList.length);
  };

  const currentReview =
    reviewsList.length > 0
      ? reviewsList[activeReviewIdx % reviewsList.length]
      : REVIEWS[0];

  const currentSlide = slides[heroIdx % slides.length] || slides[0];

  return (
    <div className="w-full space-y-12 sm:space-y-24 pb-16 sm:pb-20 overflow-x-clip">
      {/* ── 1. Hero Banner (Full-Bleed Edge-to-Edge Slider) ── */}
      <section className="relative w-full overflow-hidden bg-[#FBF6EE]">
        <div
          onTouchStart={handleHeroTouchStart}
          onTouchEnd={handleHeroTouchEnd}
          onMouseEnter={() => setIsHeroHovered(true)}
          onMouseLeave={() => setIsHeroHovered(false)}
          className="group relative w-full overflow-hidden bg-[#4A0612] text-[#FCEDEA] aspect-[4/5] sm:aspect-[21/9] sm:min-h-[500px] lg:min-h-[580px] flex flex-col justify-end sm:justify-center p-6 sm:p-14 lg:p-20 select-none"
        >
          {/* Animated Background Campaign Image with framer-motion */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id || `slide-${heroIdx}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-0"
            >
              <img
                src={currentSlide.image}
                alt={currentSlide.headline}
                className="w-full h-full object-cover object-top sm:object-center opacity-90"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#4A0612]/95 via-[#4A0612]/65 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Overlaid Animated Headline & Copy */}
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${currentSlide.id || heroIdx}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-lg"
              >
                {currentSlide.badge && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#6B1F2E]/85 backdrop-blur-xs rounded-full border border-[#FCEDEA]/20 text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-[#FCEDEA] mb-2 sm:mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8923A]" />
                    <span>{currentSlide.badge}</span>
                  </div>
                )}

                <h1 className="font-display text-2xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] tracking-tight text-[#FCEDEA] mb-2 sm:mb-3">
                  {currentSlide.headline}
                </h1>

                {currentSlide.hindiTagline && (
                  <p className="font-hindi text-sm sm:text-xl text-[#F1DFD8]/90 mb-1 sm:mb-2 font-normal">
                    {currentSlide.hindiTagline}
                  </p>
                )}

                {currentSlide.desktopDesc && (
                  <p className="font-sans text-xs sm:text-sm text-[#F1DFD8]/80 leading-relaxed mb-6 max-w-md hidden sm:block">
                    {currentSlide.desktopDesc}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href={currentSlide.ctaLink || "/shop"}
                    className="flex-1 sm:flex-none text-center px-6 py-3.5 bg-[#FCEDEA] text-[#4A0612] hover:bg-[#F1DFD8] text-xs font-semibold uppercase tracking-[0.18em] rounded-sm transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>{currentSlide.ctaText || "Explore Drop"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/about"
                    className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-[#FCEDEA] text-xs font-medium uppercase tracking-[0.18em] rounded-sm transition-colors border border-[#FCEDEA]/30 hidden sm:inline-block"
                  >
                    Our Story
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left & Right Navigation Arrows (Positioned at banner sides like the screenshot) */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevHero}
                aria-label="Previous slide"
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 transition-all duration-200 active:scale-95 shadow-lg cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextHero}
                aria-label="Next slide"
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 transition-all duration-200 active:scale-95 shadow-lg cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>

        {/* Dash Pagination Beneath Hero Banner */}
        {slides.length > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 bg-[#FBF6EE]">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  heroIdx === i
                    ? "w-8 sm:w-10 bg-[#4A0612]"
                    : "w-3 sm:w-4 bg-[#4A0612]/20 hover:bg-[#4A0612]/40"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── 2. "Shop by Theme" (Phone: 1.2 Peeking Swipe Cards, Desktop: 4-Col) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-4 sm:mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-sans text-[#6B1F2E] font-semibold block mb-1">
              Curated Edits
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-[#1E1A1A] font-normal tracking-tight">
              Shop by Mood & Occasion
            </h2>
          </div>
          <span className="text-[11px] text-[#1E1A1A]/40 font-sans sm:hidden">
            Swipe →
          </span>
        </div>

        {/* 1.2 Peeking Snap Carousel on Phone, 4-Col on Desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {THEME_COLLECTIONS.map((theme) => (
            <Link
              key={theme.id}
              href={theme.link}
              className="w-[78vw] sm:w-auto shrink-0 snap-start group relative rounded-sm overflow-hidden bg-white border border-[#4A0612]/10 shadow-xs flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#FBF6EE]">
                <img
                  src={theme.image}
                  alt={theme.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A1A]/80 via-transparent to-transparent opacity-85" />

                <div className="absolute bottom-3.5 inset-x-3.5 text-white">
                  <span className="font-hindi text-[11px] text-[#FCEDEA]/80 block">
                    {theme.hindiTitle}
                  </span>
                  <h3 className="font-display text-xl text-white font-normal leading-snug">
                    {theme.title}
                  </h3>
                  <p className="text-[11px] text-white/70 font-sans mt-0.5 line-clamp-1">
                    {theme.itemCount}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white text-center border-t border-[#4A0612]/5">
                <span className="text-xs uppercase tracking-widest text-[#6B1F2E] font-medium flex items-center justify-center gap-1">
                  <span>Explore Edit</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. Trending Product Row (Phone: 2.2 Peeking Snap Scroll) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-4 sm:mb-8 pb-3 border-b border-[#4A0612]/10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-sans text-[#6B1F2E] font-semibold block mb-0.5">
              Top Picks
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-[#1E1A1A] font-normal tracking-tight">
              Designs Delhi Is Loving
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-xs uppercase tracking-wider font-sans font-medium text-[#6B1F2E] hover:text-[#4A0612] flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2.2 Peeking Horizontal Snap Scroll on Mobile */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {productsList.slice(0, 4).map((product, idx) => (
            <div key={product.id} className="w-[45vw] min-w-[160px] sm:w-auto shrink-0 snap-start">
              <ProductCard product={product} priority={idx < 2} />
            </div>
          ))}
        </div>

        <div className="text-center pt-6 sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 border border-[#4A0612]/20 text-xs font-semibold uppercase tracking-wider text-[#6B1F2E] rounded-sm w-full justify-center"
          >
            <span>Explore All {productsList.length} Designs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Video Reels Showcase (Jewellery in Motion) ── */}
      <VideoReelsSection />

      {/* ── 4. Collection Banner (Phone: Image on top, text below) ──────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-sm overflow-hidden bg-[#4A0612] text-[#FCEDEA] flex flex-col lg:flex-row shadow-sm">
          {/* Image */}
          <div className="relative aspect-[16/10] lg:w-1/2 overflow-hidden bg-black/20">
            <img
              src="/images/product-5-a.jpg"
              alt="The Hansak Peacock Edit"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="p-6 sm:p-12 lg:w-1/2 flex flex-col justify-center items-start">
            <span className="font-hindi text-xs sm:text-sm text-[#F1DFD8]/80 block mb-1">
              अलबेली विशेष
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#B8923A] font-bold block mb-2">
              Limited Artisan Batch
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-[#FCEDEA] font-normal leading-snug mb-3">
              The Royal Hasli & Peacock Edit
            </h2>
            <p className="text-xs sm:text-sm text-[#F1DFD8]/80 font-sans leading-relaxed mb-6">
              Individually hand-engraved by master karigars in Delhi using heritage repoussé brass techniques and 22k matte gold plating.
            </p>
            <Link
              href="/shop?category=necklaces"
              className="w-full sm:w-auto text-center px-7 py-3 bg-[#FCEDEA] text-[#4A0612] hover:bg-[#F1DFD8] text-xs font-semibold uppercase tracking-widest rounded-sm transition-all"
            >
              Shop The Hasli Edit
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. The Albeli Story Block ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white rounded-sm border border-[#4A0612]/10 p-6 sm:p-12 overflow-hidden shadow-xs">
          <div className="max-w-2xl relative z-10">
            <span className="text-[11px] uppercase tracking-[0.2em] font-sans text-[#6B1F2E] font-semibold block mb-1.5">
              Our Philosophy
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-[#1E1A1A] font-normal tracking-tight mb-4 leading-tight">
              Born in Old Delhi, crafted for the fearless modern desi.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#1E1A1A]/80 leading-relaxed mb-4">
              {storyPhilosophy}
            </p>
            <Link
              href="/about"
              className="text-xs uppercase tracking-wider font-sans font-semibold text-[#6B1F2E] hover:text-[#4A0612] inline-flex items-center gap-1 pt-1"
            >
              <span>Read Full Brand Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. "Reasons to Love Albeli" (Compact on Phone) ─────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-[#4A0612]/10">
          <div className="flex items-center sm:items-start gap-3.5">
            <div className="p-2.5 bg-[#4A0612]/5 text-[#6B1F2E] rounded-sm shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg text-[#1E1A1A] font-normal">
                Handcrafted in Delhi
              </h3>
              <p className="text-[11px] sm:text-xs text-[#1E1A1A]/60 font-sans">
                Small batch production with generational Indian artisans.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-3.5">
            <div className="p-2.5 bg-[#4A0612]/5 text-[#6B1F2E] rounded-sm shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg text-[#1E1A1A] font-normal">
                Anti-Tarnish & Skin Friendly
              </h3>
              <p className="text-[11px] sm:text-xs text-[#1E1A1A]/60 font-sans">
                Lead & nickel free with protective micro-seal barrier.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-3.5">
            <div className="p-2.5 bg-[#4A0612]/5 text-[#6B1F2E] rounded-sm shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg text-[#1E1A1A] font-normal">
                Ships All India & Worldwide
              </h3>
              <p className="text-[11px] sm:text-xs text-[#1E1A1A]/60 font-sans">
                Doorstep delivery with insured tracking worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Verified Reviews Carousel ────────────────────────────── */}
      {reviewsEnabled && reviewsList.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#4A0612] text-[#FCEDEA] rounded-sm p-6 sm:p-12 text-center">
            <div className="max-w-xl mx-auto flex flex-col items-center">
              <div className="flex items-center gap-1 text-[#B8923A] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#B8923A]" />
                ))}
              </div>

              <p className="font-display text-lg sm:text-2xl text-[#FCEDEA] font-normal leading-relaxed italic mb-4">
                &ldquo;{currentReview.comment}&rdquo;
              </p>

              <span className="font-sans font-medium text-xs tracking-wider uppercase text-[#FCEDEA]">
                {currentReview.customerName}
              </span>
              <span className="font-sans text-[11px] text-[#F1DFD8]/60 mt-0.5">
                {currentReview.location} • Verified Buyer
              </span>

              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={prevReview}
                  aria-label="Previous testimonial"
                  className="touch-target w-9 h-9 rounded-full border border-[#FCEDEA]/20 flex items-center justify-center text-[#FCEDEA]/70 hover:text-[#FCEDEA]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-sans tracking-widest text-[#F1DFD8]/60">
                  {activeReviewIdx + 1} / {reviewsList.length}
                </span>
                <button
                  onClick={nextReview}
                  aria-label="Next testimonial"
                  className="touch-target w-9 h-9 rounded-full border border-[#FCEDEA]/20 flex items-center justify-center text-[#FCEDEA]/70 hover:text-[#FCEDEA]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 8. Instagram Feed & Social Strip ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[11px] uppercase tracking-[0.2em] font-sans text-[#6B1F2E] font-semibold block mb-1">
          #AlbeliMuse
        </span>
        <h2 className="font-display text-2xl sm:text-3xl text-[#1E1A1A] font-normal mb-6">
          Follow Our Journey on Instagram
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-6">
          <div className="relative aspect-square rounded-sm overflow-hidden bg-white">
            <img src="/images/product-1-a.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative aspect-square rounded-sm overflow-hidden bg-white">
            <img src="/images/product-2-a.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative aspect-square rounded-sm overflow-hidden bg-white">
            <img src="/images/product-3-a.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative aspect-square rounded-sm overflow-hidden bg-white">
            <img src="/images/product-4-a.jpg" alt="" className="w-full h-full object-cover" />
          </div>
        </div>

        <a
          href={`https://instagram.com/${instagramHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 border border-[#4A0612]/20 hover:border-[#6B1F2E] text-xs font-semibold uppercase tracking-wider text-[#6B1F2E] rounded-sm transition-colors hover:bg-white"
        >
          <InstagramIcon className="w-3.5 h-3.5" />
          <span>Follow @{instagramHandle}</span>
        </a>
      </section>
    </div>
  );
}
