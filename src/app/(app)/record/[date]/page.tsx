import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CORE_ITEMS, type CoreItemKey } from "@/lib/core-items";
import type { DailyRecord } from "@/lib/types";
import RecordForm from "@/components/RecordForm";
import { saveRecord } from "./actions";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function RecordPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  if (!DATE_RE.test(date)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user!;

  const { data: record } = await supabase
    .from("daily_records")
    .select("*")
    .eq("user_id", user.id)
    .eq("record_date", date)
    .maybeSingle();

  const typedRecord = record as DailyRecord | null;

  const initialValues = Object.fromEntries(
    CORE_ITEMS.map((item) => [item.key, typedRecord?.[item.key] ?? ""])
  ) as Record<CoreItemKey, string>;

  const userName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.email as string | undefined) ??
    "사용자";

  return (
    <RecordForm
      date={date}
      userName={userName}
      initialValues={initialValues}
      saveAction={saveRecord}
    />
  );
}
