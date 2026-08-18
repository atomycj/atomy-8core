"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { GroupOption } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type GroupActionResult =
  | { success: true; group: { id: string; name: string } }
  | { success: false; error: string };

type GroupFormsProps = {
  canCreate: boolean;
  joinableGroups: GroupOption[];
  createAction: (formData: FormData) => Promise<GroupActionResult>;
  joinAction: (formData: FormData) => Promise<GroupActionResult>;
  dict: Dictionary["groups"]["forms"];
};

export default function GroupForms({
  canCreate,
  joinableGroups,
  createAction,
  joinAction,
  dict,
}: GroupFormsProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"join" | "create">("join");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    action: (formData: FormData) => Promise<GroupActionResult>
  ) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await action(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push(`/groups/${result.group.id}`);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex gap-2 border-b border-gray-100 pb-3">
        <button
          type="button"
          onClick={() => setTab("join")}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
            tab === "join"
              ? "bg-brand-500 text-white"
              : "text-gray-400 hover:bg-gray-100"
          }`}
        >
          {dict.joinTab}
        </button>
        {canCreate && (
          <button
            type="button"
            onClick={() => setTab("create")}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
              tab === "create"
                ? "bg-brand-500 text-white"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            {dict.createTab}
          </button>
        )}
      </div>

      {tab === "join" ? (
        <form
          onSubmit={(e) => handleSubmit(e, joinAction)}
          className="mt-4 space-y-3"
        >
          <p className="text-xs text-gray-400">{dict.joinHelp}</p>
          {joinableGroups.length > 0 ? (
            <select
              name="name"
              required
              defaultValue=""
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
            >
              <option value="" disabled>
                {dict.selectPlaceholder}
              </option>
              {joinableGroups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name} ({dict.memberSuffix(group.member_count)})
                </option>
              ))}
            </select>
          ) : (
            <p className="rounded-xl border border-dashed border-gray-200 p-3 text-center text-sm text-gray-400">
              {dict.noGroups}
            </p>
          )}
          <input
            name="password"
            type="password"
            required
            placeholder={dict.passwordPlaceholder}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={isPending || joinableGroups.length === 0}
            className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {isPending ? dict.joinSubmitting : dict.joinSubmit}
          </button>
        </form>
      ) : (
        <form
          onSubmit={(e) => handleSubmit(e, createAction)}
          className="mt-4 space-y-3"
        >
          <p className="text-xs text-gray-400">{dict.createHelp}</p>
          <input
            name="name"
            required
            placeholder={dict.namePlaceholder}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />
          <input
            name="password"
            type="password"
            required
            minLength={4}
            placeholder={dict.createPasswordPlaceholder}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {isPending ? dict.createSubmitting : dict.createSubmit}
          </button>
        </form>
      )}

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
