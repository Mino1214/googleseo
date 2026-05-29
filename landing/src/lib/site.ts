function trimUrl(url: string) {
  return url.replace(/\/$/, "");
}

export const SITE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL?.trim()) ?
    trimUrl(process.env.NEXT_PUBLIC_SITE_URL.trim())
  : "http://localhost:3015";

/** 홈 페이지 `<title>` 앞쪽에 들어가는 이름 (예: 상호 또는 서비스명) */
export const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "판도라Ads";

/**
 * 검색 결과 스니펫에 쓰이는 요약입니다.
 * 사실만 짧게 쓰고, 과장·미끄러운 표현은 피합니다.
 */
export const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION?.trim() ||
  "토토·카지노·슬롯·바카라·프라그마틱·에볼루션·파워볼 관련 사이트 정보를 모아 둔 광고 페이지입니다.";

/** `meta keywords`는 검색엔진 가중치가 낮지만, 간단히 주제만 적습니다 (쉼표로 나열). 비우면 출력하지 않습니다. */
export const SITE_KEYWORDS = (process.env.NEXT_PUBLIC_KEYWORDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/** 메인 페이지 기본 키워드(환경변수 없을 때만 사용) */
export const DEFAULT_KEYWORDS: string[] = [
  "토토사이트",
  "토토 사이트",
  "토토사이트추천",
  "토토사이트 추천",
  "토토 사이트추천",
  "토토 사이트 추천",
  "카지노사이트",
  "카지노 사이트",
  "카지노사이트추천",
  "카지노사이트 추천",
  "카지노 사이트추천",
  "카지노 사이트 추천",
  "슬롯사이트",
  "슬롯 사이트",
  "슬롯사이트추천",
  "슬롯사이트 추천",
  "슬롯 사이트추천",
  "슬롯 사이트 추천",
  "바카라사이트",
  "바카라 사이트",
  "바카라사이트추천",
  "바카라사이트 추천",
  "바카라 사이트추천",
  "바카라 사이트 추천",
  "프라그마틱사이트",
  "프라그마틱 사이트",
  "프라그마틱사이트추천",
  "프라그마틱사이트 추천",
  "프라그마틱 사이트추천",
  "프라그마틱 사이트 추천",
  "에볼루션사이트",
  "에볼루션 사이트",
  "에볼루션사이트추천",
  "에볼루션사이트 추천",
  "에볼루션 사이트추천",
  "에볼루션 사이트 추천",
  "파워볼사이트",
  "파워볼 사이트",
  "파워볼사이트추천",
  "파워볼사이트 추천",
  "파워볼 사이트추천",
  "파워볼 사이트 추천",
];

export const CONTACT_PHONE =
  process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "";

export function absoluteUrl(pathname: string) {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${p}`;
}

function normalizeOutboundUrl(raw: string) {
  const t = raw.trim();
  if (!t) {
    return "";
  }
  if (/^https?:\/\//i.test(t)) {
    return t;
  }
  return `https://${t}`;
}

/** 카드 클릭 시 먼저 시도할 주소 (네트워크 실패 시 `ENTRY_URL_FALLBACK`) */
export const ENTRY_URL_PRIMARY = normalizeOutboundUrl(
  process.env.NEXT_PUBLIC_ENTRY_URL_PRIMARY?.trim() || "https://dopa-02.com",
);

/** 1차 주소 접속 불가 등으로 접기 실패할 때 안내 페이지 */
export const ENTRY_URL_FALLBACK = normalizeOutboundUrl(
  process.env.NEXT_PUBLIC_ENTRY_URL_FALLBACK?.trim() || "https://평생메인.com",
);
