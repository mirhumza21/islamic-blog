import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from("articles")
      .select("*, author:authors(*), category:categories(*)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = getAdminSupabase();

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) updates.title = body.title;
    if (body.slug !== undefined) updates.slug = body.slug;
    if (body.excerpt !== undefined) updates.excerpt = body.excerpt;
    if (body.category_slug !== undefined) updates.category_slug = body.category_slug;
    if (body.categorySlug !== undefined) updates.category_slug = body.categorySlug;
    if (body.author_id !== undefined) updates.author_id = body.author_id;
    if (body.authorId !== undefined) updates.author_id = body.authorId;
    if (body.image !== undefined) updates.image = body.image;
    if (body.image_alt !== undefined) updates.image_alt = body.image_alt;
    if (body.imageAlt !== undefined) updates.image_alt = body.imageAlt;
    if (body.reading_time !== undefined) updates.reading_time = Number(body.reading_time);
    if (body.readingTime !== undefined) updates.reading_time = Number(body.readingTime);
    if (body.featured !== undefined) updates.featured = Boolean(body.featured);
    if (body.popular !== undefined) updates.popular = Boolean(body.popular);
    if (body.popular_rank !== undefined) updates.popular_rank = body.popular_rank ? Number(body.popular_rank) : null;
    if (body.tags !== undefined) updates.tags = body.tags;
    if (body.content !== undefined) updates.content = body.content;
    if (body.seo_title !== undefined) updates.seo_title = body.seo_title;
    if (body.seoTitle !== undefined) updates.seo_title = body.seoTitle;
    if (body.seo_description !== undefined) updates.seo_description = body.seo_description;
    if (body.seoDescription !== undefined) updates.seo_description = body.seoDescription;
    if (body.status !== undefined) updates.status = body.status;
    if (body.published_at !== undefined) updates.published_at = body.published_at;

    const { data, error } = await supabase
      .from("articles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, article: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getAdminSupabase();

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Article deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
