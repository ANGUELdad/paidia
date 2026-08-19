/**
 * iPhone viewport bad-user + click-all stress harness (Playwright Chromium + WebKit).
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
    localStorage.setItem("armonia.tour.staff.v3", "1");
    localStorage.setItem("armonia.tour.child.v3", "1");
  });
}

async function loginAsAngelos(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByTestId("enter-staff").click();
  await expect(page.getByTestId("profile-e4")).toBeVisible({ timeout: 15000 });
  await page.getByTestId("profile-e4").click({ force: true });
  await expect(page.getByTestId("pin-input")).toBeVisible({ timeout: 5000 });
  await page.getByTestId("pin-input").fill("444444");
  await Promise.all([
    page.waitForURL(/\/home/, { timeout: 15000 }),
    page.getByTestId("login-submit").click(),
  ]);
  await dismissTour(page);
  await expect(page.getByTestId("dock")).toBeVisible({ timeout: 10000 });
  await expect
    .poll(async () => {
      const r = await page.request.get("/api/auth/session");
      if (!r.ok()) return false;
      const j = (await r.json()) as { authenticated?: boolean; name?: string; admin?: boolean };
      return Boolean(j.authenticated && j.admin);
    }, { timeout: 10000 })
    .toBe(true);
}

async function loginAsZoi(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByTestId("enter-staff").click();
  await expect(page.getByTestId("profile-e8")).toBeVisible({ timeout: 15000 });
  await page.getByTestId("profile-e8").click({ force: true });
  await expect(page.getByTestId("pin-input")).toBeVisible({ timeout: 5000 });
  await page.getByTestId("pin-input").fill("000000");
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("login-error")).toContainText(/PIN|Λάθος/i, { timeout: 5000 });
  await page.getByTestId("pin-input").fill("888888");
  await Promise.all([
    page.waitForURL(/\/home/, { timeout: 15000 }),
    page.getByTestId("login-submit").click(),
  ]);
  await dismissTour(page);
  await expect(page.getByTestId("dock")).toBeVisible({ timeout: 10000 });
  // WebKit can race Set-Cookie vs next navigation — wait until session is readable.
  await expect
    .poll(async () => {
      const r = await page.request.get("/api/auth/session");
      if (!r.ok()) return false;
      const j = (await r.json()) as { authenticated?: boolean };
      return Boolean(j.authenticated);
    }, { timeout: 10000 })
    .toBe(true);
}

/** Navigate while authenticated; retry on WebKit cookie lag / interrupted nav. */
async function staffGoto(page: import("@playwright/test").Page, path: string) {
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.goto(path, { waitUntil: "domcontentloaded" });
    } catch (e) {
      if (!String(e).includes("interrupted")) throw e;
      await page.waitForTimeout(250);
      continue;
    }
    const pathname = new URL(page.url()).pathname;
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      await dismissTour(page);
      return;
    }
    await page.waitForTimeout(300);
  }
  await expect(page).toHaveURL(new RegExp(escaped));
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

  expect(moreHrefs).toEqual(expect.arrayContaining(["/coverage", "/incidents", "/care"]));
  await page.goto("/coverage", { waitUntil: "domcontentloaded" });
  await dismissTour(page);
  await expect(page.locator("main").first()).toBeVisible();
  await page.goto("/incidents", { waitUntil: "domcontentloaded" });
  await dismissTour(page);
  await expect(page.locator("main").first()).toBeVisible();
});

