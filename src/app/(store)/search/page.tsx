"use client";

import { useState, useMemo } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { useAdminStore } from "@/lib/store/adminStore";
import { PLACEHOLDER_PRODUCTS, type PlaceholderProduct } from "@/lib/placeholder-data";

const POPULAR_SEARCHES = ["Chandbali", "Polki", "Choker", "Jhumka", "Hasli", "Ring", "Festive", "Saree"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const storeProducts = useAdminStore((s) => s.products);
  const products: PlaceholderProduct[] =
    storeProducts && storeProducts.length > 0 ? storeProducts : PLACEHOLDER_PRODUCTS;

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return products.filter((product: PlaceholderProduct) => {
      return (
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(q)) ||
        product.description.toLowerCase().includes(q) ||
        product.outfitPairings.some((tag: string) => tag.toLowerCase().includes(q))
      );
    });
  }, [products, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 min-h-[60vh]">
      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="font-display text-3xl sm:text-4xl text-[#1E1A1A] font-normal mb-3">
          Search the Catalogue
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1E1A1A]/60 mb-8">
          Find statement pieces by name, style, stone, or outfit pairing.
        </p>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chandbalis, chokers, rings, polki..."
            className="w-full pl-12 pr-10 py-4 bg-white border border-[#4A0612]/20 rounded-sm text-sm sm:text-base text-[#1E1A1A] placeholder-[#1E1A1A]/40 focus:outline-none focus:border-[#6B1F2E] shadow-xs"
            autoFocus
          />
          <SearchIcon className="w-5 h-5 text-[#1E1A1A]/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />

          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search query"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E1A1A]/40 hover:text-[#1E1A1A]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Popular Searches */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-[#1E1A1A]/50 font-sans mr-1">Popular:</span>
          {POPULAR_SEARCHES.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 bg-white hover:bg-[#F1DFD8]/50 border border-[#4A0612]/10 rounded-full text-xs text-[#1E1A1A]/80 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {query.trim() !== "" ? (
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#4A0612]/10 mb-8">
            <h2 className="text-sm font-sans text-[#1E1A1A]/70">
              Found {searchResults.length} {searchResults.length === 1 ? "design" : "designs"} for "{query}"
            </h2>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-sm border border-[#4A0612]/10 p-8">
              <div className="w-12 h-12 mx-auto mb-3 opacity-25">
                <img src="/brand/logo-peacock-dark.svg" alt="" className="w-full h-full object-contain" />
              </div>
              <h3 className="font-display text-xl text-[#1E1A1A] mb-1">
                No matching designs found
              </h3>
              <p className="text-xs text-[#1E1A1A]/60 max-w-sm mx-auto">
                Try searching for a different keyword or browse all jewellery in our shop.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Default Browse Grid */
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl text-[#1E1A1A]">
              Explore Recent Drops
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 4).map((p: PlaceholderProduct) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
