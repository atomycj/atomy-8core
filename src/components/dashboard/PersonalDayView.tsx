import Link from "next/link";
import { CORE_ITEMS } from "@/lib/core-items";
import type { DailyRecord } from "@/lib/types";
import { filledCount } from "@/lib/stats";

type PersonalDayViewProps = {
  date: string;
  record: DailyRecord | null;
};

export default function PersonalDayView({ date, record }: PersonalDayViewProps) {
  const count = filledCount(record);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">이 날의 진행률</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {count} / {CORE_ITEMS.length}
            </p>
          </div>
          <Link
            href={`/record/${date}`}
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            {record ? "기록 수정" : "기록 작성"}
          </Link>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-orange-500 transition-all"
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
                {item.label}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                {value || <span className="text-gray-300">(미작성)</span>}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
