import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CORE_ITEMS } from "@/lib/core-items";
import type { DailyRecord, GroupMember } from "@/lib/types";
import { filledCount } from "@/lib/stats";

type GroupWeekViewProps = {
  groupId: string;
  members: GroupMember[];
  weekDates: string[];
  recordsByUserDate: Map<string, DailyRecord>;
};

export default function GroupWeekView({
  groupId,
  members,
  weekDates,
  recordsByUserDate,
}: GroupWeekViewProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <table className="w-full min-w-[560px] border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-36 text-left text-xs font-medium text-gray-400">
              멤버
            </th>
            {weekDates.map((date) => (
              <th key={date} className="text-center">
                <Link
                  href={`/groups/${groupId}?view=day&date=${date}`}
                  className="block rounded-lg px-1 py-1 hover:bg-gray-50"
                >
                  <p className="text-[10px] text-gray-400">
                    {format(new Date(`${date}T00:00:00`), "EEEEE", {
                      locale: ko,
                    })}
                  </p>
                  <p className="text-xs font-semibold text-gray-700">
                    {format(new Date(`${date}T00:00:00`), "d")}
                  </p>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.user_id}>
              <td className="text-xs font-medium text-gray-700">
                {member.display_name || member.email}
              </td>
              {weekDates.map((date) => {
                const record = recordsByUserDate.get(
                  `${member.user_id}_${date}`
                );
                const count = filledCount(record);
                return (
                  <td key={date} className="text-center">
                    <span
                      className={`mx-auto flex h-6 w-8 items-center justify-center rounded-md text-[11px] font-semibold ${
                        count === CORE_ITEMS.length
                          ? "bg-orange-500 text-white"
                          : count > 0
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {count}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
