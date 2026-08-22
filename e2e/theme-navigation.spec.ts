import { expect, test, type Page } from "@playwright/test";

declare global {
  interface Window {
    __themeRegression?: {
      darkClassWasRemoved: boolean;
      darkAtFirstAnimationFrame: boolean | null;
    };
  }
}

async function expectDarkTheme(page: Page) {
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect
    .poll(() => page.locator("html").evaluate((element) => getComputedStyle(element).colorScheme))
    .toBe("dark");
}

async function expectThemeInitialization(page: Page) {
  await expect
    .poll(() => page.evaluate(() => window.__themeRegression?.darkAtFirstAnimationFrame))
    .toBe(true);
}

async function expectDarkWasNeverRemoved(page: Page) {
  await expect
    .poll(() => page.evaluate(() => window.__themeRegression?.darkClassWasRemoved))
    .toBe(false);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark");

    const state = {
      darkClassWasRemoved: false,
      darkAtFirstAnimationFrame: null as boolean | null,
    };
    window.__themeRegression = state;

    const observeRoot = () => {
      const root = document.documentElement;
      if (!root || root.dataset.themeRegressionObserved === "true") return;

      root.dataset.themeRegressionObserved = "true";
      new MutationObserver((records) => {
        for (let index = 0; index < records.length; index += 1) {
          const record = records[index];
          if (record?.type !== "attributes" || record.attributeName !== "class") continue;

          const hadDark = record.oldValue?.split(/\s+/).includes("dark") ?? false;
          const nextOldValue = records[index + 1]?.oldValue;
          const darkWasRemovedInSameTask =
            hadDark &&
            nextOldValue !== undefined &&
            !(nextOldValue?.split(/\s+/).includes("dark") ?? false);

          if (darkWasRemovedInSameTask || (hadDark && !root.classList.contains("dark"))) {
            state.darkClassWasRemoved = true;
          }
        }
      }).observe(root, { attributes: true, attributeFilter: ["class"], attributeOldValue: true });

      requestAnimationFrame(() => {
        state.darkAtFirstAnimationFrame = root.classList.contains("dark");
      });
    };

    observeRoot();
    new MutationObserver(observeRoot).observe(document, { childList: true, subtree: true });
  });
});

test("preserva dark en navegación de cliente por menú y footer", async ({ page }) => {
  const documentNavigations: string[] = [];
  page.on("request", (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
      documentNavigations.push(request.url());
    }
  });

  await page.goto("/");
  await expectDarkTheme(page);
  await expectThemeInitialization(page);
  documentNavigations.length = 0;

  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expectDarkTheme(page);
  expect(documentNavigations).toHaveLength(0);

  await page.getByRole("contentinfo").getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expectDarkTheme(page);
  expect(documentNavigations).toHaveLength(0);
  await expectDarkWasNeverRemoved(page);
});

test("aplica dark y no emite advertencias de hidratación tras reload duro", async ({ page }) => {
  const hydrationWarnings: string[] = [];
  page.on("console", (message) => {
    if (
      (message.type() === "warning" || message.type() === "error") &&
      /hydration|did not match|hydrated/i.test(message.text())
    ) {
      hydrationWarnings.push(message.text());
    }
  });

  await page.goto("/about");
  await expectDarkTheme(page);
  await expectThemeInitialization(page);
  await page.reload();
  await expectDarkTheme(page);
  await expectThemeInitialization(page);
  await expectDarkWasNeverRemoved(page);

  expect(hydrationWarnings).toEqual([]);
});
