import { expect, test } from "@playwright/test";
import {
  disconnectFixtureDatabase,
  getAnaFixture,
  restoreProjectTitle,
  type ProjectFixture,
} from "./support/marketplace-fixture";

test.afterAll(async () => {
  await disconnectFixtureDatabase();
});

test("Ana renames her seeded project and the fixture is restored", async ({
  page,
}) => {
  const fixture: ProjectFixture = await getAnaFixture();
  const temporaryTitle = `C6 E2E ${Date.now()}`;

  try {
    await page.goto("/login");
    await page.getByRole("button", { name: "Entrar como Ana" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText("Ana", { exact: true })).toBeVisible();

    await page.goto(`/dashboard/projects/${fixture.projectId}`);
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
    await restoreProjectTitle(fixture);
  }
});
