"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CORE_ITEMS } from "@/lib/core-items";

export async function saveRecord(date: string, formData: FormData) {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) {
    throw new Error("로그인이 필요합니다.");
  }

  const fields = Object.fromEntries(
    CORE_ITEMS.map((item) => [item.key, String(formData.get(item.key) ?? "")])
  );

  const { error } = await supabase.from("daily_records").upsert(
    {
      user_id: userData.user.id,
      record_date: date,
      ...fields,
    },
    { onConflict: "user_id,record_date" }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/history");
  revalidatePath(`/record/${date}`);

  return { success: true };
}
