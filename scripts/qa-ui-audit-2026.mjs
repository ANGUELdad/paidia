/**
 * Dual-surface UI audit — desktop (1440x900) + iPhone (393x852).
 * Measures readability, sizing, grid alignment and layout defects, writes
 * screenshots + NOTES.md + report.json. Read-only: never clicks destructive UI.
 *
 *   node scripts/qa-ui-audit-2026.mjs [--surface=both|pc|phone] [--tag=v244]
 */
import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE = process.env.PAIDIA_QA_BASE || 'http://127.0.0.1:5173';
const pins = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/marketing/.local-auth/pins.json'), 'utf8'));

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : fallback;
};
const SURFACE = arg('surface', 'both');
const TAG = arg('tag', 'ui-audit');
const OUT = path.join(ROOT, '.qa-screens', TAG);
fs.mkdirSync(OUT, { recursive: true });

const STAFF_TABS = ['home', 'schedule', 'stock', 'shop', 'book', 'talk', 'kids', 'pocket', 'gallery', 'admin'];
const KID_VIEWS = ['today', 'games', 'rate', 'bonus', 'notes', 'plan', 'stars', 'learn', 'gallery'];

const PHONE = { ...devices['iPhone 15 Pro'], viewport: { width: 393, height: 852 } };
const PC = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };

const findings = [];
const pages = [];

function note(surface, page, sev, kind, detail, extra = {}) {
  findings.push({ surface, page, sev, kind, detail, ...extra });
}

