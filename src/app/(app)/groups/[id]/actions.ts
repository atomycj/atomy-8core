"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type SimpleResult = { success: true } | { success: false; error: string };

type RenameResult =
  | { success: true; group: { id: string; name: string } }
  | { success: false; error: string };

export async function leaveGroupAction(groupId: string): Promise<SimpleResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("leave_group", { p_group_id: groupId });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/groups");
  return { success: true };
}

export async function deleteGroupAction(groupId: string): Promise<SimpleResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_group", { p_group_id: groupId });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/groups");
  return { success: true };
}

export async function renameGroupAction(
  groupId: string,
  formData: FormData
): Promise<RenameResult> {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();

  const { data, error } = await supabase.rpc("rename_group", {
    p_group_id: groupId,
    p_new_name: name,
  });

  if (error || !data?.[0]) {
    return { success: false, error: error?.message ?? "이름 변경에 실패했습니다." };
  }

  revalidatePath("/groups");
  revalidatePath(`/groups/${groupId}`);
  return { success: true, group: data[0] };
}
