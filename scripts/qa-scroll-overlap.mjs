/**
 * Scroll each staff/admin/kid page and detect mid-scroll collisions:
 * fixed chrome overlapping content, FAB/dock fights, stacked banners,
 * sticky headers covering CTAs, z-index "in front of" issues.
 *
 * Usage: node scripts/qa-scroll-overlap.mjs --surface=iphone|pc
 */
import { webkit, chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LOCAL = process.env.PAIDIA_QA_BASE || 'http://127.0.0.1:5173';
const pins = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/marketing/.local-auth/pins.json'), 'utf8'));
const surface = (process.argv.find((a) => a.startsWith('--surface=')) || '--surface=iphone').split('=')[1];
const OUT = path.join(ROOT, '.qa-screens', `v228-scroll-${surface}`);
fs.mkdirSync(OUT, { recursive: true });
const STAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

const IPHONE = { ...devices['iPhone 15 Pro'], viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true };
const DESK = { viewport: { width: 1440, height: 900 } };

const STAFF_TABS = ['home', 'schedule', 'stock', 'shop', 'book', 'talk', 'kids', 'pocket', 'gallery', 'admin'];
const ADMIN_PANES = ['ops', 'team', 'supplies', 'school', 'review', 'finance', 'audit', 'communications', 'automations', 'system'];
const KID_VIEWS = ['today', 'games', 'rate', 'bonus', 'notes', 'plan', 'stars', 'learn', 'gallery'];

const report = {
  stamp: STAMP,
  surface,
  local: LOCAL,
  pages: [],
  collisions: [],
  summary: {},
};

function shot(...parts) {
  return path.join(OUT, parts.filter(Boolean).join('-') + '.png');
}

async function settle(page, ms = 200) {
  await page.waitForTimeout(ms);
}

async function dismiss(page) {
  await page.keyboard.press('Escape').catch(() => {});
  for (const sel of ['#tourSkip', 'button:has-text("Überspringen")', 'button:has-text("Später")', '.sheet-close', '#sheet .x', '.chat-close', '.pwa-install-bar button:has-text("Später")', '#workspaceSaveStatus button']) {
    const el = page.locator(sel).first();
    if ((await el.count()) && (await el.isVisible().catch(() => false))) {
      await el.click({ force: true, timeout: 600 }).catch(() => {});
    }
  }
  await page.evaluate(() => {
    try {
      document.getElementById('sheet')?.classList.remove('on');
      document.body.classList.remove('sheet-open', 'chat-open');
      document.getElementById('workspaceSaveStatus')?.remove();
      if (typeof activeShiftPresence === 'function' && window.state?.user) {
        const a = activeShiftPresence(state.user.id);
        if (a) sessionStorage.setItem(`auto-presence:${a.dateStr}:${a.shift.id}`, '1');
      }
    } catch {}
  }).catch(() => {});
}

async function login(request, profileId, mode) {
  const pin = pins[profileId];
  if (!pin) throw new Error(`missing pin ${profileId}`);
  const res = await request.post(`${LOCAL}/api/auth/login`, { data: { profileId, mode, pin, remember: false } });
  if (!res.ok()) throw new Error(`login ${profileId} ${res.status()}`);
  await request.post(`${LOCAL}/api/auth/onboarding/complete`, { data: { version: 3 } }).catch(() => {});
}

async function boot(page, shell) {
  await page.addInitScript(() => {
    localStorage.setItem('paidia.lang', 'de');
    localStorage.setItem('paidia.uiMode', 'pro');
    localStorage.setItem('paidia.tourSeen', '1');
    localStorage.setItem('paidia.tipsSeen', '1');
    localStorage.setItem('paidia.kidGuideSeen', '1');
  });
  await page.goto(`${LOCAL}${shell}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(
    () => typeof window.render === 'function' && !document.body.classList.contains('auth-pending'),
    { timeout: 60000 },
  );
  await dismiss(page);
}

/** Detect elements colliding / stacking incorrectly at current scroll. */
async function detectCollisions(page, pageId, scrollY) {
  return page.evaluate(({ pageId, scrollY }) => {
    const winW = innerWidth;
    const winH = innerHeight;
    const hits = [];
    const push = (sev, kind, detail, a, b) => {
      const box = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { id: el.id || '', cls: (el.className || '').toString().slice(0, 70), tag: el.tagName, text: ((el.innerText || '') + '').trim().slice(0, 40), w: +r.width.toFixed(0), h: +r.height.toFixed(0), t: +r.top.toFixed(0), l: +r.left.toFixed(0) };
      };
      hits.push({ sev, kind, detail, pageId, scrollY, a: box(a), b: box(b) });
    };

    const visible = (el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
      return r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < winH && r.right > 0 && r.left < winW;
    };

    const chrome = document.querySelector('header.app-chrome, header.chrome, .app-chrome');
    const dock = document.querySelector('nav.dock, .kid-dock');
    const fab = document.querySelector('.zoai-fab, #zoFab, [data-zoai-fab]');
    const sheet = document.getElementById('sheet');
    const chat = document.getElementById('chatPanel');
    const status = document.getElementById('workspaceSaveStatus');
    const install = document.querySelector('.pwa-install-bar');
    const sticky = [...document.querySelectorAll('#view .sticky, #view [style*="position: sticky"], #view [style*="position:sticky"], .plan-sticky, .stock-toolbar, .page-head')].filter(visible);

    const fixedLayers = [chrome, dock, fab, status, install].filter(visible);
    if (sheet?.classList.contains('on') && visible(sheet)) fixedLayers.push(sheet);
    if (chat && (document.body.classList.contains('chat-open') || chat.classList.contains('on')) && visible(chat)) fixedLayers.push(chat);

    const overlap = (a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      const x = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
      const y = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
      return x * y;
    };

    // Fixed layer pairwise collisions (FAB over dock, status over dock, etc.)
    for (let i = 0; i < fixedLayers.length; i++) {
      for (let j = i + 1; j < fixedLayers.length; j++) {
        const area = overlap(fixedLayers[i], fixedLayers[j]);
        if (area > 80) {
          push('P0', 'fixed-collide', `fixed layers overlap ${Math.round(area)}px²`, fixedLayers[i], fixedLayers[j]);
        }
      }
    }

    // Content under chrome / dock (obscured interactive)
    const chromeR = chrome && visible(chrome) ? chrome.getBoundingClientRect() : null;
    const dockR = dock && visible(dock) ? dock.getBoundingClientRect() : null;
    const interactives = [...document.querySelectorAll('#view button, #view a.btn, #view .page-act, #view .chip, #view input, #view .home-primary, #view .btn')].filter(visible).slice(0, 80);

    for (const el of interactives) {
      const r = el.getBoundingClientRect();
      if (chromeR) {
        const y = Math.max(0, Math.min(r.bottom, chromeR.bottom) - Math.max(r.top, chromeR.top));
        const x = Math.max(0, Math.min(r.right, chromeR.right) - Math.max(r.left, chromeR.left));
        if (x * y > 120 && r.top < chromeR.bottom - 4) {
          push('P0', 'under-chrome', `control obscured by top chrome (${Math.round(x * y)}px²)`, el, chrome);
        }
      }
      if (dockR) {
        const y = Math.max(0, Math.min(r.bottom, dockR.bottom) - Math.max(r.top, dockR.top));
        const x = Math.max(0, Math.min(r.right, dockR.right) - Math.max(r.left, dockR.left));
        if (x * y > 120 && r.bottom > dockR.top + 4) {
          push('P0', 'under-dock', `control obscured by dock (${Math.round(x * y)}px²)`, el, dock);
        }
      }
      if (fab && visible(fab)) {
        const area = overlap(el, fab);
        if (area > 100) push('P1', 'under-fab', `control under Zo FAB (${Math.round(area)}px²)`, el, fab);
      }
    }

    // Sticky headers colliding with chrome
    for (const st of sticky) {
      if (chromeR && overlap(st, chrome) > 60) push('P1', 'sticky-chrome', 'sticky/toolbar under or into chrome', st, chrome);
      if (dockR && overlap(st, dock) > 60) push('P1', 'sticky-dock', 'sticky/toolbar into dock', st, dock);
    }

    // Banner / alert stack density in viewport
    const banners = [...document.querySelectorAll('.home-shift-step, .journal-duty-home, .mobile-alert-row, .workspace-status, .shift-presence-banner, [class*="banner"], .kid-first-run')].filter(visible);
    if (banners.length >= 3) {
      push('P1', 'banner-stack', `${banners.length} banners/alerts visible at once`, banners[0], banners[1]);
    }
    for (let i = 0; i < banners.length; i++) {
      for (let j = i + 1; j < banners.length; j++) {
        const area = overlap(banners[i], banners[j]);
        if (area > 100) push('P0', 'banner-overlap', `banners overlap ${Math.round(area)}px²`, banners[i], banners[j]);
      }
    }

    // High z-index layers fighting (excluding svg)
    const layered = [...document.querySelectorAll('body *')].filter((el) => {
      if (el.closest('svg')) return false;
      if (!visible(el)) return false;
      const z = parseInt(getComputedStyle(el).zIndex, 10);
      return Number.isFinite(z) && z >= 40;
    }).slice(0, 40);

    for (let i = 0; i < layered.length; i++) {
      for (let j = i + 1; j < layered.length; j++) {
        const a = layered[i];
        const b = layered[j];
        if (a.contains(b) || b.contains(a)) continue;
        const area = overlap(a, b);
        if (area < 200) continue;
        const za = parseInt(getComputedStyle(a).zIndex, 10);
        const zb = parseInt(getComputedStyle(b).zIndex, 10);
        if (Math.abs(za - zb) <= 5 && za >= 40) {
          push('P1', 'z-fight', `z-index neighbors ${za}/${zb} overlap ${Math.round(area)}px²`, a, b);
        }
      }
    }

    // Text truncated by another opaque box covering its center
    for (const el of interactives.slice(0, 40)) {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const topEl = document.elementFromPoint(cx, cy);
      if (!topEl) continue;
      if (el === topEl || el.contains(topEl) || topEl.contains(el)) continue;
      if (topEl.closest('header, nav.dock, .zoai-fab, #sheet, #chatPanel, .pwa-install-bar')) {
        push('P0', 'covered-point', `elementFromPoint hits ${topEl.tagName}.${(topEl.className || '').toString().slice(0, 40)} over control`, el, topEl);
      }
    }

    return hits.slice(0, 40);
  }, { pageId, scrollY });
}

async function scrollSweep(page, role, pageId) {
  const entry = { role, pageId, shots: [], collisions: [], scrollMax: 0 };
  await dismiss(page);
  await settle(page, 250);

  const maxY = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight));
  entry.scrollMax = maxY;
  const stops = maxY < 40 ? [0] : [0, Math.round(maxY * 0.35), Math.round(maxY * 0.7), maxY].filter((v, i, a) => a.indexOf(v) === i);

  for (const y of stops) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await settle(page, 220);
    const label = y === 0 ? 'top' : y >= maxY - 2 ? 'bottom' : `y${y}`;
    const file = shot(role, pageId, label);
    await page.screenshot({ path: file, fullPage: false }).catch(() => {});
    entry.shots.push(path.basename(file));
    const hits = await detectCollisions(page, pageId, y);
    entry.collisions.push(...hits);
    report.collisions.push(...hits.map((h) => ({ ...h, role })));
  }

  await page.evaluate(() => scrollTo(0, 0));
  report.pages.push(entry);
  return entry;
}

async function visit(page, role, pageId, navFn) {
  try {
    await navFn();
    await dismiss(page);
    await scrollSweep(page, role, pageId);
  } catch (e) {
    report.pages.push({ role, pageId, error: String(e.message || e).slice(0, 200) });
  }
}

async function runStaff(browserType, roleName, profileId, shell, device) {
  const browser = await browserType.launch();
  const context = await browser.newContext(device);
  await login(context.request, profileId, 'staff');
  const page = await context.newPage();
  await boot(page, shell);
  const role = `${roleName}-${shell.replace(/\//g, '')}`;

  for (const tab of STAFF_TABS) {
    await visit(page, role, tab, async () => {
      await page.evaluate((tab) => {
        state.tab = tab;
        if (tab === 'stock') state.house = 'h1';
        if (tab === 'schedule') state.planView = 'day';
        if (tab === 'admin') state.adminPane = 'ops';
        render();
        scrollTo(0, 0);
      }, tab);
    });
  }

  await visit(page, role, 'schedule-week', async () => {
    await page.evaluate(() => {
      state.tab = 'schedule';
      state.planView = 'week';
      render();
      scrollTo(0, 0);
    });
  });

  const isAdmin = await page.evaluate(() => typeof isAdminUser === 'function' && isAdminUser());
  if (isAdmin) {
    for (const pane of ADMIN_PANES) {
      await visit(page, role, `admin-${pane}`, async () => {
        await page.evaluate((pane) => {
          state.tab = 'admin';
          state.adminPane = pane;
          render();
          scrollTo(0, 0);
        }, pane);
      });
    }
  }

  await browser.close();
}

async function runKid(browserType, shell, device) {
  const browser = await browserType.launch();
  const context = await browser.newContext(device);
  await login(context.request, 'k1', 'child');
  const page = await context.newPage();
  await boot(page, shell);
  const role = `kid-${shell.replace(/\//g, '')}`;

  for (const view of KID_VIEWS) {
    await visit(page, role, `kid-${view}`, async () => {
      await page.evaluate((view) => {
        state.mode = 'child';
        state.childView = view;
        if (typeof render === 'function') render();
        scrollTo(0, 0);
      }, view);
    });
  }
  await browser.close();
}

function writeNotes() {
  const byKind = {};
  const bySev = { P0: 0, P1: 0, P2: 0 };
  for (const c of report.collisions) {
    byKind[c.kind] = (byKind[c.kind] || 0) + 1;
    bySev[c.sev] = (bySev[c.sev] || 0) + 1;
  }
  report.summary = {
    surface,
    pages: report.pages.length,
    pageErrors: report.pages.filter((p) => p.error).length,
    collisions: report.collisions.length,
    bySev,
    byKind,
    shots: report.pages.reduce((n, p) => n + (p.shots?.length || 0), 0),
  };

  const lines = [];
  lines.push(`# Scroll collision notes — ${surface.toUpperCase()}`);
  lines.push('');
  lines.push(`Stamp: ${STAMP} · Base: ${LOCAL}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('```json');
  lines.push(JSON.stringify(report.summary, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('## Severity rollup');
  for (const [k, n] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) {
    lines.push(`- **${k}**: ${n}`);
  }
  lines.push('');
  lines.push('## Top collisions (deduped)');
  const seen = new Set();
  for (const c of report.collisions.filter((x) => x.sev === 'P0' || x.sev === 'P1')) {
    const key = `${c.sev}|${c.kind}|${c.pageId}|${c.a?.text || c.a?.id}|${c.b?.cls || ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (seen.size > 80) break;
    lines.push(`- [${c.sev}] \`${c.role}/${c.pageId}\` @y=${c.scrollY} **${c.kind}**: ${c.detail}`);
    if (c.a) lines.push(`  - A: \`${c.a.tag}.${c.a.cls}\` “${c.a.text}”`);
    if (c.b) lines.push(`  - B: \`${c.b.tag}.${c.b.cls}\` “${c.b.text}”`);
  }
  lines.push('');
  lines.push('## Pages with most hits');
  const byPage = {};
  for (const c of report.collisions) {
    byPage[c.pageId] = (byPage[c.pageId] || 0) + 1;
  }
  for (const [p, n] of Object.entries(byPage).sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    lines.push(`- **${p}**: ${n}`);
  }

  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  const md = path.join(OUT, 'NOTES.md');
  fs.writeFileSync(md, lines.join('\n'));
  // also mirror into docs for PR
  return md;
}

async function main() {
  console.log(`Scroll overlap → ${surface} → ${OUT}`);
  if (surface === 'iphone') {
    await runStaff(webkit, 'admin', 'e4', '/m', IPHONE);
    await runStaff(webkit, 'staff', 'e1', '/m', IPHONE);
    await runKid(webkit, '/m', IPHONE);
  } else if (surface === 'pc') {
    await runStaff(chromium, 'admin', 'e4', '/desk', DESK);
    await runStaff(chromium, 'staff', 'e1', '/desk', DESK);
    await runKid(chromium, '/desk', DESK);
  } else {
    throw new Error(`unknown surface ${surface}`);
  }
  const md = writeNotes();
  console.log(JSON.stringify(report.summary, null, 2));
  console.log('Wrote', md);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
