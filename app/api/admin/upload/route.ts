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

    const BUCKET_NAME = "blog-images";

    // Auto-create bucket if it doesn't exist
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some((b) => b.name === BUCKET_NAME);
      if (!exists) {
        await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
      }
    } catch (e) {
      console.warn("Could not check/create bucket automatically:", e);
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      // If error was bucket not found, try createBucket once more explicitly
      if (error.message?.toLowerCase().includes("not found")) {
        try {
          const { error: retryCreateErr } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            fileSizeLimit: 10485760,
          });
          if (!retryCreateErr) {
            const retry = await supabase.storage
              .from(BUCKET_NAME)
              .upload(filename, buffer, {
                contentType: file.type,
                upsert: true,
              });
            if (!retry.error) {
              const { data: pubData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(retry.data.path);
              return NextResponse.json({
                success: true,
                url: pubData.publicUrl,
              });
            }
          }
        } catch (retryErr) {
          console.error("Retry bucket create failed:", retryErr);
        }
      }

      return NextResponse.json(
        {
          error: `Storage error: ${error.message}. Please ensure a public bucket named 'blog-images' exists in Supabase Storage.`,
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
