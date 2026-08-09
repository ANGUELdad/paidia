/**
 * iPhone viewport bad-user + click-all stress harness (Playwright / Chromium).
 */
import { test, expect } from "@playwright/test";

async function dismissTour(page: import("@playwright/test").Page) {
  for (let i = 0; i < 3; i++) {
    const later = page.getByRole("button", { name: "Später" });
    if (await later.isVisible({ timeout: 800 }).catch(() => false)) {
      await later.click({ force: true });
      await page.waitForTimeout(150);
    } else break;
  }
}

async function skipToursByDefault(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.setItem("armonia.tour.staff", "1");
    localStorage.setItem("armonia.tour.child", "1");
  });
}

async function loginAsZoi(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByTestId("enter-staff").click();
  await page.getByTestId("profile-e8").click();
  await page.getByTestId("pin-input").fill("000000");
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("login-error")).toContainText(/PIN|Λάθος/i, { timeout: 5000 });
  await page.getByTestId("pin-input").fill("888888");
  await Promise.all([
    page.waitForURL(/\/home/, { timeout: 15000 }),
    page.getByTestId("login-submit").click(),
  ]);
  await dismissTour(page);
}

test("bad user login then click every dock control", async ({ page }) => {
  await skipToursByDefault(page);
  await loginAsZoi(page);
  await expect(page.getByTestId("dock")).toBeVisible();
  await expect(page.getByTestId("dock-mehr")).toBeVisible();

  const hrefs = await page.locator('[data-testid="dock"] a').evaluateAll((els) =>
    els.map((e) => (e as HTMLAnchorElement).getAttribute("href")).filter(Boolean)
  );
  expect(hrefs).toEqual(["/home", "/plan", "/stock", "/zoai"]);

  const dockControls = page.locator('[data-testid="dock"] > *');
  await expect(dockControls).toHaveCount(5);

  for (const href of hrefs) {
    await page.goto(String(href), { waitUntil: "domcontentloaded" });
    await dismissTour(page);
    await expect(page.locator("main, [data-testid='dock']").first()).toBeVisible({ timeout: 10000 });
  }

  await page.goto("/home", { waitUntil: "domcontentloaded" });
  await dismissTour(page);
  await page.getByTestId("dock-mehr").click();
  await expect(page.getByTestId("more-sheet")).toBeVisible();

  const moreHrefs = await page.locator('[data-testid="more-sheet"] a').evaluateAll((els) =>
    els.map((e) => (e as HTMLAnchorElement).getAttribute("href")).filter(Boolean)
  );
  expect(moreHrefs.length).toBeGreaterThan(0);

  for (const href of moreHrefs) {
    await page.goto(String(href), { waitUntil: "domcontentloaded" });
    await dismissTour(page);
    await expect(page.locator("main, [data-testid='dock']").first()).toBeVisible({ timeout: 10000 });
  }
});

test("ops stress: stock spam, shop spam, plan conflict, zoai, calendar", async ({ page }) => {
  await skipToursByDefault(page);
  await loginAsZoi(page);

  await page.goto("/stock", { waitUntil: "domcontentloaded" });
  await dismissTour(page);
  for (let i = 0; i < 4; i++) {
    const plus = page.getByRole("button", { name: "＋" }).first();
    if (await plus.isVisible().catch(() => false)) await plus.click({ force: true });
  }
  await page.getByRole("button", { name: /Lager-Check/ }).click({ force: true });

  await page.goto("/shop", { waitUntil: "domcontentloaded" });
  await page.getByPlaceholder("z.B. Reis").fill("!!!@@@###");
  await page.getByRole("button", { name: "Add" }).click({ force: true });
  await page.getByPlaceholder("z.B. Reis").fill("Milch");
  await page.getByRole("button", { name: "Add" }).click({ force: true });

  await page.goto("/plan", { waitUntil: "domcontentloaded" });
  await dismissTour(page);
  await page.getByTestId("plan-activity").fill("Stress A");
  await page.getByTestId("plan-save").click({ force: true });
  await page.getByTestId("plan-activity").fill("Stress B");
  await page.getByTestId("plan-save").click({ force: true });
  const override = page.getByTestId("plan-override");
  if (await override.isVisible({ timeout: 2000 }).catch(() => false)) {
    await override.fill("bad user override");
    await page.getByTestId("plan-force").click({ force: true });
  }

  await page.goto("/book", { waitUntil: "domcontentloaded" });
  await page.getByPlaceholder("Was ist passiert?").fill("x".repeat(200));
  await page.getByRole("button", { name: /Eintrag speichern/ }).click({ force: true });

  await page.goto("/talk", { waitUntil: "domcontentloaded" });
  await page.getByPlaceholder("Nachricht…").fill("<script>alert(1)</script>");
  await page.getByRole("button", { name: "Senden" }).click({ force: true });

  await page.goto("/zoai", { waitUntil: "domcontentloaded" });
  await page.getByPlaceholder("Frag Zo-Ai…").fill("Milch auf Liste");
  await page.getByRole("button", { name: "Senden" }).click({ force: true });
  await page.waitForTimeout(400);

  await page.goto("/calendar", { waitUntil: "domcontentloaded" });
  await dismissTour(page);
  await page.getByTestId("rm-title").fill("Spam reminder");
  const at = new Date(Date.now() + 3600_000).toISOString().slice(0, 16);
  await page.getByTestId("rm-at").fill(at);
  await page.getByTestId("rm-save").click({ force: true });

  await page.goto("/admin/notify", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Evaluate now" }).click({ force: true });
  await page.getByRole("button", { name: "Toggle" }).first().click({ force: true });
});

test("guided tour advances", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem("armonia.tour.staff");
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByTestId("enter-staff").click();
  await page.getByTestId("profile-e8").click();
  await page.getByTestId("pin-input").fill("888888");
  await Promise.all([
    page.waitForURL(/\/home/, { timeout: 15000 }),
    page.getByTestId("login-submit").click(),
  ]);
  await expect(page.getByTestId("guided-tour")).toBeVisible({ timeout: 8000 });
  await page.getByTestId("tour-next").click({ force: true });
  await page.getByTestId("tour-go").click({ force: true });
  await page.getByRole("button", { name: "Später" }).click({ force: true });
  await expect(page.getByTestId("tour-reopen")).toBeVisible({ timeout: 5000 });
});

test("child mode isolated", async ({ page }) => {
  await skipToursByDefault(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByTestId("enter-child").click();
  await page.getByTestId("profile-k1").click();
  await page.getByTestId("pin-input").fill("121212");
  await Promise.all([
    page.waitForURL(/\/kids/, { timeout: 15000 }),
    page.getByTestId("login-submit").click(),
  ]);
  await dismissTour(page);
  await expect(page.getByTestId("dock-lager")).toHaveCount(0);
  await page.getByTestId("dock-spiele").click();
  await page.getByRole("button", { name: /Memory/i }).first().click({ force: true });
});
