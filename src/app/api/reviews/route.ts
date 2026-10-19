import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/db";
import { DEFAULT_REVIEWS, type AdminReview } from "@/lib/default-data";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        reviews: DEFAULT_REVIEWS,
        source: "fallback",
      });
    }

    const mapped: AdminReview[] = data.map((r: any) => ({
      id: r.id,
      customerName: r.customer_name,
      location: r.location || "Delhi",
      rating: Number(r.rating) || 5,
      comment: r.comment,
      productName: r.product_name || "Jewellery",
      verified: Boolean(r.verified),
      visible: Boolean(r.visible),
      createdAt: r.created_at,
    }));

    return NextResponse.json({
      reviews: mapped,
      source: "database",
    });
  } catch (err: any) {
    return NextResponse.json({
      reviews: DEFAULT_REVIEWS,
      source: "fallback",
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.customerName || !body.comment) {
      return NextResponse.json({ error: "Name and comment required" }, { status: 400 });
    }

    const row = {
      id: body.id || `rev-${Date.now()}`,
      product_id: body.productId || null,
      product_name: body.productName || "Jewellery",
      customer_name: body.customerName,
      location: body.location || "Delhi",
      rating: Number(body.rating) || 5,
      comment: body.comment,
      verified: body.verified !== undefined ? body.verified : true,
      visible: body.visible !== undefined ? body.visible : true,
    };

    const { data, error } = await supabaseAdmin.from("reviews").upsert(row).select().single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, review: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("reviews").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

