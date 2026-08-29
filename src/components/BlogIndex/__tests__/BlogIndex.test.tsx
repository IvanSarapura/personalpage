import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BlogIndex from "@/components/BlogIndex/BlogIndex";
import { getPosts } from "@/data/posts";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; preload?: boolean; sizes?: string; src?: string }) => {
    // El mock reemplaza next/image únicamente en JSDOM; producción usa <Image />.
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt ?? ""} sizes={props.sizes} src={props.src} />;
  },
}));

describe("BlogIndex", () => {
  it("renderiza el featured y el archivo completo en inglés", () => {
    const { container } = render(<BlogIndex locale="en" />);
    const posts = getPosts();
    const archive = container.querySelector("ol");
    const surfaces = container.querySelectorAll("[data-surface]");

    expect(screen.getByRole("heading", { level: 1, name: "Personal Blog" })).toBeVisible();
    const heroHeader = screen
      .getByRole("heading", { level: 1, name: "Personal Blog" })
      .closest("header");
    expect(heroHeader).toContainElement(container.querySelector("dl"));
    expect(surfaces[0]).toHaveAttribute("data-surface", "elevated");
    expect(screen.getByRole("heading", { level: 2, name: "Featured note" })).toBeVisible();
    const metrics = container.querySelectorAll("dl > div");
    expect(metrics).toHaveLength(2);
    expect(metrics[0]?.querySelector("dt")).toHaveTextContent("Publications");
    expect(metrics[0]?.querySelector("dd")).toHaveTextContent("04");
    expect(metrics[1]?.querySelector("dt")).toHaveTextContent("Latest post");
    expect(metrics[1]?.querySelector("dd")).toHaveTextContent("Jun 10");
    expect(screen.getByRole("region", { name: "Featured note" })).toHaveAttribute(
      "data-surface",
      "brand"
    );
    expect(screen.getByRole("region", { name: "Index" })).toHaveAttribute(
      "data-surface",
      "elevated"
    );
    expect(screen.queryByText("In English")).not.toBeInTheDocument();
    expect(screen.queryByText("In Spanish")).not.toBeInTheDocument();
    expect(archive).not.toBeNull();
    expect(archive?.querySelectorAll("article")).toHaveLength(posts.length - 1);
    expect(archive?.querySelectorAll('p span[aria-hidden="true"]')).toHaveLength(posts.length - 1);

    const firstArchiveArticle = archive?.querySelector("article");
    expect(firstArchiveArticle).not.toBeNull();
    expect(firstArchiveArticle).toHaveAttribute("lang", "en");
    expect(within(firstArchiveArticle!).getByRole("heading", { level: 3 })).toHaveTextContent(
      posts[1]!.title
    );
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /Crossing public food databases with RAG/,
      })
    ).toBeVisible();
    expect(screen.queryByText(/Cruzar bases públicas alimentarias/)).not.toBeInTheDocument();
    expect(firstArchiveArticle?.querySelectorAll("[data-slot='badge']")).toHaveLength(
      posts[1]!.tags.length
    );
  });

  it("selecciona el featured localizado y conserva los destinos del archivo", () => {
    const { container } = render(<BlogIndex locale="es" />);
    const archive = container.querySelector("ol");
    const surfaces = container.querySelectorAll("[data-surface]");

    expect(screen.getByRole("heading", { level: 1, name: "Blog Personal" })).toBeVisible();
    const metrics = container.querySelectorAll("dl > div");
    expect(metrics[0]?.querySelector("dt")).toHaveTextContent("Publicaciones realizadas");
    expect(metrics[1]?.querySelector("dt")).toHaveTextContent("Última publicación");
    expect(surfaces[0]).toHaveAttribute("data-surface", "elevated");
    expect(screen.getByRole("region", { name: "Nota destacada" })).toHaveAttribute(
      "data-surface",
      "brand"
    );
    expect(screen.getByRole("region", { name: "Índice" })).toHaveAttribute(
      "data-surface",
      "elevated"
    );
    expect(screen.queryByText("En inglés")).not.toBeInTheDocument();
    expect(screen.queryByText("En español")).not.toBeInTheDocument();
    expect(container.querySelector("article")).toHaveAttribute("lang", "es");
    expect(screen.getByRole("heading", { level: 3, name: /Cruzar bases públicas/ })).toBeVisible();
    expect(screen.queryByText(/Crossing public food databases with RAG/)).not.toBeInTheDocument();

    const archiveLinks = archive?.querySelectorAll("h3 a");
    expect(archiveLinks).toHaveLength(getPosts().length - 1);
    expect(archiveLinks?.[0]).toHaveAttribute(
      "href",
      "/es/blog/cruzar-bases-publicas-alimentarias"
    );
  });
});
