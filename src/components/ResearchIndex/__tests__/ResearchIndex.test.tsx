import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ResearchIndex from "@/components/ResearchIndex/ResearchIndex";
import { CHAIN_OF_CUSTODY_PAPER_URL } from "@/data/research";

/** El conteo de publicaciones propias vive en la barra de la sección. */
function getArchiveCount() {
  const section = screen.getByRole("region", { name: "Sort research" });
  return within(section).getByText("02");
}

describe("ResearchIndex", () => {
  it("renderiza el archivo completo con jerarquía editorial y metadatos académicos", () => {
    const { container } = render(<ResearchIndex locale="en" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Publications & research" })
    ).toBeVisible();
    // El conteo de publicaciones propias: número + etiqueta en spans separados.
    expect(getArchiveCount()).toBeVisible();
    expect(screen.getByText("publications")).toBeVisible();

    // Cada bloque de la página es una región con nombre accesible propio.
    expect(screen.getByRole("region", { name: "Publications & research" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Sort research" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Research list" })).toBeVisible();

    // El control de orden alterna el orden al hacer clic.
    expect(screen.getByRole("button", { name: "Sorted by most recent" })).toBeVisible();

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

  it("alterna el orden de la lista con el control de ordenamiento", async () => {
    const { container } = render(<ResearchIndex locale="en" />);

    const firstArticle = container.querySelector("article");
    expect(firstArticle).toHaveAttribute("id", "cryptographic-infrastructure");

    await userEvent.click(screen.getByRole("button", { name: "Sorted by most recent" }));

    const reordered = container.querySelector("article");
    expect(reordered).toHaveAttribute("id", "cardano-chain-of-custody");
    expect(screen.getByRole("button", { name: "Sorted by oldest" })).toBeVisible();
  });

  it("localiza el archivo completo en español", () => {
    render(<ResearchIndex locale="es" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Publicaciones e investigación" })
    ).toBeVisible();
    const sortRegion = screen.getByRole("region", { name: "Ordenar investigaciones" });
    expect(within(sortRegion).getByText("02")).toBeVisible();
    expect(within(sortRegion).getByText("publicaciones")).toBeVisible();
    expect(screen.getByRole("button", { name: "Ordenadas por más recientes" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Lista de investigaciones" })).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: "Leer paper (PDF) (se abre en una pestaña nueva)",
      })
    ).toHaveAttribute("href", CHAIN_OF_CUSTODY_PAPER_URL);
  });
});
