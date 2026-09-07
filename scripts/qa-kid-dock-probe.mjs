/** Why does tapping the kid dock not navigate on a phone? Hit-test every dock button. */
import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.PAIDIA_QA_BASE || 'http://127.0.0.1:5173';
const pins = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/marketing/.local-auth/pins.json'), 'utf8'));

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ ...devices['iPhone 15 Pro'], viewport: { width: 393, height: 852 } });
const page = await ctx.newPage();
const dialogs = [];
page.on('dialog', async (d) => { dialogs.push(d.message().replace(/\s+/g, ' ').slice(0, 160)); await d.accept().catch(() => {}); });

await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[data-mode="child"]', { timeout: 30000 });
await page.locator('[data-mode="child"]').click();
await page.waitForTimeout(600);
await page.locator('.profile[data-p="k1"]').click();
await page.waitForTimeout(600);
for (const d of String(pins.k1)) { await page.locator(`#gPinpad button[data-k="${d}"]`).click(); await page.waitForTimeout(50); }
await page.locator('#gLogin').click().catch(() => {});
await page.waitForFunction(() => !document.getElementById('gPinpad'), { timeout: 40000 }).catch(() => {});
await page.waitForTimeout(2500);

// What covers each dock button's centre, and what chrome is stacked at the bottom?
const report = await page.evaluate(() => {
  const vh = innerHeight, vw = innerWidth;
  const dock = document.querySelector('.kid-dock') || document.querySelector('nav.dock');
  const buttons = [...(dock ? dock.querySelectorAll('button') : [])].map((b) => {
    const r = b.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const hit = document.elementFromPoint(cx, cy);
    return {
      label: (b.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 14),
      tab: b.dataset.tab || b.dataset.kidTab || b.getAttribute('data-go') || null,
      attrs: [...b.attributes].map((a) => a.name).filter((n) => n.startsWith('data-')),
      box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      hitSelf: !!hit && (hit === b || b.contains(hit)),
      hitBy: hit ? `${hit.tagName.toLowerCase()}${hit.id ? '#' + hit.id : ''}.${String(hit.className || '').split(/\s+/).filter(Boolean).slice(0, 2).join('.')}` : null,
      hasOnclick: !!b.onclick,
    };
  });
  // Everything pinned near the bottom of the screen, in paint order.
  const pinned = [...document.querySelectorAll('body *')].filter((el) => {
    const s = getComputedStyle(el);
    if (s.position !== 'fixed' && s.position !== 'sticky') return false;
    const r = el.getBoundingClientRect();
    return r.height > 12 && r.bottom > vh - 220 && r.width > 40;
  }).map((el) => {
    const r = el.getBoundingClientRect();
    return {
      sel: `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String(el.className || '').split(/\s+/).filter(Boolean).slice(0, 2).join('.')}`,
      z: getComputedStyle(el).zIndex,
      box: { y: Math.round(r.y), h: Math.round(r.height), w: Math.round(r.width) },
      covers: Math.round(vh - r.top),
    };
  });
  return { vw, vh, dockFound: !!dock, dockClass: dock ? String(dock.className) : null, buttons, pinned };
});
console.log(JSON.stringify(report, null, 2));

// Now actually try a tap and see whether the view changes.
const before = await page.evaluate(() => ({ tab: window.state?.tab, kv: window.state?.kidView, h: location.hash }));
const b1 = page.locator('.kid-dock button, nav.dock button').nth(1);
let clickErr = null;
await b1.click({ timeout: 4000 }).catch((e) => { clickErr = String(e.message).split('\n').slice(0, 4).join(' | '); });
await page.waitForTimeout(1200);
const after = await page.evaluate(() => ({ tab: window.state?.tab, kv: window.state?.kidView, h: location.hash }));
console.log(JSON.stringify({ before, after, clickErr, dialogs }, null, 2));

await browser.close();
