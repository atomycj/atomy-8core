import { CORE_ITEMS } from "./core-items";
import type { DailyRecord } from "./types";

export function filledCount(record: Pick<DailyRecord, (typeof CORE_ITEMS)[number]["key"]> | null | undefined) {
  if (!record) return 0;
  return CORE_ITEMS.reduce(
    (count, item) => count + (record[item.key]?.trim() ? 1 : 0),
    0
  );
}

export function isRecordFilled(record: DailyRecord | null | undefined) {
  return filledCount(record) > 0;
}

export function isRecordComplete(record: DailyRecord | null | undefined) {
  return filledCount(record) === CORE_ITEMS.length;
}

/**
 * Longest run of consecutive days (ending today or yesterday) with at least
 * one core item filled in. Records must be sorted descending by date.
 */
export function computeCurrentStreak(records: DailyRecord[]): number {
  if (records.length === 0) return 0;

  const byDate = new Map(records.map((r) => [r.record_date, r]));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // Allow the streak to count today even if not filled yet, but don't break on it.
  for (let i = 0; i < 3650; i++) {
    const key = cursor.toISOString().slice(0, 10);
    const record = byDate.get(key);
    if (isRecordFilled(record)) {
      streak++;
    } else if (i === 0) {
      // today has no entry yet; keep checking yesterday onward
    } else {
      break;
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
