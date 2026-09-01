import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AboutProfile from "@/components/AboutProfile/AboutProfile";
import { ABOUT_PROJECT_SLUGS, getAboutMetadata, getAboutProfile } from "@/data/about";
import { getProjects } from "@/data/projects";
import { getRecognitions } from "@/data/recognition";

describe("AboutProfile", () => {
  it("renders the editorial map, canonical work and sourced evidence in English", () => {
    const profile = getAboutProfile("en");
    render(<AboutProfile locale="en" profile={profile} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "From legal rule to executable system.",
      })
    ).toBeVisible();
    expect(
      screen.getByText(
        "My focus is the translation layer: turning obligations, evidence and institutional decisions into systems people can inspect, test and revise."
      )
    ).toBeVisible();

    const index = screen.getByRole("navigation", { name: "On this page" });
    expect(within(index).getAllByRole("link")).toHaveLength(4);
    expect(
      within(index)
        .getAllByRole("link")
        .map((link) => link.textContent)
    ).toEqual(["Work", "Method", "Evidence", "Formation"]);
    expect(within(index).getByRole("link", { name: "Evidence" })).toHaveAttribute(
      "href",
      "#about-evidence"
    );

    for (const project of profile.work.projects) {
      expect(screen.getByRole("article", { name: project.title })).toBeVisible();
      expect(
        screen.getByRole("link", { name: `Read the case study: ${project.title}` })
      ).toHaveAttribute("href", `/projects/${project.slug}`);
    }

    expect(profile.work.projects.map((project) => project.slug)).toEqual(ABOUT_PROJECT_SLUGS);
    expect(profile.work.projects).toEqual(
      ABOUT_PROJECT_SLUGS.map((slug) => getProjects("en").find((project) => project.slug === slug))
    );

    const principles = screen.getByRole("region", { name: "Working principles" });
    expect(principles).toBeVisible();
    for (const heading of ["Translate the rule", "Design the proof", "Build the interface"]) {
      expect(within(principles).getByRole("heading", { name: heading })).toBeVisible();
    }
    expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThanOrEqual(7);

    for (const recognition of getRecognitions("en")) {
      const name = recognition.title ?? recognition.outcome;
      expect(screen.getByRole("article", { name })).toBeVisible();
    }

    expect(profile.formation.stackGroups.map((group) => group.items)).toEqual([
      ["TypeScript", "Next.js", "Tailwind CSS"],
      ["Claude API", "Vercel AI SDK", "RAG"],
      ["Solidity", "Hyperledger Fabric", "GenLayer"],
    ]);
    for (const technology of profile.formation.stackGroups.flatMap((group) => group.items)) {
      expect(screen.getAllByText(technology).at(-1)).toHaveAttribute("translate", "no");
    }

    const contact = screen.getByRole("link", { name: "Start a conversation" });
    expect(contact).toHaveAttribute("href", "/#contact");
    expect(screen.getByRole("link", { name: "View all projects" })).toHaveAttribute(
      "href",
      "/projects"
    );
  });

  it("keeps metadata separate from the render profile", () => {
    expect(getAboutMetadata("en")).toEqual({
      title: "About",
      description:
        "Iván Sarapura builds verifiable software at the intersection of commercial law, blockchain, AI compliance and product design.",
    });
    expect(getAboutProfile("en")).not.toHaveProperty("metadata");
  });

  it("localizes navigation, canonical destinations and the CTA in Spanish", () => {
    const profile = getAboutProfile("es");
    render(<AboutProfile locale="es" profile={profile} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "De la regla jurídica al sistema ejecutable.",
      })
    ).toBeVisible();
    expect(screen.getByRole("navigation", { name: "En esta página" })).toBeVisible();
    const principles = screen.getByRole("region", { name: "Principios de trabajo" });
    for (const heading of ["Traducir la regla", "Diseñar la prueba", "Construir la interfaz"]) {
      expect(within(principles).getByRole("heading", { name: heading })).toBeVisible();
    }

    for (const project of profile.work.projects) {
      expect(
        screen.getByRole("link", { name: `Leer el caso de estudio: ${project.title}` })
      ).toHaveAttribute("href", `/es/projects/${project.slug}`);
    }

    const officialResult = screen.getByRole("link", {
      name: "Resultado oficial de GenLayer (se abre en una pestaña nueva)",
    });
    expect(officialResult).toHaveAttribute(
      "href",
      "https://portal.genlayer.foundation/hackathon-winners"
    );
    expect(officialResult).toHaveAttribute("target", "_blank");
    expect(profile.evidence.recognitions).toEqual(getRecognitions("es"));

    expect(screen.getByRole("link", { name: "Iniciar una conversación" })).toHaveAttribute(
      "href",
      "/es#contact"
    );
    expect(screen.getByRole("link", { name: "Ver todos los proyectos" })).toHaveAttribute(
      "href",
      "/es/projects"
    );
  });
});
