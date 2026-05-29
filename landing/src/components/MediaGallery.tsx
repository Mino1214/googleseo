"use client";

import type { MediaItem } from "@/lib/media";
import { mediaItems } from "@/lib/media";
import { ENTRY_URL_FALLBACK, ENTRY_URL_PRIMARY } from "@/lib/site";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

async function reachable(url: string, timeoutMs: number) {
  const ctrl = new AbortController();
  const id = window.setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    await fetch(url, {
      method: "GET",
      mode: "no-cors",
      cache: "no-store",
      signal: ctrl.signal,
    });
    window.clearTimeout(id);
    return true;
  } catch {
    window.clearTimeout(id);
    return false;
  }
}

const EntryHrefContext = createContext<string>(ENTRY_URL_PRIMARY);

export function MediaGallery({ items }: { items?: readonly MediaItem[] }) {
  const list = items ?? mediaItems;
  const [href, setHref] = useState(ENTRY_URL_PRIMARY);

  useEffect(() => {
    let cancelled = false;
    reachable(ENTRY_URL_PRIMARY, 4000).then((ok) => {
      if (cancelled) {
        return;
      }
      if (!ok) {
        setHref(ENTRY_URL_FALLBACK);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => href, [href]);

  if (list.length === 0) {
    return null;
  }

  return (
    <EntryHrefContext.Provider value={value}>
      <ul
        className="mx-auto grid list-none grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-4 md:gap-2.5"
        role="list"
      >
        {list.map((item) => (
          <li key={item.src} className="min-w-0">
            <MediaCard item={item} />
          </li>
        ))}
      </ul>
    </EntryHrefContext.Provider>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  const entryHref = useContext(EntryHrefContext);
  const href = item.href ?? entryHref;

  const slotClass =
    item.kind === "video" ?
      "flex h-[9rem] w-full shrink-0 items-center justify-center bg-zinc-950/60 p-1 sm:h-[10rem]"
    : "flex h-[7rem] w-full shrink-0 items-center justify-center bg-zinc-950/60 p-1.5 sm:h-[7.5rem] md:h-[8rem]";

  const media =
    item.kind === "video" ?
      <>
        <video
          className="max-h-full max-w-full object-contain"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
        >
          <source src={item.src} type="video/mp4" />
        </video>
        <span className="sr-only">{item.alt}</span>
      </>
    : <img
        src={item.src}
        alt={item.alt}
        className="max-h-full max-w-full object-contain"
        decoding="async"
        loading="lazy"
      />;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={href}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-black/25 text-left outline-offset-2 transition-opacity hover:opacity-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-cyan-400/80"
    >
      <div className={slotClass}>{media}</div>
      {item.caption ?
        <p className="relative border-t border-[var(--border)] px-2 py-1.5 text-center text-[11px] leading-snug tracking-tight text-[var(--muted)] sm:text-xs">
          {item.caption}
        </p>
      : null}
    </a>
  );
}
