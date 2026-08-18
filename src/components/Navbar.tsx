import Link from "next/link";
import { format } from "date-fns";

type NavbarProps = {
  userName: string;
  userAvatar?: string | null;
  isAdmin?: boolean;
};

export default function Navbar({ userName, userAvatar, isAdmin }: NavbarProps) {
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white">
            8
          </span>
          <span className="text-sm font-bold text-gray-900">8코어 기록장</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium text-gray-500">
          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-gray-900"
          >
            대시보드
          </Link>
          <Link
            href={`/record/${today}`}
            className="rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-gray-900"
          >
            오늘 기록
          </Link>
          <Link
            href="/history"
            className="rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-gray-900"
          >
            히스토리
          </Link>
          <Link
            href="/groups"
            className="rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-gray-900"
          >
            그룹
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-gray-900"
            >
              관리자
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-7 w-7 rounded-full"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                {userName.slice(0, 1)}
              </div>
            )}
            <span className="hidden text-sm text-gray-700 sm:inline">
              {userName}
            </span>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50"
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
