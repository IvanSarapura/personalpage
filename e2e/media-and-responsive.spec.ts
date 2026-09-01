import { expect, test, type Page } from "@playwright/test";
import { gotoStable, setTheme } from "./helpers";

async function expectMinimumTargets(page: Page, minimum: number, diagnosticContext: string) {
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
    expect(box, `[${diagnosticContext}] control ${name} has no box`).not.toBeNull();
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
      `[${diagnosticContext}] control ${name} has an effective hit area narrower than ${minimum}px`
    ).toBeGreaterThanOrEqual(minimum);
    expect(
      hitArea.height,
      `[${diagnosticContext}] control ${name} has an effective hit area shorter than ${minimum}px`
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
    "/about",
    "/es/about",
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

test("About index is reserved for the desktop layout", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await gotoStable(page, "/about");

  const index = page.getByRole("navigation", { name: "On this page" });
  await expect(index).toBeHidden();

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(index).toBeVisible();
  await expect(index.getByRole("link")).toHaveCount(3);
  await expect(index).toHaveCSS("position", "static");
});

test("About uses four independent containers with aligned section dividers", async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 800 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await gotoStable(page, "/about");

    const structure = await page.locator("main > section").evaluateAll((sections) =>
      sections.map((section) => {
        const container = section.firstElementChild;
        const frame = container?.firstElementChild;
        const rect = frame?.getBoundingClientRect();

        return {
          containerChildren: section.children.length,
          containerTag: container?.tagName ?? null,
          frameLeft: rect?.left ?? null,
          frameRight: rect?.right ?? null,
          borderBlockStartWidth: frame ? getComputedStyle(frame).borderBlockStartWidth : null,
        };
      })
    );

    expect(structure).toHaveLength(4);
    expect(structure.map(({ containerChildren }) => containerChildren)).toEqual([1, 1, 1, 1]);
    expect(structure.map(({ containerTag }) => containerTag)).toEqual(["DIV", "DIV", "DIV", "DIV"]);
    expect(new Set(structure.map(({ frameLeft }) => frameLeft)).size).toBe(1);
    expect(new Set(structure.map(({ frameRight }) => frameRight)).size).toBe(1);
    const dividerWidths = structure
      .slice(1)
      .map(({ borderBlockStartWidth }) => borderBlockStartWidth);
    expect(new Set(dividerWidths).size).toBe(1);
    expect(Number.parseFloat(dividerWidths[0] ?? "0")).toBeGreaterThan(0);
  }
});

test("About working principles uses the compact vertical spacing", async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 800 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await gotoStable(page, "/about");

    const section = page.getByRole("region", { name: "Working principles" });
    const padding = await section.evaluate((element) => {
      const frame = element.querySelector(":scope > div > div");
      if (!frame) throw new Error("About principles frame not found");
      const style = getComputedStyle(frame);
      const markerSizes = Array.from(
        element.querySelectorAll("ol > li > span"),
        (marker) => getComputedStyle(marker).fontSize
      );
      return {
        blockStart: style.paddingBlockStart,
        blockEnd: style.paddingBlockEnd,
        markerSizes,
      };
    });
    expect(padding.blockStart).toBe("32px");
    expect(padding.blockEnd).toBe("32px");
    expect(padding.markerSizes).toEqual(["24px", "24px", "24px"]);

    const formation = page.getByRole("region", {
      name: "Education and professional practice",
    });
    const formationPadding = await formation.evaluate((element) => {
      const frame = element.querySelector(":scope > div > div");
      if (!frame) throw new Error("About formation frame not found");
      const style = getComputedStyle(frame);
      return { blockStart: style.paddingBlockStart, blockEnd: style.paddingBlockEnd };
    });
    expect(formationPadding).toEqual({ blockStart: "32px", blockEnd: "32px" });

    const stack = page.getByRole("region", { name: "Operating stack" });
    const stackPadding = await stack.evaluate((element) => {
      const frame = element.querySelector(":scope > div > div");
      if (!frame) throw new Error("About stack frame not found");
      const style = getComputedStyle(frame);
      return {
        blockStart: style.paddingBlockStart,
        blockEnd: style.paddingBlockEnd,
      };
    });
    expect(stackPadding.blockStart).toBe("32px");
    expect(stackPadding.blockEnd).toBe("32px");

    const heroPadding = await page.getByRole("heading", { level: 1 }).evaluate((heading) => {
      const hero = heading.closest("header");
      if (!hero) throw new Error("About hero header not found");
      const style = getComputedStyle(hero);
      return { blockStart: style.paddingBlockStart, blockEnd: style.paddingBlockEnd };
    });
    expect(heroPadding).toEqual({ blockStart: "32px", blockEnd: "32px" });
  }
});

