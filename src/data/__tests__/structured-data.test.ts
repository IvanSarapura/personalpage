import { describe, expect, it } from "vitest";
import {
  buildPersonJsonLd,
  buildResearchJsonLd,
  PERSON_JSON_LD_ID,
  serializeJsonLd,
} from "@/data/structured-data";

describe("structured data", () => {
  it("mantiene el perfil Person estable y separado de los artículos del archivo", () => {
    const personEn = buildPersonJsonLd("en");
    const personEs = buildPersonJsonLd("es");

    expect(personEn).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": PERSON_JSON_LD_ID,
    });
    expect(personEs["@id"]).toBe(PERSON_JSON_LD_ID);
    expect(personEn).not.toHaveProperty("@graph");
    expect(personEn).not.toHaveProperty("ScholarlyArticle");
  });

  it("genera un grafo del archivo formado únicamente por los dos artículos", () => {
    const graph = buildResearchJsonLd("es")["@graph"];

    expect(graph).toHaveLength(2);
    expect(graph.every((entity) => entity["@type"] === "ScholarlyArticle")).toBe(true);
    expect(graph.some((entity) => entity["@type"] === "Person")).toBe(false);
    expect(graph[0]).toMatchObject({ author: [{ "@id": PERSON_JSON_LD_ID }] });
    expect(graph[1]?.author).toEqual([
      { "@type": "Person", name: "José G. Damiani Corraro" },
      { "@type": "Person", name: "Lara M. Quevedo Arcuri" },
      { "@id": PERSON_JSON_LD_ID },
    ]);
  });

  it("distingue el ciclo de vida por kind y conserva los metadatos publicados", () => {
    const articles = buildResearchJsonLd("en")["@graph"];
    const inProgress = articles[0];
    const published = articles[1];

    expect(inProgress).toMatchObject({
      dateCreated: "2026",
      creativeWorkStatus: "Research in progress",
      inLanguage: "es",
    });
    expect(inProgress).not.toHaveProperty("datePublished");
    expect(inProgress).not.toHaveProperty("url");
    expect(inProgress).not.toHaveProperty("sourceOrganization");

    expect(published).toMatchObject({
      datePublished: "2025-11-24",
      alternativeHeadline: "¿Puede esta tecnología mejorar el resguardo de la evidencia?",
      award: "1st prize — Cardano Academic LegalThon 2025",
      inLanguage: "es",
      url: expect.stringMatching(/\.pdf$/),
      sourceOrganization: {
        "@type": "Organization",
        name: "Facultad de Derecho, Universidad de Buenos Aires",
      },
    });
    expect(published).not.toHaveProperty("dateCreated");
    expect(published).not.toHaveProperty("alternateName");
    expect(published).not.toHaveProperty("publisher");
  });

  it("produce JSON válido y neutraliza caracteres que podrían abrir HTML", () => {
    const serialized = serializeJsonLd({ value: "</script><script>" });

    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual({ value: "</script><script>" });
  });
});
