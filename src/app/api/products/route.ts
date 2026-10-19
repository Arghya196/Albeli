import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/db";
import { PLACEHOLDER_PRODUCTS, type PlaceholderProduct } from "@/lib/placeholder-data";
import { slugify } from "@/lib/utils";

function mapDbRowToProduct(row: any): PlaceholderProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || "",
    price: Number(row.price) || 0,
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
    stock: Number(row.stock) || 0,
    sku: row.sku || "",
    category: row.category || "Earrings",
    categorySlug: row.category_slug || slugify(row.category || "Earrings"),
    subcategory: row.subcategory || undefined,
    subcategorySlug: row.subcategory_slug || undefined,
    primaryImage: row.primary_image || (row.images && row.images[0]) || "/images/product-1-a.jpg",
    secondaryImage: row.secondary_image || (row.images && row.images[1]) || "/images/product-1-b.jpg",
    badges: Array.isArray(row.badges) ? row.badges : ["new_arrival"],
    outfitPairings: Array.isArray(row.outfit_pairings) ? row.outfit_pairings : [],
    materialsCare: row.materials_care || "",
    shippingInfo: row.shipping_info || "",
    videoUrl: row.video_url || undefined,
    isPlaceholder: Boolean(row.is_placeholder),
  };
}

function mapProductToDbRow(p: Partial<PlaceholderProduct> & { id?: string; name: string }) {
  const primaryImg = p.primaryImage || "/images/product-1-a.jpg";
  const secondaryImg = p.secondaryImage || primaryImg;
  const images = [primaryImg, secondaryImg].filter(Boolean);

  return {
    id: p.id || `prod-${Date.now()}`,
    name: p.name,
    slug: p.slug || slugify(p.name),
    description: p.description || "",
    price: Number(p.price) || 0,
    compare_at_price: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    stock: Number(p.stock) || 5,
    sku: p.sku || `ALB-${Date.now().toString().slice(-4)}`,
    category: p.category || "Earrings",
    category_slug: p.categorySlug || slugify(p.category || "Earrings"),
    subcategory: p.subcategory || null,
    subcategory_slug: p.subcategorySlug || (p.subcategory ? slugify(p.subcategory) : null),
    primary_image: primaryImg,
    secondary_image: secondaryImg,
    images: images,
    badges: p.badges || ["new_arrival"],
    outfit_pairings: p.outfitPairings || [],
    materials_care: p.materialsCare || "",
    shipping_info: p.shippingInfo || "",
    status: "published",
    is_placeholder: false,
    updated_at: new Date().toISOString(),
  };
}

// GET /api/products
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      // Fallback to placeholder data if database not yet migrated
      return NextResponse.json({
        products: PLACEHOLDER_PRODUCTS,
        source: "fallback",
      });
    }

    const mapped = data.map(mapDbRowToProduct);
    return NextResponse.json({
      products: mapped,
      source: "database",
    });
  } catch (err: any) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({
      products: PLACEHOLDER_PRODUCTS,
      source: "fallback",
    });
  }
}

// POST /api/products (Create or Upsert product)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const dbRow = mapProductToDbRow(body);
    const { data, error } = await supabaseAdmin
      .from("products")
      .upsert(dbRow)
      .select()
      .single();

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      product: mapDbRowToProduct(data),
    });
  } catch (err: any) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/products?id=prod-123
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
