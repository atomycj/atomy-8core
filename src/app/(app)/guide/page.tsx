import Link from "next/link";
import { getLocale } from "@/lib/i18n/locale";

const KO_VIDEO_URL = "http://www.youtube.com/watch?v=I3RGK0jnwMo";
const EN_VIDEO_URL = "http://www.youtube.com/watch?v=ejpJguAT1kg";

function ytLink(videoUrl: string, seconds: number) {
  return `${videoUrl}&t=${seconds}`;
}

function formatTimestamp(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const CORE_GUIDE_ITEMS = [
  {
    emoji: "📖",
    title: "책 읽기",
    description:
      "하루 15분 이상 자기계발 및 관계 형성 서적 독서 (예: 카네기 인간관계론, 목표 성취 기술 등)",
    timestamp: 1465,
  },
  {
    emoji: "🎬",
    title: "VOD 시청",
    description: "하루 1개 이상 공식 채널 VOD를 시청하며 열정 유지",
    timestamp: 1768,
  },
  {
    emoji: "🤝",
    title: "미팅 참석",
    description: "온·오프라인 미팅 참여를 통해 에너지와 비전 충전",
    timestamp: 1808,
  },
  {
    emoji: "🛍️",
    title: "제품 애용",
    description: "본인이 먼저 제품을 써보고 감동을 축적",
    timestamp: 1821,
  },
  {
    emoji: "💼",
    title: "사업설명 (STP)",
    description: "월 15회 이상 지속적인 비전 전달",
    timestamp: 1843,
  },
  {
    emoji: "📦",
    title: "소비자 전달",
    description: "써본 제품의 감동을 주변에 진정성 있게 전파",
    timestamp: 1893,
  },
  {
    emoji: "☎️",
    title: "상담",
    description: "스폰서-파트너 간 매일 긴밀한 소통과 체크",
    timestamp: 1923,
  },
  {
    emoji: "🫱",
    title: "신뢰 쌓기",
    description: "미소, 인사, 대화, 칭찬, 비난/비평/불평금지 실천",
    timestamp: 1947,
  },
];

const LEADERSHIP_POINTS = [
  {
    title: "행동 관리의 데이터화",
    quote: "측정할 수 없으면 관리할 수 없고, 관리할 수 없으면 개선할 수 없다",
    quoteBy: "피터 드러커",
    description:
      "이 원칙 아래 파트너의 8CORE 체크리스트 작성을 주기적으로 점검 및 지도해야 합니다.",
    timestamps: [1317, 1700],
  },
  {
    title: "관계 갈등 방지",
    description:
      "네트워크 사업의 난관 중 하나인 스폰서-파트너 간 갈등은 카네기 인간관계론의 핵심인 '비난·비평·불평 금지'와 '상대방 중심 대화'를 통해 극복할 수 있습니다.",
    timestamps: [1514, 1519],
  },
  {
    title: "시스템 복제",
    description:
      "나 자신이 리더로서 먼저 8CORE 습관을 완벽히 안착시킨 후, 파트너들에게 동일한 원칙을 지속적으로 복제시키는 것이 무너지지 않는 시스템 소득의 핵심입니다.",
    timestamps: [878, 1229],
  },
];

const EN_HABITS = [
  {
    emoji: "📖",
    title: "Habit 1: Read Books",
    timeRange: "6:36 – 12:36",
    bullets: [
      {
        text: "Success starts with replicating the expert's manual (the 8 Steps to Success & 8CORE) into a daily habit.",
        timestamps: [396, 442],
      },
      {
        text: "Investing 1% of your day (about 15 minutes) in steady reading gives decisive help with mind control, improving relationships, and setting goals.",
        timestamps: [480, 635],
      },
    ],
  },
  {
    emoji: "🎬",
    title: "Habit 2: Watch VODs & the 10,000-Hour Rule",
    timeRange: "12:44 – 16:25",
    bullets: [
      {
        text: "Watching at least one VOD every day steadies a wavering mind and recharges your passion.",
        timestamps: [791],
      },
      {
        text: "Decided to put in 15 hours a day, for a total of 10,000 hours of immersion, to reach an annual income in the hundreds of millions within the first two years.",
        timestamps: [865, 880],
      },
      {
        text: "Took the lead everywhere regardless of place - pushing a 12-month-old baby in a stroller to early-morning bathhouses, street stalls, and more.",
        timestamps: [904, 949],
      },
    ],
  },
  {
    emoji: "🤝",
    title: "Habit 3: Attend Meetings",
    timeRange: "16:41 – 19:36",
    bullets: [
      {
        text: "Making online and offline meeting attendance a habit keeps the business going and keeps you supplied with energy.",
        timestamps: [1035],
      },
      {
        text: "Adapting quickly to the changed, \"ontact\" environment by actively using systems like One Day Seminar and Success Academy.",
        timestamps: [1080, 1134],
      },
    ],
  },
  {
    emoji: "🛍️",
    title: "Habit 4: 100% Product Use (Loyal Consumer)",
    timeRange: "19:36 – 21:46",
    bullets: [
      {
        text: "The only real prerequisite for a distributor is becoming an Atomy \"loyal consumer.\"",
        timestamps: [1193],
      },
      {
        text: "You have to experience the products yourself and feel moved by them before you can deliver them authentically - that's what creates a steady stream of auto-consumers.",
        timestamps: [1231, 1270],
      },
    ],
  },
  {
    emoji: "💼",
    title: "Habit 5: Show the Plan (STP)",
    timeRange: "21:46 – 24:55",
    bullets: [
      {
        text: "Not an intimidating, full-blown lecture - just the habit of sharing Atomy's vision and your own experience with at least one person a day (at minimum, one person every two days), even if it only takes a minute.",
        timestamps: [1329, 1381],
      },
      {
        text: "The \"Law of Just Moving On\": not getting discouraged by rejection - getting rejection out of the way quickly is the shortcut to a successful conversation.",
        timestamps: [1401, 1427],
      },
    ],
  },
  {
    emoji: "📦",
    title: "Habit 6: Share with Consumers",
    timeRange: "24:55 – 28:00",
    bullets: [
      {
        text: "Actively growing the consumer base online and offline - flyers, SNS with auto-translate, interest-based group chats, and more.",
        timestamps: [1533, 1603, 1633],
      },
      {
        text: "A routine of steadily caring for auto-consumers, guiding them through a 1:1 learning process that naturally turns them into distributors.",
        timestamps: [1658, 1664],
      },
    ],
  },
  {
    emoji: "☎️",
    title: "Habit 7: Sponsor Consultation",
    timeRange: "28:00 – 30:06",
    bullets: [
      {
        text: "Consultation is how you grow close with your sponsor and mentor - ongoing communication builds your sense of direction and keeps you motivated.",
        timestamps: [1700, 1762],
      },
    ],
  },
  {
    emoji: "🫱",
    title: "Habit 8: Build Trust & Achieve System Income",
    timeRange: "30:06 – 34:26",
    bullets: [
      {
        text: "The key to speeding up your success is building trust with consumers and partners.",
        timestamps: [1860, 1883],
      },
      {
        text: "The SGTP principle (Smile, Greet, Talk with, Praise) builds rapport and grows relationships.",
        timestamps: [1899],
      },
      {
        text: "Practicing the 8CORE manual (using the life-scenario booklet) builds a powerful \"3RICH system income\" that keeps earning even while you sleep.",
        timestamps: [1978, 2013],
      },
    ],
  },
];

export default async function GuidePage() {
  const locale = await getLocale();

  if (locale === "en") {
    return (
      <div className="space-y-8">
        <div>
          <Link href="/dashboard" className="text-xs text-gray-400 hover:text-gray-600">
            ← Dashboard
          </Link>
          <h1 className="mt-1 text-lg font-bold text-gray-900">
            8 Core Success Habits Guide
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            The 8 daily habits that build a duplicable success system.{" "}
            <a
              href={EN_VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700"
            >
              Watch the original video ↗
            </a>
          </p>
        </div>

        <div className="space-y-4">
          {EN_HABITS.map((habit) => (
            <div
              key={habit.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <span>{habit.emoji}</span>
                  {habit.title}
                </p>
                <span className="text-xs text-gray-400">{habit.timeRange}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {habit.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-600">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-300" />
                    <span>
                      {bullet.text}{" "}
                      <span className="inline-flex gap-1.5 align-middle">
                        {bullet.timestamps.map((t) => (
                          <a
                            key={t}
                            href={ytLink(EN_VIDEO_URL, t)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-brand-600"
                          >
                            {formatTimestamp(t)} ↗
                          </a>
                        ))}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <Link href="/dashboard" className="text-xs text-gray-400 hover:text-gray-600">
          ← 대시보드
        </Link>
        <h1 className="mt-1 text-lg font-bold text-gray-900">
          8코어 성공습관 가이드
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          핵심 실천 행동과 리더십 가이드를 한눈에 확인하세요.{" "}
          <a
            href={KO_VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700"
          >
            원본 영상 보기 ↗
          </a>
        </p>
      </div>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-gray-700">
            ③ 핵심 실천 행동: 8CORE (성공 습관 8가지)
          </h2>
          <a
            href={ytLink(KO_VIDEO_URL, 1436)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-brand-600"
          >
            23:56 ↗
          </a>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
          {CORE_GUIDE_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                    {i + 1}
                  </span>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                    <span>{item.emoji}</span>
                    {item.title}
                  </p>
                </div>
                <a
                  href={ytLink(KO_VIDEO_URL, item.timestamp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-gray-400 hover:text-brand-600"
                >
                  {formatTimestamp(item.timestamp)} ↗
                </a>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700">
          사업적 활용 및 리더십 가이드
        </h2>
        <div className="mt-3 space-y-3">
          {LEADERSHIP_POINTS.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-800">{point.title}</p>
                <span className="shrink-0 space-x-2 text-xs text-gray-400">
                  {point.timestamps.map((t) => (
                    <a
                      key={t}
                      href={ytLink(KO_VIDEO_URL, t)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-600"
                    >
                      {formatTimestamp(t)} ↗
                    </a>
                  ))}
                </span>
              </div>

              {point.quote && (
                <blockquote className="mt-3 rounded-xl border-l-4 border-brand-200 bg-brand-50 px-4 py-3 text-sm italic text-brand-700">
                  &ldquo;{point.quote}&rdquo;
                  <span className="mt-1 block text-xs not-italic text-brand-500">
                    — {point.quoteBy}
                  </span>
                </blockquote>
              )}

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
