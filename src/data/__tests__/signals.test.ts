import { describe, expect, it } from "vitest";
import { getSignals } from "@/data/signals";

describe("signals", () => {
  it("mantiene el orden editorial solicitado en cada locale", () => {
    const expectedOrder = [
      "legal-engineering",
      "regtech",
      "web3-contracts",
      "typesafe-frontend",
      "product-venture",
      "ai-agents",
    ];

    expect(getSignals("en").map((signal) => signal.id)).toEqual(expectedOrder);
    expect(getSignals("es").map((signal) => signal.id)).toEqual(expectedOrder);
  });

  it("no incluye etiquetas auxiliares en las tarjetas", () => {
    for (const locale of ["en", "es"] as const) {
      for (const signal of getSignals(locale)) {
        expect(signal).not.toHaveProperty("meta");
      }
    }
  });
});
