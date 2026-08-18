import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ResearchSection from "@/components/ResearchSection/ResearchSection";

describe("ResearchSection", () => {
  it("presenta dos adelantos concisos y deriva el detalle a la página de investigación", () => {
    const { container } = render(<ResearchSection locale="en" />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Research & publications" })
    ).toBeVisible();
    expect(screen.getByRole("region", { name: "Research & publications" })).toHaveAttribute(
      "id",
      "research"
    );

    const articles = container.querySelectorAll("article");
    expect(articles).toHaveLength(2);
    expect(within(articles[0]!).getByRole("heading", { level: 3 })).toHaveTextContent(
      "Infraestructura criptográfica implementable"
    );
    expect(within(articles[0]!).getByText("Research in progress")).toBeVisible();
    expect(within(articles[0]!).getByText("October, 2026")).toHaveAttribute("datetime", "2026");
    expect(within(articles[1]!).getByText("Published paper")).toBeVisible();

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
      screen.getByRole("heading", { level: 2, name: "Investigación y publicaciones" })
    ).toBeVisible();
    expect(container.querySelector("cite")).not.toHaveAttribute("lang");
    expect(screen.getByRole("link", { name: "Ver todas las investigaciones" })).toHaveAttribute(
      "href",
      "/es/research"
    );
  });
});
