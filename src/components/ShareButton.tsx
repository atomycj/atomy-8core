"use client";

import { useState } from "react";
import { CORE_ITEMS } from "@/lib/core-items";
import type { CoreItemKey } from "@/lib/core-items";

type ShareButtonProps = {
  date: string;
  userName: string;
  values: Record<CoreItemKey, string>;
};

function buildShareText(date: string, userName: string, values: Record<CoreItemKey, string>) {
  const lines = [`📋 ${date} 8코어 실천 리포트`, `👤 ${userName}`, ""];

  for (const item of CORE_ITEMS) {
    const value = values[item.key]?.trim();
    lines.push(`${item.emoji} ${item.label}`);
    lines.push(value ? value : "(미작성)");
    lines.push("");
  }

  const filled = CORE_ITEMS.filter((item) => values[item.key]?.trim()).length;
  lines.push(`✅ 달성 ${filled} / ${CORE_ITEMS.length}`);

  return lines.join("\n").trim();
}

export default function ShareButton({ date, userName, values }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const text = buildShareText(date, userName, values);

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "8코어 실천 리포트", text });
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
      className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-100"
    >
      {copied ? "복사됨! ✓" : "팀에 공유하기"}
    </button>
  );
}
