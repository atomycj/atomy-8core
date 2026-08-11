import type { CoreItemKey } from "./core-items";

export type DailyRecord = {
  id: string;
  user_id: string;
  record_date: string; // YYYY-MM-DD
  reading: string | null;
  media: string | null;
  product_use: string | null;
  stp: string | null;
  delivery: string | null;
  meeting: string | null;
  trust: string | null;
  health: string | null;
  created_at: string;
  updated_at: string;
};

export type DailyRecordInput = Partial<Record<CoreItemKey, string>> & {
  record_date: string;
};
