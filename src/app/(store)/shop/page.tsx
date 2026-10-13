"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  RotateCcw,
  Check,
  ChevronDown,
} from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "All Jewellery", value: "all" },
  { label: "Earrings", value: "earrings" },
  { label: "Necklaces", value: "necklaces" },
  { label: "Rings", value: "rings" },
];

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity, value: "all" },
  { label: "Under ₹1,500", min: 0, max: 150000, value: "under-1500" },
  { label: "₹1,500 – ₹2,500", min: 150000, max: 250000, value: "1500-2500" },
  { label: "Above ₹2,500", min: 250000, max: Infinity, value: "above-2500" },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest Drops", value: "newest" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Mobile Bottom Sheets State
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);

  // Read URL parameters
  const activeCategory = searchParams.get("category") || "all";
  const activePrice = searchParams.get("price") || "all";
  const activeSort = searchParams.get("sort") || "featured";
  const activeCollection = searchParams.get("collection") || null;

  // Update query params
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.replace("/shop", { scroll: false });
  };

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return PLACEHOLDER_PRODUCTS.filter((product) => {
      // Category filter
      if (activeCategory !== "all" && product.categorySlug !== activeCategory) {
        return false;
      }

      // Price filter
      if (activePrice !== "all") {
        const range = PRICE_RANGES.find((r) => r.value === activePrice);
        if (range && (product.price < range.min || product.price > range.max)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (activeSort === "price-asc") return a.price - b.price;
      if (activeSort === "price-desc") return b.price - a.price;
      if (activeSort === "newest") {
        return a.badges.includes("new_arrival") ? -1 : 1;
      }
      return 0; // featured order
    });
  }, [activeCategory, activePrice, activeSort]);

  const activeFiltersCount =
    (activeCategory !== "all" ? 1 : 0) +
    (activePrice !== "all" ? 1 : 0) +
    (activeCollection ? 1 : 0);

  const activeSortLabel =
    SORT_OPTIONS.find((s) => s.value === activeSort)?.label || "Featured";

  const [visibleCount, setVisibleCount] = useState(12);

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-12">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10 px-2">
        <span className="font-hindi text-xs sm:text-sm text-[#6B1F2E] block mb-0.5">
          अलबेली आभूषण
        </span>
        <h1 className="font-display text-3xl sm:text-5xl text-[#1E1A1A] font-normal tracking-tight mb-2">
          The Jewellery Catalogue
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1E1A1A]/60">
          Handcrafted in Delhi. Discover our limited artisan edits, created with love.
        </p>
      </div>

      {/* Sticky Mobile Filter & Sort Bar (Phone Only) */}
      <div className="sticky top-14 z-30 lg:hidden bg-[#FBF6EE]/95 backdrop-blur-md py-2 border-y border-[#4A0612]/10 mb-4 -mx-2.5 px-2.5">
        <div className="grid grid-cols-2 gap-2">
          {/* Filter Button */}
          <button
            onClick={() => setFilterSheetOpen(true)}
            className="touch-target py-2 px-3 bg-white border border-[#4A0612]/15 rounded-sm text-xs font-sans font-semibold uppercase tracking-wider text-[#1E1A1A] flex items-center justify-center gap-2 shadow-xs active:scale-98"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B1F2E]" />
            <span>Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          {/* Sort Button */}
          <button
            onClick={() => setSortSheetOpen(true)}
            className="touch-target py-2 px-3 bg-white border border-[#4A0612]/15 rounded-sm text-xs font-sans font-semibold uppercase tracking-wider text-[#1E1A1A] flex items-center justify-center gap-2 shadow-xs active:scale-98"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6B1F2E]" />
            <span className="truncate">{activeSortLabel}</span>
          </button>
        </div>
      </div>

      {/* Desktop Filter & Sort Bar */}
      <div className="hidden lg:flex items-center justify-between pb-6 border-b border-[#4A0612]/10 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => updateFilter("category", cat.value)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all",
                  activeCategory === cat.value
                    ? "bg-[#4A0612] text-[#FCEDEA] font-medium"
                    : "bg-white text-[#1E1A1A]/80 hover:bg-[#F1DFD8]/50 border border-[#4A0612]/10"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs text-[#6B1F2E] hover:underline font-medium ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[#1E1A1A]/50 font-sans">
            Showing {filteredProducts.length} designs
          </span>

          <div className="relative inline-block">
            <select
              value={activeSort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              aria-label="Sort designs"
              className="appearance-none bg-white border border-[#4A0612]/15 rounded-sm px-3.5 py-2 pr-8 text-xs font-sans text-[#1E1A1A] hover:border-[#4A0612]/40 focus:outline-none focus:border-[#6B1F2E] cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#1E1A1A]/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Grid + Desktop Sidebar */}
      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-56 shrink-0 space-y-6 select-none">
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#1E1A1A] mb-3">
              Price Range
            </h3>
            <div className="space-y-2">
              {PRICE_RANGES.map((range) => (
                <label
                  key={range.value}
                  className="flex items-center gap-2.5 text-xs text-[#1E1A1A]/80 cursor-pointer hover:text-[#6B1F2E]"
                >
                  <input
                    type="radio"
                    name="price"
                    checked={activePrice === range.value}
                    onChange={() => updateFilter("price", range.value)}
                    className="accent-[#6B1F2E]"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* 2-Column Grid on Phone (8px gap), 3/4-Column on Tablet/Desktop */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {visibleCount < filteredProducts.length && (
                <div className="text-center pt-8 pb-4">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 8)}
                    className="px-6 py-3 border border-[#4A0612]/20 hover:border-[#6B1F2E] text-xs uppercase tracking-wider font-semibold rounded-sm text-[#6B1F2E] transition-colors"
                  >
                    Load More Designs ({filteredProducts.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-sm border border-[#4A0612]/10 p-6">
              <h3 className="font-display text-xl text-[#1E1A1A] mb-1">
                No designs match this filter
              </h3>
              <p className="text-xs text-[#1E1A1A]/60 max-w-sm mx-auto mb-4">
                Try resetting filters to explore the full collection.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-[#4A0612] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Bottom Sheet (80% Height) ────────────────── */}
      {filterSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setFilterSheetOpen(false)}
          />

          {/* Sheet Body (80dvh) */}
          <div className="relative bg-[#FBF6EE] rounded-t-xl shadow-2xl h-[80dvh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-[#1E1A1A]/20 rounded-full mx-auto my-3" />

            {/* Sheet Header */}
            <div className="px-6 pb-3 border-b border-[#4A0612]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl text-[#1E1A1A]">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="text-xs bg-[#6B1F2E] text-white px-2 py-0.5 rounded-full font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 ? (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#6B1F2E] font-medium underline"
                >
                  Clear all
                </button>
              ) : (
                <button
                  onClick={() => setFilterSheetOpen(false)}
                  className="p-1 text-[#1E1A1A]/60"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Scrollable Filter Options */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Category */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1E1A1A] mb-3 font-sans">
                  Categories
                </h4>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => updateFilter("category", cat.value)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-sm text-sm font-sans transition-colors",
                        activeCategory === cat.value
                          ? "bg-white text-[#6B1F2E] font-semibold border border-[#6B1F2E]/30"
                          : "bg-white/50 text-[#1E1A1A]/80 border border-transparent"
                      )}
                    >
                      <span>{cat.label}</span>
                      {activeCategory === cat.value && <Check className="w-4 h-4 text-[#6B1F2E]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1E1A1A] mb-3 font-sans">
                  Price Range
                </h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => updateFilter("price", range.value)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-sm text-sm font-sans transition-colors",
                        activePrice === range.value
                          ? "bg-white text-[#6B1F2E] font-semibold border border-[#6B1F2E]/30"
                          : "bg-white/50 text-[#1E1A1A]/80 border border-transparent"
                      )}
                    >
                      <span>{range.label}</span>
                      {activePrice === range.value && <Check className="w-4 h-4 text-[#6B1F2E]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Bottom Action Button */}
            <div className="p-4 border-t border-[#4A0612]/10 bg-white safe-bottom-bar">
              <button
                onClick={() => setFilterSheetOpen(false)}
                className="w-full py-3.5 bg-[#4A0612] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm shadow-sm"
              >
                Show {filteredProducts.length} Designs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Sort Bottom Sheet ──────────────────────────────── */}
      {sortSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSortSheetOpen(false)}
          />
          <div className="relative bg-[#FBF6EE] rounded-t-xl shadow-2xl p-6 z-10 animate-in slide-in-from-bottom duration-200 safe-bottom-bar">
            <div className="w-12 h-1.5 bg-[#1E1A1A]/20 rounded-full mx-auto mb-4" />
            <h3 className="font-display text-xl text-[#1E1A1A] mb-4 pb-2 border-b border-[#4A0612]/10">
              Sort By
            </h3>
            <div className="space-y-1.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    updateFilter("sort", opt.value);
                    setSortSheetOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-3.5 rounded-sm text-sm font-sans text-left transition-colors",
                    activeSort === opt.value
                      ? "bg-white text-[#6B1F2E] font-semibold shadow-xs"
                      : "text-[#1E1A1A]/80 hover:bg-white/50"
                  )}
                >
                  <span>{opt.label}</span>
                  {activeSort === opt.value && <Check className="w-4 h-4 text-[#6B1F2E]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 text-center text-xs text-kajal/40">Loading catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
