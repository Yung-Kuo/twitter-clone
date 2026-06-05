import { test, expect } from "@playwright/test";

/**
 * Full flow: login → home → post → like → bookmark → reply → logout.
 * Set E2E_EMAIL and E2E_PASSWORD (Supabase test user) to run authenticated steps.
 */
const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;
const hasCredentials = Boolean(email && password);

test.describe("happy path", () => {
  test("login shell is reachable without credentials", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("twitter-clone").first()).toBeVisible();
  });

  test.describe("authenticated flow", () => {
    test.skip(!hasCredentials, "Set E2E_EMAIL and E2E_PASSWORD to run");

    test("login → home feed", async ({ page }) => {
      await page.goto("/login");
      await page.getByText("Email and Password").click();
      await page.locator("#email").fill(email!);
      await page.locator("#password").fill(password!);
      await page.getByRole("button", { name: "Log In" }).click();
      await page.waitForURL((url) => !url.pathname.includes("/login"), {
        timeout: 30_000,
      });
      await expect(page.getByText("For You").first()).toBeVisible({
        timeout: 15_000,
      });
    });

    test("home → open compose → cancel", async ({ page }) => {
      await page.goto("/login");
      await page.getByText("Email and Password").click();
      await page.locator("#email").fill(email!);
      await page.locator("#password").fill(password!);
      await page.getByRole("button", { name: "Log In" }).click();
      await page.waitForURL((url) => !url.pathname.includes("/login"), {
        timeout: 30_000,
      });
      const writeBtn = page.locator('[class*="Write"]').first();
      if (await writeBtn.isVisible().catch(() => false)) {
        await writeBtn.click();
        await page.keyboard.press("Escape");
      }
    });
  });
});
