-- 그룹 나가기 / 삭제 / 이름 변경 기능 추가 스키마
-- 이미 schema.sql, schema_groups.sql을 실행한 프로젝트에 추가로 실행하세요.
-- Supabase SQL Editor에서 실행하세요.

-- 그룹장(개설자)은 나가기가 아닌 삭제만 가능합니다.
create or replace function public.leave_group(p_group_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_created_by uuid;
begin
  select created_by into v_created_by
  from public.groups
  where id = p_group_id;

  if not found then
    raise exception '그룹을 찾을 수 없습니다.';
  end if;

  if v_created_by = auth.uid() then
    raise exception '그룹장은 나가기 대신 그룹 삭제를 이용해주세요.';
  end if;

  delete from public.group_members
  where group_id = p_group_id and user_id = auth.uid();

  if not found then
    raise exception '해당 그룹의 멤버가 아닙니다.';
  end if;
end;
$$;
grant execute on function public.leave_group(uuid) to authenticated;

-- 그룹장만 그룹을 삭제할 수 있습니다. (멤버십/기록 공유는 cascade로 함께 정리됩니다)
create or replace function public.delete_group(p_group_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_created_by uuid;
begin
  select created_by into v_created_by
  from public.groups
  where id = p_group_id;

  if not found then
    raise exception '그룹을 찾을 수 없습니다.';
  end if;

  if v_created_by <> auth.uid() then
    raise exception '그룹장만 그룹을 삭제할 수 있습니다.';
  end if;

  delete from public.groups where id = p_group_id;
end;
$$;
grant execute on function public.delete_group(uuid) to authenticated;

-- 그룹장만 그룹 이름을 변경할 수 있습니다.
create or replace function public.rename_group(p_group_id uuid, p_new_name text)
returns table (id uuid, name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_created_by uuid;
  v_name text := trim(p_new_name);
begin
  select created_by into v_created_by
  from public.groups
  where id = p_group_id;

  if not found then
    raise exception '그룹을 찾을 수 없습니다.';
  end if;

  if v_created_by <> auth.uid() then
    raise exception '그룹장만 그룹 이름을 변경할 수 있습니다.';
  end if;

  if v_name is null or length(v_name) = 0 then
    raise exception '그룹 이름을 입력해주세요.';
  end if;

  update public.groups g
  set name = v_name
  where g.id = p_group_id;

  return query select p_group_id, v_name;
exception
  when unique_violation then
    raise exception '이미 존재하는 그룹 이름입니다.';
end;
$$;
grant execute on function public.rename_group(uuid, text) to authenticated;