/** Runs inside the browser: collect every measurable UI defect on the current view. */
function collect(isPhone) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const out = {
    vw,
    vh,
    scrollW: document.documentElement.scrollWidth,
    overflowPage: document.documentElement.scrollWidth > vw + 1,
    items: [],
  };
  const seen = new Set();
  const label = (el) => {
    const id = el.id ? `#${el.id}` : '';
    const cls = String(el.className || '').split(/\s+/).filter(Boolean).slice(0, 3).join('.');
    return `${el.tagName.toLowerCase()}${id}${cls ? '.' + cls : ''}`;
  };
  const text = (el) => (el.innerText || el.value || '').replace(/\s+/g, ' ').trim().slice(0, 44);
  const push = (kind, sev, el, detail, extra = {}) => {
    const key = `${kind}|${label(el)}|${detail}`;
    if (seen.has(key)) return;
    seen.add(key);
    if (out.items.length > 220) return;
    const r = el.getBoundingClientRect();
    out.items.push({
      kind, sev, detail,
      sel: label(el),
      text: text(el),
      box: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) },
      ...extra,
    });
  };

  // Visible == laid out, CSS-visible, inside the viewport band, and actually
  // hit-testable (kills closed <details> popovers clipped by an ancestor).
  const visCache = new WeakMap();
  const visible = (el) => {
    if (visCache.has(el)) return visCache.get(el);
    let ok = true;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) ok = false;
    else if (el.checkVisibility && !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) ok = false;
    else if (r.bottom < 0 || r.top > vh * 3) ok = false;
    else {
      const cx = Math.min(vw - 1, Math.max(1, r.left + r.width / 2));
      const cy = Math.min(vh - 1, Math.max(1, r.top + r.height / 2));
      if (r.top < vh && r.bottom > 0) {
        const hit = document.elementFromPoint(cx, cy);
        if (!hit) ok = false;
        else if (hit !== el && !el.contains(hit) && !hit.contains(el)) ok = false;
      }
    }
    visCache.set(el, ok);
    return ok;
  };
  // Card-shaped CTAs (kid challenge tiles, admin metric links) are meant to be
  // tall; they are not chunky buttons.
  const cardish = (el) => /tile|card|kid-|quick|shortcut|hero|banner|promo|panel|challenge|metric/i.test(String(el.className || ''))
    || el.tagName === 'TEXTAREA';

  const scope = document.querySelector('#view') || document.body;

  // 1. Horizontal overflow past the viewport
  scope.querySelectorAll('*').forEach((el) => {
    if (!visible(el)) return;
    const r = el.getBoundingClientRect();
    if (r.width < 12) return;
    if (r.right > vw + 2 || r.left < -2) {
      // scrollable rails legitimately extend; flag only if the rail itself overflows
      const par = el.parentElement;
      const parScrolls = par && getComputedStyle(par).overflowX !== 'visible';
      if (parScrolls) return;
      push('overflow-x', 'P0', el, `extends to ${Math.round(r.right)} (vw ${vw})`);
    }
  });

  // 2. Tap targets + button sizing
  const interactive = scope.querySelectorAll('button, a[href], input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="tab"]');
  interactive.forEach((el) => {
    if (!visible(el)) return;
    const r = el.getBoundingClientRect();
    const min = Math.min(r.width, r.height);
    // Pointer floor applies everywhere; the 44px touch floor is phone-only and
    // judged on height (icon buttons are legitimately narrow).
    if (min < 30) push('tap-small', 'P1', el, `${Math.round(r.width)}x${Math.round(r.height)} < 30`);
    else if (isPhone && (r.height < 43.5 || r.width < 35.5)) push('tap-sub44', 'P2', el, `${Math.round(r.width)}x${Math.round(r.height)} < 44`);
    if (isPhone && r.height > 76 && !cardish(el)) push('tap-giant', 'P2', el, `height ${Math.round(r.height)} > 76 (chunky)`);
    // clipped label
    if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
      push('btn-text-clip', 'P1', el, `scrollW ${el.scrollWidth} > clientW ${el.clientWidth}`);
    }
  });

  // --- colour helpers for WCAG contrast ---
  const parseColor = (str) => {
    const m = String(str).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (p.length < 3 || p.some((n) => Number.isNaN(n))) return null;
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const gradientStop = (bgImage) => {
    if (!bgImage || bgImage === 'none') return null;
    const m = bgImage.match(/rgba?\([^)]+\)/g);
    if (!m || !m.length) return null;
    const stops = m.map(parseColor).filter((c) => c && c.a > 0.4);
    if (!stops.length) return null;
    // average the gradient so the check reflects the middle of the band
    const avg = stops.reduce((acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }), { r: 0, g: 0, b: 0 });
    return { r: avg.r / stops.length, g: avg.g / stops.length, b: avg.b / stops.length, a: 1 };
  };
  const effectiveBg = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const s = getComputedStyle(node);
      const grad = gradientStop(s.backgroundImage);
      if (grad) return grad;
      const c = parseColor(s.backgroundColor);
      if (c && c.a > 0.5) return c;
      node = node.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const lum = (c) => {
    const f = (v) => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const contrast = (fg, bg) => {
    // flatten a translucent foreground onto its background first
    const a = fg.a == null ? 1 : fg.a;
    const mixed = { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) };
    const l1 = lum(mixed), l2 = lum(bg);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  // 3. Text readability
  scope.querySelectorAll('*').forEach((el) => {
    if (!visible(el)) return;
    // Judge any element that renders its own text, not just childless leaves —
    // `<h1>Guten Tag, <span>Name</span></h1>` styles "Guten Tag" itself.
    const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
    if (!own) return;
    const t = own;
    const s = getComputedStyle(el);
    const fs = parseFloat(s.fontSize) || 0;

    // WCAG 1.4.3 contrast
    const fg = parseColor(s.color);
    if (fg && fg.a > 0.1 && t.length > 1) {
      const bg = effectiveBg(el);
      const ratio = contrast(fg, bg);
      const weight = Number(s.fontWeight) || 400;
      const large = fs >= 24 || (fs >= 18.66 && weight >= 700);
      const need = large ? 3 : 4.5;
      if (ratio < need) {
        push('contrast', ratio < need * 0.62 ? 'P0' : 'P1', el,
          `${ratio.toFixed(2)}:1 (needs ${need}) ${s.color} on rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`);
      }
    }

    if (fs > 0 && fs < 11) push('type-tiny', 'P1', el, `${fs.toFixed(1)}px`);
    else if (fs >= 11 && fs < 12) push('type-small', 'P2', el, `${fs.toFixed(1)}px`);
    const lh = parseFloat(s.lineHeight);
    if (fs >= 12 && Number.isFinite(lh) && lh > 0 && lh / fs < 1.15 && t.length > 30) {
      push('line-height-tight', 'P2', el, `${(lh / fs).toFixed(2)}x`);
    }
    // vertical clipping of text
    if (el.scrollHeight > el.clientHeight + 3 && s.overflowY !== 'visible' && el.clientHeight > 0) {
      push('text-clip-y', 'P1', el, `scrollH ${el.scrollHeight} > clientH ${el.clientHeight}`);
    }
  });

  // 4. Grid / alignment drift: direct children of the stage should share a left edge
  const stage = document.querySelector('#view');
  if (stage) {
    const kids = [...stage.children].filter(visible);
    const lefts = kids.map((el) => Math.round(el.getBoundingClientRect().left));
    const mode = lefts.sort((a, b) => lefts.filter((v) => v === a).length - lefts.filter((v) => v === b).length).pop();
    kids.forEach((el) => {
      const l = Math.round(el.getBoundingClientRect().left);
      if (Math.abs(l - mode) > 6) push('align-drift', 'P1', el, `left ${l} vs column ${mode}`);
    });
    // width fill on phone
    if (isPhone) {
      kids.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 40 && r.width < vw * 0.82) {
          push('narrow-fill', 'P2', el, `width ${Math.round(r.width)} of ${vw}`);
        }
      });
    }
  }

  // 4b. Controls that are laid out and CSS-visible but covered by something
  // else at their own centre — i.e. rendered but not clickable.
  scope.querySelectorAll('button, a[href], input:not([type="hidden"]), select, [role="button"], [role="tab"]').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    if (r.top < 0 || r.bottom > vh) return; // only judge what is on screen
    if (el.checkVisibility && !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return;
    if (el.disabled) return;
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    if (!hit) return;
    if (hit === el || el.contains(hit) || hit.contains(el)) return;
    if (hit.closest('label') && hit.closest('label').contains(el)) return;
    // Pinned chrome (dock, FAB) legitimately passes over scrolling content;
    // the dock has its own clearance check and the FAB its own overlap check.
    if (hit.closest('.zoai-fab, .fab, nav.dock, .kid-dock, #bottomPanel')) return;
    for (let n = hit; n && n !== document.body; n = n.parentElement) {
      if (getComputedStyle(n).position === 'fixed') return;
    }
    push('control-covered', 'P0', el, `centre hit by ${hit.tagName.toLowerCase()}${hit.id ? '#' + hit.id : ''}.${String(hit.className || '').split(/\s+/)[0]}`);
  });

  // 4c. Text that is cut off horizontally by its own box (chrome included —
  // the app header title is a prime offender on narrow phones)
  const chrome = [...document.querySelectorAll('header.app-chrome, nav.dock, .kid-dock')];
  const clipScope = [...scope.querySelectorAll('h1,h2,h3,h4,p,span,small,div,label,button')]
    .concat(chrome.flatMap((c) => [...c.querySelectorAll('h1,h2,h3,span,small,div,button')]));
  clipScope.forEach((el) => {
    if (!visible(el)) return;
    const s = getComputedStyle(el);
    if (s.textOverflow !== 'ellipsis' && s.overflowX === 'visible') return;
    if (el.scrollWidth <= el.clientWidth + 2 || el.clientWidth < 8) return;
    if (el.children.length > 2) return;
    const t = (el.textContent || '').trim();
    if (t.length < 4) return;
    push('text-truncated', 'P1', el, `scrollW ${el.scrollWidth} > clientW ${el.clientWidth}`);
  });

  // 4d. Grid balance — a trailing row holding a single centred orphan reads as
  // a layout mistake rather than a deliberate arrangement.
  scope.querySelectorAll('*').forEach((el) => {
    if (!visible(el)) return;
    if (getComputedStyle(el).display !== 'grid') return;
    const kids = [...el.children].filter(visible);
    if (kids.length < 4 || kids.length > 12) return;
    // Only judge tile grids — repeating cells of a similar size. Composite
    // grids (a ring + copy + CTA, a compose bar) legitimately end on one item.
    const boxes = kids.map((k) => k.getBoundingClientRect());
    const wMax = Math.max(...boxes.map((b) => b.width));
    const wMin = Math.min(...boxes.map((b) => b.width));
    const hMax = Math.max(...boxes.map((b) => b.height));
    const hMin = Math.min(...boxes.map((b) => b.height));
    if (wMin < wMax * 0.9 || hMin < hMax * 0.75) return;
    const rows = new Map();
    kids.forEach((k) => {
      const top = Math.round(k.getBoundingClientRect().top);
      const key = [...rows.keys()].find((r) => Math.abs(r - top) < 6);
      const use = key == null ? top : key;
      rows.set(use, (rows.get(use) || 0) + 1);
    });
    const counts = [...rows.values()];
    if (counts.length < 2) return;
    const perRow = counts[0];
    const last = counts[counts.length - 1];
    if (perRow >= 2 && last === 1 && counts.length >= 2) {
      push('grid-orphan', 'P2', el, `${kids.length} items in ${perRow}-up grid leaves 1 alone on the last row`);
    }
  });

  // 5. Overlapping interactive elements (broken arrangement)
  const boxes = [...interactive].filter(visible).map((el) => ({ el, r: el.getBoundingClientRect() })).slice(0, 120);
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const ox = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
      const oy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (ox > 8 && oy > 8) {
        push('overlap', 'P0', a.el, `overlaps ${b.el.tagName.toLowerCase()}${b.el.id ? '#' + b.el.id : ''} by ${Math.round(ox)}x${Math.round(oy)}`);
      }
    }
  }

  // 6. Chrome sanity: the scroll container must reserve room for the fixed dock
  const dock = document.querySelector('.kid-dock') || document.querySelector('nav.dock');
  const isPinned = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (getComputedStyle(n).position === 'fixed') return true;
    }
    return false;
  };
  if (isPhone && dock && stage && dock.getBoundingClientRect().height > 8 && isPinned(dock)) {
    const dockH = Math.round(window.innerHeight - dock.getBoundingClientRect().top);
    const padded = Math.round(parseFloat(getComputedStyle(stage).paddingBottom) || 0);
    const kidShell = stage.querySelector('.kid-shell');
    const extra = kidShell ? Math.round(parseFloat(getComputedStyle(kidShell).paddingBottom) || 0) : 0;
    if (padded + extra < dockH + 8) {
      push('dock-clearance', 'P1', stage, `stage pad ${padded + extra} < dock ${dockH}`);
    }
  }

  // 7. Fixed overlays (FAB) sitting on top of interactive content
  document.querySelectorAll('.zoai-fab, .fab').forEach((fab) => {
    if (!visible(fab)) return;
    const fr = fab.getBoundingClientRect();
    interactive.forEach((el) => {
      if (fab === el || fab.contains(el)) return;
      if (!visible(el)) return;
      const r = el.getBoundingClientRect();
      const ox = Math.min(fr.right, r.right) - Math.max(fr.left, r.left);
      const oy = Math.min(fr.bottom, r.bottom) - Math.max(fr.top, r.top);
      if (ox > 6 && oy > 6) push('fab-covers-control', 'P1', el, `FAB covers ${Math.round(ox)}x${Math.round(oy)}`);
    });
  });

  return out;
}

