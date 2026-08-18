-- 최초 로그인 시 사용법 안내(온보딩) 페이지로 이동시키기 위한 스키마
-- 이미 schema.sql, schema_groups.sql, schema_profile.sql을 실행한 프로젝트에 추가로 실행하세요.
-- Supabase SQL Editor에서 실행하세요.

alter table public.profiles
  add column if not exists onboarding_seen boolean not null default false;

-- 이미 가입되어 있던 사용자는 새삼스레 온보딩을 보지 않도록 처리합니다.
update public.profiles set onboarding_seen = true where onboarding_seen = false;

-- profiles의 "update own profile" 정책(schema_profile.sql)이 이미 본인 행 수정을 허용하므로
-- onboarding_seen 갱신에는 별도 정책이 필요 없습니다.
