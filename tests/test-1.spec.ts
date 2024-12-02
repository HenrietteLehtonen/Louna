import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:5500/");
  await page.locator("#log-in i").click();
  await page
    .locator("div")
    .filter({ hasText: "KIRJAUDU Unohtuiko salasana?" })
    .getByRole("button")
    .first()
    .click();
});
