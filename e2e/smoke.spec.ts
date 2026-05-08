import { test, expect } from "@playwright/test";

/** Full happy-path needs env + Supabase test user — extend when credentials exist. */
test.describe("app shell", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("twitter-clone").first()).toBeVisible();
  });
});
