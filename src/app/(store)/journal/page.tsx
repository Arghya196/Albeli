import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";

const ARTICLES = [
  {
    id: "art-1",
    slug: "how-to-style-heritage-chokers-with-contemporary-western-wear",
    title: "How to Style Heritage Polki Chokers with Contemporary Western Wear",
    excerpt:
      "Why pair a heavy choker only with a lehenga? Here is how Delhi stylists are wearing polki necklaces with oversized white poplin shirts and tailored blazers.",
    date: "October 2024",
    author: "Albeli Editorial",
    image: "/images/hero-1.jpg",
    category: "Styling Guide",
  },
  {
    id: "art-2",
    slug: "the-lost-art-of-old-delhi-meenakari-enamelling",
    title: "The Lost Art of Old Delhi Meenakari Enamelling",
    excerpt:
      "A peek inside the alleys of Dariba Kalan and how our generational artisans fire vibrant minerals to create lotus petals on brass.",
    date: "September 2024",
    author: "Karigar Stories",
    image: "/images/product-4-a.jpg",
    category: "Artisan Craft",
  },
  {
    id: "art-3",
    slug: "the-festive-jewellery-checklist-what-to-invest-in",
    title: "The Festive Jewellery Checklist: 4 Pieces Every Wardrobe Needs",
    excerpt:
      "From versatile chandbalis to an architectural hasli collar, here are the four foundation pieces that carry you through every Diwali and wedding party.",
    date: "August 2024",
    author: "Albeli Edit",
    image: "/images/product-5-a.jpg",
    category: "Curations",
  },
];

export default function JournalPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="font-hindi text-sm text-[#6B1F2E] block mb-1">
          अलबेली पत्रिका
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#1E1A1A] font-normal tracking-tight mb-3">
          The Albeli Journal
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1E1A1A]/60">
          Notes on Indian jewellery styling, Delhi artisan heritage, and modern festive dressing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ARTICLES.map((art) => (
          <article
            key={art.id}
            className="bg-white rounded-sm border border-[#4A0612]/10 overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
          >
            <div className="aspect-[16/10] overflow-hidden bg-[#FBF6EE]">
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-[11px] font-sans text-[#1E1A1A]/50 uppercase tracking-wider mb-2">
                  <span className="text-[#6B1F2E] font-semibold">{art.category}</span>
                  <span>•</span>
                  <span>{art.date}</span>
                </div>

                <h2 className="font-display text-xl text-[#1E1A1A] group-hover:text-[#6B1F2E] transition-colors leading-snug mb-3">
                  {art.title}
                </h2>

                <p className="text-xs text-[#1E1A1A]/70 font-sans leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#4A0612]/5 flex items-center justify-between">
                <span className="text-[11px] text-[#1E1A1A]/50 font-sans">
                  By {art.author}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6B1F2E] group-hover:underline flex items-center gap-1">
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
