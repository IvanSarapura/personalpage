import { DEFAULT_LOCALE, type Locale } from "@/data/locale";
import { getProjects } from "@/data/projects";

export interface Module {
  num: string;
  name: string;
  description: string;
}

/** Proyectos que no se muestran en el acordeón "Selected work" de la home,
 *  aunque sigan existiendo en /projects y sus case studies. */
const EXCLUDED_PROJECT_SLUGS: ReadonlySet<string> = new Set(["lupio", "zero-to-agent"]);

/** Ítems del acordeón "Selected work" de la home, derivados de la única
 *  fuente de verdad de proyectos (src/data/projects.ts) para que la home y
 *  /projects nunca diverjan. */
export function getModules(locale: Locale): Module[] {
  return getProjects(locale)
    .filter((project) => !EXCLUDED_PROJECT_SLUGS.has(project.slug))
    .map((project) => ({
      num: project.num,
      name: `${project.title} • ${project.tagline}`,
      description: project.summary,
    }));
}

export const MODULES: Module[] = getModules(DEFAULT_LOCALE);