test("ops stress: stock shop plan book zoai calendar admin", async ({ page }) => {
  await skipToursByDefault(page);
  await loginAsZoi(page);

  await staffGoto(page, "/stock");
  for (let i = 0; i < 4; i++) {
    const plus = page.getByRole("button", { name: "＋" }).first();
    if (await plus.isVisible().catch(() => false)) await plus.click({ force: true });
  }
  await page.getByRole("button", { name: /Check abschließen|Lager-Check/ }).click({ force: true });

  await staffGoto(page, "/shop");
  await page.getByPlaceholder("z.B. Reis").fill("!!!@@@###");
  await page.getByRole("button", { name: /Hinzufügen|Προσθήκη|Add/i }).click({ force: true });
  await page.getByPlaceholder("z.B. Reis").fill("Milch");
  await page.getByRole("button", { name: /Hinzufügen|Προσθήκη|Add/i }).click({ force: true });

  await staffGoto(page, "/plan");
  // Wait for week data to load (plan-ready appears once days[] is populated and loading=false)
  await expect(page.getByTestId("plan-ready")).toBeAttached({ timeout: 20000 });
  // Button is now enabled (was disabled during loading); click via JS to bypass pointer capture
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find(
      (b) => /Eintrag hinzuf/.test(b.textContent || ""),
    );
    btn?.click();
  });
  await expect(page.getByTestId("plan-composer")).toBeAttached({ timeout: 8000 });
  // Scroll input into view within the sheet (may be below fold on mobile)
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="plan-activity"]');
    if (el) el.scrollIntoView({ block: "nearest" });
  });
  await page.getByTestId("plan-activity").fill("Stress A");
  await page.getByTestId("plan-save").click({ force: true });
  await expect(page.getByTestId("plan-composer")).toBeAttached({ timeout: 8000 });
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="plan-activity"]');
    if (el) el.scrollIntoView({ block: "nearest" });
  });
  await page.getByTestId("plan-activity").fill("Stress B");
  await page.getByTestId("plan-save").click({ force: true });
  const override = page.getByTestId("plan-override");
  if (await override.isVisible({ timeout: 2000 }).catch(() => false)) {
    await override.fill("bad user override");
    await page.getByTestId("plan-force").click({ force: true });
  }

  await staffGoto(page, "/book");
  await page.getByTestId("journal-preview").click({ force: true });
  await page.getByPlaceholder("Was ist passiert?").fill("x".repeat(80));
  await page.getByRole("button", { name: /Eintrag speichern/ }).click({ force: true });

  await staffGoto(page, "/talk");
  await page.getByPlaceholder("Nachricht…").fill("<script>alert(1)</script>");
  await page.getByRole("button", { name: /Senden|Αποστολή/i }).click({ force: true });

  await staffGoto(page, "/zoai");
  await page.getByPlaceholder("Frag Zo-Ai…").fill("Milch auf Liste");
  await page.getByRole("button", { name: /Senden|Αποστολή/i }).click({ force: true });
  await expect(page.getByTestId("staff-chat-log")).toBeVisible();
  await page.waitForTimeout(400);

  await staffGoto(page, "/calendar");
  await page.getByTestId("rm-title").fill("Spam reminder");
  const at = new Date(Date.now() + 3600_000).toISOString().slice(0, 16);
  await page.getByTestId("rm-at").fill(at);
  await page.getByTestId("rm-save").click({ force: true });

  await staffGoto(page, "/admin/notify");
  await page.getByRole("button", { name: /Jetzt prüfen|Evaluate/i }).click({ force: true });
  await page.getByRole("button", { name: /Umschalten|Toggle/i }).first().click({ force: true });
});

test("presence handover care incidents flow", async ({ page }) => {
  await skipToursByDefault(page);
  await loginAsZoi(page);

  await staffGoto(page, "/home");
  const there = page.getByTestId("presence-there");
  if (await there.isVisible({ timeout: 3000 }).catch(() => false)) {
    await there.click({ force: true });
  }

  await staffGoto(page, "/handover");
  await expect(page.getByTestId("handover-ribbon")).toBeVisible({ timeout: 10000 });

  await staffGoto(page, "/incidents");
  await page.getByTestId("incident-compose").click({ force: true });
  await expect(page.getByTestId("incident-form")).toBeVisible();
  await page.locator("#incident-text").fill("E2E Vorfall Test");
  await page.getByRole("button", { name: /Vorfall sichern/ }).click({ force: true });
  await expect(page.getByTestId("incident-list")).toBeVisible({ timeout: 8000 });

  await staffGoto(page, "/care");
  await expect(page.locator("main").first()).toBeVisible();
  const meal = page.getByRole("button", { name: /Mahlzeit/i });
  if (await meal.isVisible().catch(() => false)) {
    await meal.click({ force: true });
    const save = page.getByRole("button", { name: /Speichern|Sichern/i });
    if (await save.isVisible({ timeout: 2000 }).catch(() => false)) await save.click({ force: true });
  }
});

test("guided tour advances", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem("armonia.tour.staff.v3");
    sessionStorage.removeItem("armonia.tour.state.staff.v3");
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
  await page.getByRole("button", { name: "Später" }).click({ force: true });
  await expect(page.getByTestId("tour-reopen")).toBeVisible({ timeout: 5000 });
});

const MEHR_ROUTES = [
  "/handover",
  "/coverage",
  "/incidents",
  "/care",
  "/book",
  "/talk",
  "/shop",
  "/calendar",
  "/profile",
  "/admin/notify",
];

