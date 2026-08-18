import type { Locale } from "./i18n/locale";

export type CoreItemKey =
  | "reading"
  | "media"
  | "meeting"
  | "product_use"
  | "stp"
  | "delivery"
  | "sponsor_consultation"
  | "trust";

export interface CoreItemDef {
  key: CoreItemKey;
  order: number;
  emoji: string;
  label: Record<Locale, string>;
  description: Record<Locale, string>;
}

export const CORE_ITEMS: CoreItemDef[] = [
  {
    key: "reading",
    order: 1,
    emoji: "📖",
    label: { ko: "책읽기", en: "Reading" },
    description: {
      ko: "매일 15분 이상 책읽기 (책 선택하는데 도움이 필요하시면 공지에 추천도서 목록이 있습니다)",
      en: "Read for at least 15 minutes every day (check the notice board for a recommended reading list if you need help choosing a book)",
    },
  },
  {
    key: "media",
    order: 2,
    emoji: "🎬",
    label: { ko: "VOD 시청", en: "Watching Videos" },
    description: {
      ko: "성공자를 내 곁에 항상 둬라 (매일 한 개 이상 시청하기 - YouTube, Zoom, Challen Atomy 등등)",
      en: "Always keep successful people close to you (watch at least one video a day - YouTube, Zoom, Challenge Atomy, etc.)",
    },
  },
  {
    key: "meeting",
    order: 3,
    emoji: "🤝",
    label: { ko: "미팅 참석", en: "Attend Meetings" },
    description: {
      ko: "센터미팅, 정규 팀미팅, 한국zoom미팅, 지사의 One Day Seminar / Success Academy 포함",
      en: "Includes center meetings, regular team meetings, Korea Zoom meetings, and the branch's One Day Seminar / Success Academy",
    },
  },
  {
    key: "product_use",
    order: 4,
    emoji: "🛍️",
    label: { ko: "제품 애용", en: "Use the Products" },
    description: {
      ko: "성공의 도구를 사랑하라 (매일 10종류 이상의 제품을 애용)",
      en: "Love the tools of success (use 10 or more types of products every day)",
    },
  },
  {
    key: "stp",
    order: 5,
    emoji: "💼",
    label: { ko: "STP (Show The Plan)", en: "STP (Show The Plan)" },
    description: {
      ko: "자신 있고 당당하게 말하라",
      en: "Speak with confidence and conviction",
    },
  },
  {
    key: "delivery",
    order: 6,
    emoji: "📦",
    label: { ko: "소비자 전달", en: "Talk to Consumers" },
    description: {
      ko: "어떻게 알릴까가 아니라 왜 필요한지 설명하라 (감동받은 제품 전달하기)",
      en: "Explain why it's needed, not just how to tell them (deliver a product that moved you)",
    },
  },
  {
    key: "sponsor_consultation",
    order: 7,
    emoji: "☎️",
    label: { ko: "스폰서 상담", en: "Sponsor Consultation" },
    description: {
      ko: "안부전화도 상담이다",
      en: "Even a call to check in counts as a consultation",
    },
  },
  {
    key: "trust",
    order: 8,
    emoji: "🫱",
    label: { ko: "신뢰 쌓기", en: "Build Trust" },
    description: {
      ko: "미인대칭 (매일 미소짓고 인사하고 대화하고 칭찬하기), 비비불금 (비난, 비평, 불만 금지)",
      en: "Smile, greet, converse, and compliment every day - and no criticizing, no bad-mouthing, no complaining",
    },
  },
];

export function getCoreItem(key: CoreItemKey): CoreItemDef {
  const item = CORE_ITEMS.find((i) => i.key === key);
  if (!item) throw new Error(`Unknown core item: ${key}`);
  return item;
}
