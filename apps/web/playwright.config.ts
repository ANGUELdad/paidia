import path from "path";
import { defineConfig, devices } from "@playwright/test";

const iPhone = devices["iPhone 14"];
const repoRoot = path.join(__dirname, "../..");
const python = process.platform === "win32"
  ? path.join(repoRoot, ".venv", "Scripts", "python.exe")
  : path.join(repoRoot, ".venv", "bin", "python");

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  webServer: [
    {
      command: `"${python}" -m uvicorn armonia.main:app --host 127.0.0.1 --port 8000`,
      cwd: path.join(repoRoot, "apps", "api"),
      env: { ...process.env, PYTHONPATH: path.join(repoRoot, "apps", "api") },
      url: "http://127.0.0.1:8000/api/health",
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: "npx next dev --turbopack -H 127.0.0.1 -p 3000",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
  use: {
    baseURL: process.env.BASE_URL || "http://127.0.0.1:3000",
    trace: "on-first-retry",
    ...iPhone,
    isMobile: true,
    hasTouch: true,
  },
  projects: [
    {
      name: "iphone-14-chromium",
      use: {
        ...iPhone,
        browserName: "chromium",
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "iphone-14-webkit",
      use: {
        ...iPhone,
        browserName: "webkit",
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
