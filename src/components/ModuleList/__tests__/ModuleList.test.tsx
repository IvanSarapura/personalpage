import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModuleList from "@/components/ModuleList/ModuleList";

const modules = [
  { num: "01", name: "First project", description: "First project description." },
  { num: "02", name: "Second project", description: "Second project description." },
];

describe("ModuleList", () => {
  it("renderiza una fila interactiva completa con un único chevron decorativo", () => {
    render(<ModuleList modules={modules} />);

    const firstToggle = screen.getByRole("button", { name: "First project" });
    expect(firstToggle).toHaveAttribute("aria-expanded", "false");
    expect(firstToggle).toHaveAttribute("aria-controls", "module-content-01");
    expect(firstToggle).toContainElement(screen.getByText("01"));
    expect(firstToggle).toContainElement(screen.getByText("First project"));
    expect(firstToggle.querySelectorAll("svg")).toHaveLength(1);
  });

  it("permite alternar el disclosure desde el número y el título", async () => {
    const user = userEvent.setup();
    render(<ModuleList modules={modules} />);

    const firstToggle = screen.getByRole("button", { name: "First project" });

    await user.click(screen.getByText("01"));
    expect(firstToggle).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByText("First project"));
    expect(firstToggle).toHaveAttribute("aria-expanded", "false");
  });

  it("mantiene el comportamiento nativo con Enter y Espacio", async () => {
    const user = userEvent.setup();
    render(<ModuleList modules={modules} />);

    const firstToggle = screen.getByRole("button", { name: "First project" });
    firstToggle.focus();

    await user.keyboard("{Enter}");
    expect(firstToggle).toHaveAttribute("aria-expanded", "true");

    await user.keyboard(" ");
    expect(firstToggle).toHaveAttribute("aria-expanded", "false");
  });

  it("sincroniza el chevron y ARIA manteniendo una sola sección abierta", async () => {
    const user = userEvent.setup();
    render(<ModuleList modules={modules} />);

    const firstToggle = screen.getByRole("button", { name: "First project" });
    const secondToggle = screen.getByRole("button", { name: "Second project" });

    await user.click(firstToggle);
    expect(firstToggle).toHaveAttribute("aria-expanded", "true");

    await user.click(secondToggle);
    expect(firstToggle).toHaveAttribute("aria-expanded", "false");
    expect(secondToggle).toHaveAttribute("aria-expanded", "true");
  });

  it("no colapsa la sección al interactuar con su contenido", async () => {
    const user = userEvent.setup();
    render(<ModuleList modules={modules} />);

    const firstToggle = screen.getByRole("button", { name: "First project" });
    await user.click(firstToggle);

    const firstPanel = screen.getByRole("region", { name: "First project" });
    expect(firstPanel).toHaveAttribute("id", "module-content-01");

    await user.click(screen.getByText("First project description."));
    expect(firstToggle).toHaveAttribute("aria-expanded", "true");
  });
});
