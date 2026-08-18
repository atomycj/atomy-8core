import type { Locale } from "@/lib/i18n/locale";
import { setLocale } from "@/app/actions/locale";

type LanguageToggleProps = {
  locale: Locale;
};

export default function LanguageToggle({ locale }: LanguageToggleProps) {
  return (
    <div className="flex items-center rounded-lg border border-gray-200 p-0.5 text-xs font-semibold">
      <form action={setLocale.bind(null, "ko")}>
        <button
          type="submit"
          className={`rounded-md px-2 py-1 ${
            locale === "ko"
              ? "bg-brand-500 text-white"
              : "text-gray-400 hover:bg-gray-100"
          }`}
        >
          한
        </button>
      </form>
      <form action={setLocale.bind(null, "en")}>
        <button
          type="submit"
          className={`rounded-md px-2 py-1 ${
            locale === "en"
              ? "bg-brand-500 text-white"
              : "text-gray-400 hover:bg-gray-100"
          }`}
        >
          EN
        </button>
      </form>
    </div>
  );
}
