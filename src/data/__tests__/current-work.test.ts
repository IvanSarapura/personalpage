import { describe, expect, it } from "vitest";
import { CURRENT_WORK_IDS, getCurrentWork } from "@/data/current-work";
import { LOCALES } from "@/data/locale";

describe("CURRENT_WORK", () => {
  it("mantiene los mismos ítems y el mismo orden en todos los locales", () => {
    for (const locale of LOCALES) {
      expect(getCurrentWork(locale).map((item) => item.id)).toEqual(CURRENT_WORK_IDS);
    }
  });

  it("publica solo destinos reales", () => {
    for (const locale of LOCALES) {
      const curiosity = getCurrentWork(locale).find((item) => item.id === "curiosity");
      const link2pay = getCurrentWork(locale).find((item) => item.id === "link2pay");

      expect(curiosity?.link).toBeUndefined();
      expect(link2pay?.link?.href).toBe("https://www.link2pay.xyz");
    }
  });

  it("incluye contenido localizado completo", () => {
    for (const locale of LOCALES) {
      for (const item of getCurrentWork(locale)) {
        expect(item.title.length).toBeGreaterThan(0);
        expect(item.category.length).toBeGreaterThan(0);
        expect(item.status.length).toBeGreaterThan(0);
        expect(item.description.length).toBeGreaterThan(80);
        expect(item.highlights).toHaveLength(3);
      }
    }
  });
});
