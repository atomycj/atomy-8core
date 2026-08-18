import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locale";
import LanguageToggle from "./LanguageToggle";

type NavbarProps = {
  userName: string;
  userAvatar?: string | null;
  isAdmin?: boolean;
  locale: Locale;
  dict: Dictionary;
};

export default function Navbar({
  userName,
  userAvatar,
  isAdmin,
  locale,
  dict,
}: NavbarProps) {
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 md:flex-nowrap">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
          <Image
            src="/logo-nav.png"
            alt={dict.appName}
            width={266}
            height={160}
            priority
            className="h-8 w-auto"
          />
          <span className="whitespace-nowrap text-sm font-bold text-gray-900">
            {dict.appName}
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 text-sm font-medium text-gray-500">
          <Link
            href="/dashboard"
            className="whitespace-nowrap rounded-lg px-2.5 py-1.5 hover:bg-gray-100 hover:text-gray-900"
          >
            {dict.nav.dashboard}
          </Link>
          <Link
            href={`/record/${today}`}
            className="whitespace-nowrap rounded-lg px-2.5 py-1.5 hover:bg-gray-100 hover:text-gray-900"
          >
            {dict.nav.today}
          </Link>
          <Link
            href="/history"
            className="whitespace-nowrap rounded-lg px-2.5 py-1.5 hover:bg-gray-100 hover:text-gray-900"
          >
            {dict.nav.history}
          </Link>
          <Link
            href="/groups"
            className="whitespace-nowrap rounded-lg px-2.5 py-1.5 hover:bg-gray-100 hover:text-gray-900"
          >
            {dict.nav.groups}
          </Link>
          <Link
            href="/guide"
            className="whitespace-nowrap rounded-lg px-2.5 py-1.5 hover:bg-gray-100 hover:text-gray-900"
          >
            {dict.nav.guide}
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="whitespace-nowrap rounded-lg px-2.5 py-1.5 hover:bg-gray-100 hover:text-gray-900"
            >
              {dict.nav.admin}
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <LanguageToggle locale={locale} />
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-gray-100"
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                {userName.slice(0, 1)}
              </div>
            )}
            <span className="hidden text-sm text-gray-700 sm:inline">
              {userName}
            </span>
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50"
            >
              {dict.nav.signOut}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
