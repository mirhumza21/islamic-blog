import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const supabase = getAdminSupabase();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      return NextResponse.json(
        {
          error: `Storage error: ${error.message}. Make sure you created a public bucket named 'blog-images' in Supabase -> Storage.`,
        },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
