import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { ProductCard } from "@/components/store/ProductCard";
import { THEME_COLLECTIONS, PLACEHOLDER_PRODUCTS, PlaceholderProduct } from "@/lib/placeholder-data";

export function generateStaticParams() {
  return [
    { slug: "festive-edit" },
    { slug: "everyday-minimal" },
    { slug: "statement-jewels" },
    { slug: "gifting-under-1999" },
    { slug: "gifting" },
    { slug: "festive" },
    { slug: "everyday" },
    { slug: "statement" },
    { slug: "earrings" },
    { slug: "necklaces" },
    { slug: "rings" },
    { slug: "chokers" },
  ];
}

function resolveCollection(slug: string) {
  const normalized = slug.toLowerCase();
  
  // Direct match
  const direct = THEME_COLLECTIONS.find((c) => c.id.toLowerCase() === normalized);
  if (direct) return direct;

  // Known aliases
  if (normalized === "gifting" || normalized.includes("gift")) {
    return THEME_COLLECTIONS.find((c) => c.id === "gifting-under-1999") || THEME_COLLECTIONS[3];
  }
  if (normalized === "festive") {
    return THEME_COLLECTIONS.find((c) => c.id === "festive-edit") || THEME_COLLECTIONS[0];
  }
  if (normalized === "everyday" || normalized === "minimal") {
    return THEME_COLLECTIONS.find((c) => c.id === "everyday-minimal") || THEME_COLLECTIONS[1];
  }
  if (normalized === "statement" || normalized.includes("hasli")) {
    return THEME_COLLECTIONS.find((c) => c.id === "statement-jewels") || THEME_COLLECTIONS[2];
  }

  // Graceful fallback for any category or custom slug
  const title = normalized
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: slug,
    title: `${title} Edit`,
    hindiTitle: "अलबेली संग्रह",
    tagline: `Curated ${title} collection handcrafted in Delhi with traditional royal karigari.`,
    image: "/images/product-2-a.jpg",
    link: `/shop?collection=${slug}`,
    itemCount: "Artisan Edit",
  };
}

function filterCollectionProducts(slug: string): PlaceholderProduct[] {
  const s = slug.toLowerCase();
  if (s.includes("earring")) {
    return PLACEHOLDER_PRODUCTS.filter((p) => p.category.toLowerCase().includes("earring"));
  }
  if (s.includes("necklace") || s.includes("hasli") || s.includes("choker")) {
    return PLACEHOLDER_PRODUCTS.filter((p) => p.category.toLowerCase().includes("necklace"));
  }
  if (s.includes("ring")) {
    return PLACEHOLDER_PRODUCTS.filter((p) => p.category.toLowerCase().includes("ring"));
  }
  if (s.includes("minimal")) {
    return PLACEHOLDER_PRODUCTS.filter((p) => p.price <= 249900);
  }
  if (s.includes("festive") || s.includes("statement")) {
    return PLACEHOLDER_PRODUCTS.filter((p) => p.badges.includes("best_seller") || p.price >= 200000);
  }
  return PLACEHOLDER_PRODUCTS.slice(0, 4);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const col = resolveCollection(slug);
  return {
    title: `${col.title} | Albeli`,
    description: col.tagline,
    openGraph: {
      title: `${col.title} — Albeli`,
      description: col.tagline,
      images: [col.image.startsWith("http") ? col.image : `https://albeli.in${col.image}`],
    },
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = resolveCollection(slug);
  const products = filterCollectionProducts(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        href="/collections"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#6B1F2E] hover:text-[#4A0612] font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>All Collections</span>
      </Link>

      {/* Collection Hero Banner */}
      <div className="relative rounded-sm overflow-hidden bg-[#4A0612] text-[#FCEDEA] p-8 sm:p-14 mb-12 shadow-sm">
        <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
          <img
            src={collection.image}
            alt={collection.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A0612]/95 via-[#4A0612]/80 to-transparent" />

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 rounded-full text-xs font-hindi text-[#FCEDEA] mb-2 backdrop-blur-xs">
            <Sparkles className="w-3 h-3 text-[#B8923A]" />
            <span>{collection.hindiTitle}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-white font-normal mb-3">
            {collection.title}
          </h1>
          <p className="font-sans text-sm text-[#F1DFD8]/90 leading-relaxed max-w-md">
            {collection.tagline}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl text-[#1E1A1A]">
          Designs in this Edit ({products.length})
        </h2>
        <Link
          href="/shop"
          className="text-xs uppercase tracking-wider text-[#6B1F2E] hover:underline"
        >
          View all catalogue
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
