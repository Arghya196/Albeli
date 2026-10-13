import { MetadataRoute } from "next";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://albeli.in";
  const now = new Date();

  // Static routes
  const staticRoutes = [
    "",
    "/shop",
    "/collections",
    "/lookbook",
    "/journal",
    "/about",
    "/contact",
    "/materials-care",
    "/shipping",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: (route === "" || route === "/shop" ? "daily" : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1.0 : route === "/shop" ? 0.9 : 0.7,
  }));

  // Dynamic product routes
  const productRoutes = PLACEHOLDER_PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Collection category routes
  const categoryRoutes = ["earrings", "necklaces", "rings"].map((cat) => ({
    url: `${baseUrl}/shop?category=${cat}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
