import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("categories")
      .select("*, articles:articles(count)")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getAdminSupabase();

    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: "Category name and slug are required" },
        { status: 400 }
      );
    }

    const newCategory = {
      id: body.id || `cat_${Date.now()}`,
      slug: body.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
      name: body.name.trim(),
      description: body.description || "",
      short_description: body.short_description || body.shortDescription || "",
      image: body.image || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80",
      icon: body.icon || "kaaba",
      color: body.color || null,
    };

    const { data, error } = await supabase
      .from("categories")
      .insert(newCategory)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
