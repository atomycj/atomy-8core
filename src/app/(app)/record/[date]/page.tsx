import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CORE_ITEMS, type CoreItemKey } from "@/lib/core-items";
import type { DailyRecord } from "@/lib/types";
import { getViewerProfile } from "@/lib/profile";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
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

  const { displayName: userName } = await getViewerProfile(supabase, user);
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <RecordForm
      date={date}
      userName={userName}
      initialValues={initialValues}
      saveAction={saveRecord}
      locale={locale}
      dict={dict}
    />
  );
}
