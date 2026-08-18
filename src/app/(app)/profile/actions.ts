"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const displayName = String(formData.get("display_name") ?? "").trim();
  const avatarFile = formData.get("avatar");

  if (!displayName) {
    throw new Error("표시 이름을 입력해주세요.");
  }

  const update: { display_name: string; avatar_url?: string } = {
    display_name: displayName,
  };

  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!avatarFile.type.startsWith("image/")) {
      throw new Error("이미지 파일만 업로드할 수 있습니다.");
    }
    if (avatarFile.size > MAX_AVATAR_BYTES) {
      throw new Error("이미지 용량은 2MB 이하여야 합니다.");
    }

    const ext = avatarFile.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, {
        upsert: true,
        contentType: avatarFile.type,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    update.avatar_url = `${publicUrlData.publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
}
