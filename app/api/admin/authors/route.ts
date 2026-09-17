import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("authors")
      .select("*, articles:articles(count)")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ authors: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getAdminSupabase();

    if (!body.name) {
      return NextResponse.json({ error: "Author name is required" }, { status: 400 });
    }

    const id =
      body.id?.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-") ||
      body.name.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");

    const newAuthor = {
      id,
      name: body.name.trim(),
      role: body.role || "Contributing Writer",
      avatar: body.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      bio: body.bio || "",
    };

    const { data, error } = await supabase
      .from("authors")
      .insert(newAuthor)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, author: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
