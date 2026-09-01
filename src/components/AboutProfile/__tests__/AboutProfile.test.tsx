import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AboutProfile from "@/components/AboutProfile/AboutProfile";
import { getAboutMetadata, getAboutProfile } from "@/data/about";

describe("AboutProfile", () => {
  it("renders the editorial map and method in English", () => {
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
    expect(within(index).getAllByRole("link")).toHaveLength(2);
    expect(
      within(index)
        .getAllByRole("link")
        .map((link) => link.textContent)
    ).toEqual(["Method", "Formation"]);

    const principles = screen.getByRole("region", { name: "Working principles" });
    expect(principles).toBeVisible();
    for (const heading of ["Translate the rule", "Design the proof", "Build the interface"]) {
      expect(within(principles).getByRole("heading", { name: heading })).toBeVisible();
    }
    expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThanOrEqual(5);

    expect(profile.formation.stackGroups.map((group) => group.items)).toEqual([
      ["TypeScript", "Next.js", "Tailwind CSS"],
      ["Claude API", "Vercel AI SDK", "RAG"],
      ["Solidity", "Hyperledger Fabric", "GenLayer"],
    ]);
    for (const technology of profile.formation.stackGroups.flatMap((group) => group.items)) {
      expect(screen.getAllByText(technology).at(-1)).toHaveAttribute("translate", "no");
    }

    expect(screen.queryByRole("heading", { name: /specific problem/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Start a conversation" })).not.toBeInTheDocument();
  });

  it("keeps metadata separate from the render profile", () => {
    expect(getAboutMetadata("en")).toEqual({
      title: "About",
      description:
        "Iván Sarapura builds verifiable software at the intersection of commercial law, blockchain, AI compliance and product design.",
    });
    expect(getAboutProfile("en")).not.toHaveProperty("metadata");
  });

  it("localizes navigation and the method in Spanish", () => {
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

    expect(
      screen.queryByRole("heading", { name: /Cuatro pruebas en funcionamiento/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /EcoTrace/i })).not.toBeInTheDocument();
  });
});
