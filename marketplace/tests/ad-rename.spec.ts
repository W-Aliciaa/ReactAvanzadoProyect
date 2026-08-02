import { expect, test } from "@playwright/test";
import {
  disconnectFixtureDatabase,
  getAnaFixture,
  restoreAdTitle,
  type AdFixture,
} from "./support/marketplace-fixture";

test.afterAll(async () => {
  await disconnectFixtureDatabase();
});

test("Ana renames her seeded ad and the fixture is restored", async ({
  page,
}) => {
  const fixture: AdFixture = await getAnaFixture();
  const temporaryTitle = `C6 E2E ${Date.now()}`;

  try {
    await page.goto("/login");
    await page.getByRole("button", { name: "Entrar como Ana" }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("Ana", { exact: true })).toBeVisible();

    await page.goto(`/ads/${fixture.adId}`);
    await expect(
      page.getByRole("heading", { name: fixture.originalTitle }),
    ).toBeVisible();

    await page.getByLabel("Nuevo título").fill(temporaryTitle);
    await page.getByRole("button", { name: "Guardar título" }).click();

    await expect(page.getByText("Título actualizado.", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: temporaryTitle }),
    ).toBeVisible();
  } finally {
    await restoreAdTitle(fixture);
  }
});
