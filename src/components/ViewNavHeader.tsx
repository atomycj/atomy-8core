import Link from "next/link";
import type { ViewMode } from "@/lib/view-nav";

type ViewNavHeaderProps = {
  basePath: string;
  view: ViewMode;
  prev: string;
  next: string;
  label: string;
};

export default function ViewNavHeader({
  basePath,
  view,
  prev,
  next,
  label,
}: ViewNavHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Link
        href={`${basePath}?view=${view}&date=${prev}`}
        className="rounded-lg px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
      >
        ← 이전
      </Link>
      <span className="text-sm font-bold text-gray-900">{label}</span>
      <Link
        href={`${basePath}?view=${view}&date=${next}`}
        className="rounded-lg px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
      >
        다음 →
      </Link>
    </div>
  );
}
