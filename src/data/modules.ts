import { DEFAULT_LOCALE, type Locale } from "@/data/locale";
import { getProjects } from "@/data/projects";

export interface Module {
  num: string;
  name: string;
  description: string;
}

/** Ítems del acordeón "What I'm building" de la home, derivados de la única
 *  fuente de verdad de proyectos (src/data/projects.ts) para que la home y
 *  /projects nunca diverjan. */
export function getModules(locale: Locale): Module[] {
  return getProjects(locale).map((project) => ({
    num: project.num,
    name: `${project.title} — ${project.tagline}`,
    description: project.summary,
  }));
}

export const MODULES: Module[] = getModules(DEFAULT_LOCALE);
