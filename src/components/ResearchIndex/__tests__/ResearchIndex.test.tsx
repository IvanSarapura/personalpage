import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ResearchIndex from "@/components/ResearchIndex/ResearchIndex";

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
    // Fecha y estado se conservan en los datos, pero no forman parte del listado visual.
    expect(within(articles[0]!).queryByText("October, 2026")).not.toBeInTheDocument();
    expect(within(articles[0]!).queryByText("Research in progress")).not.toBeInTheDocument();

    expect(articles[1]).toHaveAttribute("id", "cardano-chain-of-custody");
    // El reconocimiento no forma parte del eyebrow visual del listado.
    expect(
      within(articles[1]!).queryByText("1st prize — Cardano Academic LegalThon 2025")
    ).not.toBeInTheDocument();
    // El título traducido al inglés y el subtítulo eliminado.
    expect(
      within(articles[1]!).getByText(
        "Blockchain as a technology applicable to the chain of custody"
      )
    ).toBeVisible();
    expect(
      screen.queryByText("¿Puede esta tecnología mejorar el resguardo de la evidencia?")
    ).not.toBeInTheDocument();
    const paperLink = within(articles[1]!).getByRole("link", { name: /Read paper/i });
    expect(paperLink).toHaveAttribute("href", expect.stringContaining("Paper%2001"));
    expect(paperLink).toHaveAttribute("target", "_blank");
    expect(paperLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(within(articles[0]!).queryByRole("link")).not.toBeInTheDocument();
    expect(within(articles[0]!).getByText("Read paper (PDF)")).toBeVisible();
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
      screen.getByText("La blockchain como tecnología aplicable a la cadena de custodia")
    ).toBeVisible();
    expect(
      screen.queryByText("¿Puede esta tecnología mejorar el resguardo de la evidencia?")
    ).not.toBeInTheDocument();
    const paperLink = within(
      screen
        .getByText("La blockchain como tecnología aplicable a la cadena de custodia")
        .closest("article")!
    ).getByRole("link", { name: /Leer paper/i });
    expect(paperLink).toHaveAttribute("target", "_blank");
    expect(paperLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      within(
        screen
          .getByText(
            "Cuando blockchain desaparece: de producto crypto a infraestructura digital, agentes autónomos y seguridad"
          )
          .closest("article")!
      ).getByText("Leer paper (PDF)")
    ).toBeVisible();
  });
});
