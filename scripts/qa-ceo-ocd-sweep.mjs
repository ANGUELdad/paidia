/**
 * Strict CEO / OCD UI sweep — every staff tab, admin pane, kid view.
 * Surfaces: --surface=iphone | pc | sim
 * Screenshots + CSS measurements + button click sweep + NOTES.md
 */
import { webkit, chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LOCAL = process.env.PAIDIA_QA_BASE || 'http://127.0.0.1:5173';
const LIVE = process.env.PAIDIA_LIVE_BASE || 'https://armonia-thassos.vercel.app';
const pins = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/marketing/.local-auth/pins.json'), 'utf8'));

const args = process.argv.slice(2);
const surface = (args.find((a) => a.startsWith('--surface=')) || '--surface=iphone').split('=')[1];
const SKIP_SIM = args.includes('--skip-sim');
const OUT = path.join(ROOT, '.qa-screens', `v227-ceo-${surface}`);
fs.mkdirSync(OUT, { recursive: true });
const STAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

const IPHONE = {
  ...devices['iPhone 15 Pro'],
  viewport: { width: 393, height: 852 },
  isMobile: true,
  hasTouch: true,
};
const DESK = { viewport: { width: 1440, height: 900 } };

const STAFF_TABS = ['home', 'schedule', 'stock', 'shop', 'book', 'talk', 'kids', 'pocket', 'gallery', 'admin'];
const ADMIN_PANES = ['ops', 'team', 'supplies', 'school', 'review', 'finance', 'audit', 'communications', 'automations', 'system'];
const KID_VIEWS = ['today', 'games', 'rate', 'bonus', 'notes', 'plan', 'stars', 'learn', 'gallery'];

const SKIP_CLICK = new Set(['btnUser']);
const DANGEROUS_RE = /abmelden|logout|löschen|entfernen|delete|reset|clear week|woche leeren|aiClear|force|wipe|factory/i;

const report = {
  stamp: STAMP,
  surface,
  local: LOCAL,
  live: LIVE,
  roles: {},
  cssFindings: [],
  functionalFailures: [],
  pages: [],
  notes: [],
  summary: {},
  iosSim: null,
};

function shotPath(...parts) {
  return path.join(OUT, parts.filter(Boolean).join('-') + '.png');
}

function note(sev, pageId, title, detail) {
  report.notes.push({ sev, pageId, title, detail, at: new Date().toISOString() });
}

async function settle(page, ms = 120) {
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
      await settle(page, 80);
    }
  }
  await page.evaluate(() => {
    try {
      document.getElementById('sheet')?.classList.remove('on');
      document.body.classList.remove('sheet-open');
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

/** OCD visual / layout auditor — CEO-grade pedantry */
async function measureOcd(page, label) {
  return page.evaluate((label) => {
    const winW = innerWidth;
    const winH = innerHeight;
    const findings = [];
    const push = (sev, kind, detail, el) => {
      const r = el?.getBoundingClientRect?.();
      findings.push({
        sev, kind, detail, label,
        tag: el?.tagName,
        id: el?.id || '',
        cls: (el?.className || '').toString().slice(0, 90),
        text: ((el?.innerText || el?.textContent || '') + '').trim().slice(0, 48),
        box: r ? { w: +r.width.toFixed(1), h: +r.height.toFixed(1), x: +r.x.toFixed(1), y: +r.y.toFixed(1) } : null,
      });
    };

    if (document.documentElement.scrollWidth > winW + 2) {
      push('P0', 'overflow-x', `doc scrollWidth ${document.documentElement.scrollWidth} > ${winW}`);
    }

    // Interactive + text sample only (full body walk was too slow for full-site sweeps)
    const candidates = [...document.querySelectorAll(
      'button, a[href], [role="button"], input, select, summary, .chip, .page-act, .topbtn, nav.dock button, .btn, h1, h2, h3, #title, .page-title, p, label, span.dock-label, nav.dock span'
    )].filter((el) => {
      if (el.closest('svg') || ['SVG', 'PATH', 'USE', 'G'].includes(el.tagName)) return false;
      const r = el.getBoundingClientRect();
      return r.width > 1 && r.height > 1;
    });

    for (const el of candidates) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if ((r.right > winW + 3 || r.left < -3) && !el.closest('nav.dock, .sheet, #gate, .pwa-install-bar, .sidebar, .desk-rail')) {
        push('P0', 'clip-overflow', 'extends past viewport', el);
      }

      const interactive = el.matches('button, a[href], [role="button"], input, select, summary, .chip, .page-act, .topbtn, nav.dock button, .btn');
      if (interactive && r.height > 0 && r.width > 0 && r.bottom > 0 && r.top < winH) {
        const isPhone = winW < 500;
        const min = isPhone ? 44 : 28;
        if (isPhone && r.height < min && r.width < min && !el.closest('.stock-more-popover, .nav-menu, .pin-pad')) {
          push('P1', 'tap-small', `hit ${r.width.toFixed(0)}×${r.height.toFixed(0)} < ${min}`, el);
        }
        if (r.height > 120 && el.matches('button, .btn, .page-act, .chip') && !el.closest('.home-pulse-item, .admin-record, .kid-dir-card, .stock-product, .schedule-agenda-empty')) {
          push('P1', 'tap-giant', `height ${r.height.toFixed(0)} > 120`, el);
        }
        if (el.matches('button, .btn, .page-act, .chip, a.btn') && el.scrollWidth > el.clientWidth + 2) {
          push('P1', 'btn-text-clip', 'button label overflows box', el);
        }
        if (el.matches('.home-primary, .btn.primary, .page-act.primary, button.primary') && r.height > 0) {
          const pt = parseFloat(cs.paddingTop) || 0;
          const pb = parseFloat(cs.paddingBottom) || 0;
          if (Math.abs(pt - pb) > 2) push('P2', 'pad-asym', `paddingTop ${pt} vs bottom ${pb}`, el);
        }
        if (el.matches('button, .btn, .page-act, .chip') && cs.textAlign === 'center' && r.width > 80) {
          const span = el.querySelector('span, b, strong') || el;
          const sr = span.getBoundingClientRect();
          const leftGap = sr.left - r.left;
          const rightGap = r.right - sr.right;
          if (Math.abs(leftGap - rightGap) > 10 && (el.innerText || '').trim().length < 28) {
            push('P2', 'center-skew', `label not optically centered (Δ${Math.abs(leftGap - rightGap).toFixed(0)}px)`, el);
          }
        }
      }

      if (['P', 'SPAN', 'LABEL', 'BUTTON', 'A', 'LI', 'H1', 'H2', 'H3'].includes(el.tagName)) {
        const fs = parseFloat(cs.fontSize);
        const t = (el.textContent || '').trim();
        if (fs && fs < 11 && t.length > 0) push('P2', 'type-tiny', `font-size ${fs}px`, el);
        if (fs && t.length > 2 && el.scrollWidth > el.clientWidth + 3) {
          if (cs.textOverflow === 'ellipsis' || cs.overflow === 'hidden' || cs.whiteSpace === 'nowrap') {
            if (el.closest('nav.dock, .topbar, .chrome')) {
              push('P1', 'chrome-truncate', `truncated: "${t.slice(0, 40)}"`, el);
            }
          }
        }
      }
    }

    // chrome gaps
    const core = document.querySelector('.topbar-core, .chrome-actions');
    if (core) {
      const kids = [...core.children].filter((c) => getComputedStyle(c).display !== 'none');
      for (let i = 0; i < kids.length - 1; i++) {
        const a = kids[i].getBoundingClientRect();
        const b = kids[i + 1].getBoundingClientRect();
        const gap = b.left - a.right;
        if (gap < 8) push('P1', 'chrome-gap', `gap ${gap.toFixed(1)}px`, kids[i]);
        if (gap > 28 && kids.length <= 4) push('P2', 'chrome-gap-wide', `gap ${gap.toFixed(1)}px uneven`, kids[i]);
      }
    }

    // dock: equal column widths / truncated labels / uneven icon-label rhythm
    const dockBtns = [...document.querySelectorAll('nav.dock button')].filter((b) => getComputedStyle(b).display !== 'none');
    if (dockBtns.length >= 3) {
      const widths = dockBtns.map((b) => b.getBoundingClientRect().width);
      const avg = widths.reduce((a, b) => a + b, 0) / widths.length;
      widths.forEach((w, i) => {
        if (Math.abs(w - avg) > avg * 0.35) {
          push('P1', 'dock-width-uneven', `btn width ${w.toFixed(0)} vs avg ${avg.toFixed(0)}`, dockBtns[i]);
        }
      });
      dockBtns.forEach((btn) => {
        const span = btn.querySelector('span');
        if (span && span.scrollWidth > span.clientWidth + 2) {
          push('P1', 'dock-truncate', `label truncated: ${span.textContent}`, span);
        }
        const fs = span ? parseFloat(getComputedStyle(span).fontSize) : 0;
        if (fs && fs < 10) push('P1', 'dock-type-tiny', `dock label ${fs}px`, span);
      });
    }

    // sibling primary CTA width consistency in same row
    document.querySelectorAll('.home-command-actions, .page-actions, .sheet-actions, .btn-row, .home-cta-row').forEach((row) => {
      const btns = [...row.querySelectorAll('button, .btn, .page-act')].filter((b) => {
        const r = b.getBoundingClientRect();
        return r.width > 40 && getComputedStyle(b).display !== 'none';
      });
      if (btns.length >= 2) {
        const ws = btns.map((b) => b.getBoundingClientRect().width);
        const max = Math.max(...ws);
        const min = Math.min(...ws);
        // stacked full-bleed CTAs should both be ~full width
        const stacked = btns.every((b) => {
          const r = b.getBoundingClientRect();
          const pr = row.getBoundingClientRect();
          return r.width > pr.width * 0.85;
        });
        if (stacked && max - min > 24) {
          push('P1', 'cta-width-mismatch', `stacked CTAs differ by ${(max - min).toFixed(0)}px`, btns[0]);
        }
      }
    });

    // hero / title: left edge alignment with content column
    const title = document.querySelector('#title, .page-title, h1.page-h, .home-command-hero h1, .home-command-hero .home-kicker');
    const view = document.querySelector('#view .page, #view .home-command, #view > *');
    if (title && view) {
      const tr = title.getBoundingClientRect();
      const vr = view.getBoundingClientRect();
      if (tr.left > 0 && vr.left > 0 && Math.abs(tr.left - vr.left) > 18 && tr.width < winW * 0.7) {
        push('P2', 'align-drift', `title x=${tr.left.toFixed(0)} vs content x=${vr.left.toFixed(0)}`, title);
      }
    }

    // sheet covers dock
    const sheet = document.getElementById('sheet');
    if (sheet?.classList.contains('on')) {
      const dock = document.querySelector('nav.dock');
      if (dock) {
        const sr = sheet.getBoundingClientRect();
        const dr = dock.getBoundingClientRect();
        if (sr.bottom > dr.top + 4) push('P0', 'sheet-covers-dock', 'open sheet overlaps dock', sheet);
      }
    }

    // empty giant whitespace: primary viewport content height tiny
    const main = document.querySelector('#view');
    if (main) {
      const kids = [...main.children].filter((c) => {
        const r = c.getBoundingClientRect();
        return r.height > 20 && getComputedStyle(c).display !== 'none';
      });
      const contentH = kids.reduce((n, c) => n + c.getBoundingClientRect().height, 0);
      if (contentH < winH * 0.22 && !document.querySelector('.auth-pending, #gate')) {
        push('P2', 'sparse-viewport', `content stack ~${contentH.toFixed(0)}px in ${winH}vh — sparse or empty`, main);
      }
    }

    // badge contrast
    const badge = document.querySelector('.bell-count:not([hidden])');
    if (badge) {
      const cs = getComputedStyle(badge);
      const bg = cs.backgroundColor;
      const fg = cs.color;
      if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
        push('P1', 'badge-contrast', 'bell badge transparent background', badge);
      }
      if (fg === bg) push('P0', 'badge-contrast', 'bell badge fg==bg', badge);
    }

    return {
      findings: findings.slice(0, 100),
      counts: findings.reduce((acc, f) => { acc[f.kind] = (acc[f.kind] || 0) + 1; return acc; }, {}),
      overflow: document.documentElement.scrollWidth > winW + 2,
      title: document.querySelector('#title')?.textContent || document.title,
      tab: document.body.dataset.tab || window.state?.tab,
      mode: window.state?.mode,
      win: { w: winW, h: winH },
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
    '.sidebar button:visible',
    '.desk-rail button:visible',
    '#bottomPanel button:visible',
  ].join(', ');

  const count = await page.locator(selector).count();
  const max = Math.min(count, 32);
  for (let i = 0; i < max; i++) {
    const loc = page.locator(selector).nth(i);
    const meta = await loc.evaluate((node) => ({
      id: node.id,
      text: (node.innerText || node.getAttribute('aria-label') || '').trim().slice(0, 60),
      disabled: node.disabled || node.getAttribute('aria-disabled') === 'true',
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
      await loc.click({ timeout: 900, force: true });
      result.clicked++;
      await settle(page, 80);
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
    await settle(page, 180);
    const shot = shotPath(role, pageId);
    await page.screenshot({ path: shot, fullPage: false });
    entry.shot = path.basename(shot);
    entry.css = await measureOcd(page, `${role}/${pageId}`);
    report.cssFindings.push(...(entry.css.findings || []).map((f) => ({ ...f, role, pageId })));
    const p0 = (entry.css.findings || []).filter((f) => f.sev === 'P0');
    const p1 = (entry.css.findings || []).filter((f) => f.sev === 'P1');
    if (p0.length) note('P0', pageId, `${p0.length} critical layout issues`, p0.slice(0, 5).map((f) => f.kind + ': ' + f.detail).join(' | '));
    if (p1.length >= 3) note('P1', pageId, `${p1.length} polish defects`, p1.slice(0, 6).map((f) => f.kind).join(', '));
    entry.clicks = await clickSweep(page, role, pageId);
    await dismiss(page);
    await page.screenshot({ path: shotPath(role, pageId, 'after'), fullPage: false }).catch(() => {});
  } catch (e) {
    entry.error = String(e.message || e).slice(0, 240);
    note('P0', pageId, 'page visit failed', entry.error);
    report.functionalFailures.push({ role, pageId, err: entry.error });
  }
  report.pages.push(entry);
  return entry;
}

async function runStaff(browserType, roleName, profileId, shell, device) {
  const browser = await browserType.launch();
  const context = await browser.newContext(device);
  await login(context.request, profileId, 'staff');
  const page = await context.newPage();
  page.on('pageerror', (err) => {
    page.evaluate((m) => { window.__qaLastError = m; }, String(err.message || err).slice(0, 200)).catch(() => {});
  });
  await bootShell(page, shell);
  const role = `${roleName}-${shell.replace(/\//g, '')}`;
  report.roles[role] = { profileId, shell };

  for (const tab of STAFF_TABS) {
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

  await visitPage(page, role, 'schedule-week', async () => {
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

  await browser.close();
}

async function runKid(browserType, shell, device) {
  const browser = await browserType.launch();
  const context = await browser.newContext(device);
  await login(context.request, 'k1', 'child');
  const page = await context.newPage();
  page.on('pageerror', (err) => {
    page.evaluate((m) => { window.__qaLastError = m; }, String(err.message || err).slice(0, 200)).catch(() => {});
  });
  await bootShell(page, shell);
  const role = `kid-${shell.replace(/\//g, '')}`;
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

async function runIosSimDeep() {
  const sim = { booted: false, shots: [], pages: [] };
  try {
    const list = execSync('xcrun simctl list devices booted', { encoding: 'utf8' });
    sim.booted = /Booted/.test(list);
    if (!sim.booted) {
      sim.err = 'no booted simulator';
      report.iosSim = sim;
      return sim;
    }
    const urls = [
      [`${LIVE}/`, 'live-root'],
      [`${LIVE}/m/`, 'live-m'],
      [`${LIVE}/desk/`, 'live-desk'],
      [`${LOCAL}/m/`, 'local-m'],
    ];
    for (const [url, name] of urls) {
      try {
        execSync(`xcrun simctl openurl booted '${url}'`, { stdio: 'ignore' });
        await new Promise((r) => setTimeout(r, 2800));
        const p = shotPath('ios-sim', name);
        execSync(`xcrun simctl io booted screenshot '${p}'`, { stdio: 'ignore' });
        // also copy to dedicated ios-sim folder
        try {
          const alt = path.join(ROOT, '.qa-screens', 'v227-ceo-ios-sim', path.basename(p));
          fs.mkdirSync(path.dirname(alt), { recursive: true });
          fs.copyFileSync(p, alt);
        } catch {}
        sim.shots.push(path.basename(p));
        sim.pages.push({ name, url });
        note('INFO', `ios-sim/${name}`, 'Simulator Safari screenshot', url);
      } catch (e) {
        sim.pages.push({ name, url, err: String(e.message || e).slice(0, 120) });
      }
    }
  } catch (e) {
    sim.err = String(e.message || e).slice(0, 200);
  }
  report.iosSim = sim;
  return sim;
}

function summarize() {
  const byKind = {};
  const bySev = { P0: 0, P1: 0, P2: 0 };
  for (const f of report.cssFindings) {
    byKind[f.kind] = (byKind[f.kind] || 0) + 1;
    bySev[f.sev] = (bySev[f.sev] || 0) + 1;
  }
  report.summary = {
    surface,
    pages: report.pages.length,
    pageErrors: report.pages.filter((p) => p.error).length,
    functionalFailures: report.functionalFailures.length,
    cssFindings: report.cssFindings.length,
    bySev,
    byKind,
    clicks: report.pages.reduce((n, p) => n + (p.clicks?.clicked || 0), 0),
    clickErrors: report.pages.reduce((n, p) => n + (p.clicks?.errors?.length || 0), 0),
    notes: report.notes.length,
  };
}

function writeNotesMd() {
  const lines = [];
  lines.push(`# CEO OCD QA Notes — ${surface.toUpperCase()}`);
  lines.push('');
  lines.push(`Stamp: ${STAMP}`);
  lines.push(`Base: ${LOCAL}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('```json');
  lines.push(JSON.stringify(report.summary, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('## Severity rollup');
  const topKinds = Object.entries(report.summary.byKind || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  for (const [k, n] of topKinds) lines.push(`- **${k}**: ${n}`);
  lines.push('');
  lines.push('## Page notes (strict)');
  const byPage = {};
  for (const n of report.notes) {
    (byPage[n.pageId] ||= []).push(n);
  }
  for (const [pageId, items] of Object.entries(byPage)) {
    lines.push(`### ${pageId}`);
    for (const n of items) {
      lines.push(`- [${n.sev}] **${n.title}** — ${n.detail}`);
    }
    lines.push('');
  }
  lines.push('## Top P0/P1 findings (deduped samples)');
  const seen = new Set();
  for (const f of report.cssFindings.filter((x) => x.sev === 'P0' || x.sev === 'P1')) {
    const key = `${f.sev}|${f.kind}|${f.pageId}|${f.text || f.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (seen.size > 60) break;
    lines.push(`- [${f.sev}] \`${f.role}/${f.pageId}\` **${f.kind}**: ${f.detail} — \`${f.text || f.id || f.cls}\``);
  }
  lines.push('');
  lines.push('## Functional failures');
  if (!report.functionalFailures.length) lines.push('_None._');
  for (const f of report.functionalFailures.slice(0, 40)) {
    lines.push(`- ${f.role}/${f.pageId}: ${f.click || ''} → ${f.err}`);
  }
  const md = path.join(OUT, 'NOTES.md');
  fs.writeFileSync(md, lines.join('\n'));
  return md;
}

async function main() {
  console.log(`CEO OCD sweep → ${surface} → ${OUT}`);
  if (surface === 'iphone') {
    if (!SKIP_SIM) {
      console.log('→ iOS Simulator Safari shots…');
      await runIosSimDeep();
    } else {
      console.log('→ skip iOS Simulator (--skip-sim)');
    }
    console.log('→ Admin staff iPhone WebKit…');
    await runStaff(webkit, 'admin', 'e4', '/m', IPHONE);
    console.log('→ Staff iPhone WebKit…');
    await runStaff(webkit, 'staff', 'e1', '/m', IPHONE);
    console.log('→ Kid iPhone WebKit…');
    await runKid(webkit, '/m', IPHONE);
  } else if (surface === 'pc') {
    console.log('→ Admin desk Chromium…');
    await runStaff(chromium, 'admin', 'e4', '/desk', DESK);
    console.log('→ Staff desk Chromium…');
    await runStaff(chromium, 'staff', 'e1', '/desk', DESK);
    // kids rarely use desk; still sample
    console.log('→ Kid desk Chromium…');
    await runKid(chromium, '/desk', DESK);
  } else if (surface === 'sim') {
    await runIosSimDeep();
  } else {
    throw new Error(`unknown surface ${surface}`);
  }
  summarize();
  const jsonPath = path.join(OUT, 'report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  const md = writeNotesMd();
  console.log(JSON.stringify(report.summary, null, 2));
  console.log('Wrote', jsonPath);
  console.log('Wrote', md);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
