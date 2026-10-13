import Link from "next/link";
import { ArrowRight, Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Intro */}
      <div className="text-center mb-14">
        <span className="font-hindi text-sm text-[#6B1F2E] block mb-2">
          अलबेली की कहानी
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#1E1A1A] font-normal tracking-tight mb-4">
          Not So Ordinary.
        </h1>
        <p className="font-display italic text-lg sm:text-xl text-[#6B1F2E]">
          Thoda hatke, poora desi.
        </p>
      </div>

      {/* Visual Editorial Image */}
      <div className="relative rounded-sm overflow-hidden aspect-[16/9] mb-14 shadow-sm">
        <img
          src="/images/hero-1.jpg"
          alt="Albeli Delhi Studio Craft"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#4A0612]/70 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <span className="text-xs uppercase tracking-widest font-sans font-semibold">
            Delhi Studio • Est. 2024
          </span>
        </div>
      </div>

      {/* Story Text */}
      <div className="space-y-6 text-sm sm:text-base text-[#1E1A1A]/80 font-sans leading-relaxed">
        <p>
          ALBELI was founded with a singular conviction: Indian fashion jewellery shouldn’t feel like mass-produced plastic, nor should you need to spend a small fortune at a bridal showroom just to wear something with genuine soul.
        </p>
        <p>
          Rooted in Delhi — where Mughal grandeur meets contemporary street style — our designs celebrate women who refuse to blend into the background. "Albeli" means distinct, spirited, and unapologetically oneself.
        </p>

        <div className="p-6 bg-white rounded-sm border border-[#4A0612]/10 my-8">
          <h3 className="font-display text-2xl text-[#1E1A1A] mb-2">
            The Karigar Promise
          </h3>
          <p className="text-sm text-[#1E1A1A]/70 leading-relaxed">
            Every piece in our catalogue begins with hand sketches in our Delhi studio. We collaborate directly with hereditary artisans specializing in repoussé brass engraving, glass polki stone setting, and traditional meenakari enamelling.
          </p>
        </div>

        <p>
          We deliberately produce in small, curated drops rather than endless factory runs. Once a batch is claimed, we move on to new experiments. That means when you wear an Albeli piece to a wedding or dinner, you’re almost guaranteed to be the only one in the room wearing it.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-14 pt-8 border-t border-[#4A0612]/10">
        <div className="p-5 bg-white rounded-sm border border-[#4A0612]/10">
          <Sparkles className="w-5 h-5 text-[#6B1F2E] mb-2" />
          <h4 className="font-display text-lg text-[#1E1A1A] mb-1">Authentic Detailing</h4>
          <p className="text-xs text-[#1E1A1A]/60 leading-relaxed">
            Heritage motifs with clean contemporary balance for maximum wearability.
          </p>
        </div>

        <div className="p-5 bg-white rounded-sm border border-[#4A0612]/10">
          <ShieldCheck className="w-5 h-5 text-[#6B1F2E] mb-2" />
          <h4 className="font-display text-lg text-[#1E1A1A] mb-1">Skin-First Materials</h4>
          <p className="text-xs text-[#1E1A1A]/60 leading-relaxed">
            Lead and nickel free alloys with protective anti-tarnish micro-sealing.
          </p>
        </div>

        <div className="p-5 bg-white rounded-sm border border-[#4A0612]/10">
          <HeartHandshake className="w-5 h-5 text-[#6B1F2E] mb-2" />
          <h4 className="font-display text-lg text-[#1E1A1A] mb-1">Direct from Delhi</h4>
          <p className="text-xs text-[#1E1A1A]/60 leading-relaxed">
            No middle-tier markups. Premium craftsmanship at honest transparent prices.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-widest rounded-sm transition-colors"
        >
          <span>Explore The Collection</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
