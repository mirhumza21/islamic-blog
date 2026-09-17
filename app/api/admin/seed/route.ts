import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { articles } from "@/data/articles";
import { authors } from "@/data/authors";
import { categories, siteConfig } from "@/data/categories";

export async function POST() {
  const supabase = getAdminSupabase();

  try {
    // 1. Seed Authors
    const formattedAuthors = authors.map((a) => ({
      id: a.id,
      name: a.name,
      role: a.role || "",
      avatar: a.avatar,
      bio: a.bio || "",
    }));

    const { error: authorsError } = await supabase
      .from("authors")
      .upsert(formattedAuthors, { onConflict: "id" });

    if (authorsError) {
      return NextResponse.json(
        {
          error: `Error seeding authors: ${authorsError.message}. Make sure you ran supabase_schema.sql in Supabase SQL Editor.`,
        },
        { status: 500 }
      );
    }

    // 2. Seed Categories
    const formattedCategories = categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      short_description: c.shortDescription,
      image: c.image,
      icon: c.icon,
      color: c.color || null,
    }));

    const { error: catError } = await supabase
      .from("categories")
      .upsert(formattedCategories, { onConflict: "id" });

    if (catError) {
      return NextResponse.json(
        { error: `Error seeding categories: ${catError.message}` },
        { status: 500 }
      );
    }

    // 3. Seed Articles
    const formattedArticles = articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category_slug: a.categorySlug,
      author_id: a.authorId,
      published_at: new Date(a.publishedAt).toISOString(),
      reading_time: a.readingTime,
      image: a.image,
      image_alt: a.imageAlt,
      featured: a.featured || false,
      popular: a.popular || false,
      popular_rank: a.popularRank || null,
      tags: a.tags || [],
      content: a.content,
      seo_title: a.seo?.title || null,
      seo_description: a.seo?.description || null,
      status: "published",
    }));

    const { error: artError } = await supabase
      .from("articles")
      .upsert(formattedArticles, { onConflict: "id" });

    if (artError) {
      return NextResponse.json(
        { error: `Error seeding articles: ${artError.message}` },
        { status: 500 }
      );
    }

    // 4. Seed Site Settings
    const settingsPayload = [
      { key: "site_config", value: siteConfig },
    ];

    const { error: setError } = await supabase
      .from("site_settings")
      .upsert(settingsPayload, { onConflict: "key" });

    if (setError) {
      console.warn("Settings warning:", setError.message);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${authors.length} authors, ${categories.length} categories, and ${articles.length} articles into Supabase!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}
