/**
 * Zo-Ai FAB capability tips — random dismissible bubbles from the FAB.
 * Not page chrome tips (see page-tips.js). Docs: docs/agents/TIPS_SYSTEM.md
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
  let zoaiTipSessionStarted = false;
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

  function paidiaLastCoachAt() { return Number(global.__paidiaLastCoachAt || 0) || 0; }
  function paidiaMarkCoachShown() { global.__paidiaLastCoachAt = Date.now(); }
  function paidiaCoachGapOk(gapMs) {
    return (Date.now() - paidiaLastCoachAt()) >= (gapMs || TIP_COACH_GAP_MS);
  }
  if (typeof global.paidiaMarkCoachShown !== 'function') {
    global.paidiaMarkCoachShown = paidiaMarkCoachShown;
  }
  global.paidiaZoAiTipVisible = function () { return !!zoaiTipVisibleId; };

  function zoaiTipCopy(de, el) {
    const s = state();
    return s && s.lang === 'el' ? el : de;
  }
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
      return { id: id, roles: roles || ['staff', 'child', 'admin'], text: function () { return zoaiTipCopy(de, el); } };
    };
    return [
      mk('zo-plan-fill', ['staff', 'admin'],
        'Frag Zo-Ai: Plan aus Text füllen — Bestätigen + PIN speichert.',
        'Ρώτα τη Zo-Ai: γέμισμα πλάνου από κείμενο — Επιβεβαίωση + PIN.'),
      mk('zo-questions', ['staff', 'admin', 'child'],
        'Zo-Ai beantwortet Fragen zu Heute, Lager und Spielen.',
        'Η Zo-Ai απαντά σε ερωτήσεις για σήμερα, αποθήκη και παιχνίδια.'),
      mk('zo-ocr', ['staff', 'admin'],
        'Liste/Lager per Foto? Zo-Ai hilft beim Einlesen — du prüfst vorher.',
        'Λίστα/αποθήκη με φωτό; Η Zo-Ai βοηθά στο διάβασμα — εσύ ελέγχεις.'),
      mk('zo-schedule', ['staff', 'admin'],
        '„Trag Fußball morgen ein“ — Zo-Ai schlägt vor, du bestätigst.',
        '«Βάλε ποδόσφαιρο αύριο» — η Zo-Ai προτείνει, εσύ επιβεβαιώνεις.'),
      mk('zo-stock', ['staff', 'admin'],
        'Mengen? Sag „2 Milch nach Kalyvia“ — Confirm speichert.',
        'Ποσότητες; Πες «2 γάλα στο Kalyvia» — Confirm αποθηκεύει.'),
      mk('zo-shop', ['staff', 'admin'],
        'Einkauf: „Reis auf die Liste“ — Zo-Ai schlägt vor.',
        'Αγορές: «ρύζι στη λίστα» — η Zo-Ai προτείνει.'),
      mk('zo-kids-ask', ['child'],
        'Tippe Zo-Ai und frag, was heute ansteht oder wie ein Spiel geht.',
        'Πάτα Zo-Ai και ρώτα τι έχεις σήμερα ή πώς παίζεται ένα παιχνίδι.'),
      mk('zo-kids-save', ['child'],
        'Zo-Ai erklärt — Speichern von Lager/Plan machen die Betreuer.',
        'Η Zo-Ai εξηγεί — αποθήκευση Lager/Plan κάνουν οι φροντιστές.'),
      mk('zo-always', ['staff', 'admin', 'child'],
        'Zo-Ai bleibt unten rechts — tippe den Kreis oder diesen Tipp.',
        'Η Zo-Ai μένει κάτω δεξιά — πάτα τον κύκλο ή αυτή τη συμβουλή.'),
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

  function ensureRoot() {
    let root = document.getElementById('zoaiTipRoot');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'zoaiTipRoot';
    root.className = 'zoai-tip-root';
    root.hidden = true;
    root.innerHTML =
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
    return root;
  }

  function hide(opts) {
    clearAutoHide();
    const root = document.getElementById('zoaiTipRoot');
    if (root) {
      root.hidden = true;
      root.classList.remove('zoai-tip-on');
    }
    document.body.classList.remove('zoai-tip-open');
    if (!(opts && opts.keepId)) zoaiTipVisibleId = null;
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
    const s = state();
    const de = !(s && s.lang === 'el');
    zoaiTipVisibleId = tip.id;
    (global.paidiaMarkCoachShown || paidiaMarkCoachShown)();
    document.body.classList.add('zoai-tip-open');
    root.querySelector('#zoaiTipText').textContent = tip.text();
    root.querySelector('#zoaiTipOpen').textContent = de ? 'Zo-Ai öffnen' : 'Άνοιγμα Zo-Ai';
    root.querySelector('#zoaiTipDismiss').setAttribute('aria-label', de ? 'Schließen' : 'Κλείσιμο');
    root.hidden = false;
    const reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) root.classList.add('zoai-tip-on');
    else requestAnimationFrame(function () { root.classList.add('zoai-tip-on'); });
    clearAutoHide();
    zoaiTipHideTimer = setTimeout(dismissCurrent, ZOAI_TIP_AUTO_MS);
    return true;
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

  function scheduleNext() {
    cancelSchedule();
    const s = state();
    if (!s || gateBlocking() || s.tourActive) return;
    if (!s.user && s.mode !== 'child') return;
    if (s.mode === 'child' && !s.child) return;
    const span = ZOAI_TIP_MAX_MS - ZOAI_TIP_MIN_MS;
    const delay = ZOAI_TIP_MIN_MS + Math.floor(Math.random() * Math.max(1, span + 1));
    zoaiTipTimer = setTimeout(tryShow, delay);
  }

  function notifySession() {
    const s = state();
    if (gateBlocking()) { cancelSchedule(); hide(); return; }
    if (!s) return;
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
  };
})(typeof window !== 'undefined' ? window : globalThis);
