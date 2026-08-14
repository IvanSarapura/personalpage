import { SITE } from "@/data/site";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/data/locale";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterLabels {
  site: string;
  elsewhere: string;
  home: string;
  projects: string;
  about: string;
  blog: string;
  contact: string;
  email: string;
}

const FOOTER_LABELS: Record<Locale, FooterLabels> = {
  en: {
    site: "Site",
    elsewhere: "Elsewhere",
    home: "Home",
    projects: "Projects",
    about: "About",
    blog: "Blog",
    contact: "Contact",
    email: "Email",
  },
  es: {
    site: "Sitio",
    elsewhere: "En otros lados",
    home: "Inicio",
    projects: "Proyectos",
    about: "Sobre mí",
    blog: "Blog",
    contact: "Contacto",
    email: "Email",
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
        { label: labels.home, href: homePath },
        { label: labels.projects, href: localePath(locale, "/projects") },
        { label: labels.about, href: localePath(locale, "/about") },
        { label: labels.blog, href: localePath(locale, "/blog") },
        {
          label: labels.contact,
          href: homePath === "/" ? "/#contact" : `${homePath}/#contact`,
        },
      ],
    },
    {
      title: labels.elsewhere,
      links: [
        { label: "GitHub", href: SITE.social.github },
        { label: "LinkedIn", href: SITE.social.linkedin },
        { label: labels.email, href: `mailto:${SITE.email}` },
      ],
    },
  ];
}

export const FOOTER_LINKS: FooterColumn[] = getFooterLinks(DEFAULT_LOCALE);
