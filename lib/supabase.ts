import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Public client for client-side or anonymous reads
export const supabase = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

// Admin / Server client with elevated privileges for API routes (CRUD operations)
export function getAdminSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase credentials not fully configured in environment.");
  }
  return createClient(
    supabaseUrl || "https://placeholder-project.supabase.co",
    supabaseServiceKey || "placeholder-service-key",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