async function login(context, profileId, mode) {
  const pin = pins[profileId];
  if (!pin) throw new Error(`missing pin ${profileId}`);
  const res = await context.request.post(`${BASE}/api/auth/login`, {
    data: { profileId, mode, pin, remember: false },
  });
  if (!res.ok()) throw new Error(`login ${profileId} ${res.status()}`);
  await context.request.post(`${BASE}/api/auth/onboarding/complete`, { data: { version: 3 } }).catch(() => {});
}

async function dismiss(page) {
  for (const sel of ['#tourSkip', '#tipClose', 'button:has-text("Überspringen")', 'button:has-text("Später")']) {
    const el = page.locator(sel).first();
    if ((await el.count()) && (await el.isVisible().catch(() => false))) await el.click().catch(() => {});
  }
}

async function bootShell(page, shellPath) {
  await page.goto(`${BASE}${shellPath}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(
    () => typeof window.render === 'function' && !document.body.classList.contains('auth-pending'),
    { timeout: 60000 },
  );
  await dismiss(page);
}

async function capture(page, surfaceName, pageId, isPhone) {
  await page.waitForTimeout(450);
  await dismiss(page);
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(120);
  const data = await page.evaluate(collect, isPhone).catch((e) => ({ error: String(e) }));
  if (data && data.items) {
    data.items.forEach((it) => note(surfaceName, pageId, it.sev, it.kind, it.detail, { sel: it.sel, text: it.text, box: it.box }));
    if (data.overflowPage) note(surfaceName, pageId, 'P0', 'page-overflow', `scrollW ${data.scrollW} > vw ${data.vw}`);
    pages.push({ surface: surfaceName, page: pageId, count: data.items.length, overflowPage: !!data.overflowPage });
  }
  await page.screenshot({ path: path.join(OUT, `${surfaceName}-${pageId}.png`) }).catch(() => {});
}

async function auditSurface({ surfaceName, shellPath, contextOpts, isPhone }) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(contextOpts);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message || e)));

  await page.addInitScript(() => {
    localStorage.setItem('paidia.lang', 'de');
    localStorage.setItem('paidia.uiMode', 'pro');
    localStorage.setItem('paidia.tourSeen', '1');
    localStorage.setItem('paidia.tipsSeen', '1');
    localStorage.setItem('paidia.pwaInstallDismiss', '1');
  });

  await login(context, 'e4', 'staff');
  await bootShell(page, shellPath);

  for (const tab of STAFF_TABS) {
    await page.evaluate((t) => {
      state.tab = t;
      if (t === 'stock') state.house = 'h1';
      if (t === 'schedule') state.planView = 'day';
      if (t === 'admin') state.adminPane = 'ops';
      render();
      scrollTo(0, 0);
    }, tab).catch((e) => errors.push(`tab ${tab}: ${e.message}`));
    await capture(page, surfaceName, `staff-${tab}`, isPhone);
  }

  await page.evaluate(() => { state.tab = 'schedule'; state.planView = 'week'; render(); scrollTo(0, 0); }).catch(() => {});
  await capture(page, surfaceName, 'staff-schedule-week', isPhone);

  // Kid portal
  await login(context, 'k1', 'child');
  await bootShell(page, shellPath);
  for (const view of KID_VIEWS) {
    await page.evaluate((v) => {
      try { setChildView(v, { push: false }); } catch (e) { state.childView = v; render(); }
      scrollTo(0, 0);
    }, view).catch((e) => errors.push(`kid ${view}: ${e.message}`));
    await capture(page, surfaceName, `kid-${view}`, isPhone);
  }

  await browser.close();
  return errors;
}

const pageErrors = {};
if (SURFACE === 'both' || SURFACE === 'pc') {
  pageErrors.pc = await auditSurface({ surfaceName: 'pc', shellPath: '/desk/', contextOpts: PC, isPhone: false });
}
if (SURFACE === 'both' || SURFACE === 'phone') {
  pageErrors.phone = await auditSurface({ surfaceName: 'phone', shellPath: '/m/', contextOpts: PHONE, isPhone: true });
}

const byKind = {};
const bySev = {};
const bySurfaceKind = {};
findings.forEach((f) => {
  byKind[f.kind] = (byKind[f.kind] || 0) + 1;
  bySev[f.sev] = (bySev[f.sev] || 0) + 1;
  const k = `${f.surface}/${f.kind}`;
  bySurfaceKind[k] = (bySurfaceKind[k] || 0) + 1;
});

const report = { tag: TAG, base: BASE, at: new Date().toISOString(), bySev, byKind, bySurfaceKind, pages, pageErrors, findings };
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));

const topByPage = {};
findings.forEach((f) => {
  const key = `${f.surface} · ${f.page}`;
  topByPage[key] = topByPage[key] || {};
  topByPage[key][f.kind] = (topByPage[key][f.kind] || 0) + 1;
});

let md = `# UI audit ${TAG}\n\nBase: ${BASE}\nWhen: ${new Date().toISOString()}\n\n## Severity\n\n`;
Object.entries(bySev).sort().forEach(([k, v]) => { md += `- ${k}: ${v}\n`; });
md += `\n## Kind (all surfaces)\n\n`;
Object.entries(byKind).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => { md += `- ${k}: ${v}\n`; });
md += `\n## Per surface + kind\n\n`;
Object.entries(bySurfaceKind).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => { md += `- ${k}: ${v}\n`; });
md += `\n## Per page\n\n`;
Object.entries(topByPage).sort().forEach(([k, kinds]) => {
  const parts = Object.entries(kinds).sort((a, b) => b[1] - a[1]).map(([kk, vv]) => `${kk} ${vv}`).join(', ');
  md += `- **${k}** — ${parts}\n`;
});
md += `\n## Worst offenders (P0/P1 sample)\n\n`;
findings.filter((f) => f.sev !== 'P2').slice(0, 80).forEach((f) => {
  md += `- [${f.sev}] ${f.surface}/${f.page} \`${f.sel}\` ${f.kind}: ${f.detail}${f.text ? ` — "${f.text}"` : ''}\n`;
});
fs.writeFileSync(path.join(OUT, 'NOTES.md'), md);

console.log(JSON.stringify({ bySev, byKind, bySurfaceKind, out: OUT }, null, 2));
