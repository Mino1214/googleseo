import type { Metadata } from "next";
import Link from "next/link";
import { HomeScrollLock } from "@/components/home-scroll-lock";
import { DEFAULT_KEYWORDS, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `토토사이트 - 업종 1위 [${SITE_NAME}]`,
  description: SITE_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

/**
 * kinglepoint.com HTML 스냅샷: `public/copied/copied.html`
 * - 루트 상대 `src`/`href`는 `https://kinglepoint.com/…` 로 치환됨.
 * - 번들 `<link rel="stylesheet">`의 `crossorigin` 제거: localhost 문서에서 크로스 오리진 CORS 없이 CSS가 막히는 경우 방지.
 * - `<main id="main">` 랜드마크 안에 iframe. `fixed`+`100dvh` 조합은 모바일 뷰포트와 어긋나 틈·이중 스크롤이 나기 쉬워,
 *   고정 래퍼는 `inset-0`만 쓰고 iframe은 `absolute inset-0`으로 꽉 채움.
 */
export default function HomePage() {
  return (
    <>
      <HomeScrollLock />
      <nav className="sr-only" aria-label="내부 메뉴">
        <ul>
          <li>
            <Link href="/sites">사이트 리스트</Link>
          </li>
          <li>
            <Link href="/browse">구경하기</Link>
          </li>
          <li>
            <Link href="/media">미디어</Link>
          </li>
        </ul>
      </nav>
      <div className="fixed inset-0 z-0 overflow-hidden bg-white">
        <main
          id="main"
          tabIndex={-1}
          className="relative isolate h-full min-h-0 w-full outline-none"
          aria-label={`${SITE_NAME} 메인 콘텐츠`}
        >
          <iframe
            title={`${SITE_NAME} 메인`}
            src="/copied/copied.html"
            className="absolute inset-0 block size-full min-h-0 border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </main>
      </div>
    </>
  );
}
