import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { normalizeCustomScripts } from "@/lib/customScripts";
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

    // Merge DB value with defaults
    return NextResponse.json({
      settings: {
        ...siteConfig,
        ...(data?.value || {}),
      },
    });
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

    try {
      revalidatePath("/", "layout");
    } catch (e) {
      console.warn("revalidatePath error:", e);
    }

    return NextResponse.json({ success: true, settings: data.value });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
