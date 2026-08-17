import { env } from "@/env";
import { DEFAULT_LOCALE, type Locale } from "@/data/locale";

interface SiteCopy {
  tagline: string;
  description: string;
}

export const SITE_COPY: Record<Locale, SiteCopy> = {
  en: {
    tagline: "Software where law meets code",
    description:
      "Web developer and commercial-law student building at the intersection of law and code: smart contracts, RegTech and AI compliance. Winner at Aleph & GenLayer; co-author of an awarded paper on Cardano.",
  },
  es: {
    tagline: "Software donde el derecho se encuentra con el código",
    description:
      "Desarrollador web y estudiante de derecho comercial construyendo en la intersección del derecho y el código: contratos inteligentes, RegTech y cumplimiento con IA. Ganador en Aleph & GenLayer; co-autor de un paper premiado sobre Cardano.",
  },
};

export function getSiteCopy(locale: Locale): SiteCopy {
  return SITE_COPY[locale];
}

export const SITE = {
  name: "Iván Enzo Sarapura",
  shortName: "Iván Sarapura",
  ...SITE_COPY[DEFAULT_LOCALE],
  url: env.NEXT_PUBLIC_SITE_URL,
  social: {
    linkedin: "https://www.linkedin.com/in/ivansarapura/",
    github: "https://github.com/IvanSarapura",
  },
} as const;
