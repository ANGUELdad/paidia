import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";

const out = "/tmp/paidia-fix-qa";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE", m.text());
});
await page.goto("https://paidia-platform.vercel.app/", { waitUntil: "domcontentloaded" });
await page.getByTestId("enter-staff").click();
await page.getByTestId("profile-e8").waitFor({ state: "visible", timeout: 25000 });
await page.getByTestId("profile-e8").click();
await page.getByTestId("pin-input").fill("888888");
await Promise.all([page.waitForURL(/\/home/, { timeout: 20000 }), page.getByTestId("login-submit").click()]);
for (let i = 0; i < 4; i++) {
  const later = page.getByRole("button", { name: "Später" });
  if (await later.isVisible().catch(() => false)) {
    await later.click({ force: true });
    break;
  }
  await page.waitForTimeout(400);
}
await page.waitForTimeout(600);
await page.screenshot({ path: `${out}/01-home.png`, fullPage: true });

await page.getByTestId("guide-chip-plan").click();
await page.waitForURL(/\/plan/, { timeout: 15000 }).catch(() => undefined);
await page.waitForTimeout(2000);
const hole = await page.locator("[data-testid=guide-hole]").count();
const target = await page.locator("[data-tour=tour-plan]").count();
const targetBox = target ? await page.locator("[data-tour=tour-plan]").first().boundingBox() : null;
const spotlightClass = await page.locator(".tour-spotlight-target").count();
console.log(JSON.stringify({ url: page.url(), hole, target, spotlightClass, targetBox }, null, 2));
await page.screenshot({ path: `${out}/02-plan-guide.png`, fullPage: true });

await page.goto("https://paidia-platform.vercel.app/zoai?guideAsk=" + encodeURIComponent("Wie starte ich die Schicht?"));
await page.waitForTimeout(3000);
const bubbles = await page.locator(".bubble.assistant").count();
const hint = await page.locator("[data-testid=zoai-guide-hint]").count();
const layer = await page.locator("[data-testid=guide-layer]").count();
const reply = bubbles ? await page.locator(".bubble.assistant").last().innerText() : "";
console.log(JSON.stringify({ zoaiUrl: page.url(), bubbles, hint, layer, reply: reply.slice(0, 200) }, null, 2));
await page.screenshot({ path: `${out}/03-zoai.png`, fullPage: true });
await browser.close();
