import { describe, expect, it } from "vitest";
import { LOCALES } from "@/data/locale";
import { getProject } from "@/data/projects";
import { RECOGNITION_IDS, getRecognitions } from "@/data/recognition";

const EXPECTED_YEARS = {
  "legalthon-uba-cardano": 2025,
  "genlayer-bradbury-builders": 2026,
  "trama-bootcamp": 2026,
  "founder-school": 2026,
} as const;

describe("recognition data", () => {
  it("mantiene IDs únicos, orden estable y paridad estructural entre idiomas", () => {
    expect(new Set(RECOGNITION_IDS).size).toBe(RECOGNITION_IDS.length);

    for (const locale of LOCALES) {
      const recognitions = getRecognitions(locale);
      expect(recognitions.map((item) => item.id)).toEqual(RECOGNITION_IDS);

      for (const item of recognitions) {
        expect(item.eyebrow).not.toHaveLength(0);
        expect(item.outcome).not.toHaveLength(0);
        expect(item.title).not.toHaveLength(0);
        expect(item.issuer).not.toHaveLength(0);
        expect(item.summary).not.toHaveLength(0);
        expect(item.evidence.length).toBeGreaterThan(0);
      }
    }
  });

  it("enlaza a casos existentes y limita las fuentes externas a HTTPS", () => {
    for (const locale of LOCALES) {
      for (const recognition of getRecognitions(locale)) {
        for (const evidence of recognition.evidence) {
          if (evidence.type === "external") {
            expect(evidence.href).toMatch(/^https:\/\//);
            continue;
          }

          const project = getProject(evidence.projectSlug, locale);
          expect(project, `${recognition.id} apunta a un proyecto inexistente`).toBeDefined();
          expect(
            project?.award,
            `${recognition.id} enlaza a ${evidence.projectSlug} sin reconocimiento`
          ).toBeTruthy();
        }
      }
    }
  });

  it("usa los años confirmados y conserva el registro principal", () => {
    for (const locale of LOCALES) {
      const recognitions = getRecognitions(locale);

      expect(recognitions.some((item) => item.id === "legalthon-uba-cardano")).toBe(true);
      for (const item of recognitions) {
        expect(item.year).toBe(EXPECTED_YEARS[item.id]);
      }
    }
  });
});
