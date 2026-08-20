import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ResearchIndex from "@/components/ResearchIndex/ResearchIndex";
import { CHAIN_OF_CUSTODY_PAPER_URL } from "@/data/research";

describe("ResearchIndex", () => {
  it("renderiza el archivo completo con jerarquía editorial y metadatos académicos", () => {
    const { container } = render(<ResearchIndex locale="en" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Publications & research" })
    ).toBeVisible();
    expect(screen.getByRole("heading", { level: 2, name: "Research archive" })).toBeVisible();
    expect(screen.getByText(/works/)).toHaveTextContent("02 works");

    const articles = container.querySelectorAll("article");
    expect(articles).toHaveLength(2);
    expect(articles[0]).toHaveAttribute("id", "cryptographic-infrastructure");
    expect(within(articles[0]!).getByText("Sarapura, Iván Enzo")).toBeVisible();
    expect(
      within(articles[0]!).getByText(
        "Law studies — UBA · Blockchain & Digital Finance diploma program — UTN"
      )
    ).toBeVisible();

    expect(articles[1]).toHaveAttribute("id", "cardano-chain-of-custody");
    expect(
      within(articles[1]!).getByText("1st prize — Cardano Academic LegalThon 2025")
    ).toBeVisible();

    const paperLink = within(articles[1]!).getByRole("link", {
      name: "Read paper (PDF) (opens in a new tab)",
    });
    expect(paperLink).toHaveAttribute("href", CHAIN_OF_CUSTODY_PAPER_URL);
    expect(paperLink).toHaveAttribute("target", "_blank");
    expect(paperLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("localiza el archivo completo en español", () => {
    render(<ResearchIndex locale="es" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Publicaciones e investigación" })
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 2, name: "Archivo de investigaciones" })
    ).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: "Leer paper (PDF) (se abre en una pestaña nueva)",
      })
    ).toHaveAttribute("href", CHAIN_OF_CUSTODY_PAPER_URL);
  });
});
