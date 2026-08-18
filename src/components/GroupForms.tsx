"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { GroupOption } from "@/lib/types";

type GroupActionResult =
  | { success: true; group: { id: string; name: string } }
  | { success: false; error: string };

type GroupFormsProps = {
  canCreate: boolean;
  joinableGroups: GroupOption[];
  createAction: (formData: FormData) => Promise<GroupActionResult>;
  joinAction: (formData: FormData) => Promise<GroupActionResult>;
};

export default function GroupForms({
  canCreate,
  joinableGroups,
  createAction,
  joinAction,
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
              ? "bg-orange-500 text-white"
              : "text-gray-400 hover:bg-gray-100"
          }`}
        >
          그룹 참여
        </button>
        {canCreate && (
          <button
            type="button"
            onClick={() => setTab("create")}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
              tab === "create"
                ? "bg-orange-500 text-white"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            그룹 만들기
          </button>
        )}
      </div>

      {tab === "join" ? (
        <form
          onSubmit={(e) => handleSubmit(e, joinAction)}
          className="mt-4 space-y-3"
        >
          <p className="text-xs text-gray-400">
            그룹을 선택하고 비밀번호를 입력해서 참여하세요.
          </p>
          {joinableGroups.length > 0 ? (
            <select
              name="name"
              required
              defaultValue=""
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
            >
              <option value="" disabled>
                그룹 선택
              </option>
              {joinableGroups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name} ({group.member_count}명)
                </option>
              ))}
            </select>
          ) : (
            <p className="rounded-xl border border-dashed border-gray-200 p-3 text-center text-sm text-gray-400">
              아직 생성된 그룹이 없어요.
            </p>
          )}
          <input
            name="password"
            type="password"
            required
            placeholder="그룹 비밀번호"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />
          <button
            type="submit"
            disabled={isPending || joinableGroups.length === 0}
            className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {isPending ? "참여 중..." : "참여하기"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={(e) => handleSubmit(e, createAction)}
          className="mt-4 space-y-3"
        >
          <p className="text-xs text-gray-400">
            새 그룹을 만들고 팀원에게 비밀번호를 공유하세요.
          </p>
          <input
            name="name"
            required
            placeholder="그룹 이름"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />
          <input
            name="password"
            type="password"
            required
            minLength={4}
            placeholder="그룹 비밀번호 (4자 이상)"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {isPending ? "생성 중..." : "그룹 만들기"}
          </button>
        </form>
      )}

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
