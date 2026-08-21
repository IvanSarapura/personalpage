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
      "I build software that turns real-world regulation into reliable, executable logic. Smart contracts, RegTech and AI compliance, backed by a GenLayer hackathon win and an awarded paper on Cardano.",
  },
  es: {
    tagline: "Software donde el derecho se encuentra con el código",
    description:
      "Construyo software que convierte regulación real en lógica ejecutable y confiable. Contratos inteligentes, RegTech y cumplimiento con IA, respaldados por un hackathon de GenLayer y un paper premiado sobre Cardano.",
  },
};

export function getSiteCopy(locale: Locale): SiteCopy {
  return SITE_COPY[locale];
}

export const SITE = {
  name: "Iván Enzo Sarapura",
  shortName: "Iván Sarapura",
  initials: "IS",
  ...SITE_COPY[DEFAULT_LOCALE],
  url: env.NEXT_PUBLIC_SITE_URL,
  social: {
    linkedin: "https://www.linkedin.com/in/ivansarapura/",
    github: "https://github.com/IvanSarapura",
  },
} as const;
