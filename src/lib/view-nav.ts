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
import { enUS, ko } from "date-fns/locale";
import type { Locale as AppLocale } from "./i18n/locale";

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

export function getViewNav(
  view: ViewMode,
  anchor: Date,
  appLocale: AppLocale = "ko"
): ViewNav {
  const dateLocale = appLocale === "en" ? enUS : ko;

  if (view === "day") {
    return {
      prev: format(subDays(anchor, 1), "yyyy-MM-dd"),
      next: format(addDays(anchor, 1), "yyyy-MM-dd"),
      label:
        appLocale === "en"
          ? format(anchor, "PPP (EEE)", { locale: dateLocale })
          : format(anchor, "yyyy년 M월 d일 (EEEEE)", { locale: dateLocale }),
      rangeStart: anchor,
      rangeEnd: anchor,
    };
  }

  if (view === "week") {
    const start = startOfWeek(anchor);
    const end = endOfWeek(anchor);
    const weekFormat = appLocale === "en" ? "MMM d" : "M월 d일";
    return {
      prev: format(subWeeks(anchor, 1), "yyyy-MM-dd"),
      next: format(addWeeks(anchor, 1), "yyyy-MM-dd"),
      label: `${format(start, weekFormat, { locale: dateLocale })} - ${format(end, weekFormat, { locale: dateLocale })}`,
      rangeStart: start,
      rangeEnd: end,
    };
  }

  const start = startOfMonth(anchor);
  const end = endOfMonth(anchor);
  return {
    prev: format(subMonths(anchor, 1), "yyyy-MM-dd"),
    next: format(addMonths(anchor, 1), "yyyy-MM-dd"),
    label:
      appLocale === "en"
        ? format(anchor, "MMMM yyyy", { locale: dateLocale })
        : format(anchor, "yyyy년 M월", { locale: dateLocale }),
    rangeStart: start,
    rangeEnd: end,
  };
}
