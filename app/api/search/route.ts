import { NextResponse } from "next/server";
import { searchPublishedArticles } from "@/lib/articles";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  try {
    const results = await searchPublishedArticles(q);
    return NextResponse.json({ results: results.slice(0, 8) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, results: [] }, { status: 500 });
  }
}
