import { NextResponse } from "next/server";
import { fetchSpiritualDaily } from "@/lib/spiritual-api";

export const revalidate = 86400;

export async function GET() {
  try {
    const payload = await fetchSpiritualDaily();
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load spiritual content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
