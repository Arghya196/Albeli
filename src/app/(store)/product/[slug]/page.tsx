import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data";
import { ProductDetailClient } from "@/components/store/ProductDetailClient";

export function generateStaticParams() {
  return PLACEHOLDER_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = PLACEHOLDER_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return {
      title: "Design Not Found",
    };
  }

  const priceFormatted = `₹${(product.price / 100).toLocaleString("en-IN")}`;
  const ogImageUrl = product.primaryImage.startsWith("http")
    ? product.primaryImage
    : `https://albeli.in${product.primaryImage}`;

  return {
    title: product.name,
    description: `${product.name} (${priceFormatted}) — Handcrafted in Delhi. ${product.description}`,
    openGraph: {
      title: `${product.name} (${priceFormatted}) — Albeli`,
      description: product.description,
      url: `https://albeli.in/product/${product.slug}`,
      siteName: "Albeli",
      images: [
        {
          url: ogImageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Albeli`,
      description: product.description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="w-8 h-8 border-2 border-[#4A0612] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display text-lg text-[#1E1A1A]/70">Loading artisanal design...</p>
        </div>
      }
    >
      <ProductDetailClient slug={slug} />
    </Suspense>
  );
}
