/** Desktop UI visual audit — local only. Screenshots + overflow metrics. */
import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = process.env.PAIDIA_QA_BASE || 'http://127.0.0.1:5173';
if (!['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) {
  throw new Error('Use a disposable local server.');
}
const pins = JSON.parse(
  fs.readFileSync(process.env.PAIDIA_QA_PINS || path.join(root, 'docs/marketing/.local-auth/pins.json'), 'utf8')
);
const out = path.join(root, '.qa-screens/v214-desktop');
fs.mkdirSync(out, {recursive: true});

const staffRoutes = ['home', 'schedule', 'stock', 'shop', 'pocket', 'admin', 'kids', 'book', 'talk', 'gallery', 'rules'];
const childRoutes = ['today', 'plan', 'aufgaben', 'games', 'rate', 'pocket', 'notes'];

async function measureOverflow(page) {
  return page.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    const offenders = [];
    document.querySelectorAll('body *').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      if (r.right > winW + 1 || r.left < -1) {
        const tag = el.tagName.toLowerCase();
        const cls = (el.className && typeof el.className === 'string' ? el.className : '').slice(0, 80);
        offenders.push({
          tag,
          cls,
          left: Math.round(r.left),
          right: Math.round(r.right),
          w: Math.round(r.width),
          text: (el.innerText || '').trim().slice(0, 40),
        });
      }
    });
    // Dedupe by class prefix
    const seen = new Set();
    const unique = [];
    for (const o of offenders) {
      const key = o.cls.split(/\s+/).slice(0, 2).join('.') || o.tag;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(o);
      if (unique.length >= 18) break;
    }
    // Button sizing sample
    const btns = [...document.querySelectorAll('#view button, #view .btn, nav.dock button')]
      .slice(0, 40)
      .map((b) => {
        const r = b.getBoundingClientRect();
        return {
          h: Math.round(r.height),
          w: Math.round(r.width),
          label: (b.innerText || b.getAttribute('aria-label') || '').trim().slice(0, 28),
          tiny: r.height > 0 && r.height < 36,
          huge: r.height > 64,
        };
      })
      .filter((b) => b.tiny || b.huge || b.w > winW);
    return {
      overflowX: docW > winW + 2,
      docW,
      winW,
      offenders: unique,
      badButtons: btns,
      title: document.getElementById('title')?.textContent || '',
    };
  });
}

const report = {pages: [], findings: []};
const browser = await chromium.launch();
try {
  for (const [profileId, mode] of [
    ['e4', 'staff'],
    ['k1', 'child'],
  ]) {
    const context = await browser.newContext({
      viewport: {width: 1440, height: 900},
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    try {
      const login = await context.request.post(base + '/api/auth/login', {
        data: {profileId, mode, pin: pins[profileId], remember: false},
      });
      if (!login.ok()) throw new Error(`login ${profileId} ${login.status()}`);
      await context.request.post(base + '/api/auth/onboarding/complete', {data: {version: 3}});
      await context.addInitScript(
        ({profileId, mode}) => {
          localStorage.setItem('paidia.lang', 'el');
          localStorage.setItem('paidia.uiMode', 'pro');
          localStorage.setItem('paidia.kidGuideSeen', '1');
          localStorage.setItem(
            `paidia.tourSeen:${profileId}:${mode}:3`,
            JSON.stringify({done: true, version: 3, index: 99})
          );
          localStorage.setItem(
            `paidia-contact:${profileId}:${mode}`,
            JSON.stringify({email: 'qa@armonia.test', phone: '+306912345678', at: Date.now()})
          );
        },
        {profileId, mode}
      );
      const page = await context.newPage();
      await page.goto(base, {waitUntil: 'domcontentloaded'});
      await page.waitForFunction(
        () => typeof window.render === 'function' && !document.body.classList.contains('auth-pending')
      );
      await page.evaluate(() => {
        try {
          setUiMode('pro', {scope: 'global'});
        } catch {}
      });
      await page.waitForTimeout(900);

      const routes = mode === 'child' ? childRoutes : staffRoutes;
      for (const route of routes) {
        await page.evaluate(
          ({route, mode}) => {
            try {
              closeSheet();
            } catch {}
            if (mode === 'child') {
              state.childView = route;
              renderChild();
            } else {
              state.tab = route;
              if (route === 'stock') state.house = 'h1';
              if (route === 'admin') {
                state.adminPane = 'ops';
                state.adminWorkerId = null;
              }
              render();
            }
            scrollTo(0, 0);
          },
          {route, mode}
        );
        await page.waitForTimeout(350);
        const metrics = await measureOverflow(page);
        const file = `${mode}-${route}-1440.png`;
        await page.screenshot({path: path.join(out, file), fullPage: false});
        const row = {mode, route, file, ...metrics};
        report.pages.push(row);
        if (metrics.overflowX || metrics.offenders.length || metrics.badButtons.length) {
          report.findings.push(row);
        }
        console.log(
          `${mode}/${route}: overflow=${metrics.overflowX} offenders=${metrics.offenders.length} badBtns=${metrics.badButtons.length}`
        );
      }
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}

fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({pages: report.pages.length, findings: report.findings.length, out}));
if (report.findings.length) process.exitCode = 1;
