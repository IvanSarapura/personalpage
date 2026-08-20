import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CurrentWorkSection from "@/components/CurrentWorkSection/CurrentWorkSection";

describe("CurrentWorkSection", () => {
  it("presenta Curiosity y Link2Pay con destinos honestos", () => {
    render(<CurrentWorkSection locale="en" />);

    expect(screen.getByRole("heading", { level: 2, name: "What I'm building" })).toBeVisible();
    expect(screen.getByRole("heading", { level: 3, name: "Curiosity" })).toBeVisible();
    expect(screen.getByRole("heading", { level: 3, name: "Link2Pay" })).toBeVisible();

    const curiosityLink = screen.getByRole("link", { name: /Visit Curiosity/i });
    expect(curiosityLink).toHaveAttribute("href", "#");
    expect(curiosityLink).toHaveAttribute("target", "_blank");
    expect(curiosityLink).toHaveAttribute("rel", "noopener noreferrer");

    const link = screen.getByRole("link", { name: /Visit Link2Pay/i });
    expect(link).toHaveAttribute("href", "https://www.link2pay.xyz");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("localiza el contenido de la sección en español", () => {
    render(<CurrentWorkSection locale="es" />);

    expect(screen.getByRole("heading", { level: 2, name: "Qué estoy construyendo" })).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 3, name: "Curiosity" }).closest("article")
    ).toHaveTextContent("En desarrollo");
    expect(
      screen.getByRole("heading", { level: 3, name: "Link2Pay" }).closest("article")
    ).toHaveTextContent("Emprendimiento activo");
    expect(screen.getByRole("link", { name: /Visitar Link2Pay/i })).toHaveAttribute(
      "href",
      "https://www.link2pay.xyz"
    );
  });
});
