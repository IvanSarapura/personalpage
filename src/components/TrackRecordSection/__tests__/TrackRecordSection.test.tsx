import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TrackRecordSection from "@/components/TrackRecordSection/TrackRecordSection";

describe("TrackRecordSection", () => {
  it("presenta una evidencia principal y tres registros con destinos verificables", () => {
    const { container } = render(<TrackRecordSection locale="en" />);

    expect(screen.getByRole("region", { name: "Achievements" })).toBeInTheDocument();

    const featured = screen.getByRole("article", {
      name: "First prize for legaltech research",
    });
    expect(within(featured).getByText("2025")).toHaveAttribute("dateTime", "2025");

    const paperLink = within(featured).getByRole("link", {
      name: "Read the paper (opens in a new tab)",
    });
    expect(paperLink).toHaveAttribute("target", "_blank");
    expect(paperLink).toHaveAttribute("rel", "noopener noreferrer");

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(4);
    expect(
      screen.getByRole("article", { name: "Prediction Markets track winner" })
    ).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Finalist" })).toBeInTheDocument();
    expect(
      screen.getByRole("article", { name: "Selected for Founder School · FS26-2" })
    ).toBeInTheDocument();

    const years = Array.from(container.querySelectorAll("time"), (time) => ({
      label: time.textContent,
      dateTime: time.getAttribute("datetime"),
    }));
    expect(years).toEqual([
      { label: "2025", dateTime: "2025" },
      { label: "2026", dateTime: "2026" },
      { label: "2026", dateTime: "2026" },
      { label: "2026", dateTime: "2026" },
    ]);

    for (const icon of container.querySelectorAll("svg")) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("localiza el contenido, las rutas internas y la ayuda de enlaces externos", () => {
    render(<TrackRecordSection locale="es" />);

    expect(screen.getByRole("region", { name: "Reconocimientos" })).toBeInTheDocument();

    expect(
      screen.getByRole("article", {
        name: "Primer premio por investigación en legaltech",
      })
    ).toBeInTheDocument();

    const proven = screen.getByRole("article", {
      name: "Ganador del track Prediction Markets",
    });
    expect(
      within(proven).getByRole("link", {
        name: "Resultado oficial de GenLayer (se abre en una pestaña nueva)",
      })
    ).toHaveAttribute("href", "https://portal.genlayer.foundation/hackathon-winners");

    expect(
      within(screen.getByRole("article", { name: "Finalista" })).getByRole("link", {
        name: "Visitar Lupio (se abre en una pestaña nueva)",
      })
    ).toHaveAttribute("href", "https://lupia.vercel.app/");
  });
});
