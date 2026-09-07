/** Ad-hoc probe: dump rects/computed styles for specific selectors on a tab. */
import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'http://127.0.0.1:5173';
const pins = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/marketing/.local-auth/pins.json'), 'utf8'));
const args = process.argv.slice(2);
const a = (n, d) => (args.find((x) => x.startsWith(`--${n}=`)) || `--${n}=${d}`).split('=').slice(1).join('=');
const SURFACE = a('surface', 'phone');
const TAB = a('tab', 'stock');
const SELS = a('sel', '').split('|').filter(Boolean);
const ROLE = a('role', 'staff');

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext(SURFACE === 'phone'
  ? { ...devices['iPhone 15 Pro'], viewport: { width: 393, height: 852 } }
  : { viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.addInitScript(() => {
  localStorage.setItem('paidia.lang', 'de');
  localStorage.setItem('paidia.uiMode', 'pro');
  localStorage.setItem('paidia.tourSeen', '1');
  localStorage.setItem('paidia.tipsSeen', '1');
});
const profile = ROLE === 'child' ? 'k1' : 'e4';
await ctx.request.post(`${BASE}/api/auth/login`, { data: { profileId: profile, mode: ROLE, pin: pins[profile], remember: false } });
await ctx.request.post(`${BASE}/api/auth/onboarding/complete`, { data: { version: 3 } }).catch(() => {});
await page.goto(`${BASE}${SURFACE === 'phone' ? '/m/' : '/desk/'}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof window.render === 'function' && !document.body.classList.contains('auth-pending'), { timeout: 60000 });
if (ROLE !== 'child') {
  await page.evaluate((t) => { state.tab = t; if (t === 'stock') state.house = 'h1'; render(); scrollTo(0, 0); }, TAB);
} else {
  await page.evaluate((v) => { try { setChildView(v, { push: false }); } catch (e) {} }, TAB);
}
await page.waitForTimeout(900);
const out = await page.evaluate((sels) => {
  const res = [];
  sels.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const p = el.parentElement;
      res.push({
        sel, i,
        cls: String(el.className || '').slice(0, 90),
        text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40),
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        css: { color: s.color, background: s.backgroundColor, bgImage: String(s.backgroundImage).slice(0, 80), display: s.display, position: s.position, gridArea: s.gridArea, gridTemplateColumns: s.gridTemplateColumns, overflow: s.overflow, overflowX: s.overflowX, fontSize: s.fontSize, minHeight: s.minHeight, maxHeight: s.maxHeight, zIndex: s.zIndex, visibility: s.visibility, opacity: s.opacity, transform: s.transform, margin: s.margin, padding: s.padding, width: s.width },
        parent: p ? { cls: String(p.className || '').slice(0, 70), display: getComputedStyle(p).display, gtc: getComputedStyle(p).gridTemplateColumns, overflow: getComputedStyle(p).overflow, h: Math.round(p.getBoundingClientRect().height) } : null,
      });
    });
  });
  return res;
}, SELS);
console.log(JSON.stringify(out, null, 1));
await browser.close();
