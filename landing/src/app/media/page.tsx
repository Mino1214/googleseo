import type { Metadata } from "next";
import { MediaCard } from "@/components/MediaCard";
import { OutboundHrefProvider } from "@/components/OutboundLink";
import { PopupNumberStrip } from "@/components/PopupNumberStrip";
import { mediaItems, type MediaItem } from "@/lib/media";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `미디어 | ${SITE_NAME}`,
  alternates: { canonical: "/media" },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

function popupNumber(item: MediaItem) {
  return Number(item.src.match(/popup-(\d+)-/i)?.[1] ?? Number.POSITIVE_INFINITY);
}

const popupItems = mediaItems
  .filter((item) => /\/media\/popup-\d+-/i.test(item.src))
  .sort((a, b) => popupNumber(a) - popupNumber(b));
const leftPopupItems = popupItems.slice(0, Math.ceil(popupItems.length / 2));
const rightPopupItems = popupItems.slice(Math.ceil(popupItems.length / 2));

const wideVideo = mediaItems.find((item) => item.src === "/media/banner-1200x675.mp4");
const hadesVideo = mediaItems.find((item) => item.src === "/media/banner-hades.mp4");
const miscItem = mediaItems.find(
  (item) => item.src === "/media/misc-screenshot-20260504.jpg",
);
const bannerItem = mediaItems.find((item) => item.src === "/media/banner.png");

const repeatedWideVideos =
  wideVideo ? Array.from({ length: 4 }, (_, index) => ({ key: `wide-${index}`, item: wideVideo })) : [];
const repeatedHadesVideos =
  hadesVideo ?
    Array.from({ length: 4 }, (_, index) => ({ key: `hades-${index}`, item: hadesVideo }))
  : [];

function DesktopPopupRail({ items }: { items: readonly MediaItem[] }) {
  return (
    <div className="hidden xl:flex xl:w-[11.25rem] xl:flex-col xl:gap-0">
      {items.map((item) => (
        <MediaCard
          key={item.src}
          item={item}
          dense
          className="block overflow-hidden bg-black outline-offset-2 transition-opacity hover:opacity-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-cyan-400/80"
          slotClassName="aspect-[9/16] w-full overflow-hidden bg-black"
          mediaClassName="h-full w-full object-contain"
        />
      ))}
    </div>
  );
}

function VideoGrid({
  items,
  columnsClassName,
  slotClassName,
}: {
  items: ReadonlyArray<{ key: string; item: (typeof mediaItems)[number] }>;
  columnsClassName: string;
  slotClassName: string;
}) {
  return (
    <div className={`grid gap-0 ${columnsClassName}`}>
      {items.map(({ key, item }) => (
        <MediaCard
          key={key}
          item={item}
          dense
          className="block overflow-hidden bg-black outline-offset-2 transition-opacity hover:opacity-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-cyan-400/80"
          slotClassName={slotClassName}
          mediaClassName="h-full w-full object-contain"
        />
      ))}
    </div>
  );
}

export default function MediaPage() {
  return (
    <OutboundHrefProvider>
      <main id="main" className="mx-auto max-w-[82rem] px-0 py-0 sm:px-2 sm:py-2">
        <section aria-labelledby="media-heading">
          <h1 className="sr-only">미디어</h1>
          <h2 id="media-heading" className="sr-only">
            미디어 목록
          </h2>

          <div className="mx-auto flex max-w-[82rem] items-start justify-center gap-0 xl:gap-2">
            <DesktopPopupRail items={leftPopupItems} />

            <div className="min-w-0 flex-1 max-w-[52rem]">
              <div className="space-y-0">
                <VideoGrid
                  items={repeatedWideVideos}
                  columnsClassName="grid-cols-1 sm:grid-cols-2"
                  slotClassName="aspect-[16/9] w-full overflow-hidden bg-black"
                />
                <VideoGrid
                  items={repeatedHadesVideos}
                  columnsClassName="grid-cols-1 sm:grid-cols-2"
                  slotClassName="aspect-[3/1] w-full overflow-hidden bg-black"
                />

                {miscItem ?
                  <MediaCard
                    item={miscItem}
                    dense
                    className="block overflow-hidden bg-black outline-offset-2 transition-opacity hover:opacity-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-cyan-400/80"
                    slotClassName="aspect-[1280/1007] w-full overflow-hidden bg-black"
                    mediaClassName="h-full w-full object-contain"
                  />
                : null}

                {bannerItem ?
                  <MediaCard
                    item={bannerItem}
                    dense
                    className="block overflow-hidden bg-black outline-offset-2 transition-opacity hover:opacity-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-cyan-400/80"
                    slotClassName="aspect-[18/11] w-full overflow-hidden bg-black"
                    mediaClassName="h-full w-full object-contain"
                  />
                : null}
              </div>
            </div>

            <DesktopPopupRail items={rightPopupItems} />
          </div>
        </section>
      </main>

      <div className="xl:hidden">
        <PopupNumberStrip items={popupItems} />
      </div>
    </OutboundHrefProvider>
  );
}
