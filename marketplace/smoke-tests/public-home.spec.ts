import { expect, test } from "@playwright/test";

test("the deployed application serves its public home", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
});
