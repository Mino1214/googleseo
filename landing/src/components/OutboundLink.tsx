 "use client";
 
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
 
 const HrefContext = createContext<string>(ENTRY_URL_PRIMARY);
 
 export function OutboundHrefProvider({ children }: { children: React.ReactNode }) {
   const [href, setHref] = useState(ENTRY_URL_PRIMARY);
 
   useEffect(() => {
     let cancelled = false;
     reachable(ENTRY_URL_PRIMARY, 4000).then((ok) => {
       if (cancelled) {
         return;
       }
       setHref(ok ? ENTRY_URL_PRIMARY : ENTRY_URL_FALLBACK);
     });
     return () => {
       cancelled = true;
     };
   }, []);
 
   const value = useMemo(() => href, [href]);
 
   return <HrefContext.Provider value={value}>{children}</HrefContext.Provider>;
 }
 
 export function useOutboundHref() {
   return useContext(HrefContext);
 }
