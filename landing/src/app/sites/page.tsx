 import type { Metadata } from "next";
 import Link from "next/link";
 import { SITE_NAME } from "@/lib/site";
 
 export const dynamic = "force-static";
 
 export const metadata: Metadata = {
   title: `사이트 리스트 | ${SITE_NAME}`,
   alternates: { canonical: "/sites" },
   robots: {
     index: false,
     follow: true,
     googleBot: { index: false, follow: true },
   },
 };
 
 const categories = [
   "토토사이트",
   "카지노사이트",
   "슬롯사이트",
   "바카라사이트",
   "프라그마틱사이트",
   "에볼루션사이트",
   "파워볼사이트",
 ] as const;
 
 export default function SitesPage() {
   return (
     <main id="main" className="mx-auto max-w-2xl px-4 py-14 sm:py-20">
       <header className="space-y-4">
         <h1 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
           사이트 리스트
         </h1>
         <p className="text-[var(--muted)]">
           아래 항목을 누르면 미디어 화면으로 이동합니다.
         </p>
       </header>
 
       <ul className="mt-8 space-y-3" role="list">
         {categories.map((label) => (
           <li key={label}>
             <Link
               href="/media"
               className="block rounded-lg border border-[var(--border)] bg-black/25 px-4 py-4 text-white transition-opacity hover:opacity-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-cyan-400/80"
             >
               <span className="text-base font-medium">{label}</span>
               <span className="ml-2 text-[var(--muted)]">&gt;</span>
             </Link>
           </li>
         ))}
       </ul>
 
       <p className="mt-10">
         <Link href="/" className="text-sm text-[var(--muted)] underline underline-offset-4">
           메인으로
         </Link>
       </p>
     </main>
   );
 }
