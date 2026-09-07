/**
 * Zo-Ai FAB capability tips — random dismissible bubbles from the FAB.
 * Spotlight hole + arrow at Zo-Ai; human DE/EL copy.
 * Docs: docs/agents/TIPS_SYSTEM.md
 *
 * App binds via PaidiaZoAiTips.bind({ getState, isAdminUser, feedback, getGateEl, openZoAi }).
 */
(function (global) {
  'use strict';

  const ZOAI_TIP_DISMISS_KEY = 'paidia.zoaiTipsDismissed';
  const ZOAI_TIP_MIN_MS = 120000;
  const ZOAI_TIP_MAX_MS = 300000;
  const ZOAI_TIP_AUTO_MS = 12000;
  const TIP_COACH_GAP_MS = 28000;

  let zoaiTipTimer = null;
  let zoaiTipHideTimer = null;
  let zoaiTipVisibleId = null;
  let zoaiTipVisibleTip = null;
  let zoaiTipSessionStarted = false;
  let zoaiLiveEl = null;
  let zoaiPaintBound = false;
  let api = null;

  function state() { return api && api.getState ? api.getState() : null; }
  function feedback(kind) { try { if (api && api.feedback) api.feedback(kind); } catch (_) {} }
  function gateEl() { return api && api.getGateEl ? api.getGateEl() : null; }
  function isAdmin() { return api && api.isAdminUser ? !!api.isAdminUser() : false; }
  function openZoAi() {
    try {
      if (api && typeof api.openZoAi === 'function') api.openZoAi();
    } catch (_) {}
  }

  function zoaiLang() {
    const s = state();
    if (s && (s.lang === 'el' || s.lang === 'de')) return s.lang;
    try {
      const html = document.documentElement && document.documentElement.lang;
      if (html && html.toLowerCase().indexOf('el') === 0) return 'el';
      const stored = localStorage.getItem('paidia.lang');
      if (stored === 'el' || stored === 'de') return stored;
    } catch (_) {}
    return 'de';
  }
  function zoaiTipCopy(de, el) {
    return zoaiLang() === 'el' ? el : de;
  }

  function paidiaLastCoachAt() { return Number(global.__paidiaLastCoachAt || 0) || 0; }
  function paidiaMarkCoachShown() { global.__paidiaLastCoachAt = Date.now(); }
  function paidiaCoachGapOk(gapMs) {
    return (Date.now() - paidiaLastCoachAt()) >= (gapMs || TIP_COACH_GAP_MS);
  }
  if (typeof global.paidiaMarkCoachShown !== 'function') {
    global.paidiaMarkCoachShown = paidiaMarkCoachShown;
  }
  global.paidiaZoAiTipVisible = function () { return !!zoaiTipVisibleId; };

  function readDismissed() {
    try {
      const raw = JSON.parse(localStorage.getItem(ZOAI_TIP_DISMISS_KEY) || '[]');
      return Array.isArray(raw) ? raw.map(String) : [];
    } catch (_) { return []; }
  }
  function writeDismissed(ids) {
    try {
      localStorage.setItem(ZOAI_TIP_DISMISS_KEY, JSON.stringify([...new Set(ids.map(String))].slice(-80)));
    } catch (_) {}
  }
  function markDismissed(id) {
    if (!id) return;
    const ids = readDismissed();
    if (!ids.includes(id)) { ids.push(id); writeDismissed(ids); }
  }

  function buildCatalog() {
    const mk = function (id, roles, de, el) {
      return {
        id: id,
        roles: roles || ['staff', 'child', 'admin'],
        de: de,
        el: el,
        text: function () { return zoaiTipCopy(de, el); },
        target: 'nav-zoai',
      };
    };
    return [
      mk('zo-plan-fill', ['staff', 'admin'],
        'Frag Zo-Ai, den Plan aus einem Text zu füllen. Du tippst Bestätigen und PIN — erst dann speichert die App.',
        'Ρώτα τη Zo-Ai να γεμίσει το πρόγραμμα από κείμενο. Πατάς Επιβεβαίωση και PIN — μόνο τότε αποθηκεύει.'),
      mk('zo-questions', ['staff', 'admin', 'child'],
        'Zo-Ai beantwortet Fragen zu heute, zur Vorratskammer und zu Spielen. Tippe den Kreis unten rechts.',
        'Η Zo-Ai απαντά σε ερωτήσεις για σήμερα, την αποθήκη και τα παιχνίδια. Πάτα τον κύκλο κάτω δεξιά.'),
      mk('zo-ocr', ['staff', 'admin'],
        'Liste oder Vorräte per Foto? Zo-Ai hilft beim Einlesen. Du prüfst alles, bevor etwas gespeichert wird.',
        'Λίστα ή αποθήκη με φωτογραφία; Η Zo-Ai βοηθά στο διάβασμα. Εσύ ελέγχεις πριν αποθηκευτεί κάτι.'),
      mk('zo-schedule', ['staff', 'admin'],
        'Sag zum Beispiel „Trag Fußball morgen ein“. Zo-Ai schlägt vor — du bestätigst.',
        'Πες π.χ. «Βάλε ποδόσφαιρο αύριο». Η Zo-Ai προτείνει — εσύ επιβεβαιώνεις.'),
      mk('zo-stock', ['staff', 'admin'],
        'Mengen ändern? Sag „2 Milch nach Kalyvia“. Du tippst Bestätigen — erst dann speichert die App.',
        'Θες ποσότητες; Πες «2 γάλα στο Kalyvia». Πατάς Επιβεβαίωση — μόνο τότε αποθηκεύει.'),
      mk('zo-shop', ['staff', 'admin'],
        'Für den Einkauf: sag „Reis auf die Liste“. Zo-Ai schlägt vor, du entscheidest.',
        'Για αγορές: πες «ρύζι στη λίστα». Η Zo-Ai προτείνει, εσύ αποφασίζεις.'),
      mk('zo-kids-ask', ['child'],
        'Tippe Zo-Ai und frag, was heute ansteht oder wie ein Spiel geht.',
        'Πάτα Zo-Ai και ρώτα τι έχεις σήμερα ή πώς παίζεται ένα παιχνίδι.'),
      mk('zo-kids-save', ['child'],
        'Zo-Ai erklärt gerne. Speichern in der Vorratskammer oder im Plan machen die Betreuerinnen und Betreuer.',
        'Η Zo-Ai εξηγεί με χαρά. Την αποθήκευση στην αποθήκη ή το πρόγραμμα κάνουν οι φροντιστές.'),
      mk('zo-always', ['staff', 'admin', 'child'],
        'Zo-Ai bleibt unten rechts. Tippe den hervorgehobenen Kreis oder diesen Hinweis.',
        'Η Zo-Ai μένει κάτω δεξιά. Πάτα τον τονισμένο κύκλο ή αυτή τη συμβουλή.'),
    ];
  }

  function role() {
    const s = state();
    if (!s) return 'staff';
    if (s.mode === 'child') return 'child';
    if (isAdmin()) return 'admin';
    return 'staff';
  }

  function gateBlocking() {
    try {
      if (document.body.classList.contains('auth-pending')) return true;
      const g = gateEl();
      if (g && g.classList.contains('on')) return true;
      const app = document.getElementById('app');
      if (app && app.hidden) return true;
    } catch (_) {}
    return false;
  }

  function pageSiblingBlocking() {
    try {
      if (typeof global.paidiaPageTipVisible === 'function' && global.paidiaPageTipVisible()) return true;
      const tip = document.getElementById('tipRoot');
      if (tip && !tip.hidden) return true;
    } catch (_) {}
    return false;
  }

  function busy() {
    const s = state();
    if (!s) return true;
    if (s.tourActive) return true;
    if (document.body.classList.contains('tour-open')) return true;
    if (document.body.classList.contains('sheet-open')) return true;
    if (s.chatOpen) return true;
    if (pageSiblingBlocking()) return true;
    return gateBlocking();
  }

  function cancelSchedule() {
    if (zoaiTipTimer) { clearTimeout(zoaiTipTimer); zoaiTipTimer = null; }
  }
  function clearAutoHide() {
    if (zoaiTipHideTimer) { clearTimeout(zoaiTipHideTimer); zoaiTipHideTimer = null; }
  }

  function findFab() {
    return document.querySelector('[data-tour="nav-zoai"]')
      || document.getElementById('dockZoAi')
      || document.getElementById('navChat');
  }

  function clearSpotlight() {
    if (zoaiLiveEl) {
      try { zoaiLiveEl.classList.remove('tip-target-live', 'zoai-tip-target-live'); } catch (_) {}
      zoaiLiveEl = null;
    }
    const root = document.getElementById('zoaiTipRoot');
    if (!root) return;
    root.classList.remove('zoai-tip-anchored');
    const hole = root.querySelector('#zoaiTipHole');
    const arrow = root.querySelector('#zoaiTipArrow');
    if (hole) hole.hidden = true;
    if (arrow) arrow.hidden = true;
  }

  function paint() {
    const root = document.getElementById('zoaiTipRoot');
    if (!root || root.hidden || !zoaiTipVisibleId) return;
    const hole = root.querySelector('#zoaiTipHole');
    const arrow = root.querySelector('#zoaiTipArrow');
    const bubble = root.querySelector('#zoaiTipBubble');
    const el = findFab();
    if (!hole || !arrow || !bubble) return;
    if (zoaiLiveEl && zoaiLiveEl !== el) {
      try { zoaiLiveEl.classList.remove('tip-target-live', 'zoai-tip-target-live'); } catch (_) {}
      zoaiLiveEl = null;
    }
    if (!el) {
      clearSpotlight();
      return;
    }
    zoaiLiveEl = el;
    el.classList.add('tip-target-live', 'zoai-tip-target-live');
    const r = el.getBoundingClientRect();
    const pad = 6;
    const top = Math.max(4, r.top - pad);
    const left = Math.max(4, r.left - pad);
    const width = Math.min(window.innerWidth - left - 4, r.width + pad * 2);
    const height = Math.min(window.innerHeight - top - 4, r.height + pad * 2);
    hole.hidden = false;
    hole.style.top = top + 'px';
    hole.style.left = left + 'px';
    hole.style.width = Math.max(40, width) + 'px';
    hole.style.height = Math.max(40, height) + 'px';

    root.classList.add('zoai-tip-anchored');
    const bw = Math.min(280, window.innerWidth - 24);
    const bh = bubble.offsetHeight || 120;
    let bLeft = Math.min(Math.max(12, left + width / 2 - bw / 2), window.innerWidth - bw - 12);
    let bTop = top - bh - 14;
    let dir = 'down';
    if (bTop < 12) {
      bTop = top + height + 14;
      dir = 'up';
    }
    root.style.left = bLeft + 'px';
    root.style.top = bTop + 'px';
    root.style.right = 'auto';
    root.style.bottom = 'auto';
    root.style.maxWidth = bw + 'px';

    arrow.hidden = false;
    arrow.dataset.dir = dir;
    arrow.style.left = Math.min(Math.max(bLeft + 24, left + width / 2 - 8), bLeft + bw - 32) + 'px';
    arrow.style.top = (dir === 'up' ? (bTop - 8) : (bTop + bh - 2)) + 'px';
  }

  function ensurePaintListeners() {
    if (zoaiPaintBound) return;
    zoaiPaintBound = true;
    const run = function () { if (zoaiTipVisibleId) paint(); };
    window.addEventListener('resize', run, { passive: true });
    window.addEventListener('scroll', run, { passive: true, capture: true });
  }

  function ensureRoot() {
    let root = document.getElementById('zoaiTipRoot');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'zoaiTipRoot';
    root.className = 'zoai-tip-root';
    root.hidden = true;
    root.innerHTML =
      '<div class="tip-hole zoai-tip-hole" id="zoaiTipHole" hidden aria-hidden="true"></div>' +
      '<div class="tip-arrow zoai-tip-arrow" id="zoaiTipArrow" hidden aria-hidden="true"></div>' +
      '<aside class="zoai-tip-bubble" id="zoaiTipBubble" role="status" aria-live="polite">' +
      '<button type="button" class="zoai-tip-x" id="zoaiTipDismiss" aria-label="OK">×</button>' +
      '<p class="zoai-tip-text" id="zoaiTipText"></p>' +
      '<button type="button" class="zoai-tip-cta" id="zoaiTipOpen"></button>' +
      '</aside>';
    document.body.appendChild(root);
    root.querySelector('#zoaiTipDismiss').onclick = function (e) {
      e.stopPropagation();
      dismissCurrent();
    };
    const open = function () {
      const id = zoaiTipVisibleId;
      hide();
      if (id) markDismissed(id);
      openZoAi();
    };
    root.querySelector('#zoaiTipOpen').onclick = open;
    root.querySelector('#zoaiTipBubble').onclick = function (e) {
      if (e.target.closest('#zoaiTipDismiss')) return;
      open();
    };
    ensurePaintListeners();
    return root;
  }

  function applyCopy(tip) {
    const root = document.getElementById('zoaiTipRoot');
    if (!root || !tip) return;
    const de = zoaiLang() !== 'el';
    root.querySelector('#zoaiTipText').textContent = tip.text();
    root.querySelector('#zoaiTipOpen').textContent = de ? 'Zo-Ai öffnen' : 'Άνοιγμα Zo-Ai';
    root.querySelector('#zoaiTipDismiss').setAttribute('aria-label', de ? 'Schließen' : 'Κλείσιμο');
  }

  function hide(opts) {
    clearAutoHide();
    clearSpotlight();
    const root = document.getElementById('zoaiTipRoot');
    if (root) {
      root.hidden = true;
      root.classList.remove('zoai-tip-on', 'zoai-tip-anchored');
      root.style.left = '';
      root.style.top = '';
      root.style.right = '';
      root.style.bottom = '';
    }
    document.body.classList.remove('zoai-tip-open');
    if (!(opts && opts.keepId)) {
      zoaiTipVisibleId = null;
      zoaiTipVisibleTip = null;
    }
  }

  function dismissCurrent() {
    const id = zoaiTipVisibleId;
    hide();
    if (id) markDismissed(id);
    feedback('select');
    scheduleNext();
  }

  function pick() {
    const dismissed = new Set(readDismissed());
    const r = role();
    let pool = buildCatalog().filter(function (t) {
      return !dismissed.has(t.id) && t.roles.indexOf(r) !== -1;
    });
    if (!pool.length) {
      pool = buildCatalog().filter(function (t) { return t.roles.indexOf(r) !== -1; });
    }
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function show(tip) {
    if (!tip || busy()) return false;
    if (!paidiaCoachGapOk()) return false;
    const root = ensureRoot();
    zoaiTipVisibleId = tip.id;
    zoaiTipVisibleTip = tip;
    (global.paidiaMarkCoachShown || paidiaMarkCoachShown)();
    document.body.classList.add('zoai-tip-open');
    applyCopy(tip);
    root.hidden = false;
    const reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) root.classList.add('zoai-tip-on');
    else requestAnimationFrame(function () { root.classList.add('zoai-tip-on'); });
    requestAnimationFrame(function () { paint(); });
    clearAutoHide();
    zoaiTipHideTimer = setTimeout(dismissCurrent, ZOAI_TIP_AUTO_MS);
    return true;
  }

  function refreshLang() {
    if (!zoaiTipVisibleId || !zoaiTipVisibleTip) return;
    applyCopy(zoaiTipVisibleTip);
    paint();
  }

  function tryShow() {
    zoaiTipTimer = null;
    if (busy()) {
      zoaiTipTimer = setTimeout(tryShow, TIP_COACH_GAP_MS);
      return;
    }
    if (!paidiaCoachGapOk()) {
      const wait = Math.max(8000, TIP_COACH_GAP_MS - (Date.now() - paidiaLastCoachAt()));
      zoaiTipTimer = setTimeout(tryShow, wait);
      return;
    }
    if (zoaiTipVisibleId) return;
    const tip = pick();
    if (!tip) return;
    if (!show(tip)) scheduleNext();
  }

  function notifySession() {
    const s = state();
    if (gateBlocking()) { cancelSchedule(); hide(); return; }
    if (!s) return;
    // Kids: FAB only — never schedule tip sessions that open Zo.
    if (s.mode === 'child') { cancelSchedule(); hide(); return; }
    if (!s.user && !(s.mode === 'child' && s.child)) return;
    if (s.chatOpen || s.tourActive) { hide({ keepId: true }); return; }
    if (!zoaiTipSessionStarted) {
      zoaiTipSessionStarted = true;
      cancelSchedule();
      const first = 45000 + Math.floor(Math.random() * 45000);
      zoaiTipTimer = setTimeout(tryShow, first);
      return;
    }
    if (!zoaiTipTimer && !zoaiTipVisibleId) scheduleNext();
  }

  function scheduleNext() {
    cancelSchedule();
    const s = state();
    if (!s || gateBlocking() || s.tourActive) return;
    if (s.mode === 'child') return;
    if (!s.user && s.mode !== 'child') return;
    if (s.mode === 'child' && !s.child) return;
    const span = ZOAI_TIP_MAX_MS - ZOAI_TIP_MIN_MS;
    const delay = ZOAI_TIP_MIN_MS + Math.floor(Math.random() * Math.max(1, span + 1));
    zoaiTipTimer = setTimeout(tryShow, delay);
  }

  function stopAll() {
    cancelSchedule();
    hide();
    zoaiTipSessionStarted = false;
  }

  global.PaidiaZoAiTips = {
    bind: function (deps) { api = deps || null; },
    notifySession: notifySession,
    hide: hide,
    stop: stopAll,
    refreshLang: refreshLang,
  };
})(typeof window !== 'undefined' ? window : globalThis);
