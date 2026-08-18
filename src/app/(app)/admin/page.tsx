import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import type { Profile } from "@/lib/types";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import AdminUserRow from "@/components/AdminUserRow";
import { setCanCreateGroups } from "./actions";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!isAdminEmail(userData.user?.email)) {
    redirect("/dashboard");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  const allProfiles = (profiles ?? []) as Profile[];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">{dict.admin.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{dict.admin.subtitle}</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
              <th className="pb-2 font-medium">{dict.admin.userColumn}</th>
              <th className="pb-2 text-right font-medium">{dict.admin.permissionColumn}</th>
            </tr>
          </thead>
          <tbody>
            {allProfiles.map((profile) => (
              <AdminUserRow
                key={profile.id}
                profile={profile}
                onToggle={setCanCreateGroups}
                dict={dict.admin}
              />
            ))}
          </tbody>
        </table>
        {allProfiles.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">{dict.admin.empty}</p>
        )}
      </div>
    </div>
  );
}
