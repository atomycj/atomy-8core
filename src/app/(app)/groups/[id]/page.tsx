import Link from "next/link";
import { notFound } from "next/navigation";
import { format, addDays, subDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { DailyRecord, GroupMember, GroupSummary } from "@/lib/types";
import GroupMemberCard from "@/components/GroupMemberCard";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function GroupDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { id } = await params;
  const { date: dateParam } = await searchParams;
  const date = dateParam && DATE_RE.test(dateParam)
    ? dateParam
    : format(new Date(), "yyyy-MM-dd");

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  const { data: myGroups } = await supabase.rpc("list_my_groups");
  const group = ((myGroups ?? []) as GroupSummary[]).find((g) => g.id === id);

  if (!group) {
    notFound();
  }

  const { data: memberRows } = await supabase.rpc("list_group_members", {
    p_group_id: id,
  });
  const members = (memberRows ?? []) as GroupMember[];
  const memberIds = members.map((m) => m.user_id);

  const { data: recordRows } = await supabase
    .from("daily_records")
    .select("*")
    .in("user_id", memberIds.length > 0 ? memberIds : [userId])
    .eq("record_date", date);

  const recordsByUser = new Map(
    ((recordRows ?? []) as DailyRecord[]).map((r) => [r.user_id, r])
  );

  const dateObj = new Date(`${date}T00:00:00`);
  const prevDate = format(subDays(dateObj, 1), "yyyy-MM-dd");
  const nextDate = format(addDays(dateObj, 1), "yyyy-MM-dd");

  return (
    <div className="space-y-5">
      <div>
        <Link href="/groups" className="text-xs text-gray-400 hover:text-gray-600">
          ← 그룹 목록
        </Link>
        <h1 className="mt-1 text-lg font-bold text-gray-900">{group.name}</h1>
        <p className="mt-1 text-sm text-gray-500">멤버 {group.member_count}명</p>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href={`/groups/${id}?date=${prevDate}`}
          className="rounded-lg px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
        >
          ← {prevDate}
        </Link>
        <span className="text-sm font-bold text-gray-900">{date}</span>
        <Link
          href={`/groups/${id}?date=${nextDate}`}
          className="rounded-lg px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
        >
          {nextDate} →
        </Link>
      </div>

      <div className="space-y-2">
        {members.map((member) => {
          const record = recordsByUser.get(member.user_id) ?? null;
          return (
            <GroupMemberCard
              key={member.user_id}
              member={member}
              isMe={member.user_id === userId}
              values={record}
            />
          );
        })}
      </div>
    </div>
  );
}
