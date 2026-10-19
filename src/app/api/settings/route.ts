import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/db";
import { DEFAULT_SETTINGS, type SiteSettingsData } from "@/lib/default-data";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("settings")
      .select("data")
      .eq("id", "default")
      .single();

    if (error || !data || !data.data) {
      return NextResponse.json({
        settings: DEFAULT_SETTINGS,
        source: "fallback",
      });
    }

    return NextResponse.json({
      settings: data.data,
      source: "database",
    });
  } catch (err: any) {
    return NextResponse.json({
      settings: DEFAULT_SETTINGS,
      source: "fallback",
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: "Settings data required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("settings")
      .upsert({
        id: "default",
        data: body,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
