import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { POSTS, getPosts, getPost } from "@/data/posts";
import { LOCALES } from "@/data/locale";

const CONTENT_DIR = join(process.cwd(), "src", "content", "posts");

describe("POSTS (registro de la Bitácora)", () => {
  it("tiene slugs únicos", () => {
    const slugs = POSTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("cada entrada del registro tiene su archivo MDX en src/content/posts", () => {
    for (const post of POSTS) {
      expect(existsSync(join(CONTENT_DIR, `${post.slug}.mdx`)), `${post.slug}.mdx`).toBe(true);
    }
  });

  it("cada post tiene metadata completa y válida", () => {
    for (const post of POSTS) {
      expect(post.title).toBeTruthy();
      expect(post.description).toBeTruthy();
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(post.date))).toBe(false);
      expect(LOCALES).toContain(post.lang);
      expect(post.tags.length).toBeGreaterThan(0);
      expect(post.readingMinutes).toBeGreaterThan(0);
    }
  });

  it("getPosts ordena por fecha descendente sin mutar el registro", () => {
    const posts = getPosts();
    const dates = posts.map((p) => p.date);
    expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)));
    expect(posts).not.toBe(POSTS);
  });

  it("getPost resuelve slugs válidos y rechaza inválidos", () => {
    const first = POSTS[0];
    expect(first).toBeDefined();
    expect(getPost(first!.slug)).toBe(first);
    expect(getPost("no-existe")).toBeUndefined();
  });

  it("el blog publica con al menos 4 posts (umbral de la propuesta §4.2)", () => {
    expect(POSTS.length).toBeGreaterThanOrEqual(4);
  });
});
