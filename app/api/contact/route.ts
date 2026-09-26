import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all fields." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Please write a slightly longer message." },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
      status: "new",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Message received. We’ll get back to you soon.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
