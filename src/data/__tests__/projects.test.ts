import { describe, it, expect } from "vitest";
import { PROJECTS, PROJECT_TAGS, getProject, getProjects } from "@/data/projects";
import { MODULES } from "@/data/modules";
import { LOCALES } from "@/data/locale";

describe("PROJECTS (fuente de verdad de proyectos)", () => {
  it("tiene slugs únicos", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("tiene nums únicos y secuenciales", () => {
    const nums = PROJECTS.map((p) => p.num);
    expect(new Set(nums).size).toBe(nums.length);
    expect(nums).toEqual(PROJECTS.map((_, i) => String(i + 1).padStart(2, "0")));
  });

  it("cada proyecto tiene el copy completo del caso de estudio", () => {
    for (const project of PROJECTS) {
      expect(project.title).toBeTruthy();
      expect(project.tagline).toBeTruthy();
      expect(project.summary).toBeTruthy();
      expect(project.origin).toBeTruthy();
      expect(project.mechanism).toBeTruthy();
      expect(project.future).toBeTruthy();
      expect(project.status).toBeTruthy();
      expect(project.tags.length).toBeGreaterThan(0);
    }
  });

  it("getProject resuelve slugs válidos y rechaza inválidos", () => {
    const first = PROJECTS[0];
    expect(first).toBeDefined();
    expect(getProject(first!.slug)).toBe(first);
    expect(getProject("no-existe")).toBeUndefined();
  });

  it("PROJECT_TAGS no tiene duplicados", () => {
    expect(new Set(PROJECT_TAGS).size).toBe(PROJECT_TAGS.length);
  });

  it("todos los locales tienen los mismos slugs, en el mismo orden", () => {
    const slugsByLocale = LOCALES.map((locale) => getProjects(locale).map((p) => p.slug));
    for (const slugs of slugsByLocale) {
      expect(slugs).toEqual(slugsByLocale[0]);
    }
  });

  it("cada locale tiene el copy completo del caso de estudio", () => {
    for (const locale of LOCALES) {
      for (const project of getProjects(locale)) {
        expect(project.title).toBeTruthy();
        expect(project.summary).toBeTruthy();
        expect(project.origin).toBeTruthy();
        expect(project.mechanism).toBeTruthy();
        expect(project.future).toBeTruthy();
      }
    }
  });
});

describe("MODULES (acordeón de la home, derivado de PROJECTS)", () => {
  it("deriva un ítem por proyecto destacado, en el mismo orden", () => {
    expect(MODULES.length).toBeGreaterThan(0);
    expect(MODULES.length).toBeLessThanOrEqual(PROJECTS.length);
    const projectByNum = new Map(PROJECTS.map((p) => [p.num, p]));
    for (const mod of MODULES) {
      const project = projectByNum.get(mod.num);
      expect(project).toBeDefined();
      expect(mod.name).toContain(project!.title);
      expect(mod.description).toBe(project!.summary);
    }
  });

  it("excluye lupio y zero-to-agent del acordeón de la home", () => {
    expect(MODULES.some((mod) => mod.name.includes("Lupio"))).toBe(false);
    expect(MODULES.some((mod) => mod.name.includes("Zero to Agent"))).toBe(false);
  });
});
