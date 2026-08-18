import Link from "next/link";

const VIDEO_URL = "http://www.youtube.com/watch?v=I3RGK0jnwMo";

function ytLink(seconds: number) {
  return `${VIDEO_URL}&t=${seconds}`;
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
    quote:
      "측정할 수 없으면 관리할 수 없고, 관리할 수 없으면 개선할 수 없다",
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

function formatTimestamp(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function GuidePage() {
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
            href={VIDEO_URL}
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
            href={ytLink(1436)}
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
                  href={ytLink(item.timestamp)}
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
                <p className="text-sm font-semibold text-gray-800">
                  {point.title}
                </p>
                <span className="shrink-0 space-x-2 text-xs text-gray-400">
                  {point.timestamps.map((t) => (
                    <a
                      key={t}
                      href={ytLink(t)}
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
