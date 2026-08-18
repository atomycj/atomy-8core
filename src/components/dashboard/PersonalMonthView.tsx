import Link from "next/link";
import { format, isSameMonth } from "date-fns";
import { CORE_ITEMS } from "@/lib/core-items";
import type { DailyRecord } from "@/lib/types";
import { filledCount } from "@/lib/stats";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

type PersonalMonthViewProps = {
  monthStart: Date;
  calendarDays: Date[];
  recordsByDate: Map<string, DailyRecord>;
};

export default function PersonalMonthView({
  monthStart,
  calendarDays,
  recordsByDate,
}: PersonalMonthViewProps) {
  const monthRecords = calendarDays
    .filter((day) => isSameMonth(day, monthStart))
    .map((day) => recordsByDate.get(format(day, "yyyy-MM-dd")));

  const activeDays = monthRecords.filter((r) => filledCount(r) > 0).length;
  const completeDays = monthRecords.filter(
    (r) => filledCount(r) === CORE_ITEMS.length
  ).length;
  const avgProgress =
    monthRecords.length > 0
      ? Math.round(
          (monthRecords.reduce((sum, r) => sum + filledCount(r), 0) /
            (monthRecords.length * CORE_ITEMS.length)) *
            100
        )
      : 0;

  const itemStats = CORE_ITEMS.map((item) => ({
    ...item,
    count: monthRecords.filter((r) => r?.[item.key]?.trim()).length,
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="실천일" value={`${activeDays}일`} />
        <StatCard label="완주일" value={`${completeDays}일`} />
        <StatCard label="평균 진행률" value={`${avgProgress}%`} />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="py-1">
              {label}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const record = recordsByDate.get(dateKey);
            const count = filledCount(record);
            const inMonth = isSameMonth(day, monthStart);
            const isToday = dateKey === format(new Date(), "yyyy-MM-dd");

            return (
              <Link
                key={dateKey}
                href={`/dashboard?view=day&date=${dateKey}`}
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

      <div>
        <h2 className="text-sm font-semibold text-gray-700">
          항목별 실천 현황 (이번 달)
        </h2>
        <div className="mt-3 space-y-2">
          {itemStats.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3"
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="flex-1 text-sm text-gray-700">{item.label}</span>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-orange-400"
                  style={{
                    width: `${
                      monthRecords.length > 0
                        ? (item.count / monthRecords.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="w-10 text-right text-xs text-gray-400">
                {item.count}일
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}
