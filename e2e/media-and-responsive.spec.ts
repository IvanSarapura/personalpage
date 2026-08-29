import { expect, test, type Page } from "@playwright/test";
import { gotoStable } from "./helpers";

async function expectMinimumTargets(page: Page, minimum: number) {
  const controls = page.locator(
    ":is(nav, main, footer, [role='dialog']) :is(a[href], button, input:not([type='hidden']), select, textarea, [role='button'], [role='link'], [role='switch']):visible"
  );

  for (let index = 0; index < (await controls.count()); index += 1) {
    const control = controls.nth(index);
    const exemption = await control.evaluate((element) => {
      if (
        element instanceof HTMLInputElement &&
        element.tabIndex === -1 &&
        Boolean(element.closest('[aria-hidden="true"]'))
      ) {
        return "non-operable anti-spam honeypot";
      }
      if (
        element instanceof HTMLAnchorElement &&
        getComputedStyle(element).display === "inline" &&
        Boolean(element.closest("p, figcaption, blockquote"))
      ) {
        return "inline prose link";
      }
      return null;
    });
    // WCAG 2.5.8 explicitly exempts inline links inside blocks of prose. The
    // aria-hidden/tabIndex=-1 honeypot is intentionally not user-operable.
    if (exemption) continue;

    const box = await control.boundingBox();
    const label = (await control.getAttribute("aria-label")) ?? (await control.textContent());
    const name =
      label?.trim() ||
      (await control.evaluate(
        (element, fallback) =>
          `${element.tagName.toLowerCase()}${element.getAttribute("href") ? `[href="${element.getAttribute("href")}"]` : ""} (${fallback})`,
        index
      ));
    expect(box, `control ${name} has no box`).not.toBeNull();
    const hitArea = await control.evaluate((element, boxSize) => {
      const pseudo = getComputedStyle(element, "::after");
      const pseudoWidth = pseudo.content === "none" ? 0 : Number.parseFloat(pseudo.width);
      const pseudoHeight = pseudo.content === "none" ? 0 : Number.parseFloat(pseudo.height);
      return {
        width: Math.max(boxSize.width, pseudoWidth || 0),
        height: Math.max(boxSize.height, pseudoHeight || 0),
      };
    }, box!);
    expect(
      hitArea.width,
      `control ${name} has an effective hit area narrower than ${minimum}px`
    ).toBeGreaterThanOrEqual(minimum);
    expect(
      hitArea.height,
      `control ${name} has an effective hit area shorter than ${minimum}px`
    ).toBeGreaterThanOrEqual(minimum);
  }
}

test("reduced motion neutralizes menu transforms and theme transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoStable(page, "/");

  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Main navigation menu" });
  const firstMenuLink = dialog.getByRole("link").first();
  await expect(firstMenuLink).toBeVisible();
  const motion = await firstMenuLink.evaluate((element) => {
    const item = element.closest("li");
    const linkStyle = getComputedStyle(element);
    const itemStyle = item ? getComputedStyle(item) : null;
    return {
      itemTransform: itemStyle?.transform,
      itemTransitionDurations: itemStyle?.transitionDuration.split(", "),
      linkTransform: linkStyle.transform,
      linkTransitionDurations: linkStyle.transitionDuration.split(", "),
    };
  });
  expect(motion.itemTransform).toBe("none");
  expect(motion.linkTransform).toBe("none");
  expect(motion.itemTransitionDurations?.every((duration) => duration === "0s")).toBe(true);
  expect(motion.linkTransitionDurations.every((duration) => duration === "0s")).toBe(true);

  await page
    .getByRole("dialog", { name: "Main navigation menu" })
    .getByRole("button", { name: "Close menu" })
    .click();
  await page.getByRole("switch", { name: "Color theme" }).click();
  await expect(page.locator("html")).not.toHaveClass(/theme-transitioning/);
});

test("forced colors preserves focus and theme-switch operability", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Forced-colors emulation is verified in Chromium.");
  await page.emulateMedia({ forcedColors: "active" });
  await gotoStable(page, "/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  const outline = await skipLink.evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(outline).not.toBe("none");

  const themeSwitch = page.getByRole("switch", { name: "Color theme" });
  await themeSwitch.focus();
  const switchFocus = await themeSwitch.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    };
  });
  expect(switchFocus.outlineStyle).not.toBe("none");
  expect(switchFocus.outlineWidth).toBeGreaterThanOrEqual(2);
  await page.keyboard.press("Space");
  await expect(themeSwitch).toHaveAttribute("aria-checked", "true");
});

test("content reflows at a 320px viewport without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });

  for (const route of [
    "/",
    "/projects",
    "/projects/proven",
    "/blog",
    "/es/blog",
    "/blog/llm-oracles-genlayer",
  ]) {
    await gotoStable(page, route);
    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(overflow.scrollWidth, `${route} overflows horizontally`).toBeLessThanOrEqual(
      overflow.clientWidth + 1
    );
  }
});

test("blog archive keeps a stable grid structure across breakpoints", async ({ page }) => {
  const viewports = [
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1440, height: 900 },
  ];

  await page.setViewportSize(viewports[0]!);
  await gotoStable(page, "/blog");

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);

    const layout = await page
      .locator("ol article")
      .first()
      .evaluate((article) => {
        const style = getComputedStyle(article);
        const copy = article.querySelector<HTMLElement>("[class*='archiveCopy']");
        const tags = article.querySelector<HTMLElement>("[class*='archiveTags']");

        return {
          areas: style.gridTemplateAreas,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          copyLeft: copy?.getBoundingClientRect().left ?? 0,
          tagsLeft: tags?.getBoundingClientRect().left ?? 0,
        };
      });

    expect(
      layout.overflow,
      `${viewport.width}px blog layout overflows horizontally`
    ).toBeLessThanOrEqual(1);
    if (viewport.width < 768) {
      expect(layout.areas).toContain('"index meta"');
      expect(layout.areas).toContain('"index copy"');
      expect(layout.areas).toContain('"index tags"');
    } else if (viewport.width < 1024) {
      expect(layout.areas).toContain('"index meta copy"');
      expect(layout.areas).toContain('"index meta tags"');
    } else {
      expect(layout.areas).toBe('"index meta copy tags"');
      expect(layout.tagsLeft).toBeGreaterThan(layout.copyLeft);
    }
  }
});

test("controls meet minimum pointer and coarse-pointer target sizes", async ({ browser }) => {
  test.slow();
  const pointerContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pointerPage = await pointerContext.newPage();
  for (const route of ["/projects", "/", "/blog/llm-oracles-genlayer"]) {
    await gotoStable(pointerPage, route);
    await expectMinimumTargets(pointerPage, 24);
  }
  await gotoStable(pointerPage, "/");
  await pointerPage.getByRole("button", { name: "Open menu" }).click();
  await expect(pointerPage.getByRole("dialog", { name: "Main navigation menu" })).toBeVisible();
  await expectMinimumTargets(pointerPage, 24);
  await pointerContext.close();

  const coarseContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const coarsePage = await coarseContext.newPage();
  for (const route of ["/projects", "/"]) {
    await gotoStable(coarsePage, route);
    await expectMinimumTargets(coarsePage, 44);
  }
  await coarsePage.getByRole("button", { name: "Open menu" }).click();
  await expect(coarsePage.getByRole("dialog", { name: "Main navigation menu" })).toBeVisible();
  await expectMinimumTargets(coarsePage, 44);
  await coarseContext.close();
});
