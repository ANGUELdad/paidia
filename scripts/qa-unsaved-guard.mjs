/**
 * Regression test for the "unsaved changes" guard.
 *
 * A: open the Taschengeld compose form, type nothing, navigate away  -> NO dialog
 * B: open it, type an amount, navigate away                          -> dialog fires
 *
 * Before v245 case A also fired, which is what made the warning feel spammy.
 */
import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.PAIDIA_QA_BASE || 'http://127.0.0.1:5173';
const pins = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/marketing/.local-auth/pins.json'), 'utf8'));

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ ...devices['iPhone 15 Pro'], viewport: { width: 393, height: 852 } });
await ctx.request.post(`${BASE}/api/auth/login`, { data: { profileId: 'e4', mode: 'staff', pin: pins.e4, remember: false } });
await ctx.request.post(`${BASE}/api/auth/onboarding/complete`, { data: { version: 3 } }).catch(() => {});
const page = await ctx.newPage();
await page.addInitScript(() => {
  localStorage.setItem('paidia.lang', 'de');
  localStorage.setItem('paidia.tourSeen', '1');
  localStorage.setItem('paidia.tipsSeen', '1');
});

let dialogs = [];
page.on('dialog', async (d) => { dialogs.push(d.message().replace(/\s+/g, ' ').slice(0, 90)); await d.dismiss().catch(() => {}); });

await page.goto(`${BASE}/m/`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof window.render === 'function', { timeout: 40000 });
await page.waitForTimeout(2000);

/** Open the pocket compose form for the first kid, optionally typing an amount. */
async function openCompose(amount) {
  // `DB` / `state` are top-level lexical bindings, so they resolve by name but
  // are not properties of `window`.
  await page.evaluate(() => {
    const first = (DB.children || [])[0];
    if (first) openPocketCompose(first.id, 'in');
  });
  await page.waitForSelector('#pocketAmt', { timeout: 8000 });
  if (amount) await page.fill('#pocketAmt', amount);
  await page.waitForTimeout(300);
}

const results = {};

// A — form open, nothing typed.
await openCompose(null);
dialogs = [];
await page.evaluate(() => navigateStaffTab('stock'));
await page.waitForTimeout(600);
results.emptyForm = { dialogs: [...dialogs], tab: await page.evaluate(() => state.tab) };

// B — form open with a real amount.
await page.evaluate(() => navigateStaffTab('pocket'));
await page.waitForTimeout(500);
await openCompose('12.50');
dialogs = [];
await page.evaluate(() => navigateStaffTab('stock'));
await page.waitForTimeout(600);
results.typedAmount = { dialogs: [...dialogs], tab: await page.evaluate(() => state.tab) };

// C — stale list-removal ids must not count as unsaved. Clear case B's form first.
results.staleListIds = await page.evaluate(() => {
  discardUnsavedChanges();
  render();
  state.listPendingRemove = ['does-not-exist-1', 'does-not-exist-2'];
  const parts = typeof unsavedChangeParts==="function" ? unsavedChangeParts() : null;
  return { parts, prunedTo: state.listPendingRemove };
});

const pass = results.emptyForm.dialogs.length === 0
  && results.typedAmount.dialogs.length === 1
  && (results.staleListIds.parts || []).length === 0;

console.log(JSON.stringify({ results, pass }, null, 2));
await browser.close();
process.exit(pass ? 0 : 1);
