"use client";

import { useState, useTransition } from "react";
import type { Profile } from "@/lib/types";
import { ADMIN_EMAIL } from "@/lib/admin";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type AdminUserRowProps = {
  profile: Profile;
  onToggle: (userId: string, value: boolean) => Promise<void>;
  dict: Dictionary["admin"];
};

export default function AdminUserRow({ profile, onToggle, dict }: AdminUserRowProps) {
  const [isPending, startTransition] = useTransition();
  const [checked, setChecked] = useState(profile.can_create_groups);
  const isAdmin = profile.email === ADMIN_EMAIL;

  function handleChange(next: boolean) {
    setChecked(next);
    startTransition(async () => {
      try {
        await onToggle(profile.id, next);
      } catch {
        setChecked(!next);
      }
    });
  }

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 pr-3">
        <p className="text-sm font-medium text-gray-800">
          {profile.display_name || dict.noName}
        </p>
        <p className="text-xs text-gray-400">{profile.email}</p>
      </td>
      <td className="py-3 text-right">
        {isAdmin ? (
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-600">
            {dict.adminBadge}
          </span>
        ) : (
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={checked}
              disabled={isPending}
              onChange={(e) => handleChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
            />
            {dict.permissionLabel}
          </label>
        )}
      </td>
    </tr>
  );
}
