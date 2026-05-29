export type MediaItem = {
  kind?: "image" | "video";
  /** `public/` 기준 경로 */
  src: string;
  /** 이미지·영상 썸네일에 무엇이 보이는지 한국어로 짧게 */
  alt: string;
  caption?: string;
  href?: string;
};

/**
 * 파일은 `apps/landing/public/media/` 에 두고, 아래 배열 순서가 화면 순서입니다.
 * (팝업 JPG → 기타 캡처 → 배너 자산)
 */
export const mediaItems: MediaItem[] = [
  {
    src: "/media/popup-overview-main-bonus-dividend-events.jpg",
    alt: "메인·보너스·배당·이벤트 안내 팝업 01~10 요약 화면",
    caption: "팝업 번호 가이드",
  },
  {
    src: "/media/popup-01-main-new-register.jpg",
    alt: "메인 신규 가입(입플) 이벤트 팝업",
    caption: "01 신규 입플",
  },
  {
    src: "/media/popup-02-main-first-deposit.jpg",
    alt: "메인 첫 충전 이벤트 팝업",
    caption: "02 첫 충전",
  },
  {
    src: "/media/popup-03-main-flash-event.jpg",
    alt: "메인 돌발 이벤트 팝업",
    caption: "03 돌발 이벤트",
  },
  {
    src: "/media/popup-05-main-new-settle-event.jpg",
    alt: "메인 신규 정착 이벤트 팝업",
    caption: "05 신규 정착",
  },
  {
    src: "/media/popup-06-main-level-comp.jpg",
    alt: "메인 레벨 및 콤프 혜택 안내 팝업",
    caption: "06 레벨·콤프",
  },
  {
    src: "/media/popup-07-main-referral-event.jpg",
    alt: "메인 지인 추천 이벤트 팝업",
    caption: "07 지인 추천",
  },
  {
    src: "/media/popup-08-main-daily-stack-event.jpg",
    alt: "메인 일일 누적 이벤트 팝업",
    caption: "08 일일 누적",
  },
  {
    src: "/media/popup-09-main-attendance-event.jpg",
    alt: "메인 출석 체크 이벤트 팝업",
    caption: "09 출석 체크",
  },
  {
    src: "/media/popup-10-main-return-event.jpg",
    alt: "메인 복귀 이벤트 팝업",
    caption: "10 복귀 이벤트",
  },
  {
    src: "/media/misc-screenshot-20260504.jpg",
    alt: "서비스 화면 참고 이미지",
    caption: "기타 화면 캡처",
  },
  {
    src: "/media/banner.png",
    alt: "정적 배너 이미지",
    caption: "배너 이미지",
    href: "https://t.me/nimo7788",
  },
  {
    kind: "video",
    src: "/media/banner-hades.mp4",
    alt: "Hades 테마 배너 동영상",
    caption: "배너 영상 · Hades",
  },
  {
    kind: "video",
    src: "/media/banner-1200x675.mp4",
    alt: "가로형 배너(1200×675) 동영상",
    caption: "배너 영상 · 1200×675",
  },
];
