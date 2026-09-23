import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

const BUCKET_NAME = "blog-files";
const MAX_BYTES = 25 * 1024 * 1024;

const ALLOWED_EXT = new Set([
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "zip",
  "txt",
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 25MB." },
        { status: 400 }
      );
    }

    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json(
        { error: "Allowed files: PDF, Word, Excel, ZIP, TXT." },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `file_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;

    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some((b) => b.name === BUCKET_NAME);
      if (!exists) {
        await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: MAX_BYTES,
        });
      }
    } catch (e) {
      console.warn("Could not check/create file bucket automatically:", e);
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (error) {
      return NextResponse.json(
        {
          error: `Storage error: ${error.message}. Please ensure a public bucket named '${BUCKET_NAME}' exists in Supabase Storage.`,
        },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
