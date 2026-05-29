import type { Metadata } from "next";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { mediaItems } from "@/lib/media";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site";

const pageTitleDefault = `${SITE_NAME} | 팝업·배너 미디어`;

function buildOgImages(): { url: string; alt?: string }[] {
  const fromEnv = process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE?.trim();
  if (fromEnv) {
    return [{ url: fromEnv.startsWith("http") ? fromEnv : absoluteUrl(fromEnv) }];
  }
  const firstStill = mediaItems.find((m) => m.kind !== "video");
  if (!firstStill) {
    return [];
  }
  return [{ url: absoluteUrl(firstStill.src), alt: firstStill.alt }];
}

const ogImages = buildOgImages();
const twitterHasImage = ogImages.length > 0;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: pageTitleDefault,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  ...(SITE_KEYWORDS.length ?
    {
      keywords: SITE_KEYWORDS,
    }
  : {}),
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: pageTitleDefault,
    description: SITE_DESCRIPTION,
    images: ogImages,
  },
  twitter: {
    card: twitterHasImage ? "summary_large_image" : "summary",
    title: pageTitleDefault,
    description: SITE_DESCRIPTION,
    ...(twitterHasImage ? { images: ogImages.map((i) => i.url) } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const dynamic = "force-static";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">
        <JsonLd />
        <a
          href="#main"
          className="sr-only outline-none focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-zinc-900"
        >
          본문으로 건너뛰기
        </a>
        {children}
      </body>
    </html>
  );
}
