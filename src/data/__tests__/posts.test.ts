import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { POSTS, getMissingTranslations, getPosts, getPost } from "@/data/posts";
import { LOCALES } from "@/data/locale";

const CONTENT_DIR = join(process.cwd(), "src", "content", "posts");

describe("POSTS (registro de la Bitácora)", () => {
  it("tiene slugs únicos", () => {
    const slugs = POSTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("cada traducción tiene su archivo MDX en src/content/posts", () => {
    for (const post of POSTS) {
      for (const locale of LOCALES) {
        const contentFile = post.translations[locale].contentFile;
        expect(existsSync(join(CONTENT_DIR, `${contentFile}.mdx`)), `${contentFile}.mdx`).toBe(
          true
        );
      }
    }
  });

  it("cada post tiene metadata completa y válida", () => {
    for (const post of POSTS) {
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(post.date))).toBe(false);
      expect(post.readingMinutes).toBeGreaterThan(0);
      for (const locale of LOCALES) {
        const translation = post.translations[locale];
        expect(translation.title).toBeTruthy();
        expect(translation.description).toBeTruthy();
        expect(translation.tags.length).toBeGreaterThan(0);
        expect(translation.contentFile).toBeTruthy();
      }
    }
  });

  it("tiene traducciones completas para todos los locales soportados", () => {
    expect(getMissingTranslations()).toEqual([]);
  });

  it("getPosts ordena por fecha descendente sin mutar el registro", () => {
    const posts = getPosts("en");
    const dates = posts.map((post) => post.date);
    expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)));
    expect(posts).not.toBe(POSTS);
    expect(posts.every((post) => post.lang === "en")).toBe(true);
  });

  it("getPost resuelve slugs válidos y rechaza inválidos", () => {
    const first = POSTS[0];
    expect(first).toBeDefined();
    expect(getPost(first!.slug, "es")?.lang).toBe("es");
    expect(getPost(first!.slug, "es")?.title).toBe(
      "Evaluar evidencia con oráculos LLM en GenLayer"
    );
    expect(getPost("no-existe")).toBeUndefined();
  });

  it("el blog publica con al menos 4 posts (umbral de la propuesta §4.2)", () => {
    expect(POSTS.length).toBeGreaterThanOrEqual(4);
  });
});
