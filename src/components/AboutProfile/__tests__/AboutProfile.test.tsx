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
        name: "About me",
      })
    ).toBeVisible();
    expect(
      screen.getByText(
        "I develop and study systems for contexts where rules, technology and real-world decisions have to work together."
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
    expect(screen.getByRole("region", { name: "Operating stack" })).toBeVisible();
    expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThanOrEqual(5);
    expect(screen.queryByText(/I study commercial law at UBA/i)).not.toBeInTheDocument();

    expect(
      profile.formation.groups.flatMap((group) =>
        group.items.map(({ title, institution }) => ({ title, institution }))
      )
    ).toEqual([
      { title: "Law, Business orientation", institution: "University of Buenos Aires" },
      {
        title: "Diploma in Blockchain & Digital Finance",
        institution: "National Technological University",
      },
      { title: "Founder School", institution: "Aleph Crecimiento & Protocol Labs" },
      {
        title: "Trama Entrepreneurship BootCamp",
        institution: "Buenos Aires Institute of Technology",
      },
    ]);

    expect(profile.formation.stackGroups.map((group) => group.items)).toEqual([
      ["TypeScript", "Next.js", "Tailwind CSS", "React", "Angular", "Node.js", "SQL"],
      ["Claude", "Vercel AI SDK", "Codex", "DeepSeek", "Kimi"],
      ["Solidity", "Hyperledger Fabric", "Rust", "Hardhat", "Foundry", "Compact"],
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
        "Iván Sarapura studies business law and builds products as a freelancer, with interests in legaltech, blockchain, artificial intelligence and AI Safety research.",
    });
    expect(getAboutProfile("en")).not.toHaveProperty("metadata");
  });

  it("localizes navigation and the method in Spanish", () => {
    const profile = getAboutProfile("es");
    render(<AboutProfile locale="es" profile={profile} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Sobre mí",
      })
    ).toBeVisible();
    expect(
      screen.getByText(
        "Desarrollo y estudio sistemas para contextos donde las reglas, la tecnología y las decisiones concretas tienen que funcionar juntas."
      )
    ).toBeVisible();
    expect(screen.getByRole("navigation", { name: "En esta página" })).toBeVisible();
    const principles = screen.getByRole("region", { name: "Principios de trabajo" });
    for (const heading of ["Traducir la regla", "Diseñar la prueba", "Construir la interfaz"]) {
      expect(within(principles).getByRole("heading", { name: heading })).toBeVisible();
    }
    expect(screen.getByRole("region", { name: "Stack de trabajo" })).toBeVisible();

    expect(
      profile.formation.groups.flatMap((group) =>
        group.items.map(({ title, institution }) => ({ title, institution }))
      )
    ).toEqual([
      { title: "Abogacía, orientación empresarial", institution: "Universidad de Buenos Aires" },
      {
        title: "Diplomatura en Blockchain & Finanzas Digitales",
        institution: "Universidad Tecnológica Nacional",
      },
      { title: "Founder School", institution: "Aleph Crecimiento & Protocol Labs" },
      {
        title: "Trama Entrepreneurship Bootcamp",
        institution: "Instituto Tecnológico de Buenos Aires",
      },
    ]);

    expect(
      screen.queryByRole("heading", { name: /Cuatro pruebas en funcionamiento/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /EcoTrace/i })).not.toBeInTheDocument();
  });
});
