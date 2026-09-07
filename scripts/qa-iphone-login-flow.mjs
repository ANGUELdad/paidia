/**
 * Drives the REAL gate UI on an iPhone viewport (no API shortcut) and
 * screenshots the whole journey: mode card → profile → pinpad → app → dock walk.
 *
 *   node scripts/qa-iphone-login-flow.mjs [--tag=login] [--role=staff|child|both]
 *
 * Captures every native dialog (window.confirm / beforeunload) that fires, which
 * is how the "unsaved changes" spam shows up on a phone.
 */
import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.PAIDIA_QA_BASE || 'http://127.0.0.1:5173';
const pins = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/marketing/.local-auth/pins.json'), 'utf8'));
const args = process.argv.slice(2);
const arg = (n, d) => (args.find((a) => a.startsWith(`--${n}=`)) || `--${n}=${d}`).split('=').slice(1).join('=');

const TAG = arg('tag', 'login-flow');
const ROLE = arg('role', 'both');
const OUT = path.join(ROOT, '.qa-screens', TAG);
fs.mkdirSync(OUT, { recursive: true });

const PHONE = { ...devices['iPhone 15 Pro'], viewport: { width: 393, height: 852 } };
const steps = [];

async function shot(page, name, note) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`) }).catch(() => {});
  steps.push({ name, note, url: page.url() });
  console.log(`  · ${name}${note ? ` — ${note}` : ''}`);
}

async function runRole(browser, { profileId, mode, label }) {
  const context = await browser.newContext(PHONE);
  const page = await context.newPage();
  const errors = [];
  const dialogs = [];
  page.on('pageerror', (e) => errors.push(String(e.message || e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text().slice(0, 160)}`); });
  page.on('dialog', async (d) => {
    dialogs.push({ type: d.type(), message: d.message().replace(/\s+/g, ' ').slice(0, 220), at: steps.length });
    await d.accept().catch(() => d.dismiss().catch(() => {}));
  });

  console.log(`\n=== ${label} (${mode}/${profileId}) ===`);
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-mode="staff"]', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(900);
  await shot(page, `${label}-01-gate-mode`, 'gate: choose staff/child');

  await page.locator(`[data-mode="${mode}"]`).first().click().catch(() => {});
  await page.waitForTimeout(700);
  await shot(page, `${label}-02-gate-profiles`, 'gate: profile picker');

  await page.locator(`.profile[data-p="${profileId}"]`).first().click().catch(() => {});
  await page.waitForTimeout(700);
  await shot(page, `${label}-03-gate-pinpad`, 'gate: pinpad');

  for (const d of String(pins[profileId] || '')) {
    await page.locator(`#gPinpad button[data-k="${d}"]`).first().click().catch(() => {});
    await page.waitForTimeout(60);
  }
  await shot(page, `${label}-04-gate-pin-filled`, 'gate: PIN entered');

  await page.locator('#gLogin').first().click().catch(() => {});
  await page.waitForFunction(() => !document.getElementById('gPinpad'), { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2600);
  await shot(page, `${label}-05-after-login`, 'first screen after login');

  // Capture any first-run overlay before dismissing it.
  for (const sel of ['#tourCard', '.tour-card', '#tipCard', '.tip-card', '.onboard-card']) {
    const el = page.locator(sel).first();
    if ((await el.count()) && (await el.isVisible().catch(() => false))) {
      await shot(page, `${label}-06-overlay`, `overlay: ${sel}`);
      break;
    }
  }
  for (const sel of ['#tourSkip', '#tipClose', '#tourClose', 'button:has-text("Überspringen")', 'button:has-text("Später")']) {
    const b = page.locator(sel).first();
    if ((await b.count()) && (await b.isVisible().catch(() => false))) { await b.click().catch(() => {}); await page.waitForTimeout(500); }
  }
  await shot(page, `${label}-07-home`, 'home, overlays dismissed');

  // Walk the dock with real taps. Only visible buttons — `.dock-secondary` lives in
  // the hidden "Mehr" menu and clicking it silently does nothing.
  const dock = page.locator('nav.dock button:visible, .kid-dock button:visible');
  const n = Math.min(await dock.count(), 6);
  for (let i = 0; i < n; i++) {
    const b = dock.nth(i);
    const name = (await b.innerText().catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 16) || `i${i}`;
    const err = await b.click({ timeout: 5000 }).then(() => null).catch((e) => String(e.message).split('\n')[0]);
    await page.waitForTimeout(1300);
    await shot(page, `${label}-08-tab${i}-${name.replace(/[^\w]+/g, '')}`, `dock tap: ${name}${err ? ` — CLICK FAILED: ${err}` : ''}`);
    if (err) errors.push(`dock "${name}": ${err}`);
  }

  const dirty = await page.evaluate(() => (window.PaidiaDirty ? { ...window.PaidiaDirty.flags } : null)).catch(() => null);
  await context.close();
  return { errors: [...new Set(errors)].slice(0, 8), dialogs, dirty };
}

const browser = await chromium.launch({ headless: true });
const results = {};
if (ROLE === 'both' || ROLE === 'staff') results.staff = await runRole(browser, { profileId: 'e4', mode: 'staff', label: 'staff' });
if (ROLE === 'both' || ROLE === 'child') results.kid = await runRole(browser, { profileId: 'k1', mode: 'child', label: 'kid' });
await browser.close();

fs.writeFileSync(path.join(OUT, 'flow.json'), JSON.stringify({ tag: TAG, steps, results }, null, 2));
console.log('\n' + JSON.stringify({ out: OUT, results }, null, 2));
