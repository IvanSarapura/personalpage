import { expect, test } from "@playwright/test";
import { gotoStable, holdContactAction } from "./helpers";

test("fullscreen menu traps focus, closes with Escape and restores focus", async ({ page }) => {
  await gotoStable(page, "/");
  const trigger = page.getByRole("button", { name: "Open menu" });

  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Main navigation menu" });
  await expect(dialog).toBeVisible();
  const focusable = dialog.locator(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable.first();
  const last = focusable.last();
  await expect(first).toBeFocused();

  await last.focus();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(last).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("project filters expose and update their pressed state", async ({ page }) => {
  await gotoStable(page, "/projects");
  const all = page.getByRole("button", { name: "All" });
  const web3 = page.getByRole("button", { name: "Web3" });

  await expect(all).toHaveAttribute("aria-pressed", "true");
  await web3.click();

  await expect(web3).toHaveAttribute("aria-pressed", "true");
  await expect(all).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("article")).toHaveCount(2);
  await expect(page.getByRole("article").getByRole("heading", { level: 3 })).toHaveText([
    "Chain of Custody on Cardano",
    "EcoTrace",
  ]);
});

test("contact form validates on blur and exposes a deterministic pending state", async ({
  page,
}) => {
  await gotoStable(page, "/");
  const name = page.getByLabel("Name");
  const email = page.getByLabel("Email");
  const message = page.getByLabel("Message");

  await name.focus();
  await name.fill("x");
  await email.focus();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Enter your name (2 to 80 characters).")).toBeVisible();

  await name.fill("Ada Lovelace");
  await expect(name).not.toHaveAttribute("aria-invalid", "true");
  await email.fill("ada@example.com");
  await message.fill("I would like to discuss a concrete legal engineering project.");

  const contactAction = await holdContactAction(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await contactAction.matched;

  try {
    const form = page.locator("form");
    await expect(form).toHaveAttribute("aria-busy", "true");
    await expect(page.getByRole("button", { name: "Sending message" })).toBeDisabled();
    expect(contactAction.matchedCount()).toBe(1);
  } finally {
    // The Server Action is aborted: tests never execute the mutation or send email.
    await contactAction.release();
  }
});

test("theme switch persists the selected theme", async ({ page }) => {
  await gotoStable(page, "/");
  const themeSwitch = page.getByRole("switch", { name: "Color theme" });

  await expect(themeSwitch).toHaveAttribute("aria-checked", "false");
  await themeSwitch.click();
  await expect(themeSwitch).toHaveAttribute("aria-checked", "true");
  await expect(page.locator("html")).toHaveClass(/(?:^|\s)dark(?:\s|$)/);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/(?:^|\s)dark(?:\s|$)/);
});

test("locale switch keeps canonical public paths", async ({ page }) => {
  await gotoStable(page, "/");
  await expect(page.getByRole("link", { name: "Ver en español" })).toHaveAttribute("href", "/es");

  await gotoStable(page, "/projects");
  await expect(page.getByRole("link", { name: "Ver en español" })).toHaveAttribute(
    "href",
    "/es/projects"
  );

  await gotoStable(page, "/es/projects");
  await expect(page.getByRole("link", { name: "View in English" })).toHaveAttribute(
    "href",
    "/projects"
  );
});

test("keyboard focus is visible on the skip link", async ({ page }) => {
  await gotoStable(page, "/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  const focusStyle = await skipLink.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    };
  });
  expect(focusStyle.outlineStyle).not.toBe("none");
  expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(2);
});
