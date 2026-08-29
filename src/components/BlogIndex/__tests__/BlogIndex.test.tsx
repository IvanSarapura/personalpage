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

    expect(screen.getByRole("heading", { level: 1, name: "Personal Blog" })).toBeVisible();
    expect(screen.getByRole("heading", { level: 2, name: "Featured note" })).toBeVisible();
    expect(screen.queryByText("In English")).not.toBeInTheDocument();
    expect(screen.queryByText("In Spanish")).not.toBeInTheDocument();
    expect(archive).not.toBeNull();
    expect(archive?.querySelectorAll("article")).toHaveLength(posts.length - 1);

    const firstArchiveArticle = archive?.querySelector("article");
    expect(firstArchiveArticle).not.toBeNull();
    expect(firstArchiveArticle).toHaveAttribute("lang", "es");
    expect(within(firstArchiveArticle!).getByRole("heading", { level: 3 })).toHaveTextContent(
      posts[1]!.title
    );
    expect(firstArchiveArticle?.querySelectorAll("[data-slot='badge']")).toHaveLength(
      posts[1]!.tags.length
    );
  });

  it("selecciona el featured localizado y conserva los destinos del archivo", () => {
    const { container } = render(<BlogIndex locale="es" />);
    const archive = container.querySelector("ol");

    expect(screen.getByRole("heading", { level: 1, name: "Blog Personal" })).toBeVisible();
    expect(screen.queryByText("En inglés")).not.toBeInTheDocument();
    expect(screen.queryByText("En español")).not.toBeInTheDocument();
    expect(container.querySelector("article")).toHaveAttribute("lang", "es");
    expect(screen.getByRole("heading", { level: 3, name: /Cruzar bases públicas/ })).toBeVisible();

    const archiveLinks = archive?.querySelectorAll("h3 a");
    expect(archiveLinks).toHaveLength(getPosts().length - 1);
    expect(archiveLinks?.[0]).toHaveAttribute("href", "/es/blog/llm-oracles-genlayer");
  });
});
