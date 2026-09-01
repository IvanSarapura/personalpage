import { expect, test } from "@playwright/test";
import {
  gotoVisual,
  holdContactAction,
  setTheme,
  waitForUiAnimations,
  type Theme,
} from "./helpers";

const routes = [
  { name: "home-en", path: "/" },
  { name: "home-es", path: "/es" },
  { name: "about-en", path: "/about" },
  { name: "about-es", path: "/es/about" },
  { name: "projects-list", path: "/projects" },
  { name: "research-list", path: "/research" },
  { name: "blog-list", path: "/blog" },
  { name: "blog-list-es", path: "/es/blog" },
  { name: "project-detail", path: "/projects/proven" },
  { name: "blog-detail", path: "/blog/llm-oracles-genlayer" },
];
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];
const themes: Theme[] = ["light", "dark"];

for (const viewport of viewports) {
  for (const theme of themes) {
    for (const route of routes) {
      test(`${route.name} · ${viewport.name} · ${theme}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await setTheme(page, theme);
        await gotoVisual(page, route.path);

        await expect(page.locator("html")).toHaveClass(
          theme === "dark" ? /(?:^|\s)dark(?:\s|$)/ : /^(?!.*(?:^|\s)dark(?:\s|$))/
        );

        await waitForUiAnimations(page);
        await expect(page).toHaveScreenshot(`${route.name}-${viewport.name}-${theme}.png`);
      });
    }
  }
}

test.describe("interactive state baselines", () => {
  test("fullscreen menu open", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoVisual(page, "/");
    await page.getByRole("button", { name: "Open menu" }).click();

    const dialog = page.getByRole("dialog", { name: "Main navigation menu" });
    await expect(dialog).toBeVisible();
    await waitForUiAnimations(page, dialog);
    await expect(dialog).toHaveScreenshot("state-menu-open-mobile-light.png");
  });

  test("project filter pressed", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoVisual(page, "/projects");
    await page.getByRole("button", { name: "Web3" }).click();

    const filters = page.getByRole("group", { name: "Filter projects by tag" });
    await expect(page.getByRole("button", { name: "Web3" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await waitForUiAnimations(page, filters);
    await expect(filters).toHaveScreenshot("state-filter-pressed-desktop-light.png");
  });

  test("contact form validation and pending", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoVisual(page, "/");
    const form = page.locator("form");
    const name = page.getByLabel("Name");

    await name.fill("x");
    await page.getByLabel("Email").focus();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await waitForUiAnimations(page, form);
    await expect(form).toHaveScreenshot("state-form-invalid-mobile-light.png");

    await name.fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page
      .getByLabel("Message")
      .fill("I would like to discuss a concrete legal engineering project.");

    const contactAction = await holdContactAction(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await contactAction.matched;
    try {
      await expect(form).toHaveAttribute("aria-busy", "true");
      await waitForUiAnimations(page, form);
      await expect(form).toHaveScreenshot("state-form-pending-mobile-light.png");
      expect(contactAction.matchedCount()).toBe(1);
    } finally {
      await contactAction.release();
    }
  });

  test("keyboard focus and toggled dark theme", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoVisual(page, "/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
    await waitForUiAnimations(page);
    await expect(page).toHaveScreenshot("state-keyboard-focus-desktop-light.png");

    await page.getByRole("switch", { name: "Color theme" }).click();
    await expect(page.locator("html")).toHaveClass(/(?:^|\s)dark(?:\s|$)/);
    await waitForUiAnimations(page);
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toHaveScreenshot(
      "state-theme-toggled-desktop-dark.png"
    );
  });
});

const focalRegions = [
  { name: "home-research", path: "/", target: "#research" },
  { name: "home-footer", path: "/", target: "footer" },
  { name: "about-formation", path: "/about", target: "#about-formation" },
  { name: "about-stack", path: "/about", target: "#about-stack" },
  { name: "blog-featured", path: "/blog", target: "main article" },
  { name: "blog-index", path: "/blog", target: "main section:last-of-type ol" },
  {
    name: "blog-detail-content",
    path: "/blog/llm-oracles-genlayer",
    target: "article h2",
  },
];

test.describe("below-fold focal baselines", () => {
  for (const theme of themes) {
    for (const region of focalRegions) {
      test(`${region.name} · desktop · ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await setTheme(page, theme);
        await gotoVisual(page, region.path);

        const target = page.locator(region.target).first();
        await expect(target).toBeVisible();
        await target.scrollIntoViewIfNeeded();
        await waitForUiAnimations(page);

        await expect(page.locator("html")).toHaveClass(
          theme === "dark" ? /(?:^|\s)dark(?:\s|$)/ : /^(?!.*(?:^|\s)dark(?:\s|$))/
        );
        await expect(page).toHaveScreenshot(`${region.name}-desktop-${theme}.png`);
      });
    }
  }
});
