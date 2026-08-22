import { describe, expect, it } from "vitest";
import { LOCALES } from "@/data/locale";
import { getFooterLinks } from "@/data/navigation";

describe("footer navigation data", () => {
  it("clasifica los destinos de sitio como internos y los perfiles sociales como externos", () => {
    for (const locale of LOCALES) {
      const [siteColumn, elsewhereColumn] = getFooterLinks(locale);

      expect(siteColumn?.links.map((link) => link.kind)).toEqual([
        "internal",
        "internal",
        "internal",
        "internal",
        "internal",
      ]);
      expect(siteColumn?.links.every((link) => link.href.startsWith("/"))).toBe(true);

      expect(elsewhereColumn?.links).toEqual([
        expect.objectContaining({ label: "GitHub", kind: "external" }),
        expect.objectContaining({ label: "LinkedIn", kind: "external" }),
      ]);
      expect(elsewhereColumn?.links.every((link) => link.href.startsWith("https://"))).toBe(true);
    }
  });
});
