 "use client";
 
 import type { MediaItem } from "@/lib/media";
 import { useOutboundHref } from "@/components/OutboundLink";
 
export function MediaCard({
  item,
  className,
  slotClassName,
  mediaClassName,
  dense,
  href,
}: {
  item: MediaItem;
  className?: string;
  slotClassName?: string;
  mediaClassName?: string;
  dense?: boolean;
  href?: string;
}) {
  const outboundHref = useOutboundHref();
  const resolvedHref = href ?? item.href ?? outboundHref;
 
   const slotClass =
     slotClassName ??
     (item.kind === "video"
       ? "flex h-full w-full items-center justify-center bg-zinc-950/60 p-0"
       : "flex h-full w-full items-center justify-center bg-zinc-950/60 p-0");
 
   const media =
     item.kind === "video" ? (
       <>
         <video
           className={mediaClassName ?? "h-full w-full object-cover"}
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
     ) : (
       <img
         src={item.src}
         alt={item.alt}
         className={mediaClassName ?? "h-full w-full object-cover"}
         decoding="async"
         loading="lazy"
       />
     );
 
   return (
    <a
      href={resolvedHref}
      target="_blank"
      rel="noopener noreferrer"
      title={resolvedHref}
      className={
        className ??
        "block overflow-hidden border border-[var(--border)] bg-black/25 outline-offset-2 transition-opacity hover:opacity-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-cyan-400/80"
      }
       aria-label={`${item.alt} 페이지로 새 창 열기`}
     >
       <div className={slotClass}>{media}</div>
       {!dense && item.caption ? (
         <p className="border-t border-[var(--border)] px-2 py-1.5 text-center text-[11px] leading-snug tracking-tight text-[var(--muted)] sm:text-xs">
           {item.caption}
         </p>
       ) : null}
     </a>
   );
 }
