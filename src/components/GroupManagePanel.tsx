"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type SimpleResult = { success: true } | { success: false; error: string };
type RenameResult =
  | { success: true; group: { id: string; name: string } }
  | { success: false; error: string };

type GroupManagePanelProps = {
  groupId: string;
  groupName: string;
  isOwner: boolean;
  dict: Dictionary["groups"]["manage"];
  leaveAction: (groupId: string) => Promise<SimpleResult>;
  deleteAction: (groupId: string) => Promise<SimpleResult>;
  renameAction: (groupId: string, formData: FormData) => Promise<RenameResult>;
};

export default function GroupManagePanel({
  groupId,
  groupName,
  isOwner,
  dict,
  leaveAction,
  deleteAction,
  renameAction,
}: GroupManagePanelProps) {
  const router = useRouter();
  const [name, setName] = useState(groupName);
  const [isRenaming, startRename] = useTransition();
  const [isLeaving, startLeave] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleRename(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    startRename(async () => {
      const result = await renameAction(groupId, formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setMessage(dict.renameSuccess);
      router.refresh();
    });
  }

  function handleLeave() {
    if (!window.confirm(dict.leaveConfirm)) return;
    setError(null);
    startLeave(async () => {
      const result = await leaveAction(groupId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push("/groups");
      router.refresh();
    });
  }

  function handleDelete() {
    if (!window.confirm(dict.deleteConfirm)) return;
    setError(null);
    startDelete(async () => {
      const result = await deleteAction(groupId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push("/groups");
      router.refresh();
    });
  }

  return (
    <details className="group rounded-2xl border border-gray-100 bg-white shadow-sm">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-700 marker:content-none">
        {dict.title}
      </summary>

      <div className="space-y-4 border-t border-gray-100 p-4">
        {isOwner && (
          <form onSubmit={handleRename} className="space-y-2">
            <label className="text-xs font-medium text-gray-500">
              {dict.renameLabel}
            </label>
            <div className="flex gap-2">
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm outline-none focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
              />
              <button
                type="submit"
                disabled={isRenaming}
                className="shrink-0 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
              >
                {isRenaming ? dict.renameSubmitting : dict.renameSubmit}
              </button>
            </div>
          </form>
        )}

        {isOwner ? (
          <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 p-3">
            <p className="text-xs text-red-500">{dict.leaveOwnerNotice}</p>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
            >
              {isDeleting ? dict.deleteSubmitting : dict.deleteButton}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleLeave}
            disabled={isLeaving}
            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
          >
            {isLeaving ? dict.leaveSubmitting : dict.leaveButton}
          </button>
        )}

        {message && <p className="text-sm text-green-600">{message}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </details>
  );
}
