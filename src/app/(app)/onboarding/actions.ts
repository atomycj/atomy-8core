"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function completeOnboardingAction() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (userData.user) {
    await supabase
      .from("profiles")
      .update({ onboarding_seen: true })
      .eq("id", userData.user.id);
  }

  redirect("/dashboard");
}
