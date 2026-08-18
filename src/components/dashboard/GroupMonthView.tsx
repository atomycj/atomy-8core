import { CORE_ITEMS } from "@/lib/core-items";
import type { DailyRecord, GroupMember } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { filledCount } from "@/lib/stats";

type GroupMonthViewProps = {
  members: GroupMember[];
  monthDates: string[];
  recordsByUserDate: Map<string, DailyRecord>;
  dict: Dictionary;
};

export default function GroupMonthView({
  members,
  monthDates,
  recordsByUserDate,
  dict,
}: GroupMonthViewProps) {
  const rows = members.map((member) => {
    const counts = monthDates.map((date) =>
      filledCount(recordsByUserDate.get(`${member.user_id}_${date}`))
    );
    const activeDays = counts.filter((n) => n > 0).length;
    const completeDays = counts.filter((n) => n === CORE_ITEMS.length).length;
    const avgProgress =
      monthDates.length > 0
        ? Math.round(
            (counts.reduce((sum, n) => sum + n, 0) /
              (monthDates.length * CORE_ITEMS.length)) *
              100
          )
        : 0;
    return { member, activeDays, completeDays, avgProgress };
  });

  rows.sort((a, b) => b.avgProgress - a.avgProgress);

  const t = dict.groups.detail;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <table className="w-full min-w-[440px]">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
            <th className="pb-2 font-medium">{t.memberColumn}</th>
            <th className="pb-2 text-center font-medium">{t.activeDays}</th>
            <th className="pb-2 text-center font-medium">{t.completeDays}</th>
            <th className="pb-2 text-right font-medium">{t.avgProgress}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ member, activeDays, completeDays, avgProgress }) => (
            <tr key={member.user_id} className="border-b border-gray-50 last:border-0">
              <td className="py-3 text-sm font-medium text-gray-800">
                {member.display_name || member.email}
              </td>
              <td className="py-3 text-center text-sm text-gray-600">
                {activeDays}
              </td>
              <td className="py-3 text-center text-sm text-gray-600">
                {completeDays}
              </td>
              <td className="py-3">
                <div className="flex items-center justify-end gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-orange-400"
                      style={{ width: `${avgProgress}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs font-semibold text-gray-500">
                    {avgProgress}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
