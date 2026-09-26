import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const source = String(body.source || "newsletter").trim() || "newsletter";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: "You’re already subscribed. Thank you!",
      });
    }

    const { error } = await supabase.from("subscribers").insert({
      email,
      source,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({
          success: true,
          alreadySubscribed: true,
          message: "You’re already subscribed. Thank you!",
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "You’re subscribed. Welcome to the UmrahZone community.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to subscribe" },
      { status: 500 }
    );
  }
}
