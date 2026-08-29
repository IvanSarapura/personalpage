import { expect, type Locator, type Page, type Route } from "@playwright/test";

export type Theme = "light" | "dark";
const baseURL = `http://localhost:${process.env.PLAYWRIGHT_PORT ?? 3100}`;

export async function setTheme(page: Page, theme: Theme) {
  await page.addInitScript((selectedTheme) => {
    window.localStorage.setItem("theme", selectedTheme);
  }, theme);
}

export async function waitForStablePage(page: Page) {
  await expect(page.locator("main")).toBeVisible();
  // The fullscreen menu is client-only. Its portal is a stable signal that
  // React hydration completed before a test clicks interactive controls.
  await page.locator("#fullscreen-menu-dialog").waitFor({ state: "attached" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images, (image) => {
        if (image.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        });
      })
    );
  });
}

/**
 * Waits for finite UI motion in a scope to reach its computed end state.
 * This uses the browser animation timeline rather than an arbitrary delay, so
 * staggered transitions are covered without making fast/reduced-motion runs wait.
 */
export async function waitForUiAnimations(page: Page, scope?: Locator) {
  const root = scope ?? page.locator("html");
  await root.evaluate(async (element) => {
    // Flush the current style update so newly-created CSS transitions are visible
    // through the Web Animations API before collecting them.
    element.getBoundingClientRect();
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const animations = element.getAnimations({ subtree: true }).filter((animation) => {
      const iterations = animation.effect?.getTiming().iterations;
      return iterations !== Infinity && ["pending", "running"].includes(animation.playState);
    });

    await Promise.allSettled(animations.map((animation) => animation.finished));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  });
}

export async function prepareVisualPage(page: Page) {
  await waitForStablePage(page);
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        caret-color: transparent !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
      }
    `,
  });
}

export async function gotoStable(page: Page, path: string) {
  const expectedURL = new URL(path, baseURL).toString();
  await page.setExtraHTTPHeaders({ "Cache-Control": "no-cache", Pragma: "no-cache" });
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });

  expect(response, `${path} did not return a document response`).not.toBeNull();
  expect(response!.status(), `${path} returned HTTP ${response!.status()}`).toBe(200);
  expect(response!.ok(), `${path} returned a non-success response`).toBe(true);
  await expect(page).toHaveURL(expectedURL);
  await waitForStablePage(page);
}

export async function gotoVisual(page: Page, path: string) {
  await gotoStable(page, path);
  await prepareVisualPage(page);
}

export async function holdContactAction(page: Page) {
  let releaseRequest!: () => void;
  let markMatched!: () => void;
  let markDone!: () => void;
  let matchedCount = 0;
  const released = new Promise<void>((resolve) => {
    releaseRequest = resolve;
  });
  const matched = new Promise<void>((resolve) => {
    markMatched = resolve;
  });
  const done = new Promise<void>((resolve) => {
    markDone = resolve;
  });

  const handler = async (route: Route) => {
    const request = route.request();
    const isContactAction =
      request.method() === "POST" &&
      new URL(request.url()).pathname === "/" &&
      Boolean(await request.headerValue("next-action"));

    if (!isContactAction) {
      await route.continue();
      return;
    }

    matchedCount += 1;
    markMatched();
    await released;
    try {
      await route.abort("blockedbyclient");
    } finally {
      markDone();
    }
  };

  await page.route("**/*", handler);

  return {
    matched,
    matchedCount: () => matchedCount,
    async release() {
      releaseRequest();
      await done;
      await page.unroute("**/*", handler);
    },
  };
}

export function formatAxeViolations(
  violations: Array<{ id: string; impact?: string | null; help: string; nodes: unknown[] }>
) {
  return violations
    .map(
      ({ id, impact, help, nodes }) =>
        `${impact ?? "unknown"}: ${id} — ${help} (${nodes.length} node${nodes.length === 1 ? "" : "s"})`
    )
    .join("\n");
}
