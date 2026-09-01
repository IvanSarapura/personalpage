import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import {
  formatAxeViolations,
  gotoStable,
  setTheme,
  waitForUiAnimations,
  type Theme,
} from "./helpers";

const routes = [
  "/",
  "/es",
  "/about",
  "/es/about",
  "/projects",
  "/research",
  "/blog",
  "/es/blog",
  "/projects/proven",
  "/blog/llm-oracles-genlayer",
];
const themes: Theme[] = ["light", "dark"];
const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function expectNoAxeViolations(page: Page) {
  await waitForUiAnimations(page);
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  expect(results.violations, formatAxeViolations(results.violations)).toEqual([]);
}

for (const theme of themes) {
  test.describe(`${theme} theme`, () => {
    for (const route of routes) {
      test(`${route} has no WCAG 2.2 AA axe violations`, async ({ page }) => {
        await setTheme(page, theme);
        await gotoStable(page, route);

        await expect(page.locator("html")).toHaveClass(
          theme === "dark" ? /(?:^|\s)dark(?:\s|$)/ : /^(?!.*(?:^|\s)dark(?:\s|$))/
        );

        await expectNoAxeViolations(page);
      });
    }
  });
}

test.describe("interactive states", () => {
  test("open fullscreen menu has no axe violations", async ({ page }) => {
    await gotoStable(page, "/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Main navigation menu" })).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test("invalid contact form has no axe violations", async ({ page }) => {
    await gotoStable(page, "/");
    const name = page.getByLabel("Name");
    await name.fill("x");
    await page.getByLabel("Email").focus();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expectNoAxeViolations(page);
  });

  test("pressed project filter has no axe violations", async ({ page }) => {
    await gotoStable(page, "/projects");
    const web3 = page.getByRole("button", { name: "Web3" });
    await web3.click();
    await expect(web3).toHaveAttribute("aria-pressed", "true");
    await expectNoAxeViolations(page);
  });
});
