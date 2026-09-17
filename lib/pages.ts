import { getAdminSupabase } from "@/lib/supabase";
import { heroContent as defaultHeroContent } from "@/data/navigation";

export async function getHomePageContent() {
  try {
    const supabase = getAdminSupabase();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "page_home")
      .maybeSingle();

    if (data?.value) {
      return data.value;
    }
  } catch (err) {
    console.error("Could not fetch page_home from Supabase, using default:", err);
  }

  return defaultHeroContent;
}
