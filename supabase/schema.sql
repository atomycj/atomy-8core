-- 8코어 기록 앱 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요.

create extension if not exists "pgcrypto";

create table if not exists public.daily_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  record_date date not null,
  reading text default '',
  media text default '',
  product_use text default '',
  stp text default '',
  delivery text default '',
  meeting text default '',
  trust text default '',
  health text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, record_date)
);

create index if not exists daily_records_user_date_idx
  on public.daily_records (user_id, record_date desc);

-- updated_at 자동 갱신 트리거
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_daily_records_updated_at on public.daily_records;
create trigger trg_daily_records_updated_at
  before update on public.daily_records
  for each row
  execute function public.set_updated_at();

-- Row Level Security: 각 사용자는 자신의 기록만 조회/수정 가능
alter table public.daily_records enable row level security;

drop policy if exists "select own records" on public.daily_records;
create policy "select own records"
  on public.daily_records for select
  using (auth.uid() = user_id);

drop policy if exists "insert own records" on public.daily_records;
create policy "insert own records"
  on public.daily_records for insert
  with check (auth.uid() = user_id);

drop policy if exists "update own records" on public.daily_records;
create policy "update own records"
  on public.daily_records for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "delete own records" on public.daily_records;
create policy "delete own records"
  on public.daily_records for delete
  using (auth.uid() = user_id);
