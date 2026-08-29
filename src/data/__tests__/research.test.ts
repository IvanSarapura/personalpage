import { describe, expect, it } from "vitest";
import { LOCALES } from "@/data/locale";
import { getProject } from "@/data/projects";
import { CHAIN_OF_CUSTODY_PAPER_URL, RESEARCH_IDS, getResearch } from "@/data/research";

describe("research data", () => {
  it("mantiene los mismos IDs y el orden en ambos idiomas", () => {
    for (const locale of LOCALES) {
      expect(getResearch(locale).map((item) => item.id)).toEqual(RESEARCH_IDS);
    }
  });

  it("presenta la investigación de UCEMA sin inventar un enlace público", () => {
    for (const locale of LOCALES) {
      const item = getResearch(locale)[0];

      expect(item?.kind).toBe("in-progress");
      if (item?.kind !== "in-progress") throw new Error("Expected in-progress research");

      expect(item.dateCreated).toBe("2026");
      expect(item.status).toBe(
        locale === "en" ? "Research in progress" : "Investigación en desarrollo"
      );
      expect(item.titleLanguage).toBe(locale === "en" ? "en" : "es");
      expect(item?.authors).toEqual([{ name: "Sarapura, Iván Enzo", isSiteOwner: true }]);
      expect(item).not.toHaveProperty("sourceOrganization");
      expect(item.academicBackground).toEqual(
        locale === "en"
          ? ["Law studies — UBA", "Blockchain & Digital Finance diploma program — UTN"]
          : ["Abogacía — UBA", "Diplomatura en Blockchain y Finanzas Digitales — UTN"]
      );
      expect(item).not.toHaveProperty("link");
    }
  });

  it("conserva los metadatos verificados y el PDF oficial del paper publicado", () => {
    const expectedAuthors = [
      { name: "José G. Damiani Corraro" },
      { name: "Lara M. Quevedo Arcuri" },
      { name: "Iván E. Sarapura", isSiteOwner: true },
    ];

    for (const locale of LOCALES) {
      const item = getResearch(locale)[1];

      expect(item?.kind).toBe("published");
      if (item?.kind !== "published") throw new Error("Expected published research");

      expect(item.datePublished).toBe("2025-11-24");
      expect(item.status).toBe(locale === "en" ? "Published paper" : "Paper publicado");
      expect(item.titleLanguage).toBe(locale === "en" ? "en" : "es");
      expect(item.authors).toEqual(expectedAuthors);
      expect(item.context).toBe(
        locale === "en"
          ? "Faculty of Law, University of Buenos Aires, Cardano and Project Catalyst"
          : "Facultad de Derecho, Universidad de Buenos Aires, Cardano y Project Catalyst"
      );
      expect(item.recognition).toBe(
        locale === "en"
          ? "1st prize — Cardano Academic LegalThon 2025"
          : "1er premio — LegalThon Académico de Cardano 2025"
      );
      expect(item.sourceOrganization).toBe("Facultad de Derecho, Universidad de Buenos Aires");
      expect(item.link).toEqual({
        href: CHAIN_OF_CUSTODY_PAPER_URL,
        label: locale === "en" ? "Read paper (PDF)" : "Leer paper (PDF)",
      });
      expect(item).not.toHaveProperty("publisher");
    }

    expect(getProject("cardano-chain-of-custody")?.links.paper).toBe(CHAIN_OF_CUSTODY_PAPER_URL);
  });
});
