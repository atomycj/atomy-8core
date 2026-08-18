"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 2 * 1024 * 1024;

type ProfileFormProps = {
  currentName: string;
  currentAvatar: string | null;
  updateAction: (formData: FormData) => Promise<void>;
  dict: Dictionary;
};

export default function ProfileForm({
  currentName,
  currentAvatar,
  updateAction,
  dict,
}: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(currentName);
  const [preview, setPreview] = useState<string | null>(currentAvatar);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(dict.profile.errorInvalidType);
      e.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(dict.profile.errorTooLarge);
      e.target.value = "";
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateAction(formData);
        setMessage(dict.profile.savedMessage);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : dict.profile.errorGeneric);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-4">
        {preview ? (
          <img
            src={preview}
            alt={name}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold text-gray-500">
            {name.slice(0, 1) || "?"}
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            {dict.profile.changePhoto}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            name="avatar"
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="mt-1 text-[11px] text-gray-400">{dict.profile.photoHint}</p>
        </div>
      </div>

      <div>
        <label
          htmlFor="display_name"
          className="text-xs font-medium text-gray-500"
        >
          {dict.profile.nameLabel}
        </label>
        <input
          id="display_name"
          name="display_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={dict.profile.namePlaceholder}
          className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
      >
        {isPending ? dict.common.saving : dict.common.save}
      </button>

      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
