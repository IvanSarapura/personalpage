import { SITE } from "@/data/site";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/data/locale";

interface InternalFooterLink {
  label: string;
  href: string;
  kind: "internal";
}

interface ExternalFooterLink {
  label: string;
  href: string;
  kind: "external";
}

export type FooterLink = InternalFooterLink | ExternalFooterLink;

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterLabels {
  site: string;
  elsewhere: string;
  home: string;
  research: string;
  projects: string;
  about: string;
  blog: string;
}

const FOOTER_LABELS: Record<Locale, FooterLabels> = {
  en: {
    site: "Site",
    elsewhere: "Elsewhere",
    home: "Home",
    research: "Research",
    projects: "Projects",
    about: "About",
    blog: "Blog",
  },
  es: {
    site: "Sitio",
    elsewhere: "En otros lados",
    home: "Inicio",
    research: "Investigación",
    projects: "Proyectos",
    about: "Sobre mí",
    blog: "Blog",
  },
};

/** Columnas del footer por locale: solo destinos reales (nada de links muertos). */
export function getFooterLinks(locale: Locale): FooterColumn[] {
  const labels = FOOTER_LABELS[locale];
  const homePath = localePath(locale, "/");
  return [
    {
      title: labels.site,
      links: [
        { label: labels.home, href: homePath, kind: "internal" },
        { label: labels.about, href: localePath(locale, "/about"), kind: "internal" },
        { label: labels.research, href: localePath(locale, "/research"), kind: "internal" },
        { label: labels.projects, href: localePath(locale, "/projects"), kind: "internal" },
        { label: labels.blog, href: localePath(locale, "/blog"), kind: "internal" },
      ],
    },
    {
      title: labels.elsewhere,
      links: [
        { label: "GitHub", href: SITE.social.github, kind: "external" },
        { label: "LinkedIn", href: SITE.social.linkedin, kind: "external" },
      ],
    },
  ];
}

export const FOOTER_LINKS: FooterColumn[] = getFooterLinks(DEFAULT_LOCALE);
