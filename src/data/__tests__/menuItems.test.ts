import { describe, expect, it } from "vitest";
import { getMenuItems } from "@/data/menuItems";

describe("getMenuItems", () => {
  it.each([
    ["en", "/projects"],
    ["es", "/es/projects"],
  ] as const)("dirige Projects a la página de proyectos para %s", (locale, expectedHref) => {
    const projectsItem = getMenuItems(locale).find((item) => item.index === "03");

    expect(projectsItem).toMatchObject({ href: expectedHref });
  });
});
