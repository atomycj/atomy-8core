"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type GroupActionResult =
  | { success: true; group: { id: string; name: string } }
  | { success: false; error: string };

export async function createGroupAction(
  formData: FormData
): Promise<GroupActionResult> {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { data, error } = await supabase.rpc("create_group", {
    p_name: name,
    p_password: password,
  });

  if (error || !data?.[0]) {
    return { success: false, error: error?.message ?? "그룹 생성에 실패했습니다." };
  }

  revalidatePath("/groups");
  return { success: true, group: data[0] };
}

export async function joinGroupAction(
  formData: FormData
): Promise<GroupActionResult> {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { data, error } = await supabase.rpc("join_group", {
    p_name: name,
    p_password: password,
  });

  if (error || !data?.[0]) {
    return { success: false, error: error?.message ?? "그룹 참여에 실패했습니다." };
  }

  revalidatePath("/groups");
  return { success: true, group: data[0] };
}
