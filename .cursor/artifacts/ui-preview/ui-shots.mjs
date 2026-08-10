import { chromium, devices } from "@playwright/test";
import path from "path";
import fs from "fs";

const OUT = "/Users/aggelosdadalis/paidia/.cursor/artifacts/ui-preview";
fs.mkdirSync(OUT, { recursive: true });
const iPhone = devices["iPhone 14"];
const browser = await chromium.launch();
const context = await browser.newContext({ ...iPhone, locale: "de-DE" });
const page = await context.newPage();

async function shot(name) {
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
  console.log("wrote", name);
}

await page.addInitScript(() => {
  localStorage.setItem("armonia.tour.staff", "1");
  localStorage.setItem("armonia.tour.child", "1");
});

await page.goto("http://127.0.0.1:3000/", { waitUntil: "domcontentloaded" });
await shot("01-login.png");

await page.getByTestId("enter-staff").click();
await page.getByTestId("profile-e8").waitFor({ timeout: 15000 });
await shot("02-profiles.png");

await page.getByTestId("profile-e8").click();
await page.getByTestId("pin-input").fill("888888");
await Promise.all([
  page.waitForURL(/\/home/, { timeout: 15000 }),
  page.getByTestId("login-submit").click(),
]);
await page.getByTestId("dock").waitFor({ timeout: 10000 });
await shot("03-home.png");

const routes = [
  ["/plan", "04-plan.png"],
  ["/stock", "05-stock.png"],
  ["/zoai", "06-zoai.png"],
  ["/handover", "07-handover.png"],
  ["/coverage", "08-coverage.png"],
  ["/incidents", "09-incidents.png"],
  ["/care", "10-care.png"],
  ["/book", "11-book.png"],
  ["/talk", "12-talk.png"],
  ["/shop", "13-shop.png"],
  ["/calendar", "14-calendar.png"],
  ["/profile", "15-profile.png"],
];

for (const [route, file] of routes) {
  await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  await shot(file);
}

await context.clearCookies();
await page.goto("http://127.0.0.1:3000/", { waitUntil: "domcontentloaded" });
await page.getByTestId("enter-child").click();
await page.getByTestId("profile-k1").click();
await page.getByTestId("pin-input").fill("121212");
await Promise.all([
  page.waitForURL(/\/kids/, { timeout: 15000 }),
  page.getByTestId("login-submit").click(),
]);
await page.waitForTimeout(700);
await shot("16-kids.png");
await page.goto("http://127.0.0.1:3000/kids/games", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(700);
await shot("17-kids-games.png");
await page.goto("http://127.0.0.1:3000/kids/zoai", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(700);
await shot("18-kids-zoai.png");

await browser.close();
console.log("done");
