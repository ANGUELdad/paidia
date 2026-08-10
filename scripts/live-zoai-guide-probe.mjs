/**
 * Live Zo-Ai guide flow probe against paidia-platform.vercel.app
 * Usage: node scripts/live-zoai-guide-probe.mjs
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const BASE = "https://paidia-platform.vercel.app";
const API = "https://paidia-api.vercel.app";
const OUT = "/tmp/zoai-guide-probe";
mkdirSync(OUT, { recursive: true });

const results = [];

function log(step, status, detail) {
  const row = { step, status, detail };
  results.push(row);
  console.log(`\n=== ${status}: ${step} ===`);
  console.log(typeof detail === "string" ? detail : JSON.stringify(detail, null, 2));
}

async function dismissOverlays(page) {
  for (let i = 0; i < 5; i++) {
    const later = page.getByRole("button", { name: "Später" });
    if (await later.isVisible({ timeout: 400 }).catch(() => false)) {
      await later.click({ force: true });
      await page.waitForTimeout(120);
      continue;
    }
    const understood = page.getByTestId("guide-dismiss");
    if (await understood.isVisible({ timeout: 300 }).catch(() => false)) {
      await understood.click({ force: true });
      await page.waitForTimeout(120);
      continue;
    }
    const verstehen = page.getByRole("button", { name: "Verstanden" });
    if (await verstehen.isVisible({ timeout: 300 }).catch(() => false)) {
      await verstehen.click({ force: true });
      await page.waitForTimeout(120);
      continue;
    }
    break;
  }
}

async function captureGuideState(page) {
  const guideLayer = page.getByTestId("guide-layer");
  const guideHint = page.getByTestId("zoai-guide-hint");
  const layerVisible = await guideLayer.isVisible({ timeout: 2500 }).catch(() => false);
  const hintVisible = await guideHint.isVisible({ timeout: 1500 }).catch(() => false);
  let coachText = null;
  let hintText = null;
  if (layerVisible) {
    coachText = ((await page.locator(".guide-coach").innerText().catch(() => "")) || "").trim();
  }
  if (hintVisible) {
    hintText = ((await guideHint.innerText()) || "").trim();
  }
  const assistantCount = await page.locator(".bubble.assistant").count().catch(() => 0);
  const assistantText =
    assistantCount > 0
      ? ((await page.locator(".bubble.assistant").last().innerText().catch(() => "")) || "").trim()
      : "";
  return {
    url: page.url(),
    layerVisible,
    hintVisible,
    coachText,
    hintText,
    assistantCount,
    assistantText: assistantText.slice(0, 400),
  };
}

/** Ask via guideAsk deep-link; wait for chat API + optional navigation from startGuide. */
async function askGuide(page, question, apiGuideSnippets) {
  const before = apiGuideSnippets.length;
  await page.goto(`${BASE}/zoai?guideAsk=${encodeURIComponent(question)}`, {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  // Do NOT dismiss guide — that's the thing under test.
  // Wait for API response (guide navigates away from /zoai, so bubbles are unreliable).
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    if (apiGuideSnippets.length > before) break;
    await page.waitForTimeout(250);
  }
  // Allow startGuide router.push + coach paint
  await page.waitForTimeout(1200);
  const ui = await captureGuideState(page);
  const net = apiGuideSnippets.slice(before);
  const guide = net.find((n) => n.guide)?.guide || null;
  return { ui, net, guide };
}

async function main() {
  // --- API without cookie ---
  try {
    const r = await fetch(`${API}/api/zoai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Wie starte ich die Schicht?" }),
    });
    const body = await r.json().catch(() => ({}));
    log(
      "API direct POST paidia-api /api/zoai/chat (no cookie)",
      r.status === 401 ? "PASS" : r.status === 200 ? "PASS?" : "FAIL",
      { status: r.status, body, note: r.status === 401 ? "expected 401 without cookie" : "unexpected" },
    );
  } catch (e) {
    log("API direct POST paidia-api /api/zoai/chat (no cookie)", "FAIL", String(e));
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  await context.addInitScript(() => {
    localStorage.setItem("armonia.tour.staff.v3", "1");
    localStorage.setItem("armonia.tour.child.v3", "1");
  });
  const page = await context.newPage();

  const apiGuideSnippets = [];
  page.on("response", async (res) => {
    try {
      const url = res.url();
      if (!url.includes("/api/zoai/chat") || res.request().method() !== "POST") return;
      const status = res.status();
      const json = await res.json().catch(() => null);
      apiGuideSnippets.push({
        url,
        status,
        guide: json?.guide ?? null,
        replySnippet: String(json?.reply || json?.message || "").slice(0, 240),
        provider: json?.provider,
      });
      console.log("[net] zoai/chat", status, "guide=", JSON.stringify(json?.guide));
    } catch {
      /* ignore */
    }
  });

  // --- Login ---
  try {
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1500);
    const enterStaff = page.getByTestId("enter-staff");
    await enterStaff.waitFor({ state: "visible", timeout: 20000 });
    await enterStaff.click({ force: true });
    const profile = page.getByTestId("profile-e8");
    if (!(await profile.isVisible({ timeout: 10000 }).catch(() => false))) {
      if (await enterStaff.isVisible().catch(() => false)) {
        await enterStaff.click({ force: true });
      }
      await profile.waitFor({ state: "visible", timeout: 20000 });
    }
    await profile.click({ force: true });
    await page.getByTestId("pin-input").waitFor({ state: "visible", timeout: 8000 });
    await page.getByTestId("pin-input").fill("888888");
    await Promise.all([
      page.waitForURL(/\/home/, { timeout: 20000 }),
      page.getByTestId("login-submit").click(),
    ]);
    await dismissOverlays(page);
    await page.getByTestId("dock").waitFor({ state: "visible", timeout: 15000 });

    const sess = await page.request.get(`${BASE}/api/auth/session`);
    const sessJson = await sess.json();
    const ok = sess.ok() && sessJson.authenticated;
    log("1. Login Zoi staff PIN 888888", ok ? "PASS" : "FAIL", {
      url: page.url(),
      sessionStatus: sess.status(),
      session: sessJson,
    });
    await page.screenshot({ path: join(OUT, "01-home.png"), fullPage: true });
  } catch (e) {
    log("1. Login Zoi staff PIN 888888", "FAIL", String(e));
    await page.screenshot({ path: join(OUT, "01-login-fail.png"), fullPage: true }).catch(() => {});
    writeFileSync(join(OUT, "results.json"), JSON.stringify({ results, apiGuideSnippets }, null, 2));
    await browser.close();
    process.exit(1);
  }

  const cookies = await context.cookies();
  const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

  // --- Platform proxy with session cookie ---
  try {
    const r = await fetch(`${BASE}/api/zoai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ text: "Wie starte ich die Schicht?" }),
    });
    const body = await r.json().catch(() => ({}));
    const guideOk = body?.guide?.spotlight === "tour-presence";
    log("5b. Platform proxy POST /api/zoai/chat (with session cookie)", r.ok && guideOk ? "PASS" : r.ok ? "PASS?" : "FAIL", {
      status: r.status,
      guide: body.guide ?? null,
      replySnippet: String(body.reply || body.message || "").slice(0, 300),
      provider: body.provider,
      bodyKeys: Object.keys(body),
    });
  } catch (e) {
    log("5b. Platform proxy POST /api/zoai/chat (with session cookie)", "FAIL", String(e));
  }

  try {
    const r = await fetch(`${API}/api/zoai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ text: "Wie starte ich die Schicht?" }),
    });
    const body = await r.json().catch(() => ({}));
    log("5c. Direct API with platform cookie forwarded", r.ok ? "PASS" : "INFO", {
      status: r.status,
      guide: body.guide ?? null,
      replySnippet: String(body.reply || body.message || body.detail || "").slice(0, 300),
      note: "Cookie Domain may not apply to paidia-api host",
    });
  } catch (e) {
    log("5c. Direct API with platform cookie forwarded", "INFO", String(e));
  }

  // --- Step 2: Schicht → tour-presence on /home ---
  try {
    await dismissOverlays(page);
    const { ui, net, guide } = await askGuide(page, "Wie starte ich die Schicht?", apiGuideSnippets);
    const wantsPresence =
      guide?.spotlight === "tour-presence" ||
      /tour-presence|Schicht starten|Präsenz/i.test(String(ui.coachText || ui.hintText || ""));
    const onHome = /\/home/.test(ui.url) || guide?.href === "/home";
    const hasGuideUi = ui.layerVisible || ui.hintVisible;
    const pass = Boolean(guide?.spotlight === "tour-presence" || (hasGuideUi && wantsPresence));
    log("2. Ask «Wie starte ich die Schicht?» → reply + guide (presence)", pass ? "PASS" : "FAIL", {
      ...ui,
      onHome,
      wantsPresence,
      hasGuideUi,
      guide,
      net,
    });
    await page.screenshot({ path: join(OUT, pass ? "02-schicht.png" : "02-schicht-fail.png"), fullPage: true });
  } catch (e) {
    log("2. Ask «Wie starte ich die Schicht?» → reply + guide (presence)", "FAIL", String(e));
    await page.screenshot({ path: join(OUT, "02-schicht-fail.png"), fullPage: true }).catch(() => {});
  }

  // --- Step 3: Lager → /stock ---
  try {
    await dismissOverlays(page);
    const { ui, net, guide } = await askGuide(page, "Wie pflege ich das Lager?", apiGuideSnippets);
    const wantsStock =
      guide?.href === "/stock" ||
      guide?.spotlight === "tour-stock" ||
      /\/stock/.test(ui.url) ||
      /Lager|tour-stock/i.test(String(ui.coachText || ui.hintText || ""));
    const hasGuideUi = ui.layerVisible || ui.hintVisible || /\/stock/.test(ui.url);
    const pass = Boolean((guide?.href === "/stock" || guide?.spotlight === "tour-stock") && (hasGuideUi || wantsStock));
    log("3. Ask «Wie pflege ich das Lager?» → guide /stock", pass ? "PASS" : "FAIL", {
      ...ui,
      wantsStock,
      hasGuideUi,
      guide,
      net,
    });
    await page.screenshot({ path: join(OUT, pass ? "03-lager.png" : "03-lager-fail.png"), fullPage: true });
  } catch (e) {
    log("3. Ask «Wie pflege ich das Lager?» → guide /stock", "FAIL", String(e));
    await page.screenshot({ path: join(OUT, "03-lager-fail.png"), fullPage: true }).catch(() => {});
  }

  // --- Step 4: Plan → /plan ---
  try {
    await dismissOverlays(page);
    const { ui, net, guide } = await askGuide(page, "Wie ändere ich den Plan?", apiGuideSnippets);
    const wantsPlan =
      guide?.href === "/plan" ||
      guide?.spotlight === "tour-plan" ||
      /\/plan/.test(ui.url) ||
      /Wochenplan|tour-plan|Plan/i.test(String(ui.coachText || ui.hintText || ""));
    const hasGuideUi = ui.layerVisible || ui.hintVisible || /\/plan/.test(ui.url);
    const pass = Boolean((guide?.href === "/plan" || guide?.spotlight === "tour-plan") && (hasGuideUi || wantsPlan));
    log("4. Ask «Wie ändere ich den Plan?» → guide /plan", pass ? "PASS" : "FAIL", {
      ...ui,
      wantsPlan,
      hasGuideUi,
      guide,
      net,
    });
    await page.screenshot({ path: join(OUT, pass ? "04-plan.png" : "04-plan-fail.png"), fullPage: true });
  } catch (e) {
    log("4. Ask «Wie ändere ich den Plan?» → guide /plan", "FAIL", String(e));
    await page.screenshot({ path: join(OUT, "04-plan-fail.png"), fullPage: true }).catch(() => {});
  }

  writeFileSync(
    join(OUT, "results.json"),
    JSON.stringify({ results, apiGuideSnippets, cookieNames: cookies.map((c) => c.name) }, null, 2),
  );
  console.log("\n\n===== SUMMARY =====");
  let failed = 0;
  for (const r of results) {
    console.log(`${r.status.padEnd(5)} ${r.step}`);
    if (r.status === "FAIL") failed += 1;
  }
  console.log(`\nArtifacts: ${OUT}`);
  await browser.close();
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
