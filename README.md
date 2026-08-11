# 8코어 기록장

애터미 8코어(8가지 성공습관)를 매일 기록하고, 대시보드로 진행 상황을 확인하고, 팀에 공유하는 웹앱입니다.

## 주요 기능

- **구글 로그인**: Supabase Auth의 Google OAuth로 로그인
- **8코어 데일리 기록**: 책 읽기, VOD/세미나 시청, 제품 애용, 사업설명(STP), 소비자 전달, 미팅 참석, 신뢰 쌓기, 체력 관리 8개 항목을 텍스트로 기록
- **대시보드**: 오늘의 진행률, 연속 기록일(streak), 최근 30일 실천/완주일, 항목별 실천 현황
- **히스토리(캘린더)**: 월별 캘린더에서 과거 기록을 조회하고 클릭해서 수정
- **팀 공유**: 하단 [팀에 공유하기] 버튼으로 오늘 기록을 정리된 텍스트로 만들어 모바일 공유창(카톡/밴드 등)으로 보내거나 클립보드에 복사
- **데이터베이스 저장**: Supabase(Postgres) + Row Level Security로 사용자별 기록을 안전하게 저장

## 기술 스택

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth + Postgres DB)

## 처음 설정하기

### 1. Supabase 프로젝트 만들기

1. https://supabase.com 에서 새 프로젝트를 생성합니다.
2. 프로젝트의 **SQL Editor**에서 `supabase/schema.sql` 파일 내용을 실행해 `daily_records` 테이블과 보안 정책(RLS)을 생성합니다.
3. **Project Settings → API**에서 `Project URL`과 `anon public key`를 복사합니다.

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
  components/              Navbar, RecordForm, ShareButton
  lib/
    core-items.ts          8코어 항목 정의
    stats.ts                streak/완주율 계산
    supabase/               Supabase client/server/middleware 헬퍼
supabase/schema.sql        DB 테이블 및 RLS 정책
```
