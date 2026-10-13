import Link from "next/link";
import { ShieldAlert, Droplets, Sparkles, Sun } from "lucide-react";

export default function MaterialsCarePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center mb-12">
        <span className="font-hindi text-sm text-[#6B1F2E] block mb-1">
          देखभाल और सामग्री
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#1E1A1A] font-normal tracking-tight mb-3">
          Materials & Jewellery Care
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1E1A1A]/60">
          How we craft our jewellery and how to keep your pieces radiant for years.
        </p>
      </div>

      <div className="space-y-8 font-sans text-xs sm:text-sm text-[#1E1A1A]/80 leading-relaxed">
        {/* Core Materials */}
        <div className="p-6 sm:p-8 bg-white rounded-sm border border-[#4A0612]/10 space-y-4">
          <h2 className="font-display text-2xl text-[#1E1A1A]">
            What Makes Albeli Jewellery Different?
          </h2>
          <p>
            We choose base metals and surface treatments that deliver the visual weight, intricacy, and warmth of heirloom gold jewellery without compromise.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#FBF6EE]/60 rounded-sm border border-[#4A0612]/5">
              <h3 className="font-display text-lg text-[#1E1A1A] mb-1">Base Metal & Plating</h3>
              <p className="text-xs text-[#1E1A1A]/70">
                High-grade brass and copper alloy base, triple-layered with 22k matte antique micro-gold plating. 100% nickel and lead free.
              </p>
            </div>

            <div className="p-4 bg-[#FBF6EE]/60 rounded-sm border border-[#4A0612]/5">
              <h3 className="font-display text-lg text-[#1E1A1A] mb-1">Stones & Enamelling</h3>
              <p className="text-xs text-[#1E1A1A]/70">
                Hand-cut glass polki, hydro-colour gemstones, and fired meenakari enamel hand-painted by master artisans in Delhi and Jaipur.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Essential Care Rules */}
        <div className="p-6 sm:p-8 bg-white rounded-sm border border-[#4A0612]/10 space-y-6">
          <h2 className="font-display text-2xl text-[#1E1A1A]">
            4 Simple Rules for Long-Lasting Brilliance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Droplets className="w-5 h-5 text-[#6B1F2E] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1E1A1A] mb-1">Keep Away from Moisture</h3>
                <p className="text-xs text-[#1E1A1A]/60">
                  Avoid wearing in the shower, swimming pools, or during intense gym workouts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#6B1F2E] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1E1A1A] mb-1">Perfume Goes on First</h3>
                <p className="text-xs text-[#1E1A1A]/60">
                  Apply makeup, hairspray, and perfumes first. Let them dry completely before wearing your jewellery.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#6B1F2E] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1E1A1A] mb-1">Wipe with Soft Cloth</h3>
                <p className="text-xs text-[#1E1A1A]/60">
                  After wearing, gently wipe any skin oil or sweat with a clean, dry microfiber cloth.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Sun className="w-5 h-5 text-[#6B1F2E] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1E1A1A] mb-1">Store in Airtight Pouches</h3>
                <p className="text-xs text-[#1E1A1A]/60">
                  Store each design individually in the zip pouch provided with your Albeli box to prevent oxygen exposure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
