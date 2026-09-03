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
});
