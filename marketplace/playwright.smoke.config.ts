import { defineConfig, devices } from "@playwright/test";

const deployedBaseUrl = process.env.SMOKE_BASE_URL;
const localBaseUrl = "http://localhost:3001";

export default defineConfig({
  testDir: "./smoke-tests",
  reporter: "list",
  use: {
    baseURL: deployedBaseUrl ?? localBaseUrl,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: deployedBaseUrl
    ? undefined
    : {
        command: "npm run start -- --port 3001",
        url: localBaseUrl,
        reuseExistingServer: false,
        timeout: 120_000,
      },
});
