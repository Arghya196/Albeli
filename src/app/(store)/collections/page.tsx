import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { THEME_COLLECTIONS } from "@/lib/placeholder-data";

export default function CollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
        <span className="font-hindi text-xs sm:text-sm text-[#6B1F2E] block mb-1">
          अलबेली संग्रह
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#1E1A1A] font-normal tracking-tight mb-3">
          Curated Collections
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1E1A1A]/60">
          Themed jewellery curations crafted around moods, rituals, and distinct styles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        {THEME_COLLECTIONS.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.id}`}
            className="group relative rounded-sm overflow-hidden bg-white border border-[#4A0612]/10 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#FBF6EE]">
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A0612]/80 via-transparent to-transparent opacity-90" />

              <div className="absolute bottom-6 inset-x-6 text-[#FCEDEA]">
                <span className="font-hindi text-xs text-[#F1DFD8]/80 block mb-1">
                  {col.hindiTitle}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-white font-normal mb-1">
                  {col.title}
                </h2>
                <p className="text-xs text-[#F1DFD8]/80 font-sans line-clamp-2 max-w-md">
                  {col.tagline}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white flex items-center justify-between border-t border-[#4A0612]/5">
              <span className="text-xs text-[#1E1A1A]/60 font-sans">
                {col.itemCount}
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#6B1F2E] group-hover:underline flex items-center gap-1.5">
                <span>View Collection</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
