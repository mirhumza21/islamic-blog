import { NextResponse } from "next/server";
import {
  defaultAboutContent,
  defaultContactContent,
  defaultPrivacyContent,
  defaultTermsContent,
  getPageSetting,
} from "@/lib/pages";
import { getAdminSupabase } from "@/lib/supabase";
import { heroContent as defaultHeroContent } from "@/data/navigation";

const PAGE_DEFAULTS: Record<string, unknown> = {
  page_home: defaultHeroContent,
  page_about: defaultAboutContent,
  page_contact: defaultContactContent,
  page_privacy: defaultPrivacyContent,
  page_terms: defaultTermsContent,
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const settingKey = key.startsWith("page_") ? key : `page_${key}`;
  const fallback = PAGE_DEFAULTS[settingKey];

  if (!fallback) {
    return NextResponse.json({ error: "Unknown page key" }, { status: 404 });
  }

  const content = await getPageSetting(settingKey, fallback);
  return NextResponse.json({ content });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const settingKey = key.startsWith("page_") ? key : `page_${key}`;

  if (!PAGE_DEFAULTS[settingKey]) {
    return NextResponse.json({ error: "Unknown page key" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .upsert(
        {
          key: settingKey,
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
