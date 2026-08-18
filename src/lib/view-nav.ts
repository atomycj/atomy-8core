import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ko } from "date-fns/locale";

export type ViewMode = "day" | "week" | "month";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseView(v: string | undefined): ViewMode {
  return v === "week" || v === "month" ? v : "day";
}

export function parseAnchorDate(d: string | undefined): Date {
  if (d && DATE_RE.test(d)) {
    const parsed = new Date(`${d}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

export type ViewNav = {
  prev: string;
  next: string;
  label: string;
  rangeStart: Date;
  rangeEnd: Date;
};

export function getViewNav(view: ViewMode, anchor: Date): ViewNav {
  if (view === "day") {
    return {
      prev: format(subDays(anchor, 1), "yyyy-MM-dd"),
      next: format(addDays(anchor, 1), "yyyy-MM-dd"),
      label: format(anchor, "yyyy년 M월 d일 (EEEEE)", { locale: ko }),
      rangeStart: anchor,
      rangeEnd: anchor,
    };
  }

  if (view === "week") {
    const start = startOfWeek(anchor);
    const end = endOfWeek(anchor);
    return {
      prev: format(subWeeks(anchor, 1), "yyyy-MM-dd"),
      next: format(addWeeks(anchor, 1), "yyyy-MM-dd"),
      label: `${format(start, "M월 d일")} - ${format(end, "M월 d일")}`,
      rangeStart: start,
      rangeEnd: end,
    };
  }

  const start = startOfMonth(anchor);
  const end = endOfMonth(anchor);
  return {
    prev: format(subMonths(anchor, 1), "yyyy-MM-dd"),
    next: format(addMonths(anchor, 1), "yyyy-MM-dd"),
    label: format(anchor, "yyyy년 M월"),
    rangeStart: start,
    rangeEnd: end,
  };
}
