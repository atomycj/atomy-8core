-- 그룹(팀) 기능 추가 스키마
-- supabase/schema.sql을 이미 실행한 프로젝트에 추가로 실행하세요.
-- Supabase SQL Editor에서 실행하세요.

-- =========================================================
-- profiles: 사용자별 프로필 + 그룹 생성 권한
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  can_create_groups boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 관리자 이메일. atomycj@gmail.com만 관리자 권한을 가집니다.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from auth.users
    where id = auth.uid() and email = 'atomycj@gmail.com'
  );
$$;
grant execute on function public.is_admin() to authenticated;

create or replace function public.can_create_groups(p_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select can_create_groups from public.profiles where id = p_user), false)
    or exists (select 1 from auth.users where id = p_user and email = 'atomycj@gmail.com');
$$;
grant execute on function public.can_create_groups(uuid) to authenticated;

drop policy if exists "select own profile" on public.profiles;
create policy "select own profile"
  on public.profiles for select
  using (id = auth.uid());

drop policy if exists "admin select all profiles" on public.profiles;
create policy "admin select all profiles"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "admin update any profile" on public.profiles;
create policy "admin update any profile"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- 신규 가입 시 프로필 자동 생성 (관리자 이메일이면 자동으로 그룹 생성 권한 부여)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, can_create_groups)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.email = 'atomycj@gmail.com'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 이미 가입되어 있던 사용자 백필
insert into public.profiles (id, email, display_name, can_create_groups)
select id, email, raw_user_meta_data->>'full_name', email = 'atomycj@gmail.com'
from auth.users
on conflict (id) do nothing;

-- =========================================================
-- groups / group_members
-- =========================================================
create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  password_hash text not null,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
create unique index if not exists groups_name_lower_key on public.groups (lower(name));

create table if not exists public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

alter table public.groups enable row level security;
alter table public.group_members enable row level security;
-- groups/group_members에는 직접 select/insert 정책을 두지 않습니다.
-- password_hash가 클라이언트에 노출되지 않도록, 아래 SECURITY DEFINER 함수로만 접근합니다.

-- =========================================================
-- 그룹 생성/참여/조회 RPC
-- =========================================================
create or replace function public.create_group(p_name text, p_password text)
returns table (id uuid, name text)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_group_id uuid;
  v_name text := trim(p_name);
begin
  if not public.can_create_groups(auth.uid()) then
    raise exception '그룹을 생성할 권한이 없습니다.';
  end if;

  if v_name is null or length(v_name) = 0 then
    raise exception '그룹 이름을 입력해주세요.';
  end if;

  if p_password is null or length(p_password) < 4 then
    raise exception '비밀번호는 4자 이상이어야 합니다.';
  end if;

  insert into public.groups (name, password_hash, created_by)
  values (v_name, crypt(p_password, gen_salt('bf')), auth.uid())
  returning groups.id into v_group_id;

  insert into public.group_members (group_id, user_id)
  values (v_group_id, auth.uid());

  return query select v_group_id, v_name;
exception
  when unique_violation then
    raise exception '이미 존재하는 그룹 이름입니다.';
end;
$$;
grant execute on function public.create_group(text, text) to authenticated;

create or replace function public.join_group(p_name text, p_password text)
returns table (id uuid, name text)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_group record;
begin
  select g.id, g.name, g.password_hash into v_group
  from public.groups g
  where lower(g.name) = lower(trim(p_name));

  if not found then
    raise exception '그룹을 찾을 수 없습니다.';
  end if;

  if v_group.password_hash <> crypt(p_password, v_group.password_hash) then
    raise exception '비밀번호가 일치하지 않습니다.';
  end if;

  insert into public.group_members (group_id, user_id)
  values (v_group.id, auth.uid())
  on conflict do nothing;

  return query select v_group.id, v_group.name;
end;
$$;
grant execute on function public.join_group(text, text) to authenticated;

create or replace function public.list_my_groups()
returns table (id uuid, name text, created_at timestamptz, member_count bigint, is_owner boolean)
language sql
stable
security definer
set search_path = public
as $$
  select
    g.id,
    g.name,
    g.created_at,
    (select count(*) from public.group_members gm2 where gm2.group_id = g.id) as member_count,
    g.created_by = auth.uid() as is_owner
  from public.groups g
  join public.group_members gm on gm.group_id = g.id
  where gm.user_id = auth.uid()
  order by g.created_at desc;
$$;
grant execute on function public.list_my_groups() to authenticated;

create or replace function public.list_all_groups()
returns table (id uuid, name text, member_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    g.id,
    g.name,
    (select count(*) from public.group_members gm where gm.group_id = g.id) as member_count
  from public.groups g
  order by g.name asc;
$$;
grant execute on function public.list_all_groups() to authenticated;

create or replace function public.list_group_members(p_group_id uuid)
returns table (user_id uuid, email text, display_name text, joined_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.email, p.display_name, gm.joined_at
  from public.group_members gm
  join public.profiles p on p.id = gm.user_id
  where gm.group_id = p_group_id
    and exists (
      select 1 from public.group_members me
      where me.group_id = p_group_id and me.user_id = auth.uid()
    )
  order by gm.joined_at asc;
$$;
grant execute on function public.list_group_members(uuid) to authenticated;

-- =========================================================
-- 그룹원끼리 서로의 8코어 기록을 볼 수 있도록 daily_records에 정책 추가
-- (기존 "select own records" 정책은 그대로 유지되고, 아래 정책과 OR로 결합됩니다)
-- =========================================================
drop policy if exists "select group members records" on public.daily_records;
create policy "select group members records"
  on public.daily_records for select
  using (
    exists (
      select 1
      from public.group_members gm1
      join public.group_members gm2 on gm1.group_id = gm2.group_id
      where gm1.user_id = auth.uid() and gm2.user_id = daily_records.user_id
    )
  );
