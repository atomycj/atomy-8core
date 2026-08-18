import Link from "next/link";
import { notFound } from "next/navigation";
import { eachDayOfInterval, format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { DailyRecord, GroupMember, GroupSummary } from "@/lib/types";
import { getViewNav, parseAnchorDate, parseView } from "@/lib/view-nav";
import ViewTabs from "@/components/ViewTabs";
import ViewNavHeader from "@/components/ViewNavHeader";
import GroupMemberCard from "@/components/GroupMemberCard";
import GroupWeekView from "@/components/dashboard/GroupWeekView";
import GroupMonthView from "@/components/dashboard/GroupMonthView";

export default async function GroupDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  const { id } = await params;
  const { view: viewParam, date: dateParam } = await searchParams;
  const view = parseView(viewParam);
  const anchor = parseAnchorDate(dateParam);
  const nav = getViewNav(view, anchor);

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

  const rangeDates = eachDayOfInterval({
    start: nav.rangeStart,
    end: nav.rangeEnd,
  }).map((d) => format(d, "yyyy-MM-dd"));

  const { data: recordRows } = await supabase
    .from("daily_records")
    .select("*")
    .in("user_id", memberIds.length > 0 ? memberIds : [userId])
    .gte("record_date", rangeDates[0])
    .lte("record_date", rangeDates[rangeDates.length - 1]);

  const records = (recordRows ?? []) as DailyRecord[];
  const recordsByUserDate = new Map(
    records.map((r) => [`${r.user_id}_${r.record_date}`, r])
  );

  return (
    <div className="space-y-5">
      <div>
        <Link href="/groups" className="text-xs text-gray-400 hover:text-gray-600">
          ← 그룹 목록
        </Link>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{group.name}</h1>
            <p className="mt-1 text-sm text-gray-500">멤버 {group.member_count}명</p>
          </div>
          <ViewTabs basePath={`/groups/${id}`} view={view} anchorDate={anchor} />
        </div>
      </div>

      <ViewNavHeader
        basePath={`/groups/${id}`}
        view={view}
        prev={nav.prev}
        next={nav.next}
        label={nav.label}
      />

      {view === "day" && (
        <div className="space-y-2">
          {members.map((member) => {
            const date = format(anchor, "yyyy-MM-dd");
            const record = recordsByUserDate.get(`${member.user_id}_${date}`) ?? null;
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
      )}

      {view === "week" && (
        <GroupWeekView
          groupId={id}
          members={members}
          weekDates={rangeDates}
          recordsByUserDate={recordsByUserDate}
        />
      )}

      {view === "month" && (
        <GroupMonthView
          members={members}
          monthDates={rangeDates}
          recordsByUserDate={recordsByUserDate}
        />
      )}
    </div>
  );
}
