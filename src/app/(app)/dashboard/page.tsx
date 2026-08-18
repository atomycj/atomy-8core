import { format, eachDayOfInterval, endOfWeek, startOfWeek, subDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { DailyRecord } from "@/lib/types";
import { computeCurrentStreak } from "@/lib/stats";
import { getViewNav, parseAnchorDate, parseView } from "@/lib/view-nav";
import ViewTabs from "@/components/ViewTabs";
import ViewNavHeader from "@/components/ViewNavHeader";
import PersonalDayView from "@/components/dashboard/PersonalDayView";
import PersonalWeekView from "@/components/dashboard/PersonalWeekView";
import PersonalMonthView from "@/components/dashboard/PersonalMonthView";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  const { view: viewParam, date: dateParam } = await searchParams;
  const view = parseView(viewParam);
  const anchor = parseAnchorDate(dateParam);
  const nav = getViewNav(view, anchor);

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  const today = format(new Date(), "yyyy-MM-dd");
  const streakRangeStart = format(subDays(new Date(), 59), "yyyy-MM-dd");

  const gridStart = view === "month" ? startOfWeek(nav.rangeStart) : nav.rangeStart;
  const gridEnd = view === "month" ? endOfWeek(nav.rangeEnd) : nav.rangeEnd;

  const fetchStart =
    format(gridStart, "yyyy-MM-dd") < streakRangeStart
      ? format(gridStart, "yyyy-MM-dd")
      : streakRangeStart;
  const fetchEnd = format(gridEnd, "yyyy-MM-dd") > today ? format(gridEnd, "yyyy-MM-dd") : today;

  const { data: records } = await supabase
    .from("daily_records")
    .select("*")
    .eq("user_id", userId)
    .gte("record_date", fetchStart)
    .lte("record_date", fetchEnd)
    .order("record_date", { ascending: false });

  const allRecords = (records ?? []) as DailyRecord[];
  const recordsByDate = new Map(allRecords.map((r) => [r.record_date, r]));

  const streakRecords = allRecords.filter((r) => r.record_date >= streakRangeStart);
  const streak = computeCurrentStreak(streakRecords);

  const calendarDays = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weekDates = calendarDays.map((d) => format(d, "yyyy-MM-dd"));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-900">내 대시보드</h1>
          <p className="mt-1 text-sm text-gray-500">연속 기록 {streak}일째</p>
        </div>
        <ViewTabs basePath="/dashboard" view={view} anchorDate={anchor} />
      </div>

      <ViewNavHeader
        basePath="/dashboard"
        view={view}
        prev={nav.prev}
        next={nav.next}
        label={nav.label}
      />

      {view === "day" && (
        <PersonalDayView
          date={format(anchor, "yyyy-MM-dd")}
          record={recordsByDate.get(format(anchor, "yyyy-MM-dd")) ?? null}
        />
      )}

      {view === "week" && (
        <PersonalWeekView weekDates={weekDates} recordsByDate={recordsByDate} />
      )}

      {view === "month" && (
        <PersonalMonthView
          monthStart={nav.rangeStart}
          calendarDays={calendarDays}
          recordsByDate={recordsByDate}
        />
      )}
    </div>
  );
}
