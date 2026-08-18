"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  const dict = getDictionary(await getLocale());

  if (!user) {
    throw new Error(dict.profile.errorGeneric);
  }

  const displayName = String(formData.get("display_name") ?? "").trim();
  const avatarFile = formData.get("avatar");

  if (!displayName) {
    throw new Error(dict.profile.errorGeneric);
  }

  const update: { display_name: string; avatar_url?: string } = {
    display_name: displayName,
  };

  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!ALLOWED_AVATAR_TYPES.includes(avatarFile.type)) {
      throw new Error(dict.profile.errorInvalidType);
    }
    if (avatarFile.size > MAX_AVATAR_BYTES) {
      throw new Error(dict.profile.errorTooLarge);
    }

    const ext = avatarFile.type.split("/")[1];
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
