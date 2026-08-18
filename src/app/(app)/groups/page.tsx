import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { GroupOption, GroupSummary } from "@/lib/types";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatGroupMemberCount } from "@/lib/i18n/format";
import GroupForms from "@/components/GroupForms";
import { createGroupAction, joinGroupAction } from "./actions";

export default async function GroupsPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const [{ data: myGroups }, { data: profile }, { data: allGroups }] =
    await Promise.all([
      supabase.rpc("list_my_groups"),
      supabase
        .from("profiles")
        .select("can_create_groups")
        .eq("id", userId)
        .maybeSingle(),
      supabase.rpc("list_all_groups"),
    ]);

  const groups = (myGroups ?? []) as GroupSummary[];
  const canCreate = Boolean(profile?.can_create_groups);
  const joinableGroups = (allGroups ?? []) as GroupOption[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-gray-900">{dict.groups.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{dict.groups.subtitle}</p>
      </div>

      <GroupForms
        canCreate={canCreate}
        joinableGroups={joinableGroups}
        createAction={createGroupAction}
        joinAction={joinGroupAction}
        dict={dict.groups.forms}
        locale={locale}
      />

      <section>
        <h2 className="text-sm font-semibold text-gray-700">
          {dict.groups.myGroupsTitle}
        </h2>
        <div className="mt-3 space-y-2">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:border-brand-200"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {group.name}
                  {group.is_owner && (
                    <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-600">
                      {dict.groups.ownerBadge}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {formatGroupMemberCount(
                    locale,
                    group.member_count,
                    format(new Date(group.created_at), "yyyy-MM-dd")
                  )}
                </p>
              </div>
              <span className="text-gray-300">→</span>
            </Link>
          ))}
          {groups.length === 0 && (
            <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
              {dict.groups.emptyGroups}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
