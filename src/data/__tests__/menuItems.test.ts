import { describe, expect, it } from "vitest";
import { getMenuItems } from "@/data/menuItems";

describe("getMenuItems", () => {
  it.each([
    ["en", "/projects"],
    ["es", "/es/projects"],
  ] as const)("dirige Projects a la página de proyectos para %s", (locale, expectedHref) => {
    const projectsItem = getMenuItems(locale).find((item) => item.index === "04");

    expect(projectsItem).toMatchObject({ href: expectedHref });
  });

  it.each([
    ["en", ["Home", "About me", "Research", "Projects", "Blog", "Contact"]],
    ["es", ["Inicio", "Sobre mí", "Investigación", "Proyectos", "Blog", "Contacto"]],
  ] as const)("mantiene el orden de navegación para %s", (locale, expectedLabels) => {
    expect(getMenuItems(locale).map((item) => item.label)).toEqual(expectedLabels);
  });
});
