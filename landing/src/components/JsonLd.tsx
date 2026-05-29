import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export function JsonLd() {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "ko-KR",
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "ViewAction",
      target: [`${SITE_URL}/sites`, `${SITE_URL}/browse`, `${SITE_URL}/media`],
    },
    hasPart: [
      { "@type": "WebPage", name: "사이트 리스트", url: `${SITE_URL}/sites` },
      { "@type": "WebPage", name: "구경하기", url: `${SITE_URL}/browse` },
      { "@type": "WebPage", name: "미디어", url: `${SITE_URL}/media` },
    ],
  };

  const payload = [website];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
