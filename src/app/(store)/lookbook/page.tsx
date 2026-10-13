import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data";
import { formatPrice } from "@/lib/utils";

const LOOKBOOK_ITEMS = [
  {
    id: "look-1",
    title: "The Regal Sangeet Mood",
    subtitle: "Heavy Kundan & Vintage Pearls",
    image: "/images/hero-1.jpg",
    taggedProducts: [PLACEHOLDER_PRODUCTS[0], PLACEHOLDER_PRODUCTS[1]],
  },
  {
    id: "look-2",
    title: "Old Delhi Evening Soirée",
    subtitle: "Carved Haslis & Statement Cocktail Rings",
    image: "/images/product-5-a.jpg",
    taggedProducts: [PLACEHOLDER_PRODUCTS[4], PLACEHOLDER_PRODUCTS[2]],
  },
  {
    id: "look-3",
    title: "Pastel Lotus Mehendi",
    subtitle: "Handpainted Enamel & Micro Pearl Fringes",
    image: "/images/product-4-a.jpg",
    taggedProducts: [PLACEHOLDER_PRODUCTS[3]],
  },
];

export default function LookbookPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="font-hindi text-sm text-[#6B1F2E] block mb-1">
          अलबेली रूप
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#1E1A1A] font-normal tracking-tight mb-3">
          The Albeli Lookbook
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1E1A1A]/60">
          Editorial curations and outfit pairings styled in our Delhi atelier.
        </p>
      </div>

      <div className="space-y-16">
        {LOOKBOOK_ITEMS.map((item, index) => (
          <div
            key={item.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
              index % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Image banner */}
            <div className={`lg:col-span-7 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <div className="relative aspect-[16/10] rounded-sm overflow-hidden bg-white border border-[#4A0612]/10 shadow-xs">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-[#FCEDEA]/80 font-sans block mb-1">
                    {item.subtitle}
                  </span>
                  <h2 className="font-display text-3xl text-white font-normal">
                    {item.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Tagged Products list */}
            <div className={`lg:col-span-5 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
              <div className="p-6 bg-white rounded-sm border border-[#4A0612]/10 space-y-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6B1F2E] block">
                  Shop the Pieces in this Look
                </span>

                <div className="space-y-4">
                  {item.taggedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-4 p-3 bg-[#FBF6EE]/60 rounded-sm border border-[#4A0612]/5 hover:border-[#4A0612]/20 transition-all"
                    >
                      <img
                        src={p.primaryImage}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-xs shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${p.slug}`}
                          className="font-display text-lg text-[#1E1A1A] hover:text-[#6B1F2E] transition-colors truncate block"
                        >
                          {p.name}
                        </Link>
                        <span className="text-xs font-sans font-medium text-[#1E1A1A]/80">
                          {formatPrice(p.price)}
                        </span>
                      </div>
                      <Link
                        href={`/product/${p.slug}`}
                        className="p-2 text-[#6B1F2E] hover:text-[#4A0612] transition-colors"
                        aria-label={`View ${p.name}`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
