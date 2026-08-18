import type { Locale } from "./locale";

export function formatStreak(locale: Locale, n: number): string {
  return locale === "en" ? `${n}-day streak` : `연속 기록 ${n}일째`;
}

export function formatGroupMemberCount(
  locale: Locale,
  n: number,
  date: string
): string {
  return locale === "en"
    ? `${n} members · created ${date}`
    : `멤버 ${n}명 · ${date} 개설`;
}

export function formatMemberSuffix(locale: Locale, n: number): string {
  return locale === "en" ? `${n} members` : `${n}명`;
}

export function formatGroupDetailMemberCount(locale: Locale, n: number): string {
  return locale === "en" ? `${n} members` : `멤버 ${n}명`;
}

export function formatShareReportTitle(locale: Locale, date: string): string {
  return locale === "en"
    ? `📋 ${date} 8 Core Report`
    : `📋 ${date} 8코어 실천 리포트`;
}

export function formatAchievedLabel(
  locale: Locale,
  filled: number,
  total: number
): string {
  return locale === "en"
    ? `✅ Achieved ${filled} / ${total}`
    : `✅ 달성 ${filled} / ${total}`;
}
