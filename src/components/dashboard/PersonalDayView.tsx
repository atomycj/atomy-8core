import Link from "next/link";
import { CORE_ITEMS } from "@/lib/core-items";
import type { DailyRecord } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { filledCount } from "@/lib/stats";

type PersonalDayViewProps = {
  date: string;
  record: DailyRecord | null;
  locale: Locale;
  dict: Dictionary;
};

export default function PersonalDayView({
  date,
  record,
  locale,
  dict,
}: PersonalDayViewProps) {
  const count = filledCount(record);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{dict.dashboard.day.progressLabel}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {count} / {CORE_ITEMS.length}
            </p>
          </div>
          <Link
            href={`/record/${date}`}
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            {record ? dict.dashboard.day.editButton : dict.dashboard.day.createButton}
          </Link>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${(count / CORE_ITEMS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {CORE_ITEMS.map((item) => {
          const value = record?.[item.key]?.trim();
          return (
            <div
              key={item.key}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <span>{item.emoji}</span>
                {item.label[locale]}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                {value || (
                  <span className="text-gray-300">{dict.common.notWritten}</span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
