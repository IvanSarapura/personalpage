import type { Locale } from "@/data/locale";
import { getResearch, type ResearchItem } from "@/data/research";
import { getSiteCopy, SITE } from "@/data/site";

function fragmentId(fragment: string): string {
  return `${SITE.url.replace(/\/$/, "")}#${fragment}`;
}

export const PERSON_JSON_LD_ID = fragmentId("person");

export function buildPersonJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_JSON_LD_ID,
    name: SITE.name,
    url: SITE.url,
    jobTitle: "Legal Engineer & Software Developer",
    description: getSiteCopy(locale).description,
    sameAs: [SITE.social.linkedin, SITE.social.github],
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Universidad de Buenos Aires" },
      { "@type": "CollegeOrUniversity", name: "Universidad Tecnológica Nacional" },
    ],
  };
}

function buildResearchArticle(item: ResearchItem) {
  const article = {
    "@type": "ScholarlyArticle",
    "@id": fragmentId(`research-${item.id}`),
    name: item.title,
    headline: item.title,
    description: item.summary,
    inLanguage: item.titleLanguage,
    author: item.authors.map((author) =>
      author.isSiteOwner ? { "@id": PERSON_JSON_LD_ID } : { "@type": "Person", name: author.name }
    ),
  };

  if (item.kind === "published") {
    return {
      ...article,
      datePublished: item.datePublished,
      url: item.link.href,
      award: item.recognition,
      sourceOrganization: {
        "@type": "Organization",
        name: item.sourceOrganization,
      },
    };
  }

  return {
    ...article,
    dateCreated: item.dateCreated,
    creativeWorkStatus: item.status,
  };
}

export function buildResearchJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": getResearch(locale).map(buildResearchArticle),
  };
}

/** Serialización recomendada por Next.js: evita que `<` abra HTML dentro del script. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
