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
  Sparkles,
  ChevronRight,
  Filter,
} from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { PLACEHOLDER_PRODUCTS, PlaceholderProduct } from "@/lib/placeholder-data";
import { useAdminStore, DEFAULT_CATEGORIES, AdminCategory } from "@/lib/store/adminStore";
import { cn } from "@/lib/utils";

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

  const storeProducts = useAdminStore((s) => s.products);
  const storeCategories = useAdminStore((s) => s.categories);

  // Available products & categories from store or static fallbacks
  const products: PlaceholderProduct[] =
    storeProducts && storeProducts.length > 0 ? storeProducts : PLACEHOLDER_PRODUCTS;
  const categories: AdminCategory[] =
    storeCategories && storeCategories.length > 0 ? storeCategories : DEFAULT_CATEGORIES;

  // Root categories
  const rootCategories = useMemo(() => {
    return categories.filter((c) => !c.parentId);
  }, [categories]);

  // Subcategories mapping by parentId
  const subcategoriesByParentId = useMemo(() => {
    const map = new Map<string, AdminCategory[]>();
    categories.forEach((cat) => {
      if (cat.parentId) {
        const list = map.get(cat.parentId) || [];
        list.push(cat);
        map.set(cat.parentId, list);
      }
    });
    return map;
  }, [categories]);

  // Mobile Bottom Sheets State
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);

  // Read URL parameters
  const activeCategory = searchParams.get("category") || "all";
  const activeSubcategory = searchParams.get("subcategory") || "all";
  const activePrice = searchParams.get("price") || "all";
  const activeSort = searchParams.get("sort") || "featured";
  const activeCollection = searchParams.get("collection") || null;

  // Find currently active root category object
  const currentCategoryObj = useMemo(() => {
    if (activeCategory === "all") return null;
    return (
      rootCategories.find(
        (c) => c.slug.toLowerCase() === activeCategory.toLowerCase()
      ) || null
    );
  }, [rootCategories, activeCategory]);

  // Subcategories for active category
  const activeSubcategoriesList = useMemo(() => {
    if (!currentCategoryObj) return [];
    return subcategoriesByParentId.get(currentCategoryObj.id) || [];
  }, [currentCategoryObj, subcategoriesByParentId]);

  // Current active subcategory object
  const currentSubcategoryObj = useMemo(() => {
    if (activeSubcategory === "all") return null;
    return (
      categories.find(
        (c) =>
          c.parentId &&
          c.slug.toLowerCase() === activeSubcategory.toLowerCase()
      ) || null
    );
  }, [categories, activeSubcategory]);

  // Update query params
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (key === "category") {
      // When changing category, reset subcategory
      params.delete("subcategory");
      if (value === "all" || !value) {
        params.delete("category");
      } else {
        params.set("category", value);
      }
    } else {
      if (value === "all" || !value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.replace("/shop", { scroll: false });
  };

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (activeCategory !== "all" && product.categorySlug !== activeCategory) {
        return false;
      }

      // Subcategory filter
      if (activeSubcategory !== "all" && product.subcategorySlug !== activeSubcategory) {
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
        return a.badges?.includes("new_arrival") ? -1 : 1;
      }
      return 0; // featured order
    });
  }, [products, activeCategory, activeSubcategory, activePrice, activeSort]);

  // Subcategory item count helper
  const getSubcategoryCount = (subSlug: string) => {
    return products.filter((p) => {
      if (activeCategory !== "all" && p.categorySlug !== activeCategory) return false;
      return p.subcategorySlug === subSlug;
    }).length;
  };

  const getCategoryCount = (catSlug: string) => {
    return products.filter((p) => p.categorySlug === catSlug).length;
  };

  const activeFiltersCount =
    (activeCategory !== "all" ? 1 : 0) +
    (activeSubcategory !== "all" ? 1 : 0) +
    (activePrice !== "all" ? 1 : 0) +
    (activeCollection ? 1 : 0);

  const activeSortLabel =
    SORT_OPTIONS.find((s) => s.value === activeSort)?.label || "Featured";

  const [visibleCount, setVisibleCount] = useState(12);

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
        <span className="font-hindi text-xs sm:text-sm text-[#6B1F2E] block mb-0.5">
          {currentCategoryObj ? currentCategoryObj.name : "अलबेली आभूषण"}
        </span>
        <h1 className="font-display text-3xl sm:text-5xl text-[#1E1A1A] font-normal tracking-tight mb-2">
          {currentSubcategoryObj
            ? `${currentCategoryObj?.name || ""} › ${currentSubcategoryObj.name}`
            : currentCategoryObj
            ? `${currentCategoryObj.name} Collection`
            : "The Jewellery Catalogue"}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1E1A1A]/65 leading-relaxed">
          {currentSubcategoryObj ? (
            <span>
              {currentSubcategoryObj.description ||
                `Explore our handcrafted collection of ${currentSubcategoryObj.name}.`}{" "}
              <span className="font-medium text-[#6B1F2E]">
                ({filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "varieties"} in stock)
              </span>
            </span>
          ) : currentCategoryObj?.description || (
            "Handcrafted in Delhi. Discover our limited artisan edits, created with love."
          )}
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

      {/* Desktop Main Categories Bar */}
      <div className="hidden lg:flex items-center justify-between pb-4 border-b border-[#4A0612]/10 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => updateFilter("category", "all")}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-sans tracking-wide transition-all cursor-pointer",
              activeCategory === "all"
                ? "bg-[#4A0612] text-[#FCEDEA] font-semibold shadow-xs"
                : "bg-white text-[#1E1A1A]/80 hover:bg-[#F1DFD8]/50 border border-[#4A0612]/10"
            )}
          >
            All Jewellery ({products.length})
          </button>

          {rootCategories.map((cat) => {
            const count = getCategoryCount(cat.slug);
            return (
              <button
                key={cat.id}
                onClick={() => updateFilter("category", cat.slug)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-sans tracking-wide transition-all cursor-pointer flex items-center gap-1.5",
                  activeCategory === cat.slug
                    ? "bg-[#4A0612] text-[#FCEDEA] font-semibold shadow-xs"
                    : "bg-white text-[#1E1A1A]/80 hover:bg-[#F1DFD8]/50 border border-[#4A0612]/10"
                )}
              >
                <span>{cat.name}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    activeCategory === cat.slug
                      ? "bg-[#FCEDEA]/20 text-[#FCEDEA]"
                      : "bg-[#4A0612]/5 text-[#1E1A1A]/50"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[#1E1A1A]/50 font-sans">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? "design" : "designs"}
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

      {/* ── Subcategory Filter Ribbon (Desktop & Mobile) ─────────── */}
      {currentCategoryObj && activeSubcategoriesList.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-[#FBF6EE] via-white to-[#FBF6EE] p-3 sm:p-4 rounded-sm border border-[#4A0612]/10 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#6B1F2E] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentCategoryObj.name} Subcategories</span>
            </div>
            {activeSubcategory !== "all" && (
              <button
                onClick={() => updateFilter("subcategory", "all")}
                className="text-[11px] text-[#6B1F2E] hover:underline font-sans font-medium flex items-center gap-1"
              >
                <span>Show all {currentCategoryObj.name}</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Subcategory Pills Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* "All" in this category */}
            <button
              onClick={() => updateFilter("subcategory", "all")}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all shrink-0 cursor-pointer",
                activeSubcategory === "all"
                  ? "bg-[#6B1F2E] text-[#FCEDEA] font-semibold shadow-xs"
                  : "bg-white text-[#1E1A1A]/80 hover:bg-[#F1DFD8]/40 border border-[#4A0612]/15"
              )}
            >
              All {currentCategoryObj.name} ({getCategoryCount(currentCategoryObj.slug)})
            </button>

            {/* Subcategory Pills (e.g. Chandbalis, Jhumkas, Studs, Danglers) */}
            {activeSubcategoriesList.map((sub) => {
              const count = getSubcategoryCount(sub.slug);
              const isSelected = activeSubcategory === sub.slug;

              return (
                <button
                  key={sub.id}
                  onClick={() => updateFilter("subcategory", sub.slug)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all shrink-0 cursor-pointer flex items-center gap-1.5",
                    isSelected
                      ? "bg-[#4A0612] text-[#FCEDEA] font-semibold shadow-xs"
                      : "bg-white text-[#1E1A1A]/80 hover:bg-[#F1DFD8]/40 border border-[#4A0612]/15"
                  )}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#B8923A]" />}
                  <span>{sub.name}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full",
                      isSelected
                        ? "bg-[#FCEDEA]/20 text-[#FCEDEA]"
                        : "bg-[#4A0612]/5 text-[#1E1A1A]/50"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filter Chips Row */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-6 text-xs font-sans">
          <span className="text-[#1E1A1A]/50 text-[11px] uppercase tracking-wider font-semibold mr-1">
            Active Filters:
          </span>

          {activeCategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A0612]/5 text-[#4A0612] border border-[#4A0612]/15 font-medium">
              <span>Category: {currentCategoryObj?.name || activeCategory}</span>
              <button
                onClick={() => updateFilter("category", "all")}
                className="hover:text-red-700 p-0.5"
                aria-label="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeSubcategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B1F2E]/10 text-[#6B1F2E] border border-[#6B1F2E]/30 font-semibold">
              <span>Subcategory: {currentSubcategoryObj?.name || activeSubcategory}</span>
              <button
                onClick={() => updateFilter("subcategory", "all")}
                className="hover:text-red-700 p-0.5"
                aria-label="Remove subcategory filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activePrice !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A0612]/5 text-[#4A0612] border border-[#4A0612]/15 font-medium">
              <span>Price: {PRICE_RANGES.find((p) => p.value === activePrice)?.label}</span>
              <button
                onClick={() => updateFilter("price", "all")}
                className="hover:text-red-700 p-0.5"
                aria-label="Remove price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 text-xs text-[#6B1F2E] hover:underline font-semibold ml-2 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Main Grid + Desktop Sidebar */}
      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6 select-none font-sans">
          {/* Category Tree Navigation */}
          <div className="bg-white p-4 rounded-sm border border-[#4A0612]/10 shadow-xs">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#1E1A1A] mb-3 flex items-center justify-between">
              <span>Jewellery Hierarchy</span>
              <Filter className="w-3.5 h-3.5 text-[#6B1F2E]" />
            </h3>

            <div className="space-y-1.5">
              {/* All jewellery button */}
              <button
                onClick={() => updateFilter("category", "all")}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-2 rounded-xs text-xs text-left transition-colors cursor-pointer",
                  activeCategory === "all"
                    ? "bg-[#4A0612] text-[#FCEDEA] font-semibold"
                    : "text-[#1E1A1A]/80 hover:bg-[#FBF6EE]"
                )}
              >
                <span>All Jewellery</span>
                <span className="text-[10px] opacity-75">{products.length}</span>
              </button>

              {/* Root Categories with nested subcategories */}
              {rootCategories.map((cat) => {
                const subs = subcategoriesByParentId.get(cat.id) || [];
                const isCatActive = activeCategory === cat.slug;
                const catCount = getCategoryCount(cat.slug);

                return (
                  <div key={cat.id} className="space-y-1">
                    <button
                      onClick={() => updateFilter("category", cat.slug)}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-2 rounded-xs text-xs text-left transition-colors cursor-pointer",
                        isCatActive
                          ? "bg-[#4A0612] text-[#FCEDEA] font-semibold"
                          : "text-[#1E1A1A]/80 hover:bg-[#FBF6EE]"
                      )}
                    >
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-[10px] opacity-75">{catCount}</span>
                    </button>

                    {/* Subcategories (Indented if Category is Selected) */}
                    {isCatActive && subs.length > 0 && (
                      <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-[#6B1F2E]/30 ml-2 animate-in fade-in duration-200">
                        <button
                          onClick={() => updateFilter("subcategory", "all")}
                          className={cn(
                            "w-full flex items-center justify-between px-2 py-1.5 rounded-xs text-[11px] text-left transition-colors cursor-pointer",
                            activeSubcategory === "all"
                              ? "text-[#6B1F2E] font-bold bg-[#6B1F2E]/10"
                              : "text-[#1E1A1A]/70 hover:text-[#6B1F2E]"
                          )}
                        >
                          <span>• All {cat.name}</span>
                          <span className="text-[10px]">{catCount}</span>
                        </button>

                        {subs.map((s) => {
                          const subCount = getSubcategoryCount(s.slug);
                          const isSubActive = activeSubcategory === s.slug;

                          return (
                            <button
                              key={s.id}
                              onClick={() => updateFilter("subcategory", s.slug)}
                              className={cn(
                                "w-full flex items-center justify-between px-2 py-1.5 rounded-xs text-[11px] text-left transition-colors cursor-pointer",
                                isSubActive
                              ? "text-[#6B1F2E] font-bold bg-[#6B1F2E]/10"
                              : "text-[#1E1A1A]/70 hover:text-[#6B1F2E]"
                              )}
                            >
                              <span>• {s.name}</span>
                              <span className="text-[10px] text-[#1E1A1A]/40">{subCount}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="bg-white p-4 rounded-sm border border-[#4A0612]/10 shadow-xs">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#1E1A1A] mb-3">
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
                    className="px-6 py-3 border border-[#4A0612]/20 hover:border-[#6B1F2E] text-xs uppercase tracking-wider font-semibold rounded-sm text-[#6B1F2E] transition-colors cursor-pointer"
                  >
                    Load More Designs ({filteredProducts.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-sm border border-[#4A0612]/10 p-6">
              <h3 className="font-display text-xl text-[#1E1A1A] mb-1">
                No designs match this subcategory filter
              </h3>
              <p className="text-xs text-[#1E1A1A]/60 max-w-sm mx-auto mb-4 font-sans">
                Try selecting a different subcategory or explore all {currentCategoryObj ? currentCategoryObj.name : "jewellery"}.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-[#4A0612] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm cursor-pointer shadow-xs"
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
                  <span className="text-xs bg-[#6B1F2E] text-white px-2 py-0.5 rounded-full font-bold font-sans">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 ? (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#6B1F2E] font-medium underline font-sans"
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
              {/* Category & Subcategory Selection */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1E1A1A] mb-3 font-sans flex items-center justify-between">
                  <span>Categories & Subcategories</span>
                </h4>

                <div className="space-y-2">
                  {/* All Jewellery */}
                  <button
                    onClick={() => updateFilter("category", "all")}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-sm text-sm font-sans transition-colors",
                      activeCategory === "all"
                        ? "bg-white text-[#6B1F2E] font-semibold border border-[#6B1F2E]/30"
                        : "bg-white/50 text-[#1E1A1A]/80 border border-transparent"
                    )}
                  >
                    <span>All Jewellery</span>
                    {activeCategory === "all" && <Check className="w-4 h-4 text-[#6B1F2E]" />}
                  </button>

                  {/* Categories list */}
                  {rootCategories.map((cat) => {
                    const isCatActive = activeCategory === cat.slug;
                    const subs = subcategoriesByParentId.get(cat.id) || [];

                    return (
                      <div key={cat.id} className="space-y-2">
                        <button
                          onClick={() => updateFilter("category", cat.slug)}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-sm text-sm font-sans transition-colors",
                            isCatActive
                              ? "bg-white text-[#6B1F2E] font-semibold border border-[#6B1F2E]/30"
                              : "bg-white/50 text-[#1E1A1A]/80 border border-transparent"
                          )}
                        >
                          <span>{cat.name}</span>
                          {isCatActive && <Check className="w-4 h-4 text-[#6B1F2E]" />}
                        </button>

                        {/* If this category is selected, show nested subcategories */}
                        {isCatActive && subs.length > 0 && (
                          <div className="pl-3 pr-1 py-1 space-y-1.5 bg-[#4A0612]/5 rounded-sm p-2">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#6B1F2E] font-sans block mb-1">
                              {cat.name} Subcategories:
                            </span>

                            <button
                              onClick={() => updateFilter("subcategory", "all")}
                              className={cn(
                                "w-full flex items-center justify-between p-2 rounded-xs text-xs font-sans text-left transition-colors",
                                activeSubcategory === "all"
                                  ? "bg-white text-[#6B1F2E] font-semibold"
                                  : "text-[#1E1A1A]/80 hover:bg-white/60"
                              )}
                            >
                              <span>All {cat.name}</span>
                              {activeSubcategory === "all" && <Check className="w-3.5 h-3.5 text-[#6B1F2E]" />}
                            </button>

                            {subs.map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => updateFilter("subcategory", sub.slug)}
                                className={cn(
                                  "w-full flex items-center justify-between p-2 rounded-xs text-xs font-sans text-left transition-colors",
                                  activeSubcategory === sub.slug
                                    ? "bg-white text-[#6B1F2E] font-semibold"
                                    : "text-[#1E1A1A]/80 hover:bg-white/60"
                                )}
                              >
                                <span>{sub.name}</span>
                                {activeSubcategory === sub.slug && (
                                  <Check className="w-3.5 h-3.5 text-[#6B1F2E]" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
            <div className="space-y-1.5 font-sans">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    updateFilter("sort", opt.value);
                    setSortSheetOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-3.5 rounded-sm text-sm text-left transition-colors",
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
    <Suspense
      fallback={
        <div className="min-h-screen p-8 text-center text-xs text-[#1E1A1A]/40 font-sans">
          Loading catalogue...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
