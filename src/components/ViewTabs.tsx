import Link from "next/link";
import { format } from "date-fns";
import type { ViewMode } from "@/lib/view-nav";

const LABELS: Record<ViewMode, string> = {
  day: "일간",
  week: "주간",
  month: "월간",
};

type ViewTabsProps = {
  basePath: string;
  view: ViewMode;
  anchorDate: Date;
};

export default function ViewTabs({ basePath, view, anchorDate }: ViewTabsProps) {
  const date = format(anchorDate, "yyyy-MM-dd");

  return (
    <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
      {(Object.keys(LABELS) as ViewMode[]).map((mode) => (
        <Link
          key={mode}
          href={`${basePath}?view=${mode}&date=${date}`}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
            view === mode
              ? "bg-orange-500 text-white"
              : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          }`}
        >
          {LABELS[mode]}
        </Link>
      ))}
    </div>
  );
}
