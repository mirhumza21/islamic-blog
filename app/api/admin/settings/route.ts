import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { siteConfig } from "@/data/categories";

export async function GET() {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", "site_config")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If not set yet in DB, return current default siteConfig
    return NextResponse.json({ settings: data?.value || siteConfig });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from("site_settings")
      .upsert(
        {
          key: "site_config",
          value: body,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: data.value });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
