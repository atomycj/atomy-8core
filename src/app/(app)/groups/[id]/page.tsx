import Link from "next/link";
import { notFound } from "next/navigation";
import { eachDayOfInterval, format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { DailyRecord, GroupMember, GroupSummary } from "@/lib/types";
import { getViewNav, parseAnchorDate, parseView } from "@/lib/view-nav";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatGroupDetailMemberCount } from "@/lib/i18n/format";
import ViewTabs from "@/components/ViewTabs";
import ViewNavHeader from "@/components/ViewNavHeader";
import TodayLink from "@/components/TodayLink";
import GroupMemberCard from "@/components/GroupMemberCard";
import GroupManagePanel from "@/components/GroupManagePanel";
import GroupWeekView from "@/components/dashboard/GroupWeekView";
import GroupMonthView from "@/components/dashboard/GroupMonthView";
import { deleteGroupAction, leaveGroupAction, renameGroupAction } from "./actions";

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
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const nav = getViewNav(view, anchor, locale);

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

  const today = format(new Date(), "yyyy-MM-dd");
  const rangeStartStr = format(nav.rangeStart, "yyyy-MM-dd");
  const rangeEndStr = format(nav.rangeEnd, "yyyy-MM-dd");
  const isCurrentPeriod = today >= rangeStartStr && today <= rangeEndStr;
  const todayLinkLabel =
    view === "day"
      ? dict.common.today
      : view === "week"
        ? dict.common.thisWeek
        : dict.common.thisMonth;

  return (
    <div className="space-y-5">
      <div>
        <Link href="/groups" className="text-xs text-gray-400 hover:text-gray-600">
          {dict.groups.detail.backLink}
        </Link>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3 md:flex-nowrap">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{group.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {formatGroupDetailMemberCount(locale, group.member_count)}
            </p>
          </div>
          <TodayLink
            basePath={`/groups/${id}`}
            view={view}
            isCurrent={isCurrentPeriod}
            label={todayLinkLabel}
          />
          <ViewTabs
            basePath={`/groups/${id}`}
            view={view}
            anchorDate={anchor}
            labels={dict.dashboard.viewTabs}
          />
        </div>
      </div>

      <GroupManagePanel
        groupId={id}
        groupName={group.name}
        isOwner={group.is_owner}
        dict={dict.groups.manage}
        leaveAction={leaveGroupAction}
        deleteAction={deleteGroupAction}
        renameAction={renameGroupAction}
      />

      <ViewNavHeader
        basePath={`/groups/${id}`}
        view={view}
        prev={nav.prev}
        next={nav.next}
        label={nav.label}
        prevLabel={dict.common.prev}
        nextLabel={dict.common.next}
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
                locale={locale}
                dict={dict}
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
          locale={locale}
          dict={dict}
        />
      )}

      {view === "month" && (
        <GroupMonthView
          members={members}
          monthDates={rangeDates}
          recordsByUserDate={recordsByUserDate}
          dict={dict}
        />
      )}
    </div>
  );
}
