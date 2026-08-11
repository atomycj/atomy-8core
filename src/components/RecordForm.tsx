"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, subDays } from "date-fns";
import { CORE_ITEMS, type CoreItemKey } from "@/lib/core-items";
import ShareButton from "./ShareButton";

type RecordFormProps = {
  date: string;
  userName: string;
  initialValues: Record<CoreItemKey, string>;
  saveAction: (date: string, formData: FormData) => Promise<{ success: boolean }>;
};

export default function RecordForm({
  date,
  userName,
  initialValues,
  saveAction,
}: RecordFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const dateObj = new Date(`${date}T00:00:00`);
  const prevDate = format(subDays(dateObj, 1), "yyyy-MM-dd");
  const nextDate = format(addDays(dateObj, 1), "yyyy-MM-dd");
  const isToday = date === format(new Date(), "yyyy-MM-dd");

  function handleChange(key: CoreItemKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    for (const item of CORE_ITEMS) {
      formData.set(item.key, values[item.key] ?? "");
    }
    startTransition(async () => {
      await saveAction(date, formData);
      setSavedAt(Date.now());
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push(`/record/${prevDate}`)}
          className="rounded-lg px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
        >
          ← {prevDate}
        </button>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900">{date}</p>
          {isToday && <p className="text-xs text-orange-500">오늘</p>}
        </div>
        <button
          type="button"
          onClick={() => router.push(`/record/${nextDate}`)}
          className="rounded-lg px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
        >
          {nextDate} →
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {CORE_ITEMS.map((item) => (
          <div
            key={item.key}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <label
              htmlFor={item.key}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800"
            >
              <span>{item.emoji}</span>
              {item.label}
            </label>
            <p className="mt-0.5 text-xs text-gray-400">{item.description}</p>
            <textarea
              id={item.key}
              value={values[item.key] ?? ""}
              onChange={(e) => handleChange(item.key, e.target.value)}
              rows={2}
              placeholder="오늘의 실천 내용을 입력하세요"
              className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>
        ))}

        <div className="flex items-center justify-between gap-3 pt-2">
          <ShareButton date={date} userName={userName} values={values} />
          <div className="flex items-center gap-3">
            {savedAt && !isPending && (
              <span className="text-xs text-green-600">저장됨 ✓</span>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {isPending ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
