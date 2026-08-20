import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ResearchSection from "@/components/ResearchSection/ResearchSection";

describe("ResearchSection", () => {
  it("presenta dos adelantos concisos y deriva el detalle a la página de investigación", () => {
    const { container } = render(<ResearchSection locale="en" />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Publications & research" })
    ).toBeVisible();
    expect(screen.getByRole("region", { name: "Publications & research" })).toHaveAttribute(
      "id",
      "research"
    );

    const articles = container.querySelectorAll("article");
    expect(articles).toHaveLength(2);
    expect(within(articles[0]!).getByRole("heading", { level: 3 })).toHaveTextContent(
      "Infraestructura criptográfica implementable"
    );
    expect(within(articles[0]!).getByText("01", { selector: ".numeral" })).toBeVisible();
    expect(within(articles[0]!).getByText("October, 2026")).toHaveAttribute("datetime", "2026");
    expect(within(articles[1]!).getByText("02", { selector: ".numeral" })).toBeVisible();

    // El estado ya no se muestra como mini-título; se comunica con el diseño.
    expect(screen.queryByText("Research in progress")).not.toBeInTheDocument();
    expect(screen.queryByText("Published paper")).not.toBeInTheDocument();

    expect(screen.queryByText("Sarapura, Iván Enzo")).not.toBeInTheDocument();
    expect(screen.queryByText("Academic background")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Read paper/ })).not.toBeInTheDocument();

    const archiveLink = screen.getByRole("link", { name: "Explore all research" });
    expect(archiveLink).toHaveAttribute("href", "/research");
    expect(archiveLink.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(
      screen.getByRole("list").compareDocumentPosition(archiveLink) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("localiza el enlace interno y evita un lang redundante en español", () => {
    const { container } = render(<ResearchSection locale="es" />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Publicaciones e investigación" })
    ).toBeVisible();
    expect(container.querySelector("cite")).not.toHaveAttribute("lang");
    expect(screen.getByRole("link", { name: "Ver todas las investigaciones" })).toHaveAttribute(
      "href",
      "/es/research"
    );
  });
});
