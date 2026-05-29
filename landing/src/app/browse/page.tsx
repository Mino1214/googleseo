 import type { Metadata } from "next";
 import Link from "next/link";
 import { SITE_NAME } from "@/lib/site";
 
 export const dynamic = "force-static";
 
 export const metadata: Metadata = {
   title: `구경하기 | ${SITE_NAME}`,
   alternates: { canonical: "/browse" },
   robots: {
     index: false,
     follow: true,
     googleBot: { index: false, follow: true },
   },
 };
 
 export default function BrowsePage() {
   return (
     <main id="main" className="mx-auto max-w-2xl px-4 py-14 sm:py-20">
       <header className="space-y-4">
         <h1 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
           구경하기
         </h1>
         <p className="text-[var(--muted)]">
           아래 버튼을 누르면 미디어 화면으로 이동합니다.
         </p>
       </header>
 
       <div className="mt-8 space-y-3">
         <Link
           href="/media"
           className="block rounded-lg border border-[var(--border)] bg-black/25 px-4 py-4 text-white transition-opacity hover:opacity-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-cyan-400/80"
         >
           미디어로 이동 <span className="text-[var(--muted)]">&gt;</span>
         </Link>
       </div>
 
       <p className="mt-10">
         <Link href="/" className="text-sm text-[var(--muted)] underline underline-offset-4">
           메인으로
         </Link>
       </p>
     </main>
   );
 }
