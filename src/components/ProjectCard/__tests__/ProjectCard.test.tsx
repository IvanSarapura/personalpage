import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CaseStudyPage from "@/app/[lang]/projects/[slug]/page";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import { getProject } from "@/data/projects";
import { CHAIN_OF_CUSTODY_PAPER_URL } from "@/data/research";

describe("chain-of-custody PDF links", () => {
  it("identifica el formato y la nueva pestaña en la tarjeta", () => {
    const project = getProject("cardano-chain-of-custody", "es");
    if (!project) throw new Error("Expected chain-of-custody project");

    render(<ProjectCard project={project} locale="es" />);

    expect(
      screen.getByRole("link", {
        name: "Paper (PDF) (se abre en una pestaña nueva)",
      })
    ).toMatchObject({
      href: CHAIN_OF_CUSTODY_PAPER_URL,
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });

  it("mantiene el mismo contrato accesible en el caso de estudio", async () => {
    const page = await CaseStudyPage({
      params: Promise.resolve({ lang: "en", slug: "cardano-chain-of-custody" }),
      searchParams: Promise.resolve({}),
    });

    render(page);

    expect(
      screen.getByRole("link", {
        name: "Paper (PDF) (opens in a new tab)",
      })
    ).toMatchObject({
      href: CHAIN_OF_CUSTODY_PAPER_URL,
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });
});
