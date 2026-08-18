import Image from "next/image";
import Link from "next/link";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { completeOnboardingAction } from "./actions";

const KO_STEPS = [
  {
    emoji: "🌐",
    title: "언어 전환",
    description:
      "화면 오른쪽 위 \"한 / EN\" 버튼으로 언제든지 한국어와 영어를 전환할 수 있어요.",
  },
  {
    emoji: "📊",
    title: "대시보드",
    description:
      "오늘의 진행률과 연속 기록일을 확인하고, 일간·주간·월간 뷰로 전환해서 볼 수 있어요. 다른 날짜를 보고 있을 땐 \"오늘\" 버튼으로 바로 돌아올 수 있습니다.",
  },
  {
    emoji: "✍️",
    title: "오늘 기록 작성",
    description:
      "8코어 항목을 매일 작성하고 저장하세요. \"팀에 공유하기\" 버튼을 누르면 카톡, 밴드 등으로 바로 붙여넣을 수 있는 정리된 텍스트가 만들어져요.",
  },
  {
    emoji: "🗓️",
    title: "히스토리",
    description: "캘린더에서 과거 날짜를 클릭하면 그날의 기록을 다시 보거나 수정할 수 있어요.",
  },
  {
    emoji: "👥",
    title: "그룹",
    description:
      "팀원들과 그룹을 만들거나(권한이 있는 경우) 비밀번호로 참여해서, 그룹원들의 8코어 기록을 함께 확인하세요. 그룹장은 그룹 이름 변경·삭제도 할 수 있어요.",
  },
  {
    emoji: "🙋",
    title: "프로필",
    description: "오른쪽 위 내 이름/사진을 클릭하면 표시 이름과 프로필 사진을 바꿀 수 있어요.",
  },
  {
    emoji: "📖",
    title: "8코어 가이드",
    description: "헤더의 \"가이드\" 메뉴에서 8코어 성공습관에 대한 자세한 설명을 확인할 수 있어요.",
  },
];

const EN_STEPS = [
  {
    emoji: "🌐",
    title: "Switch Language",
    description:
      "Use the \"한 / EN\" toggle in the top-right corner to switch between Korean and English anytime.",
  },
  {
    emoji: "📊",
    title: "Dashboard",
    description:
      "Check today's progress and your current streak, and switch between Day, Week, and Month views. When viewing a different date, a \"Today\" link appears to jump straight back.",
  },
  {
    emoji: "✍️",
    title: "Record Today",
    description:
      "Fill in and save your 8 Core items every day. The \"Share with team\" button turns today's entry into ready-to-paste text for KakaoTalk, Band, or any messenger.",
  },
  {
    emoji: "🗓️",
    title: "History",
    description: "Click any date on the calendar to view or edit that day's record.",
  },
  {
    emoji: "👥",
    title: "Groups",
    description:
      "Create a group (if you have permission) or join one with its password to see your teammates' 8 Core records together. Group owners can also rename or delete the group.",
  },
  {
    emoji: "🙋",
    title: "Profile",
    description: "Click your name or photo in the top-right corner to change your display name and profile photo.",
  },
  {
    emoji: "📖",
    title: "8 Core Guide",
    description: "The \"Guide\" menu in the header has a detailed walkthrough of the 8 Core success habits.",
  },
];

export default async function OnboardingPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const steps = locale === "en" ? EN_STEPS : KO_STEPS;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-brand-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex justify-center">
          <Image
            src="/logo-nav.png"
            alt={dict.appName}
            width={266}
            height={160}
            priority
            className="h-14 w-auto"
          />
        </div>
        <h1 className="text-xl font-bold text-gray-900">{dict.appName}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {locale === "en"
            ? "Welcome! Here's a quick look at what you can do."
            : "환영합니다! 앱에서 할 수 있는 것들을 간단히 소개할게요."}
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
              {i + 1}
            </span>
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                <span>{step.emoji}</span>
                {step.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form action={completeOnboardingAction} className="flex justify-center">
        <button
          type="submit"
          className="rounded-xl bg-brand-500 px-8 py-3 text-sm font-semibold text-white hover:bg-brand-600"
        >
          {locale === "en" ? "Get Started" : "시작하기"}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400">
        {locale === "en" ? (
          <>You can revisit this page anytime from the </>
        ) : (
          <>이 페이지는 헤더의 </>
        )}
        <Link href="/onboarding" className="font-medium text-brand-600 hover:underline">
          {dict.nav.help}
        </Link>
        {locale === "en" ? <> link in the header.</> : <> 메뉴에서 언제든 다시 볼 수 있어요.</>}
      </p>
    </div>
  );
}
