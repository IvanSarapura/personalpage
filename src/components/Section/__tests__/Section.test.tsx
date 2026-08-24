import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Section from "../Section";

describe("Section", () => {
  it.each(["brand", "surface", "elevated", "inverse"] as const)(
    "exposes the %s semantic surface",
    (variant) => {
      render(
        <Section variant={variant} ariaLabel={`${variant} section`}>
          Content
        </Section>
      );

      expect(screen.getByRole("region", { name: `${variant} section` })).toHaveAttribute(
        "data-surface",
        variant
      );
    }
  );
});
