import Link from "next/link";
import { format, subDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { CORE_ITEMS } from "@/lib/core-items";
import type { DailyRecord } from "@/lib/types";
import { computeCurrentStreak, filledCount, isRecordFilled } from "@/lib/stats";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  const today = format(new Date(), "yyyy-MM-dd");
  const rangeStart = format(subDays(new Date(), 59), "yyyy-MM-dd");

  const { data: records } = await supabase
    .from("daily_records")
    .select("*")
    .eq("user_id", userId)
    .gte("record_date", rangeStart)
    .lte("record_date", today)
    .order("record_date", { ascending: false });

  const allRecords = (records ?? []) as DailyRecord[];
  const todayRecord = allRecords.find((r) => r.record_date === today) ?? null;
  const streak = computeCurrentStreak(allRecords);

  const last30 = allRecords.filter(
    (r) => r.record_date >= format(subDays(new Date(), 29), "yyyy-MM-dd")
  );
  const activeDays30 = last30.filter(isRecordFilled).length;
  const completeDays30 = last30.filter(
    (r) => filledCount(r) === CORE_ITEMS.length
  ).length;

  const last7Dates = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), i), "yyyy-MM-dd")
  );
  const byDate = new Map(allRecords.map((r) => [r.record_date, r]));

  const itemStats = CORE_ITEMS.map((item) => ({
    ...item,
    count: last30.filter((r) => r[item.key]?.trim()).length,
  }));

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-lg font-bold text-gray-900">오늘의 8코어</h1>
        <p className="mt-1 text-sm text-gray-500">{today}</p>

        <div className="mt-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">오늘 진행률</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {filledCount(todayRecord)} / {CORE_ITEMS.length}
              </p>
            </div>
            <Link
              href={`/record/${today}`}
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              {todayRecord ? "오늘 기록 수정" : "오늘 기록 작성"}
            </Link>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-orange-500 transition-all"
              style={{
                width: `${(filledCount(todayRecord) / CORE_ITEMS.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <StatCard label="연속 기록일" value={`${streak}일`} />
        <StatCard label="최근 30일 실천일" value={`${activeDays30}일`} />
        <StatCard label="최근 30일 완주일" value={`${completeDays30}일`} />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700">최근 7일</h2>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {last7Dates.map((date) => {
            const record = byDate.get(date);
            const count = filledCount(record);
            return (
              <Link
                key={date}
                href={`/record/${date}`}
                className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white p-2 hover:border-orange-200"
              >
                <span className="text-[10px] text-gray-400">
                  {format(new Date(date), "MM/dd")}
                </span>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    count === CORE_ITEMS.length
                      ? "bg-orange-500 text-white"
                      : count > 0
                        ? "bg-orange-100 text-orange-600"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700">
          항목별 실천 현황 (최근 30일)
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
                  style={{ width: `${(item.count / 30) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs text-gray-400">
                {item.count}일
              </span>
            </div>
          ))}
        </div>
      </section>
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
