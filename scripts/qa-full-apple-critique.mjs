/**
 * Full-site functional + CSS critique sweep.
 * Local auth (staff admin / staff / kids) on iPhone WebKit + desk Chromium,
 * plus live public site gate/smoke (staff PINs differ — no live staff login).
 */
import { webkit, chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LOCAL = process.env.PAIDIA_QA_BASE || 'http://127.0.0.1:5173';
const LIVE = process.env.PAIDIA_LIVE_BASE || 'https://armonia-thassos.vercel.app';
const pins = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/marketing/.local-auth/pins.json'), 'utf8'));
const OUT = path.join(ROOT, '.qa-screens/full-apple-critique');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
fs.mkdirSync(OUT, { recursive: true });

const IPHONE = {
  ...devices['iPhone 15 Pro'],
  viewport: { width: 393, height: 852 },
};

const STAFF_TABS = ['home', 'schedule', 'stock', 'shop', 'book', 'talk', 'kids', 'pocket', 'gallery', 'admin'];
const ADMIN_PANES = ['ops', 'team', 'supplies', 'school', 'review', 'finance', 'audit', 'communications', 'automations', 'system'];
const SCHEDULE_VIEWS = ['day', 'week'];
const KID_VIEWS = ['today', 'games', 'rate', 'bonus', 'notes', 'plan', 'stars', 'learn', 'gallery'];

const SKIP_CLICK = new Set([
  'btnUser', // opens profile / logout risk mid-run
]);
const DANGEROUS_RE = /abmelden|logout|löschen|entfernen|delete|reset|clear week|woche leeren|aiClear|force|wipe|factory/i;

const report = {
  stamp: STAMP,
  local: LOCAL,
  live: LIVE,
  roles: {},
  liveGate: {},
  iosSim: {},
  cssFindings: [],
  functionalFailures: [],
  pages: [],
  summary: {},
};

function shotPath(...parts) {
  return path.join(OUT, parts.filter(Boolean).join('-') + '.png');
}

async function settle(page, ms = 280) {
  await page.waitForTimeout(ms);
}

async function dismiss(page) {
  await page.keyboard.press('Escape').catch(() => {});
  for (const sel of [
    '#tourSkip',
    'button:has-text("Überspringen")',
    'button:has-text("Später")',
    '.sheet-close',
    '#sheet .x',
    '#sheet [aria-label="Schließen"]',
    '#sheet [aria-label="Close"]',
    '.chat-close',
    '.pwa-install-bar button:has-text("Später")',
  ]) {
    const el = page.locator(sel).first();
    if ((await el.count()) && (await el.isVisible().catch(() => false))) {
      await el.click({ force: true, timeout: 800 }).catch(() => {});
      await settle(page, 100);
    }
  }
  await page.evaluate(() => {
    try {
      document.getElementById('sheet')?.classList.remove('on');
      document.body.classList.remove('sheet-open');
      const s = document.getElementById('sheet');
      if (s && s.classList.contains('on') === false) { /* keep */ }
      // suppress auto presence reopen
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
  const res = await request.post(`${LOCAL}/api/auth/login`, {
    data: { profileId, mode, pin, remember: false },
  });
  if (!res.ok()) throw new Error(`login ${profileId} ${res.status()}`);
  await request.post(`${LOCAL}/api/auth/onboarding/complete`, { data: { version: 3 } }).catch(() => {});
}

async function bootShell(page, shell, lang = 'de') {
  await page.addInitScript(({ lang }) => {
    localStorage.setItem('paidia.lang', lang);
    localStorage.setItem('paidia.uiMode', 'pro');
    localStorage.setItem('paidia.tourSeen', '1');
    localStorage.setItem('paidia.tipsSeen', '1');
  }, { lang });
  await page.goto(`${LOCAL}${shell}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(
    () => typeof window.render === 'function' && !document.body.classList.contains('auth-pending'),
    { timeout: 60000 },
  );
  await dismiss(page);
}

async function measureCss(page, label) {
  return page.evaluate((label) => {
    const winW = innerWidth;
    const winH = innerHeight;
    const findings = [];
    const push = (sev, kind, detail, el) => {
      const r = el?.getBoundingClientRect?.();
      findings.push({
        sev, kind, detail, label,
        tag: el?.tagName, id: el?.id, cls: (el?.className || '').toString().slice(0, 80),
        box: r ? { w: +r.width.toFixed(1), h: +r.height.toFixed(1), x: +r.x.toFixed(1), y: +r.y.toFixed(1) } : null,
      });
    };

    // page overflow
    if (document.documentElement.scrollWidth > winW + 2) {
      push('P0', 'overflow-x', `doc scrollWidth ${document.documentElement.scrollWidth} > ${winW}`);
    }

    const all = [...document.querySelectorAll('body *')].filter((el) => {
      if (el.closest('svg') || el.tagName === 'svg' || el.tagName === 'PATH' || el.tagName === 'USE' || el.tagName === 'G') return false;
      const r = el.getBoundingClientRect();
      return r.width > 1 && r.height > 1;
    });

    for (const el of all) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.right > winW + 3 || r.left < -3) {
        if (!el.closest('nav.dock, .sheet, #gate, .pwa-install-bar')) {
          push('P0', 'clip-overflow', `extends past viewport`, el);
        }
      }
      // tap targets in view / interactive
      const interactive = el.matches('button, a, [role="button"], input, select, summary, .chip, .page-act, .topbtn, nav.dock button');
      if (interactive && r.height > 0 && r.width > 0 && r.bottom > 0 && r.top < winH) {
        if (r.height < 40 && r.width < 40 && !el.closest('.stock-more-popover, .nav-menu')) {
          push('P1', 'tap-small', `hit ${r.width.toFixed(0)}×${r.height.toFixed(0)} < 44`, el);
        }
        if (r.height > 120 && el.matches('button, .btn, .page-act, .chip') && !el.closest('.schedule-agenda-empty, .home-pulse-item, .admin-record, .kid-dir-card, .stock-product')) {
          push('P1', 'tap-giant', `hit height ${r.height.toFixed(0)} > 120`, el);
        }
      }
      // text too small
      if (['P', 'SPAN', 'LABEL', 'BUTTON', 'A', 'LI', 'H1', 'H2', 'H3'].includes(el.tagName)) {
        const fs = parseFloat(cs.fontSize);
        if (fs && fs < 11 && (el.textContent || '').trim().length > 0) {
          push('P2', 'type-tiny', `font-size ${fs}px`, el);
        }
      }
      // low contrast-ish: white text on near-white (heuristic)
      if (cs.color === 'rgb(255, 255, 255)' || cs.color === 'rgba(255, 255, 255, 1)') {
        const bg = cs.backgroundColor;
        if (bg.startsWith('rgb(255') || bg === 'rgba(0, 0, 0, 0)') {
          // skip transparent — expensive ancestry walk limited
        }
      }
    }

    // chrome / dock crowding
    const core = document.querySelector('.topbar-core, .chrome-actions');
    if (core) {
      const kids = [...core.children].filter((c) => getComputedStyle(c).display !== 'none');
      if (kids.length >= 3) {
        for (let i = 0; i < kids.length - 1; i++) {
          const a = kids[i].getBoundingClientRect();
          const b = kids[i + 1].getBoundingClientRect();
          const gap = b.left - a.right;
          if (gap < 6) push('P1', 'chrome-gap', `gap ${gap.toFixed(1)}px between chrome controls`, kids[i]);
        }
      }
    }

    // dock label truncation
    document.querySelectorAll('nav.dock button span').forEach((span) => {
      if (span.scrollWidth > span.clientWidth + 2) {
        push('P1', 'dock-truncate', `label truncated: ${span.textContent}`, span);
      }
    });

    // sheet covering dock
    const sheet = document.getElementById('sheet');
    if (sheet?.classList.contains('on')) {
      const dock = document.querySelector('nav.dock');
      if (dock) {
        const sr = sheet.getBoundingClientRect();
        const dr = dock.getBoundingClientRect();
        if (sr.bottom > dr.top + 4) push('P0', 'sheet-covers-dock', 'open sheet overlaps dock', sheet);
      }
    }

    // duplicate visible strings (simple)
    const banners = [...document.querySelectorAll('.home-shift-step')].map((row) => ({
      label: row.querySelector('.home-shift-step-label')?.textContent?.trim(),
      cta: row.querySelector('.home-shift-step-cta, button')?.textContent?.trim(),
    }));
    for (const b of banners) {
      if (b.label && b.cta && b.label === b.cta) {
        push('P1', 'copy-dup', `duplicate label+cta "${b.label}"`);
      }
    }

    return {
      findings: findings.slice(0, 80),
      counts: findings.reduce((acc, f) => { acc[f.kind] = (acc[f.kind] || 0) + 1; return acc; }, {}),
      overflow: document.documentElement.scrollWidth > winW + 2,
      title: document.querySelector('#title')?.textContent || document.title,
      tab: document.body.dataset.tab || window.state?.tab,
      mode: window.state?.mode,
    };
  }, label);
}

async function clickSweep(page, role, pageId) {
  const result = { clicked: 0, skipped: 0, errors: [], broken: [] };
  const selector = [
    '#view button:visible',
    '#view a.btn:visible',
    '#view .page-act:visible',
    '#view .chip:visible',
    '#view summary:visible',
    'nav.dock button:visible',
    '.topbar-core button:visible',
    '#bottomPanel button:visible',
  ].join(', ');

  const count = await page.locator(selector).count();
  const max = Math.min(count, 48);
  for (let i = 0; i < max; i++) {
    const loc = page.locator(selector).nth(i);
    const meta = await loc.evaluate((node) => ({
      id: node.id,
      text: (node.innerText || node.getAttribute('aria-label') || '').trim().slice(0, 60),
      disabled: node.disabled || node.getAttribute('aria-disabled') === 'true',
      type: node.getAttribute('type'),
      dataTab: node.getAttribute('data-tab'),
    })).catch(() => null);
    if (!meta || meta.disabled) { result.skipped++; continue; }
    if (SKIP_CLICK.has(meta.id) || DANGEROUS_RE.test(meta.text) || DANGEROUS_RE.test(meta.id)) {
      result.skipped++;
      continue;
    }
    const before = await page.evaluate(() => ({
      tab: window.state?.tab,
      childView: window.state?.childView,
      err: window.__qaLastError || null,
    }));
    try {
      await loc.click({ timeout: 1200, force: true });
      result.clicked++;
      await settle(page, 180);
      const err = await page.evaluate(() => window.__qaLastError || null);
      if (err && err !== before.err) {
        result.errors.push({ pageId, click: meta, err });
        report.functionalFailures.push({ role, pageId, click: meta.text, err });
        await page.evaluate(() => { window.__qaLastError = null; });
      }
      await dismiss(page);
      if (!meta.dataTab && !String(meta.id || '').startsWith('dock')) {
        await page.evaluate((b) => {
          if (window.state && b.tab && state.tab !== b.tab && state.mode !== 'child') {
            state.tab = b.tab;
            if (typeof render === 'function') render();
          }
          if (window.state && b.childView && state.mode === 'child' && state.childView !== b.childView) {
            state.childView = b.childView;
            if (typeof render === 'function') render();
          }
        }, before);
      }
    } catch (e) {
      const msg = String(e.message || e);
      if (/not attached|not visible|Timeout/i.test(msg)) {
        result.skipped++;
        continue;
      }
      result.broken.push({ pageId, click: meta, message: msg.slice(0, 120) });
      report.functionalFailures.push({ role, pageId, click: meta?.text, err: msg.slice(0, 160) });
    }
  }
  return result;
}

async function visitPage(page, role, pageId, navigateFn) {
  const entry = { role, pageId, css: null, clicks: null, shot: null };
  try {
    await navigateFn();
    await dismiss(page);
    await settle(page, 320);
    const shot = shotPath(role, pageId);
    await page.screenshot({ path: shot, fullPage: false });
    entry.shot = path.basename(shot);
    entry.css = await measureCss(page, `${role}/${pageId}`);
    report.cssFindings.push(...(entry.css.findings || []).map((f) => ({ ...f, role, pageId })));
    entry.clicks = await clickSweep(page, role, pageId);
    await dismiss(page);
    // post-click screenshot
    await page.screenshot({ path: shotPath(role, pageId, 'after'), fullPage: false }).catch(() => {});
  } catch (e) {
    entry.error = String(e.message || e).slice(0, 240);
    report.functionalFailures.push({ role, pageId, err: entry.error });
  }
  report.pages.push(entry);
  return entry;
}

async function runStaff(browserType, roleName, profileId, shell, device) {
  const browser = await browserType.launch();
  const context = await browser.newContext(device || { viewport: { width: 1440, height: 900 } });
  await login(context.request, profileId, 'staff');
  const page = await context.newPage();
  page.on('pageerror', (err) => {
    page.evaluate((m) => { window.__qaLastError = m; }, String(err.message || err).slice(0, 200)).catch(() => {});
  });
  await bootShell(page, shell);
  const role = `${roleName}-${shell.replace('/', '') || 'root'}`;
  report.roles[role] = { profileId, shell };

  for (const tab of STAFF_TABS) {
    if (tab === 'admin' && !['admin-m', 'admin-desk', 'admin-'].some(() => false) && !role.startsWith('admin')) {
      // still try — non-admin should show adminRequired
    }
    await visitPage(page, role, tab, async () => {
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

  // schedule week
  await visitPage(page, role, 'schedule-week', async () => {
    await page.evaluate(() => {
      state.tab = 'schedule';
      state.planView = 'week';
      render();
      scrollTo(0, 0);
    });
  });

  // admin panes if admin
  const isAdmin = await page.evaluate(() => typeof isAdminUser === 'function' && isAdminUser());
  if (isAdmin) {
    for (const pane of ADMIN_PANES) {
      await visitPage(page, role, `admin-${pane}`, async () => {
        await page.evaluate((pane) => {
          state.tab = 'admin';
          state.adminPane = pane;
          render();
          scrollTo(0, 0);
        }, pane);
      });
    }
  }

  // Easy mode sample
  await visitPage(page, role, 'home-easy', async () => {
    await page.evaluate(() => {
      localStorage.setItem('paidia.uiMode', 'easy');
      document.body.classList.remove('mode-pro');
      document.body.classList.add('mode-easy');
      if (window.setUiMode) setUiMode('easy', { scope: 'global' });
      state.tab = 'home';
      render();
    });
  });
  await page.evaluate(() => {
    localStorage.setItem('paidia.uiMode', 'pro');
    document.body.classList.add('mode-pro');
    document.body.classList.remove('mode-easy');
    if (window.setUiMode) setUiMode('pro', { scope: 'global' });
  });

  await browser.close();
}

async function runKid(browserType, shell) {
  const browser = await browserType.launch();
  const context = await browser.newContext(IPHONE);
  await login(context.request, 'k1', 'child');
  const page = await context.newPage();
  page.on('pageerror', (err) => {
    page.evaluate((m) => { window.__qaLastError = m; }, String(err.message || err).slice(0, 200)).catch(() => {});
  });
  await bootShell(page, shell);
  const role = `kid-${shell.replace('/', '')}`;
  report.roles[role] = { profileId: 'k1', shell };

  for (const view of KID_VIEWS) {
    await visitPage(page, role, `kid-${view}`, async () => {
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

async function runLive() {
  const browser = await webkit.launch();
  const context = await browser.newContext(IPHONE);
  const page = await context.newPage();
  const live = { urls: [], gate: null, desk: null, errors: [] };

  for (const pathUrl of ['/', '/m/', '/desk/']) {
    try {
      const res = await page.goto(`${LIVE}${pathUrl}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await settle(page, 800);
      const info = await page.evaluate(() => ({
        title: document.title,
        build: document.querySelector('.gate-build')?.innerText || null,
        authPending: document.body.classList.contains('auth-pending'),
        h2: document.querySelector('.gate-head h2')?.innerText || null,
        cards: [...document.querySelectorAll('.gate-mode-card .pn, .profile .pn')].map((e) => e.textContent.trim()).slice(0, 8),
        overflow: document.documentElement.scrollWidth > innerWidth + 2,
      }));
      const name = pathUrl === '/' ? 'root' : pathUrl.replace(/\//g, '') || 'root';
      await page.screenshot({ path: shotPath('live', name), fullPage: false });
      live.urls.push({ path: pathUrl, status: res?.status(), ...info });

      // try tapping gate buttons if present
      const staff = page.locator('[data-mode="staff"], .gate-mode-card').first();
      if (await staff.count()) {
        await staff.click().catch(() => {});
        await settle(page, 500);
        await page.screenshot({ path: shotPath('live', name, 'profiles'), fullPage: false });
        // tap first profile if any (won't know PIN on live)
        const prof = page.locator('[data-p]').first();
        if (await prof.count()) {
          await prof.click().catch(() => {});
          await settle(page, 400);
          await page.screenshot({ path: shotPath('live', name, 'pin'), fullPage: false });
          // try wrong pin digits for UI only
          for (const d of ['1', '2', '3', '4']) {
            const key = page.locator(`.pin-pad button:has-text("${d}"), .gate-pin button:has-text("${d}"), button.pin-key:has-text("${d}")`).first();
            if (await key.count()) await key.click().catch(() => {});
          }
          await settle(page, 300);
          await page.screenshot({ path: shotPath('live', name, 'pin-try'), fullPage: false });
        }
      }
    } catch (e) {
      live.errors.push({ path: pathUrl, err: String(e.message || e).slice(0, 200) });
    }
  }

  // dead alias check
  try {
    const dead = await context.request.get('https://a-thassos.vercel.app/', { timeout: 15000 });
    live.deadAlias = { status: dead.status(), ok: dead.ok() };
  } catch (e) {
    live.deadAlias = { err: String(e.message || e).slice(0, 120) };
  }

  report.liveGate = live;
  await browser.close();
}

async function runIosSim() {
  // Best-effort: open live gate in Simulator Safari + screenshot
  const sim = { booted: false, shots: [] };
  try {
    const { execSync } = await import('child_process');
    const list = execSync('xcrun simctl list devices booted', { encoding: 'utf8' });
    sim.booted = /Booted/.test(list);
    if (sim.booted) {
      execSync(`xcrun simctl openurl booted '${LIVE}/m/'`, { stdio: 'ignore' });
      await new Promise((r) => setTimeout(r, 3500));
      const p = shotPath('ios-sim', 'live-m-gate');
      execSync(`xcrun simctl io booted screenshot '${p}'`, { stdio: 'ignore' });
      sim.shots.push(path.basename(p));
      execSync(`xcrun simctl openurl booted '${LIVE}/desk/'`, { stdio: 'ignore' });
      await new Promise((r) => setTimeout(r, 2500));
      const p2 = shotPath('ios-sim', 'live-desk');
      execSync(`xcrun simctl io booted screenshot '${p2}'`, { stdio: 'ignore' });
      sim.shots.push(path.basename(p2));
    }
  } catch (e) {
    sim.err = String(e.message || e).slice(0, 200);
  }
  report.iosSim = sim;
}

function summarize() {
  const byKind = {};
  const bySev = { P0: 0, P1: 0, P2: 0 };
  for (const f of report.cssFindings) {
    byKind[f.kind] = (byKind[f.kind] || 0) + 1;
    bySev[f.sev] = (bySev[f.sev] || 0) + 1;
  }
  report.summary = {
    pages: report.pages.length,
    pageErrors: report.pages.filter((p) => p.error).length,
    functionalFailures: report.functionalFailures.length,
    cssFindings: report.cssFindings.length,
    bySev,
    byKind,
    clicks: report.pages.reduce((n, p) => n + (p.clicks?.clicked || 0), 0),
    clickErrors: report.pages.reduce((n, p) => n + (p.clicks?.errors?.length || 0), 0),
  };
}

async function main() {
  console.log('→ iOS Simulator live smoke…');
  await runIosSim();
  console.log('→ Live public site…');
  await runLive();
  console.log('→ Local admin staff iPhone…');
  await runStaff(webkit, 'admin', 'e4', '/m', IPHONE);
  console.log('→ Local admin staff desk…');
  await runStaff(chromium, 'admin', 'e4', '/desk', { viewport: { width: 1440, height: 900 } });
  console.log('→ Local non-admin staff iPhone…');
  await runStaff(webkit, 'staff', 'e1', '/m', IPHONE);
  console.log('→ Local kid iPhone…');
  await runKid(webkit, '/m');
  summarize();
  const jsonPath = path.join(OUT, 'report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.summary, null, 2));
  console.log('Wrote', jsonPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
