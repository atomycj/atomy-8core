"use client";

import { useState } from "react";
import { CORE_ITEMS } from "@/lib/core-items";
import type { CoreItemKey } from "@/lib/core-items";
import type { Locale } from "@/lib/i18n/locale";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type ShareButtonProps = {
  date: string;
  userName: string;
  values: Record<CoreItemKey, string>;
  locale: Locale;
  dict: Dictionary;
};

function buildShareText(
  date: string,
  userName: string,
  values: Record<CoreItemKey, string>,
  locale: Locale,
  dict: Dictionary
) {
  const lines = [dict.share.reportTitle(date), `👤 ${userName}`, ""];

  for (const item of CORE_ITEMS) {
    const value = values[item.key]?.trim();
    lines.push(`${item.emoji} ${item.label[locale]}`);
    lines.push(value ? value : dict.common.notWritten);
    lines.push("");
  }

  const filled = CORE_ITEMS.filter((item) => values[item.key]?.trim()).length;
  lines.push(dict.share.achievedLabel(filled, CORE_ITEMS.length));

  return lines.join("\n").trim();
}

export default function ShareButton({
  date,
  userName,
  values,
  locale,
  dict,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const text = buildShareText(date, userName, values, locale, dict);

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: dict.appName, text });
        return;
      } catch {
        // user cancelled share sheet or it's unsupported; fall back to clipboard
      }
    }

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-100"
    >
      {copied ? dict.record.copied : dict.record.shareButton}
    </button>
  );
}