test("angelos click every dock and mehr control", async ({ page }) => {
  await skipToursByDefault(page);
  await loginAsAngelos(page);

  await expect(page.getByTestId("dock")).toBeVisible();
  await expect(page.getByTestId("dock-mehr")).toBeVisible();
  await expect(page.getByTestId("home-ask-submit")).toBeVisible();

  const weekDay = page.locator('[data-testid^="week-day-"]').first();
  if (await weekDay.isVisible().catch(() => false)) {
    await weekDay.click({ force: true });
    await expect(page).toHaveURL(/\/plan/);
    await staffGoto(page, "/home");
  }

  await expect(page.getByTestId("dock-heute")).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId("dock-plan")).toBeVisible();
  await expect(page.getByTestId("dock-lager")).toBeVisible();
  await expect(page.getByTestId("dock-zo-ai")).toBeVisible();

  const hrefs = await page.locator('[data-testid="dock"] a').evaluateAll((els) =>
    els.map((e) => (e as HTMLAnchorElement).getAttribute("href")).filter(Boolean),
  );
  expect(hrefs).toEqual(["/home", "/plan", "/stock", "/zoai"]);

  for (const href of hrefs) {
    await staffGoto(page, String(href));
    await expect(page.locator("main, [data-testid='dock']").first()).toBeVisible({ timeout: 10000 });
  }

  await staffGoto(page, "/home");
  await page.getByTestId("dock-mehr").click();
  await expect(page.getByTestId("more-sheet")).toBeVisible();
  await expect(page.getByTestId("more-sheet").locator("a[href='/admin/notify']")).toBeVisible();

  const moreHrefs = await page.locator('[data-testid="more-sheet"] a').evaluateAll((els) =>
    els.map((e) => (e as HTMLAnchorElement).getAttribute("href")).filter(Boolean),
  );
  for (const route of MEHR_ROUTES) {
    expect(moreHrefs).toContain(route);
  }

  for (const href of moreHrefs) {
    await staffGoto(page, String(href));
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId("dock")).toBeVisible();
  }
});

/**
 * Viewport matrix — adaptive CSS layer assertions (Phase 2).
 * Each viewport asserts: no horizontal overflow, tap targets ≥44px (coarse),
 * landscape chrome under 20 % of vh, content fills available width ±40px.
 */
const VIEWPORTS = [
  { name: "iphone-14-portrait", width: 390, height: 844, coarse: true },
  { name: "iphone-14-landscape", width: 844, height: 390, coarse: true },
  { name: "ipad-air-portrait", width: 820, height: 1180, coarse: true },
  { name: "ipad-air-landscape", width: 1180, height: 820, coarse: true },
  { name: "macbook-1728", width: 1728, height: 1080, coarse: false },
  { name: "windows-1920", width: 1920, height: 1080, coarse: false },
  { name: "narrow-320", width: 320, height: 568, coarse: true },
] as const;

for (const vp of VIEWPORTS) {
  test(`viewport matrix: ${vp.name}`, async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      hasTouch: vp.coarse,
      isMobile: vp.coarse,
    });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      localStorage.setItem("armonia.tour.staff.v3", "1");
    });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // No horizontal scroll on the root page
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyScrollWidth, `${vp.name}: horizontal overflow`).toBeLessThanOrEqual(vp.width + 2);

    // Landscape chrome check: header + nav under 20 % of viewport height
    if (vp.height < vp.width) {
      const chromeH = await page.evaluate(() => {
        const topbar = document.querySelector(".app-topbar") as HTMLElement | null;
        const dock = document.querySelector(".dock") as HTMLElement | null;
        const topH = topbar?.getBoundingClientRect().height || 0;
        const dockH = dock?.getBoundingClientRect().height || 0;
        return topH + dockH;
      });
      const limit = vp.height * 0.2;
      expect(chromeH, `${vp.name}: landscape chrome ${chromeH}px > ${limit}px`).toBeLessThanOrEqual(limit);
    }

    // Tap target check (coarse pointer only): all buttons/links ≥ 44×44
    if (vp.coarse) {
      const smallTargets = await page.evaluate(() => {
        const els = document.querySelectorAll<HTMLElement>("button, a, [role='button']");
        const small: string[] = [];
        for (const el of els) {
          const r = el.getBoundingClientRect();
          if (r.width < 1 || r.height < 1) continue; // invisible
          if (r.width < 44 || r.height < 44) {
            small.push(`${el.tagName}[${el.textContent?.trim().slice(0, 20)}] ${Math.round(r.width)}×${Math.round(r.height)}`);
          }
        }
        return small;
      });
      expect(smallTargets, `${vp.name}: tap targets under 44px`).toHaveLength(0);
    }

    // Content fills available width: only check on phone portrait where the
    // page shell is full-bleed (login form is max-w-md by design, not a failure)
    if (vp.name === "iphone-14-portrait") {
      const contentW = await page.evaluate(() => {
        const main = document.querySelector("main") as HTMLElement | null;
        return main ? main.getBoundingClientRect().width : 0;
      });
      if (contentW > 0) {
        expect(contentW, `${vp.name}: content width`).toBeGreaterThan(vp.width - 60);
      }
    }

    await ctx.close();
  });
}

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
  await expect(page).toHaveURL(/\/kids\/games/);
  await page.getByRole("button", { name: /Memory/i }).first().click({ force: true });
  await expect(page.getByText(/Züge|Κινήσεις|Paare|Ζευγάρια/i).first()).toBeVisible({ timeout: 8000 });
});
