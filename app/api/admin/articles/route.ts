import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { getHeadingId } from "@/lib/articles";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";

    const supabase = getAdminSupabase();

    let query = supabase
      .from("articles")
      .select("*, author:authors(*), category:categories(*)")
      .order("published_at", { ascending: false });

    if (category) {
      query = query.eq("category_slug", category);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ articles: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getAdminSupabase();

    const title = body.title?.trim();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Generate or clean slug
    let slug = body.slug?.trim() || getHeadingId(title);
    slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

    const id = body.id || `art_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const newArticle = {
      id,
      slug,
      title,
      excerpt: body.excerpt || "",
      category_slug: body.category_slug || body.categorySlug || "umrah-guides",
      author_id: body.author_id || body.authorId || "dr-bilal-mansoor",
      published_at: body.published_at || body.publishedAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reading_time: Number(body.reading_time || body.readingTime || 5),
      image: body.image || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1600&q=80",
      image_alt: body.image_alt || body.imageAlt || title,
      featured: Boolean(body.featured),
      popular: Boolean(body.popular),
      popular_rank: body.popular_rank ? Number(body.popular_rank) : null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      content: body.content || [
        { type: "paragraph", text: "Start writing your article here..." },
      ],
      seo_title: body.seo_title || body.seoTitle || title,
      seo_description: body.seo_description || body.seoDescription || body.excerpt || "",
      status: body.status || "published",
    };

    const { data, error } = await supabase
      .from("articles")
      .insert(newArticle)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, article: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
