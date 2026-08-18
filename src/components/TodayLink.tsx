import Link from "next/link";
import { format } from "date-fns";
import type { ViewMode } from "@/lib/view-nav";

type TodayLinkProps = {
  basePath: string;
  view: ViewMode;
  isCurrent: boolean;
  label: string;
};

export default function TodayLink({
  basePath,
  view,
  isCurrent,
  label,
}: TodayLinkProps) {
  if (isCurrent) return null;

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <Link
      href={`${basePath}?view=${view}&date=${today}`}
      className="text-sm font-semibold text-brand-600 underline-offset-2 hover:text-brand-700 hover:underline"
    >
      {label}
    </Link>
  );
}
