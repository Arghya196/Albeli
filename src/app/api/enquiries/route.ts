import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/db";
import { type AdminEnquiry } from "@/lib/store/adminStore";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return NextResponse.json({ enquiries: [], source: "fallback" });
    }

    const mapped: AdminEnquiry[] = data.map((e: any) => ({
      id: e.id,
      customerName: e.customer_name || undefined,
      customerContact: e.customer_contact || undefined,
      productName: e.product_name,
      channel: (e.channel as any) || "whatsapp",
      status: (e.status as any) || "new",
      notes: e.notes || undefined,
      timestamp: e.created_at,
    }));

    return NextResponse.json({ enquiries: mapped, source: "database" });
  } catch (err: any) {
    return NextResponse.json({ enquiries: [], source: "fallback" });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.productName) {
      return NextResponse.json({ error: "Product name required" }, { status: 400 });
    }

    const row = {
      id: body.id || `enq-${Date.now()}`,
      customer_name: body.customerName || null,
      customer_contact: body.customerContact || null,
      product_name: body.productName,
      channel: body.channel || "whatsapp",
      status: body.status || "new",
      notes: body.notes || null,
    };

    const { data, error } = await supabaseAdmin.from("enquiries").upsert(row).select().single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, enquiry: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
