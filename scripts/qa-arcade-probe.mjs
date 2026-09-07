/** What is the kid Spiele lobby actually laid out as, and where does the void come from? */
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
await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[data-mode="child"]', { timeout: 30000 });
await page.locator('[data-mode="child"]').click(); await page.waitForTimeout(500);
await page.locator('.profile[data-p="k1"]').click(); await page.waitForTimeout(500);
for (const d of String(pins.k1)) { await page.locator(`#gPinpad button[data-k="${d}"]`).click(); await page.waitForTimeout(50); }
await page.locator('#gLogin').click().catch(() => {});
await page.waitForFunction(() => !document.getElementById('gPinpad'), { timeout: 40000 }).catch(() => {});
await page.waitForTimeout(2200);
await page.locator('.kid-dock button:visible').nth(1).click();
await page.waitForTimeout(1500);

console.log(JSON.stringify(await page.evaluate(() => {
  const vw = innerWidth;
  const dump = (el, depth = 0) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return {
      d: depth,
      sel: `${el.tagName.toLowerCase()}.${String(el.className || '').split(/\s+/).filter(Boolean).slice(0, 3).join('.')}`,
      box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      display: s.display, gtc: s.gridTemplateColumns.slice(0, 60), overflowX: s.overflowX,
      order: s.order, flexGrow: s.flexGrow, minHeight: s.minHeight,
      scrollW: el.scrollWidth, clientW: el.clientWidth,
      overflows: r.right > vw + 2,
    };
  };
  const lobby = document.querySelector('.arcade-lobby');
  const out = { vw, found: !!lobby, chain: [] };
  if (lobby) {
    out.chain.push(dump(lobby, 0));
    [...lobby.children].forEach((c) => {
      out.chain.push(dump(c, 1));
      if (c.children.length && c.children.length < 8) [...c.children].forEach((g) => out.chain.push(dump(g, 2)));
    });
  }
  // What sits under the void at y=600?
  const hit = document.elementFromPoint(vw / 2, 600);
  out.voidHit = hit ? `${hit.tagName.toLowerCase()}.${String(hit.className || '').split(/\s+/).filter(Boolean).slice(0, 3).join('.')}` : null;
  const shell = document.querySelector('.kid-shell');
  if (shell) out.shell = dump(shell, 0);
  return out;
}), null, 2));

await browser.close();
