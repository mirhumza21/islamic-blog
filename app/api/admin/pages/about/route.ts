import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { defaultAboutContent } from "@/lib/pages";

export async function GET() {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", "page_about")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ content: data?.value || defaultAboutContent });
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
          key: "page_about",
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

    return NextResponse.json({ success: true, content: data.value });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