test("blog article keeps navigation, metadata and editorial headings consistent", async ({
  page,
}) => {
  for (const locale of [
    { path: "/blog/zero-to-agent-v0", backText: "All posts", readingText: "4 min read" },
    {
      path: "/es/blog/zero-to-agent-v0",
      backText: "Todos los posts",
      readingText: "4 min de lectura",
    },
  ]) {
    for (const viewport of [
      { width: 320, height: 800 },
      { width: 390, height: 844 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await gotoStable(page, locale.path);

      const typography = await page
        .locator("article")
        .first()
        .evaluate((article) => {
          const title = article.querySelector("h1");
          const sectionHeading = article.querySelector("h2");
          const articleHeader = article.querySelector("header");
          const backLink = articleHeader?.querySelector("a");
          const backLinkLabel = backLink?.querySelector("span");
          const articleMeta = articleHeader?.querySelector("p");
          const titleStyle = title ? getComputedStyle(title) : null;
          const sectionStyle = sectionHeading ? getComputedStyle(sectionHeading) : null;
          const headerStyle = articleHeader ? getComputedStyle(articleHeader) : null;
          const backLinkStyle = backLink ? getComputedStyle(backLink) : null;
          const backLinkLabelStyle = backLinkLabel ? getComputedStyle(backLinkLabel) : null;
          const articleMetaStyle = articleMeta ? getComputedStyle(articleMeta) : null;

          return {
            titleFont: titleStyle?.fontFamily,
            sectionFont: sectionStyle?.fontFamily,
            titleSize: Number.parseFloat(titleStyle?.fontSize ?? "0"),
            sectionSize: Number.parseFloat(sectionStyle?.fontSize ?? "0"),
            headerMarginBottom: Number.parseFloat(headerStyle?.marginBottom ?? "0"),
            backLinkHeight: backLink?.getBoundingClientRect().height ?? 0,
            backLinkDisplay: backLinkStyle?.display,
            backLinkDecoration: backLinkLabelStyle?.textDecorationLine,
            backLinkSvgCount: backLink?.querySelectorAll("svg").length ?? 0,
            backLinkText: backLink?.textContent?.trim() ?? "",
            backLinkRight: backLink?.getBoundingClientRect().right ?? 0,
            articleMetaLeft: articleMeta?.getBoundingClientRect().left ?? 0,
            articleMetaFontSize: Number.parseFloat(articleMetaStyle?.fontSize ?? "0"),
            articleMetaText: articleMeta?.textContent?.trim() ?? "",
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          };
        });

      await expect(page.getByRole("link", { name: locale.backText })).toBeVisible();
      expect(typography.titleFont).toBe(typography.sectionFont);
      expect(typography.titleSize).toBeGreaterThan(typography.sectionSize);
      expect(typography.headerMarginBottom).toBe(32);
      expect(typography.backLinkHeight).toBeGreaterThanOrEqual(44);
      expect(typography.backLinkDisplay).toMatch(/^(inline-)?flex$/);
      expect(typography.backLinkDecoration).toContain("underline");
      expect(typography.backLinkSvgCount).toBe(1);
      expect(typography.backLinkText).toBe(locale.backText);
      expect(typography.articleMetaFontSize).toBe(16);
      expect(typography.articleMetaText).toBe(locale.readingText);
      if (viewport.width >= 390) {
        expect(typography.articleMetaLeft).toBeGreaterThanOrEqual(typography.backLinkRight);
      }
      expect(typography.overflow).toBeLessThanOrEqual(1);
    }
  }
});

test("blog articles use the navbar surface in both themes", async ({ page }) => {
  const articlePaths = [
    "/blog/llm-oracles-genlayer",
    "/blog/cruzar-bases-publicas-alimentarias",
    "/blog/evidencia-digital-cardano",
    "/blog/zero-to-agent-v0",
    "/es/blog/llm-oracles-genlayer",
    "/es/blog/cruzar-bases-publicas-alimentarias",
    "/es/blog/evidencia-digital-cardano",
    "/es/blog/zero-to-agent-v0",
  ];

  for (const theme of ["light", "dark"] as const) {
    for (const articlePath of articlePaths) {
      await setTheme(page, theme);
      await gotoStable(page, articlePath);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page.locator("nav").first()).not.toHaveClass(/navbarScrolled/);

      const surfaces = await page.evaluate(() => {
        const articleSection = document.querySelector("main > section");
        const navbar = document.querySelector("nav");

        return {
          article: articleSection ? getComputedStyle(articleSection).backgroundColor : null,
          navbar: navbar ? getComputedStyle(navbar).backgroundColor : null,
        };
      });

      expect(surfaces.article, `${articlePath} does not match the navbar surface`).toBe(
        surfaces.navbar
      );
    }
  }
});

test("about pages use the navbar surface in both themes", async ({ page }) => {
  for (const theme of ["light", "dark"] as const) {
    for (const aboutPath of ["/about", "/es/about"]) {
      await setTheme(page, theme);
      await gotoStable(page, aboutPath);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page.locator("nav").first()).not.toHaveClass(/navbarScrolled/);

      const surfaces = await page.evaluate(() => {
        const pageSection = document.querySelector("main > section");
        const navbar = document.querySelector("nav");

        return {
          page: pageSection ? getComputedStyle(pageSection).backgroundColor : null,
          navbar: navbar ? getComputedStyle(navbar).backgroundColor : null,
        };
      });

      expect(surfaces.page, `${aboutPath} does not match the navbar surface`).toBe(surfaces.navbar);
    }
  }
});

