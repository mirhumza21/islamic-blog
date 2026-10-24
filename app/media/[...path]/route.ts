import { NextResponse } from "next/server";

const ALLOWED_BUCKETS = new Set(["blog-images"]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const [bucket, ...rest] = path || [];
  const objectPath = rest.join("/");

  if (
    !bucket ||
    !ALLOWED_BUCKETS.has(bucket) ||
    !objectPath ||
    objectPath.includes("..") ||
    !/^[\w.\-/]+$/.test(objectPath)
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  if (!base) return new NextResponse("Not found", { status: 404 });

  const upstream = await fetch(
    `${base}/storage/v1/object/public/${bucket}/${objectPath}`,
    { cache: "no-store" }
  );

  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Not found", { status: 404 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    upstream.headers.get("content-type") || "application/octet-stream"
  );
  headers.set("Content-Disposition", "inline");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  const length = upstream.headers.get("content-length");
  if (length) headers.set("Content-Length", length);

  return new NextResponse(upstream.body, { status: 200, headers });
}
