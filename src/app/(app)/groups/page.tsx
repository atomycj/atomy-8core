import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { GroupSummary } from "@/lib/types";
import GroupForms from "@/components/GroupForms";
import { createGroupAction, joinGroupAction } from "./actions";

export default async function GroupsPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  const [{ data: myGroups }, { data: profile }] = await Promise.all([
    supabase.rpc("list_my_groups"),
    supabase
      .from("profiles")
      .select("can_create_groups")
      .eq("id", userId)
      .maybeSingle(),
  ]);

  const groups = (myGroups ?? []) as GroupSummary[];
  const canCreate = Boolean(profile?.can_create_groups);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-gray-900">그룹</h1>
        <p className="mt-1 text-sm text-gray-500">
          그룹에 참여하면 팀원들의 8코어 기록을 함께 볼 수 있어요.
        </p>
      </div>

      <GroupForms
        canCreate={canCreate}
        createAction={createGroupAction}
        joinAction={joinGroupAction}
      />

      <section>
        <h2 className="text-sm font-semibold text-gray-700">내 그룹</h2>
        <div className="mt-3 space-y-2">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:border-orange-200"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {group.name}
                  {group.is_owner && (
                    <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
                      개설자
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  멤버 {group.member_count}명 · {format(new Date(group.created_at), "yyyy-MM-dd")} 개설
                </p>
              </div>
              <span className="text-gray-300">→</span>
            </Link>
          ))}
          {groups.length === 0 && (
            <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
              아직 참여한 그룹이 없어요. 위에서 그룹에 참여하거나 만들어보세요.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
