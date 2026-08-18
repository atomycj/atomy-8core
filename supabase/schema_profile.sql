-- 프로필(표시 이름/사진) 수정 기능 추가 스키마
-- supabase/schema.sql, supabase/schema_groups.sql을 이미 실행한 프로젝트에
-- 추가로 실행하세요. Supabase SQL Editor에서 실행하세요.

-- =========================================================
-- profiles.avatar_url
-- =========================================================
alter table public.profiles add column if not exists avatar_url text;

-- 본인 프로필(표시 이름/사진)은 본인이 수정할 수 있도록 허용합니다.
-- can_create_groups / email은 아래 트리거로 관리자만 바꿀 수 있게 보호합니다.
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.can_create_groups := old.can_create_groups;
    new.email := old.email;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_fields on public.profiles;
create trigger trg_protect_profile_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- =========================================================
-- avatars 스토리지 버킷: 사용자당 자신의 폴더(user_id/...)에만 업로드 가능,
-- 이미지는 공개적으로 조회 가능(그룹원에게 프로필 사진을 보여주기 위함)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatar images are publicly accessible" on storage.objects;
create policy "avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "users can upload their own avatar" on storage.objects;
create policy "users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users can update their own avatar" on storage.objects;
create policy "users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users can delete their own avatar" on storage.objects;
create policy "users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
