# 8코어 기록장

애터미 8코어(8가지 성공습관)를 매일 기록하고, 대시보드로 진행 상황을 확인하고, 팀에 공유하는 웹앱입니다.

## 주요 기능

- **구글 로그인**: Supabase Auth의 Google OAuth로 로그인
- **8코어 데일리 기록**: 책 읽기, VOD/세미나 시청, 제품 애용, 사업설명(STP), 소비자 전달, 미팅 참석, 신뢰 쌓기, 체력 관리 8개 항목을 텍스트로 기록
- **대시보드**: 일간/주간/월간 뷰 전환. 일간은 오늘의 상세 기록, 주간은 항목×요일 히트맵, 월간은 캘린더+통계
- **히스토리(캘린더)**: 월별 캘린더에서 과거 기록을 조회하고 클릭해서 수정
- **팀 공유**: 하단 [팀에 공유하기] 버튼으로 오늘 기록을 정리된 텍스트로 만들어 모바일 공유창(카톡/밴드 등)으로 보내거나 클립보드에 복사
- **그룹**: 비밀번호로 그룹을 만들고 참여해서, 같은 그룹 멤버끼리 서로의 8코어 기록을 조회 (그룹도 일간/주간/월간 뷰 지원)
- **관리자**: `atomycj@gmail.com` 계정이 사용자별로 그룹 생성 권한을 지정 (`/admin`)
- **프로필 수정**: 표시 이름과 프로필 사진을 직접 설정 (`/profile`)
- **사용법 안내**: 앱 기능을 소개하는 온보딩 페이지 (`/onboarding`), 최초 로그인 시 자동 진입, 헤더의 "사용법" 메뉴로 언제든 다시 확인 가능
- **데이터베이스 저장**: Supabase(Postgres) + Row Level Security로 사용자별 기록을 안전하게 저장

## 기술 스택

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth + Postgres DB)

## 처음 설정하기

### 1. Supabase 프로젝트 만들기

1. https://supabase.com 에서 새 프로젝트를 생성합니다.
2. 프로젝트의 **SQL Editor**에서 `supabase/schema.sql` 파일 내용을 실행해 `daily_records` 테이블과 보안 정책(RLS)을 생성합니다.
3. 이어서 같은 SQL Editor에서 `supabase/schema_groups.sql` 내용을 실행합니다. 그룹/멤버십 테이블, 관리자·그룹 생성 권한 로직, 그룹원 간 기록 공유를 위한 RLS 정책이 추가됩니다.
   - 관리자 이메일은 `atomycj@gmail.com`으로 하드코딩되어 있습니다. 다른 이메일로 바꾸려면 `schema_groups.sql` 안의 `'atomycj@gmail.com'` 문자열과 `src/lib/admin.ts`의 `ADMIN_EMAIL`을 함께 수정하세요.
4. 이어서 `supabase/schema_profile.sql`을 실행합니다. 프로필 사진/이름을 본인이 수정할 수 있는 권한과, 프로필 사진을 저장할 `avatars` 스토리지 버킷·정책이 추가됩니다.
5. 이어서 `supabase/schema_group_management.sql`을 실행합니다. 그룹 나가기/삭제/이름 변경 RPC 함수가 추가됩니다 (삭제·이름 변경은 그룹장만 가능).
6. 이어서 `supabase/schema_onboarding.sql`을 실행합니다. 최초 로그인 시 온보딩 페이지로 보내기 위한 `profiles.onboarding_seen` 컬럼이 추가됩니다 (이미 가입된 사용자는 자동으로 "이미 봄" 처리됩니다).
7. 이어서 `supabase/schema_fix_group_records_rls.sql`을 실행합니다. 그룹원끼리 서로의 기록이 보이지 않던 RLS 버그 수정입니다 (`schema_groups.sql`을 먼저 실행한 프로젝트라면 꼭 실행하세요. 이 저장소를 새로 클론해서 schema_groups.sql을 이미 수정된 최신 버전으로 실행한다면 이 단계는 필요 없습니다).
8. **Project Settings → API**에서 `Project URL`과 `anon public key`를 복사합니다.

### 2. 구글 로그인(OAuth) 연동

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 에서 OAuth 2.0 클라이언트 ID를 생성합니다(유형: 웹 애플리케이션).
2. 승인된 리디렉션 URI에 Supabase가 제공하는 콜백 URL을 추가합니다.
   Supabase Dashboard → **Authentication → Providers → Google** 화면에 표시되는
   `https://YOUR_PROJECT.supabase.co/auth/v1/callback` 을 그대로 등록하면 됩니다.
3. 생성된 Client ID / Client Secret을 Supabase의 Google Provider 설정에 입력하고 활성화합니다.
4. Supabase Dashboard → **Authentication → URL Configuration**의 `Redirect URLs`에
   개발 환경 `http://localhost:3000/auth/callback` 과 배포 도메인의
   `https://your-domain.com/auth/callback` 을 추가합니다.

### 3. 환경변수 설정

`.env.local.example`을 복사해 `.env.local`을 만들고 값을 채워주세요.

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000 접속 → 구글 로그인 → 오늘 기록 작성

## 배포

Vercel 등에 배포 시, 위 두 개의 환경변수를 프로젝트 설정에 등록하고
Supabase의 Redirect URLs에 배포 도메인의 `/auth/callback`을 추가해주세요.

## 폴더 구조

```
src/
  app/
    login/                구글 로그인 페이지
    auth/callback, signout  OAuth 콜백 / 로그아웃 라우트
    (app)/
      dashboard/           대시보드
      record/[date]/       날짜별 기록 작성·수정
      history/             월별 캘린더 히스토리
      groups/              그룹 목록·생성·참여, 그룹 상세(일간/주간/월간 뷰)
      admin/               관리자 전용: 그룹 생성 권한 관리
      profile/             표시 이름·프로필 사진 수정
      onboarding/          사용법 안내(온보딩) 페이지, 최초 로그인 시 자동 진입
      guide/               8코어 성공습관 가이드
  components/
    dashboard/             PersonalDayView, PersonalWeekView, PersonalMonthView, GroupWeekView, GroupMonthView
    Navbar, RecordForm, ShareButton, GroupForms, GroupMemberCard, AdminUserRow, ProfileForm, ViewTabs, ViewNavHeader
  lib/
    core-items.ts          8코어 항목 정의
    stats.ts                streak/완주율 계산
    view-nav.ts             일간/주간/월간 뷰 날짜 계산 유틸
    admin.ts                관리자 이메일 상수
    profile.ts              표시 이름/아바타 조회 헬퍼
    supabase/               Supabase client/server/middleware 헬퍼
supabase/schema.sql         DB 테이블 및 RLS 정책 (daily_records)
supabase/schema_groups.sql  그룹/관리자 기능 스키마 (profiles, groups, group_members, RPC)
supabase/schema_profile.sql 프로필 수정 권한 + avatars 스토리지 버킷/정책
supabase/schema_group_management.sql  그룹 나가기/삭제/이름 변경 RPC (삭제·이름 변경은 그룹장 전용)
supabase/schema_onboarding.sql  최초 로그인 온보딩용 profiles.onboarding_seen 컬럼
supabase/schema_fix_group_records_rls.sql  그룹원 기록이 안 보이던 RLS 버그 수정
```
