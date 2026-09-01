import { describe, expect, it } from "vitest";
import { LOCALES } from "@/data/locale";
import {
  AWARDED_PAPER_RECOGNITION_IDS,
  FIRST_PRIZE_RECOGNITION_IDS,
  FOUNDER_SCHOOL_COHORT,
  RECOGNITION_IDS,
  getRecognitions,
} from "@/data/recognition";

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
        if (item.outcome) {
          expect(item.outcome).not.toHaveLength(0);
        }
        expect(item.issuer).not.toHaveLength(0);
        expect(item.summary).not.toHaveLength(0);
        expect(item.evidence.length).toBeGreaterThan(0);
      }
    }
  });

  it("limita las fuentes externas a HTTPS", () => {
    for (const locale of LOCALES) {
      for (const recognition of getRecognitions(locale)) {
        for (const evidence of recognition.evidence) {
          expect(evidence.href).toMatch(/^https:\/\//);
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

  it("deriva las métricas de credibilidad de reconocimientos canónicos", () => {
    expect(FIRST_PRIZE_RECOGNITION_IDS).toHaveLength(2);
    expect(AWARDED_PAPER_RECOGNITION_IDS).toEqual(["legalthon-uba-cardano"]);

    for (const locale of LOCALES) {
      const founderSchool = getRecognitions(locale).find((item) => item.id === "founder-school");
      expect(founderSchool?.outcome).toContain(FOUNDER_SCHOOL_COHORT);
    }
  });
});
