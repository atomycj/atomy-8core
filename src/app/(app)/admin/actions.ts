"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export async function setCanCreateGroups(userId: string, value: boolean) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!isAdminEmail(userData.user?.email)) {
    throw new Error("관리자만 사용할 수 있습니다.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ can_create_groups: value })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}
