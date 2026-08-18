import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import type { Profile } from "@/lib/types";
import AdminUserRow from "@/components/AdminUserRow";
import { setCanCreateGroups } from "./actions";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!isAdminEmail(userData.user?.email)) {
    redirect("/dashboard");
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  const allProfiles = (profiles ?? []) as Profile[];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">관리자</h1>
        <p className="mt-1 text-sm text-gray-500">
          그룹을 만들 수 있는 사용자를 지정할 수 있습니다.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
              <th className="pb-2 font-medium">사용자</th>
              <th className="pb-2 text-right font-medium">권한</th>
            </tr>
          </thead>
          <tbody>
            {allProfiles.map((profile) => (
              <AdminUserRow
                key={profile.id}
                profile={profile}
                onToggle={setCanCreateGroups}
              />
            ))}
          </tbody>
        </table>
        {allProfiles.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            아직 가입한 사용자가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
