import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LeadSection from "../LeadSection";

describe("LeadSection", () => {
  it.each([
    [
      "en",
      "Driving forward",
      "This is the project I’m working on right now. Take a look, try it out, and see how it evolves.",
    ],
    [
      "es",
      "Impulsando",
      "Este es el proyecto en el que estoy trabajando hoy. Podés conocerlo, probarlo y ver cómo evoluciona.",
    ],
  ] as const)("renders the Alimentis feature in %s", (locale, heading, description) => {
    render(<LeadSection locale={locale} />);

    expect(screen.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    expect(screen.getByText(description)).toBeVisible();
    const alimentis = screen.getByRole("article", { name: "Alimentis" });
    expect(within(alimentis).getByRole("heading", { level: 3, name: "Alimentis" })).toBeVisible();
    expect(
      screen.queryByText(/Independent RegTech research|Investigación independiente en RegTech/)
    ).not.toBeInTheDocument();
  });
});
