-- 버그 수정: 그룹원끼리 서로의 8코어 기록이 보이지 않던 문제
--
-- 원인: daily_records의 "select group members records" 정책이 group_members
-- 테이블을 정책 안에서 직접 조회하는데, group_members에는 select 정책이 없어서
-- (SECURITY DEFINER 함수로만 접근하도록 설계됨) 정책 평가 시 group_members가
-- 항상 빈 테이블처럼 보여 그룹원 조건이 절대 참이 되지 않았습니다.
--
-- 이미 schema_groups.sql을 실행한 프로젝트에 추가로 실행하세요.
-- Supabase SQL Editor에서 실행하세요.

create or replace function public.shares_group_with(p_other_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.group_members gm1
    join public.group_members gm2 on gm1.group_id = gm2.group_id
    where gm1.user_id = auth.uid() and gm2.user_id = p_other_user
  );
$$;
grant execute on function public.shares_group_with(uuid) to authenticated;

drop policy if exists "select group members records" on public.daily_records;
create policy "select group members records"
  on public.daily_records for select
  using (public.shares_group_with(daily_records.user_id));
