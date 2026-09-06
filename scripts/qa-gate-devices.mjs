#!/usr/bin/env node
/**
 * Multi-device login UI audit for Paidia PWA (gate / PIN / keyboard).
 * Usage: node scripts/qa-gate-devices.mjs [BASE_URL]
 */
import { chromium, devices, webkit } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = process.argv[2] || 'https://armonia-thassos.vercel.app';
const OUT = path.resolve(' .qa-screens/live-audit'.trim() || '.qa-screens/live-audit');
const ROOT = path.resolve('.qa-screens/live-audit');
fs.mkdirSync(ROOT, { recursive: true });

const PROFILES = [
  { name: 'iPhone-SE', ...devices['iPhone SE'] },
  { name: 'iPhone-14', ...devices['iPhone 14'] },
  { name: 'iPhone-14-Pro-Max', ...devices['iPhone 14 Pro Max'] },
  { name: 'iPhone-15-landscape', ...devices['iPhone 15'], viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true },
  { name: 'iPad-Mini', ...devices['iPad Mini'] },
  { name: 'iPad-Pro-11', ...devices['iPad Pro 11'] },
  { name: 'Pixel-7', ...devices['Pixel 7'] },
  { name: 'Galaxy-S9+', ...devices['Galaxy S9+'] },
  { name: 'Desktop-1280', viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  { name: 'Desktop-1440', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
];

function issuesFromMetrics(m) {
  const out = [];
  if (m.docScrollY > 2 || m.docScrollH > m.innerH + 4) {
    out.push(`page-scrollable (scrollH=${m.docScrollH} innerH=${m.innerH} scrollY=${m.docScrollY})`);
  }
  if (m.gateBottom > m.innerH + 2) out.push(`gate below viewport (gateBottom=${m.gateBottom} > ${m.innerH})`);
  if (m.gateTop < -2) out.push(`gate above viewport (gateTop=${m.gateTop})`);
  if (m.overflowing?.length) out.push(`overflowing: ${m.overflowing.join(', ')}`);
  if (m.pinpadBottom > m.innerH + 2) out.push(`pinpad clipped (bottom=${m.pinpadBottom})`);
  if (m.loginBottom > m.innerH + 2) out.push(`login btn clipped (bottom=${m.loginBottom})`);
  if (m.hiddenByClip?.length) out.push(`clipped: ${m.hiddenByClip.join(', ')}`);
  if (m.gateKb) out.push(`data-gate-kb=${m.gateKb}`);
  return out;
}

async function measure(page) {
  return page.evaluate(() => {
    const gate = document.getElementById('gate');
    const wrap = document.querySelector('.gate-wrap');
    const pinpad = document.querySelector('.pinpad');
    const login = document.querySelector('.gate-login-submit, #gLogin');
    const field = document.querySelector('#gPinInput');
    const landmark = document.querySelector('.gate-landmark');
    const build = document.querySelector('.gate-build');
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, w: r.width, h: r.height };
    };
    const vv = window.visualViewport;
    const innerH = window.innerHeight;
    const innerW = window.innerWidth;
    const overflowing = [];
    const hiddenByClip = [];
    for (const sel of ['.gate-wrap', '.gate-main', '.gate-pin', '.pinpad', '.gate-login-submit', '#gPinInput', '.gate-landmark', '.gate-build', '.pindots']) {
      const el = document.querySelector(sel);
      if (!el || el.hidden) continue;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (r.bottom > innerH + 2 || r.top < -2 || r.right > innerW + 2 || r.left < -2) {
        overflowing.push(`${sel}[${Math.round(r.top)}..${Math.round(r.bottom)}]`);
      }
      if (r.width > 0 && r.height > 0 && (r.bottom <= 0 || r.top >= innerH)) {
        hiddenByClip.push(sel);
      }
    }
    const g = rect(gate);
    const p = rect(pinpad);
    const l = rect(login);
    return {
      build: document.querySelector('.gate-build b')?.textContent || '',
      view: wrap?.dataset?.gateView || '',
      gateKb: document.body.dataset.gateKb || '0',
      authPending: document.body.classList.contains('auth-pending'),
      innerH, innerW,
      vvH: vv?.height ?? null,
      vvTop: vv?.offsetTop ?? null,
      docScrollH: document.documentElement.scrollHeight,
      docScrollY: window.scrollY || document.documentElement.scrollTop || 0,
      bodyOverflow: getComputedStyle(document.body).overflow,
      gateTop: g?.top ?? null,
      gateBottom: g?.bottom ?? null,
      gateH: g?.h ?? null,
      pinpadBottom: p?.bottom ?? null,
      pinpadVisible: !!(pinpad && getComputedStyle(pinpad).display !== 'none'),
      loginBottom: l?.bottom ?? null,
      landmarkVisible: !!(landmark && getComputedStyle(landmark).display !== 'none'),
      buildVisible: !!(build && getComputedStyle(build).display !== 'none'),
      fieldFocused: document.activeElement === field,
      overflowing,
      hiddenByClip,
    };
  });
}