test("blog archive keeps a stable grid structure across breakpoints", async ({ page }) => {
  const viewports = [
    { width: 320, height: 844 },
    { width: 375, height: 844 },
    { width: 390, height: 844 },
    { width: 641, height: 900 },
    { width: 767, height: 900 },
    { width: 768, height: 900 },
    { width: 1024, height: 900 },
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

test("blog hero separates the title from its publication metrics", async ({ page }) => {
  const viewports = [
    { width: 375, height: 844 },
    { width: 1024, height: 900 },
    { width: 1440, height: 900 },
  ];

  await page.setViewportSize(viewports[0]!);
  await gotoStable(page, "/blog");

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);

    const layout = await page
      .locator("main header")
      .first()
      .evaluate((header) => {
        const title = header.querySelector("h1")?.getBoundingClientRect();
        const metrics = header.querySelector("dl")?.getBoundingClientRect();
        const metricGroups = [...header.querySelectorAll("dl > div")].map((group) => ({
          box: group.getBoundingClientRect(),
          label: group.querySelector("dt")?.getBoundingClientRect(),
          value: group.querySelector("dd")?.getBoundingClientRect(),
        }));

        return {
          titleBottom: title?.bottom ?? 0,
          titleLeft: title?.left ?? 0,
          metricsTop: metrics?.top ?? 0,
          metricsLeft: metrics?.left ?? 0,
          metricGroups,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        };
      });

    expect(layout.metricGroups).toHaveLength(2);
    for (const metric of layout.metricGroups) {
      expect(metric.label?.top ?? 0).toBeLessThanOrEqual(metric.value?.top ?? 0);
    }
    expect(layout.metricGroups[1]?.box.left).toBeGreaterThan(layout.metricGroups[0]?.box.left ?? 0);
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);

    if (viewport.width < 1024) {
      expect(layout.metricsTop).toBeGreaterThanOrEqual(layout.titleBottom);
    } else {
      expect(layout.metricsLeft).toBeGreaterThan(layout.titleLeft);
    }
  }
});

const POINTER_TARGET_ROUTES = [
  "/projects",
  "/",
  "/about",
  "/es/about",
  "/blog/llm-oracles-genlayer",
] as const;
const COARSE_TARGET_ROUTES = ["/projects", "/", "/about", "/es/about"] as const;

test.describe("minimum target sizes", () => {
  for (const route of POINTER_TARGET_ROUTES) {
    test(`pointer · ${route} · controls are at least 24px`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await gotoStable(page, route);
      await expectMinimumTargets(page, 24, `pointer · ${route}`);
    });
  }

  test("pointer · menu · controls are at least 24px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStable(page, "/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Main navigation menu" })).toBeVisible();
    await expectMinimumTargets(page, 24, "pointer · menu");
  });

  for (const route of COARSE_TARGET_ROUTES) {
    test(`coarse · ${route} · controls are at least 44px`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
      });

      try {
        const page = await context.newPage();
        await gotoStable(page, route);
        await expectMinimumTargets(page, 44, `coarse · ${route}`);
      } finally {
        await context.close();
      }
    });
  }

  test("coarse · menu · controls are at least 44px", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });

    try {
      const page = await context.newPage();
      await gotoStable(page, "/");
      await page.getByRole("button", { name: "Open menu" }).click();
      await expect(page.getByRole("dialog", { name: "Main navigation menu" })).toBeVisible();
      await expectMinimumTargets(page, 44, "coarse · menu");
    } finally {
      await context.close();
    }
  });
});
