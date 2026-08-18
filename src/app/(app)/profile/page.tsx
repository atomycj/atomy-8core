import { createClient } from "@/lib/supabase/server";
import { getViewerProfile } from "@/lib/profile";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import ProfileForm from "@/components/ProfileForm";
import { updateProfile } from "./actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user!;
  const { displayName, avatarUrl } = await getViewerProfile(supabase, user);
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="max-w-md space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">{dict.profile.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{user.email}</p>
      </div>

      <ProfileForm
        currentName={displayName}
        currentAvatar={avatarUrl}
        updateAction={updateProfile}
        dict={dict}
      />
    </div>
  );
}