async function goPin(page) {
  await page.goto(`${BASE}/?qa=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector('#gate.on, body.auth-pending', { timeout: 20000 });
  // Entrance → staff → first profile → PIN
  const staff = page.locator('[data-mode="staff"], .gate-mode-card').first();
  if (await staff.isVisible({ timeout: 4000 }).catch(() => false)) {
    await staff.click({ force: true });
  }
  await page.waitForTimeout(400);
  const profile = page.locator('.profile[data-p], button.profile').first();
  if (await profile.isVisible({ timeout: 5000 }).catch(() => false)) {
    await profile.click({ force: true });
  }
  await page.waitForSelector('#gPinInput, .pinpad', { timeout: 10000 });
  await page.waitForTimeout(300);
}

async function auditProfile(browserType, label, device) {
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({
    ...device,
    locale: 'de-DE',
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const rows = { device: label, engine: browserType.name(), steps: [] };

  try {
    await goPin(page);
    const base = await measure(page);
    const shot = path.join(ROOT, `${label}-pin.png`);
    await page.screenshot({ path: shot, fullPage: false });
    rows.steps.push({
      step: 'pin-default',
      screenshot: shot,
      metrics: base,
      issues: issuesFromMetrics(base),
    });

    // Focus field (soft keyboard path) + simulate vv shrink
    const field = page.locator('#gPinInput');
    if (await field.count()) {
      await field.click({ force: true });
      await page.waitForTimeout(200);
      await page.evaluate(() => {
        // Approximate OS keyboard: shrink visual layout for auth-pending gate CSS
        const shrink = Math.round(window.innerHeight * 0.42);
        const gate = document.getElementById('gate');
        const vvH = Math.max(220, window.innerHeight - shrink);
        document.body.dataset.gateKb = '1';
        if (gate) {
          gate.style.setProperty('--gate-vvh', vvH + 'px');
          gate.style.setProperty('--gate-vvo', '0px');
          gate.style.setProperty('--gate-kb', shrink + 'px');
        }
        // Also try to dispatch a fake visualViewport-ish layout by resizing if possible
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(250);
      const kb = await measure(page);
      const shotKb = path.join(ROOT, `${label}-pin-kb.png`);
      await page.screenshot({ path: shotKb, fullPage: false });
      const issues = issuesFromMetrics(kb);
      // Extra: when kb mode, pinpad should be hidden on mobile if v192 CSS present
      if (device.isMobile !== false && kb.pinpadVisible && Number(kb.innerW) <= 899) {
        issues.push('pinpad still visible during keyboard mode (expected hidden on v192+)');
      }
      if (device.isMobile !== false && kb.landmarkVisible && Number(kb.innerW) <= 899) {
        issues.push('landmark still visible during keyboard mode');
      }
      rows.steps.push({ step: 'pin-keyboard', screenshot: shotKb, metrics: kb, issues });
    }

    // Entrance screen check
    await page.goto(`${BASE}/?qa=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector('#gate.on, body.auth-pending', { timeout: 15000 });
    await page.waitForTimeout(400);
    const entrance = await measure(page);
    const shotE = path.join(ROOT, `${label}-entrance.png`);
    await page.screenshot({ path: shotE, fullPage: false });
    rows.steps.push({
      step: 'entrance',
      screenshot: shotE,
      metrics: entrance,
      issues: issuesFromMetrics(entrance),
    });
  } catch (err) {
    rows.error = String(err?.message || err);
  } finally {
    await context.close();
    await browser.close();
  }
  return rows;
}

const results = [];
for (const d of PROFILES) {
  const { name, ...device } = d;
  process.stderr.write(`→ chromium ${name}\n`);
  results.push(await auditProfile(chromium, name, device));
}

// WebKit subset (iOS-like)
for (const name of ['iPhone-14', 'iPad-Mini', 'iPhone-SE']) {
  const d = PROFILES.find((p) => p.name === name);
  if (!d) continue;
  const { name: n, ...device } = d;
  process.stderr.write(`→ webkit ${n}\n`);
  try {
    results.push(await auditProfile(webkit, `webkit-${n}`, device));
  } catch (e) {
    results.push({ device: `webkit-${n}`, engine: 'webkit', error: String(e?.message || e), steps: [] });
  }
}

const summary = {
  base: BASE,
  at: new Date().toISOString(),
  results,
  failures: results.flatMap((r) =>
    (r.steps || [])
      .filter((s) => (s.issues || []).length)
      .map((s) => ({ device: r.device, engine: r.engine, step: s.step, issues: s.issues, build: s.metrics?.build }))
  ),
  errors: results.filter((r) => r.error).map((r) => ({ device: r.device, error: r.error })),
};

const reportPath = path.join(ROOT, 'report.json');
fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ report: reportPath, failures: summary.failures.length, errors: summary.errors.length, builds: [...new Set(results.flatMap((r) => (r.steps || []).map((s) => s.metrics?.build).filter(Boolean)))] }, null, 2));
for (const f of summary.failures) {
  console.log(`FAIL ${f.device} ${f.step}: ${f.issues.join('; ')}`);
}
for (const e of summary.errors) {
  console.log(`ERROR ${e.device}: ${e.error}`);
}
