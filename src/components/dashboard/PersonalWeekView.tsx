import Link from "next/link";
import { format } from "date-fns";
import { enUS, ko } from "date-fns/locale";
import { CORE_ITEMS } from "@/lib/core-items";
import type { DailyRecord } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { filledCount } from "@/lib/stats";

type PersonalWeekViewProps = {
  weekDates: string[];
  recordsByDate: Map<string, DailyRecord>;
  locale: Locale;
  dict: Dictionary;
};

export default function PersonalWeekView({
  weekDates,
  recordsByDate,
  locale,
  dict,
}: PersonalWeekViewProps) {
  const dateLocale = locale === "en" ? enUS : ko;
  const dayTotals = weekDates.map(
    (date) => filledCount(recordsByDate.get(date))
  );
  const activeDays = dayTotals.filter((n) => n > 0).length;
  const completeDays = dayTotals.filter((n) => n === CORE_ITEMS.length).length;
  const totalFilled = dayTotals.reduce((sum, n) => sum + n, 0);
  const t = dict.dashboard.week;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label={t.activeDays} value={`${activeDays}`} />
        <StatCard label={t.completeDays} value={`${completeDays}`} />
        <StatCard label={t.totalItems} value={`${totalFilled}`} />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <table className="w-full min-w-[560px] border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="w-32 text-left text-xs font-medium text-gray-400" />
              {weekDates.map((date) => (
                <th key={date} className="text-center">
                  <Link
                    href={`/record/${date}`}
                    className="block rounded-lg px-1 py-1 hover:bg-gray-50"
                  >
                    <p className="text-[10px] text-gray-400">
                      {format(new Date(`${date}T00:00:00`), "EEEEE", {
                        locale: dateLocale,
                      })}
                    </p>
                    <p className="text-xs font-semibold text-gray-700">
                      {format(new Date(`${date}T00:00:00`), "d")}
                    </p>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CORE_ITEMS.map((item) => (
              <tr key={item.key}>
                <td className="text-xs font-medium text-gray-600">
                  {item.emoji} {item.label[locale]}
                </td>
                {weekDates.map((date) => {
                  const record = recordsByDate.get(date);
                  const filled = Boolean(record?.[item.key]?.trim());
                  return (
                    <td key={date} className="text-center">
                      <span
                        className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md text-xs ${
                          filled
                            ? "bg-brand-500 text-white"
                            : "bg-gray-100 text-gray-300"
                        }`}
                      >
                        {filled ? "✓" : "–"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="pt-2 text-xs font-semibold text-gray-500">
                {t.dailyTotal}
              </td>
              {dayTotals.map((total, i) => (
                <td key={weekDates[i]} className="pt-2 text-center">
                  <span
                    className={`mx-auto flex h-6 w-8 items-center justify-center rounded-md text-[11px] font-semibold ${
                      total === CORE_ITEMS.length
                        ? "bg-brand-500 text-white"
                        : total > 0
                          ? "bg-brand-100 text-brand-600"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {total}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
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
