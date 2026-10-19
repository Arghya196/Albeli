import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/db";
import { DEFAULT_CATEGORIES, type AdminCategory } from "@/lib/default-data";

function mapDbRowToCategory(row: any): AdminCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    itemCount: Number(row.item_count) || 0,
    parentId: row.parent_id || null,
    description: row.description || "",
    imageUrl: row.image_url || "",
  };
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        categories: DEFAULT_CATEGORIES,
        source: "fallback",
      });
    }

    return NextResponse.json({
      categories: data.map(mapDbRowToCategory),
      source: "database",
    });
  } catch (err: any) {
    console.error("GET /api/categories error:", err);
    return NextResponse.json({
      categories: DEFAULT_CATEGORIES,
      source: "fallback",
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.name || !body.slug) {
      return NextResponse.json({ error: "Category name and slug are required" }, { status: 400 });
    }

    const row = {
      id: body.id || `cat-${Date.now()}`,
      name: body.name,
      slug: body.slug,
      description: body.description || "",
      image_url: body.imageUrl || "",
      parent_id: body.parentId || null,
      item_count: Number(body.itemCount) || 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("categories")
      .upsert(row)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      category: mapDbRowToCategory(data),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
