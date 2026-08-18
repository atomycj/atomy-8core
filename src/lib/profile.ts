import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

export type ViewerProfile = {
  displayName: string;
  avatarUrl: string | null;
};

export async function getViewerProfile(
  supabase: SupabaseClient,
  user: User
): Promise<ViewerProfile> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const googleName = user.user_metadata?.full_name as string | undefined;
  const googleAvatar = user.user_metadata?.avatar_url as string | undefined;

  return {
    displayName: profile?.display_name || googleName || user.email || "사용자",
    avatarUrl: profile?.avatar_url || googleAvatar || null,
  };
}
