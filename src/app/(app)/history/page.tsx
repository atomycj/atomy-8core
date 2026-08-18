import Link from "next/link";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
} from "date-fns";
import { enUS, ko } from "date-fns/locale";
import { createClient } from "@/lib/supabase/server";
import { CORE_ITEMS } from "@/lib/core-items";
import type { DailyRecord } from "@/lib/types";
import { filledCount } from "@/lib/stats";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const anchor = monthParam ? new Date(`${monthParam}-01T00:00:00`) : new Date();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const dateLocale = locale === "en" ? enUS : ko;

  const monthStart = startOfMonth(anchor);
  const monthEnd = endOfMonth(anchor);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  const { data: records } = await supabase
    .from("daily_records")
    .select("*")
    .eq("user_id", userId)
    .gte("record_date", format(gridStart, "yyyy-MM-dd"))
    .lte("record_date", format(gridEnd, "yyyy-MM-dd"));

  const byDate = new Map(
    ((records ?? []) as DailyRecord[]).map((r) => [r.record_date, r])
  );

  const monthLabel =
    locale === "en"
      ? format(monthStart, "MMMM yyyy", { locale: dateLocale })
      : format(monthStart, "yyyy년 M월", { locale: dateLocale });
  const prevMonth = format(subMonths(monthStart, 1), "yyyy-MM");
  const nextMonth = format(addMonths(monthStart, 1), "yyyy-MM");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">{dict.history.title}</h1>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/history?month=${prevMonth}`}
            className="rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-100"
          >
            ← {dict.common.prev}
          </Link>
          <span className="font-semibold text-gray-800">{monthLabel}</span>
          <Link
            href={`/history?month=${nextMonth}`}
            className="rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-100"
          >
            {dict.common.next} →
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
          {dict.history.weekdayLabels.map((label) => (
            <div key={label} className="py-1">
              {label}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const record = byDate.get(dateKey);
            const count = filledCount(record);
            const inMonth = isSameMonth(day, monthStart);
            const isToday = dateKey === format(new Date(), "yyyy-MM-dd");

            return (
              <Link
                key={dateKey}
                href={`/record/${dateKey}`}
                className={`flex aspect-square flex-col items-center justify-center rounded-xl border text-xs transition ${
                  inMonth
                    ? "border-gray-100 bg-white hover:border-orange-200"
                    : "border-transparent bg-gray-50 text-gray-300"
                } ${isToday ? "ring-2 ring-orange-300" : ""}`}
              >
                <span className={inMonth ? "text-gray-700" : "text-gray-300"}>
                  {format(day, "d")}
                </span>
                {count > 0 && inMonth && (
                  <span
                    className={`mt-1 flex h-4 w-8 items-center justify-center rounded-full text-[10px] font-semibold ${
                      count === CORE_ITEMS.length
                        ? "bg-orange-500 text-white"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {count}/{CORE_ITEMS.length}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">{dict.history.footerNote}</p>
    </div>
  );
}
