import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const explicitNext = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (!explicitNext) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_seen")
            .eq("id", userData.user.id)
            .maybeSingle();

          if (!profile || profile.onboarding_seen === false) {
            return NextResponse.redirect(`${origin}/onboarding`);
          }
        }
      }
      return NextResponse.redirect(`${origin}${explicitNext ?? "/dashboard"}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
