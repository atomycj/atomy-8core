-- 8코어 항목 변경: "체력 관리(health)" -> "스폰서 상담(sponsor_consultation)"
-- 이미 schema.sql을 실행한 프로젝트에 추가로 실행하세요. (기존 데이터는 보존됩니다)
-- Supabase SQL Editor에서 실행하세요.

alter table public.daily_records
  rename column health to sponsor_consultation;
