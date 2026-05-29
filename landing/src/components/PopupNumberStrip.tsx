"use client";

import type { MediaItem } from "@/lib/media";
import { useEffect, useMemo, useState } from "react";

const popupNumbers = Array.from({ length: 10 }, (_, index) => index + 1);
const HIDE_FOR_DAY_KEY = "landing-mobile-popups-hide-until";

function parsePopupNumber(item: MediaItem) {
  const match = item.src.match(/popup-(\d+)-/i);
  if (!match) {
    return null;
  }
  return Number(match[1]);
}

export function PopupNumberStrip({
  items,
  numbers = popupNumbers,
}: {
  items: readonly MediaItem[];
  numbers?: readonly number[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hideUntil, setHideUntil] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const popupMap = useMemo(() => {
    const map = new Map<number, MediaItem>();
    for (const item of items) {
      const popupNumber = parsePopupNumber(item);
      if (popupNumber !== null) {
        map.set(popupNumber, item);
      }
    }
    return map;
  }, [items]);

  const orderedItems = useMemo(
    () =>
      numbers
        .map((number) => popupMap.get(number))
        .filter((item): item is MediaItem => item !== undefined),
    [numbers, popupMap],
  );
  const hideAllForDay = hideUntil !== null && hideUntil > Date.now();
  const activeItem = !isHydrated || hideAllForDay ? null : (orderedItems[activeIndex] ?? null);

  useEffect(() => {
    const raw = window.localStorage.getItem(HIDE_FOR_DAY_KEY);
    if (raw) {
      const storedUntil = Number(raw);
      if (Number.isFinite(storedUntil) && storedUntil > Date.now()) {
        setHideUntil(storedUntil);
      } else {
        window.localStorage.removeItem(HIDE_FOR_DAY_KEY);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!activeItem) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex((current) => current + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem]);

  function closeCurrentPopup() {
    setActiveIndex((current) => current + 1);
  }

  function hidePopupsForDay() {
    const nextHideUntil = Date.now() + 24 * 60 * 60 * 1000;
    window.localStorage.setItem(HIDE_FOR_DAY_KEY, String(nextHideUntil));
    setHideUntil(nextHideUntil);
  }

  if (!activeItem) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-[2px]">
      <div className="flex min-h-full items-start justify-center pt-8">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.alt}
          className="w-full max-w-[23rem] overflow-hidden rounded-lg border border-white/10 bg-[#111216] shadow-[0_28px_80px_rgba(0,0,0,0.55)]"
        >
          <div className="bg-black">
            <img
              src={activeItem.src}
              alt={activeItem.alt}
              className="h-auto w-full object-cover"
              decoding="async"
            />
          </div>
          <div className="grid grid-cols-[1fr_auto] border-t border-white/10 bg-[#16171c]">
            <button
              type="button"
              onClick={hidePopupsForDay}
              className="min-h-11 border-r border-white/10 px-4 text-left text-sm text-white/85 transition-colors hover:bg-white/5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-cyan-400/80"
            >
              하루동안 보지 않기
            </button>
            <button
              type="button"
              onClick={closeCurrentPopup}
              aria-label="팝업 닫기"
              className="flex min-h-11 w-12 items-center justify-center text-lg text-white/85 transition-colors hover:bg-white/5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-cyan-400/80"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
