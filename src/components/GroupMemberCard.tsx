"use client";

import { useState } from "react";
import { CORE_ITEMS } from "@/lib/core-items";
import type { DailyRecord, GroupMember } from "@/lib/types";

type GroupMemberCardProps = {
  member: GroupMember;
  isMe: boolean;
  values: DailyRecord | null;
};

export default function GroupMemberCard({
  member,
  isMe,
  values,
}: GroupMemberCardProps) {
  const [open, setOpen] = useState(false);
  const filled = values
    ? CORE_ITEMS.filter((item) => values[item.key]?.trim()).length
    : 0;

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {member.display_name || member.email}
            {isMe && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                나
              </span>
            )}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">{member.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`flex h-8 w-12 items-center justify-center rounded-full text-xs font-semibold ${
              filled === CORE_ITEMS.length
                ? "bg-orange-500 text-white"
                : filled > 0
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            {filled}/{CORE_ITEMS.length}
          </span>
          <span className="text-gray-300">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="space-y-3 border-t border-gray-100 p-4">
          {values ? (
            CORE_ITEMS.map((item) => {
              const value = values[item.key]?.trim();
              return (
                <div key={item.key}>
                  <p className="text-xs font-semibold text-gray-600">
                    {item.emoji} {item.label}
                  </p>
                  <p className="mt-0.5 whitespace-pre-wrap text-sm text-gray-700">
                    {value || (
                      <span className="text-gray-300">(미작성)</span>
                    )}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-400">이 날짜에 작성된 기록이 없어요.</p>
          )}
        </div>
      )}
    </div>
  );
}
