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

export type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  can_create_groups: boolean;
  created_at: string;
};

export type GroupSummary = {
  id: string;
  name: string;
  created_at: string;
  member_count: number;
  is_owner: boolean;
};

export type GroupMember = {
  user_id: string;
  email: string;
  display_name: string | null;
  joined_at: string;
};
