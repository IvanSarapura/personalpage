import type { MenuItem } from "@/types/navigation";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/data/locale";

interface MenuLabels {
  home: string;
  research: string;
  projects: string;
  about: string;
  blog: string;
  contact: string;
}

const MENU_LABELS: Record<Locale, MenuLabels> = {
  en: {
    home: "Home",
    research: "Research",
    projects: "Projects",
    about: "About",
    blog: "Blog",
    contact: "Contact",
  },
  es: {
    home: "Inicio",
    research: "Investigación",
    projects: "Proyectos",
    about: "Sobre mí",
    blog: "Blog",
    contact: "Contacto",
  },
};

/** Ancla dentro de la home del locale: "/#focus" (en) · "/es/#focus" (es). */
function homeAnchor(locale: Locale, anchor: string): string {
  const homePath = localePath(locale, "/");
  return homePath === "/" ? `/${anchor}` : `${homePath}/${anchor}`;
}

/** Ítems del menú fullscreen para un locale. Los que no tienen `href` se muestran
 *  deshabilitados. */
export function getMenuItems(locale: Locale): MenuItem[] {
  const labels = MENU_LABELS[locale];
  return [
    { label: labels.home, href: localePath(locale, "/"), index: "01" },
    { label: labels.research, href: localePath(locale, "/research"), index: "02" },
    { label: labels.projects, href: localePath(locale, "/projects"), index: "03" },
    { label: labels.about, href: localePath(locale, "/about"), index: "04" },
    { label: labels.blog, href: localePath(locale, "/blog"), index: "05" },
    { label: labels.contact, href: homeAnchor(locale, "#contact"), index: "06" },
  ];
}

export const MENU_ITEMS: MenuItem[] = getMenuItems(DEFAULT_LOCALE);
