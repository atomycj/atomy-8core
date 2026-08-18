import type { Locale } from "./i18n/locale";

export type CoreItemKey =
  | "reading"
  | "media"
  | "product_use"
  | "stp"
  | "delivery"
  | "meeting"
  | "trust"
  | "health";

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
    label: { ko: "책 읽기", en: "Reading" },
    description: {
      ko: "오늘 읽은 책/내용을 기록하세요",
      en: "Record what you read today",
    },
  },
  {
    key: "media",
    order: 2,
    emoji: "🎬",
    label: { ko: "VOD/세미나 시청", en: "VOD / Seminar" },
    description: {
      ko: "시청한 VOD, 세미나, 강의 내용을 기록하세요",
      en: "Record the VOD, seminar, or lecture you watched",
    },
  },
  {
    key: "product_use",
    order: 3,
    emoji: "🛍️",
    label: { ko: "제품 애용", en: "Product Use" },
    description: {
      ko: "오늘 애용한 제품과 후기를 기록하세요",
      en: "Record the products you used and your review",
    },
  },
  {
    key: "stp",
    order: 4,
    emoji: "💼",
    label: { ko: "사업 설명 (STP)", en: "Business Presentation (STP)" },
    description: {
      ko: "진행한 사업설명(STP) 내용을 기록하세요",
      en: "Record the business presentation (STP) you gave",
    },
  },
  {
    key: "delivery",
    order: 5,
    emoji: "📦",
    label: { ko: "소비자 전달", en: "Delivery" },
    description: {
      ko: "소비자에게 전달한 내용을 기록하세요",
      en: "Record what you delivered to a customer",
    },
  },
  {
    key: "meeting",
    order: 6,
    emoji: "🤝",
    label: { ko: "미팅 참석", en: "Meeting" },
    description: {
      ko: "참석한 미팅/모임을 기록하세요",
      en: "Record the meeting or gathering you attended",
    },
  },
  {
    key: "trust",
    order: 7,
    emoji: "🫱",
    label: { ko: "신뢰 쌓기", en: "Building Trust" },
    description: {
      ko: "신뢰를 쌓기 위한 활동을 기록하세요",
      en: "Record what you did to build trust",
    },
  },
  {
    key: "health",
    order: 8,
    emoji: "💪",
    label: { ko: "체력 관리", en: "Health" },
    description: {
      ko: "오늘의 체력 관리 활동을 기록하세요",
      en: "Record today's health/fitness activity",
    },
  },
];

export function getCoreItem(key: CoreItemKey): CoreItemDef {
  const item = CORE_ITEMS.find((i) => i.key === key);
  if (!item) throw new Error(`Unknown core item: ${key}`);
  return item;
}
