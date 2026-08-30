/**
 * Contextual page tips — dismissible help for the current page.
 * Not the spotlight tour; not Zo-Ai FAB capability nags.
 * Docs: docs/agents/TIPS_SYSTEM.md
 *
 * App binds deps via PaidiaPageTips.bind({ getState, isEasy, feedback, getGateEl }).
 */
(function (global) {
  'use strict';

  const TIP_DISMISS_KEY = 'paidia.tipsDismissed';
  const TIP_DELAY_MIN_MS = 45000;
  const TIP_DELAY_MAX_MS = 120000;
  const TIP_AUTO_HIDE_MS = 14000;
  const TIP_COACH_GAP_MS = 28000;

  const tipSessionPages = new Set();
  let tipTimer = null;
  let tipHideTimer = null;
  let tipPageWatchKey = '';
  let tipVisibleId = null;
  let api = null;

  function state() { return api && api.getState ? api.getState() : null; }
  function isEasy() { return api && api.isEasy ? !!api.isEasy() : true; }
  function feedback(kind) { try { if (api && api.feedback) api.feedback(kind); } catch (_) {} }
  function gateEl() { return api && api.getGateEl ? api.getGateEl() : null; }

  function tipCopy(de, el) {
    const s = state();
    return s && s.lang === 'el' ? el : de;
  }
  function tipPageKey() {
    const s = state();
    if (!s) return '';
    if (s.mode === 'child') return 'child:' + (s.childView || 'today');
    return 'staff:' + (s.tab || 'home');
  }

  function paidiaLastCoachAt() { return Number(global.__paidiaLastCoachAt || 0) || 0; }
  function paidiaMarkCoachShown() { global.__paidiaLastCoachAt = Date.now(); }
  function paidiaCoachGapOk(gapMs) {
    return (Date.now() - paidiaLastCoachAt()) >= (gapMs || TIP_COACH_GAP_MS);
  }
  global.paidiaMarkCoachShown = paidiaMarkCoachShown;
  global.paidiaPageTipVisible = function () { return !!tipVisibleId; };

  function readTipDismissed() {
    try {
      const raw = JSON.parse(localStorage.getItem(TIP_DISMISS_KEY) || '[]');
      return Array.isArray(raw) ? raw.map(String) : [];
    } catch (_) { return []; }
  }
  function writeTipDismissed(ids) {
    try {
      localStorage.setItem(TIP_DISMISS_KEY, JSON.stringify([...new Set(ids.map(String))].slice(-200)));
    } catch (_) {}
  }
  function markTipDismissed(id) {
    if (!id) return;
    const ids = readTipDismissed();
    if (!ids.includes(id)) { ids.push(id); writeTipDismissed(ids); }
  }

  /** Page-UI only — no Zo-Ai capability spam (FAB sibling owns those). */
  function buildTipCatalog() {
    const mk = (id, page, deTitle, elTitle, deBody, elBody, opts) => ({
      id, page,
      title: () => tipCopy(deTitle, elTitle),
      body: () => tipCopy(deBody, elBody),
      proOnly: !!(opts && opts.proOnly),
    });
    return [
      mk('staff-home-tasks', 'staff:home',
        'Heutige Aufgaben', 'Σημερινές εργασίες',
        'Oben siehst du, was heute ansteht — tippe eine Karte, um direkt dorthin zu springen.',
        'Επάνω βλέπεις τι πρέπει σήμερα — πάτα μια κάρτα για να μεταβείς κατευθείαν.'),
      mk('staff-home-signals', 'staff:home',
        'Signale', 'Σήματα',
        'Rote/gelbe Hinweise bedeuten Aufmerksamkeit (Lager, Liste, Plan).',
        'Κόκκινα/κίτρινα σήματα ζητούν προσοχή (αποθήκη, λίστα, πρόγραμμα).',
        { proOnly: true }),
      mk('staff-home-mode', 'staff:home',
        'Easy oder Pro', 'Easy ή Pro',
        'Oben kannst du Easy (weniger) und Pro (mehr Werkzeuge) umschalten.',
        'Επάνω αλλάζεις Easy (λιγότερα) και Pro (περισσότερα εργαλεία).',
        { proOnly: true }),
      mk('staff-plan-views', 'staff:schedule',
        'Tag & Woche', 'Ημέρα & εβδομάδα',
        'Wechsle zwischen Tag und Woche. Hausfilter grenzt die Ansicht ein.',
        'Άλλαξε μεταξύ ημέρας και εβδομάδας. Το φίλτρο σπιτιού στενεύει την όψη.'),
      mk('staff-plan-add', 'staff:schedule',
        'Eintrag hinzufügen', 'Προσθήκη καταχώρησης',
        'Mit ＋ legst du Aktivitäten an. In Easy bleibt das Formular schlank.',
        'Με το ＋ προσθέτεις δραστηριότητες. Στο Easy η φόρμα μένει απλή.'),
      mk('staff-plan-pro', 'staff:schedule',
        'Pro-Extras', 'Επιπλέον Pro',
        'Import, Kalender und Wochennotizen findest du in Pro unter Mehr.',
        'Εισαγωγή, ημερολόγιο και σημειώσεις εβδομάδας στο Pro υπό Άλλα.',
        { proOnly: true }),
      mk('staff-stock-house', 'staff:stock',
        'Haus wählen', 'Διάλεξε σπίτι',
        'Zuerst Haus wählen, dann suchen und mit ± Mengen anpassen.',
        'Πρώτα διάλεξε σπίτι, μετά αναζήτηση και ± για ποσότητες.'),
      mk('staff-stock-add', 'staff:stock',
        'Ware hinzufügen', 'Προσθήκη προϊόντος',
        'Hinzufügen legt neue Produkte an — danach sofort ± nutzbar.',
        'Η Προσθήκη δημιουργεί προϊόντα — μετά αμέσως ±.'),
      mk('staff-stock-pro', 'staff:stock',
        'Regale & Foto lesen', 'Ράφια & ανάγνωση φωτό',
        'In Pro: Regale, Mehrfachauswahl und Foto lesen über die Leiste.',
        'Στο Pro: ράφια, μαζική επιλογή και ανάγνωση φωτό από τη γραμμή.',
        { proOnly: true }),
      mk('staff-shop-friday', 'staff:shop',
        'Freitag prüfen', 'Έλεγξε Παρασκευή',
        'Prüfe Freitag und Haus, dann Artikel in den Warenkorb legen.',
        'Έλεγξε Παρασκευή και σπίτι, μετά βάλε στο καλάθι.'),
      mk('staff-shop-requests', 'staff:shop',
        'Anfragen', 'Αιτήματα',
        'Offene Anfragen von Kindern oder Team erscheinen als eigene Liste.',
        'Ανοιχτά αιτήματα παιδιών ή ομάδας φαίνονται ως ξεχωριστή λίστα.'),
      mk('staff-shop-pro', 'staff:shop',
        'Foto & Einlesen', 'Φωτό & εισαγωγή',
        'Pro: Foto lesen und Fehlendes aus Lager beschleunigen große Einkäufe.',
        'Pro: ανάγνωση φωτό και συμπλήρωση από αποθήκη για μεγάλες αγορές.',
        { proOnly: true }),
      mk('staff-talk-chat', 'staff:talk',
        'Team-Chat', 'Chat ομάδας',
        'Kurze Absprachen hier — längere Themen für die Besprechung merken.',
        'Σύντομες συνεννοήσεις εδώ — μεγαλύτερα θέματα για τη σύσκεψη.'),
      mk('staff-talk-topics', 'staff:talk',
        'Themen', 'Θέματα',
        'Themen halten die Besprechung strukturiert — tippe zum Öffnen.',
        'Τα θέματα κρατούν τη σύσκεψη σε τάξη — πάτα για άνοιγμα.',
        { proOnly: true }),
      mk('staff-kids-dir', 'staff:kids',
        'Kinderverzeichnis', 'Κατάλογος παιδιών',
        'Wähle ein Kind für Schule, Noten und Profil.',
        'Διάλεξε παιδί για σχολείο, βαθμούς και προφίλ.'),
      mk('staff-kids-school', 'staff:kids',
        'Schule', 'Σχολείο',
        'Anwesenheit, Hausaufgaben und Stundenplan liegen in den Panes.',
        'Παρουσίες, εργασίες και ωρολόγιο είναι στα πάνελ.',
        { proOnly: true }),
      mk('staff-gallery-share', 'staff:gallery',
        'Momente teilen', 'Μοίρασε στιγμές',
        'Fotos freundlich teilen — nur was zum Haus gehört.',
        'Μοίρασε φωτό φιλικά — μόνο ό,τι ανήκει στο σπίτι.'),
      mk('staff-gallery-refresh', 'staff:gallery',
        'Aktualisieren', 'Ανανέωση',
        'Zum Nachladen nach oben ziehen oder Aktualisieren tippen.',
        'Τράβηξε προς τα πάνω ή πάτα Ανανέωση μετά από νέες φωτό.',
        { proOnly: true }),
      mk('staff-book-shift', 'staff:book',
        'Übergabe', 'Παράδοση',
        'Schreibe in Abschnitten, was die nächste Schicht wissen muss — sie tippt „Gelesen“.',
        'Γράψε σε ενότητες τι πρέπει να ξέρει η επόμενη βάρδια — πατά «Διαβάστηκε».'),
      mk('staff-book-log', 'staff:book',
        'Protokoll', 'Πρωτόκολλο',
        'Im Protokoll siehst du Korrekturen und wichtige Änderungen.',
        'Στο πρωτόκολλο βλέπεις διορθώσεις και σημαντικές αλλαγές.',
        { proOnly: true }),
      mk('kid-today-xp', 'child:today',
        'Dein Tag', 'Η μέρα σου',
        'Hier siehst du XP, nächste Aktivität und Schnellwege.',
        'Εδώ βλέπεις XP, επόμενη δραστηριότητα και συντομεύσεις.'),
      mk('kid-today-dock', 'child:today',
        'Menü unten', 'Μενού κάτω',
        'Spiele, Bewertungen, Bonus und Notizen erreichst du über das Dock.',
        'Παιχνίδια, αξιολογήσεις, μπόνους και σημειώσεις από το κάτω μενού.'),
      mk('kid-today-chores', 'child:today',
        'Aufgaben', 'Εργασίες',
        'Erledigte Aufgaben bringen XP — tippe eine Karte zum Einreichen.',
        'Οι ολοκληρωμένες εργασίες δίνουν XP — πάτα κάρτα για υποβολή.',
        { proOnly: true }),
      mk('kid-games-pick', 'child:games',
        'Spiel wählen', 'Διάλεξε παιχνίδι',
        'Tippe ein Spiel. „Alle Spiele“ bringt dich zurück zur Übersicht.',
        'Πάτα ένα παιχνίδι. Το «Όλα τα παιχνίδια» σε γυρίζει στην επισκόπηση.'),
      mk('kid-games-best', 'child:games',
        'Highscore', 'Υψηλό σκορ',
        'Dein Bestwert bleibt auf diesem Gerät gespeichert.',
        'Το καλύτερό σου σκορ μένει σε αυτή τη συσκευή.',
        { proOnly: true }),
      mk('kid-rate-stars', 'child:rate',
        'Sterne setzen', 'Βάλε αστέρια',
        'Tippe die Noten für Leben & Schule — ehrlich und kurz.',
        'Πάτα τους βαθμούς για ζωή & σχολείο — ειλικρινά και σύντομα.'),
      mk('kid-rate-staff', 'child:rate',
        'Team-Bewertung', 'Αξιολόγηση ομάδας',
        'Unten siehst du, wie das Team die Woche einschätzt.',
        'Κάτω βλέπεις πώς αξιολογεί η ομάδα την εβδομάδα.',
        { proOnly: true }),
      mk('kid-bonus-view', 'child:bonus',
        'Bonus ansehen', 'Δες το μπόνους',
        'Bonus aus Streak und Aufgaben — hier nur ansehen.',
        'Μπόνους από streak και εργασίες — εδώ μόνο βλέπεις.'),
      mk('kid-notes-private', 'child:notes',
        'Private Notizen', 'Ιδιωτικές σημειώσεις',
        'Notizen bleiben auf diesem Gerät — nicht für das ganze Team.',
        'Οι σημειώσεις μένουν σε αυτή τη συσκευή — όχι για όλη την ομάδα.'),
      mk('kid-notes-save', 'child:notes',
        'Speichern', 'Αποθήκευση',
        'Schreibe kurz und tippe Speichern, sonst geht der Text verloren.',
        'Γράψε σύντομα και πάτα Αποθήκευση, αλλιώς χάνεται το κείμενο.',
        { proOnly: true }),
    ];
  }

  function tipCancelSchedule() {
    if (tipTimer) { clearTimeout(tipTimer); tipTimer = null; }
  }
  function tipClearAutoHide() {
    if (tipHideTimer) { clearTimeout(tipHideTimer); tipHideTimer = null; }
  }
  function tipGateBlocking() {
    try {
      if (document.body.classList.contains('auth-pending')) return true;
      const g = gateEl();
      if (g && g.classList.contains('on')) return true;
      const app = document.getElementById('app');
      if (app && app.hidden) return true;
    } catch (_) {}
    return false;
  }
  function tipZoAiSiblingBlocking() {
    try {
      if (document.body.classList.contains('zoai-tip-open')) return true;
      const z = document.getElementById('zoaiTipRoot');
      if (z && !z.hidden) return true;
      if (typeof global.paidiaZoAiTipVisible === 'function' && global.paidiaZoAiTipVisible()) return true;
    } catch (_) {}
    return false;
  }
  function tipBusyBlocking() {
    const s = state();
    if (!s) return true;
    if (s.tourActive) return true;
    if (document.body.classList.contains('sheet-open')) return true;
    if (document.body.classList.contains('tour-open')) return true;
    if (s.chatOpen) return true;
    if (tipZoAiSiblingBlocking()) return true;
    return tipGateBlocking();
  }
  function tipEnsureRoot() {
    let root = document.getElementById('tipRoot');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'tipRoot';
    root.className = 'tip-root';
    root.hidden = true;
    root.innerHTML = '<aside class="tip-card" id="tipCard" role="status" aria-live="polite">'
      + '<div class="tip-card-top">'
      + '<span class="tip-kicker" id="tipKicker"></span>'
      + '<button type="button" class="tip-dismiss" id="tipDismiss" aria-label="OK">×</button>'
      + '</div>'
      + '<strong class="tip-title" id="tipTitle"></strong>'
      + '<p class="tip-body" id="tipBody"></p>'
      + '<button type="button" class="tip-gotit" id="tipGotIt"></button>'
      + '</aside>';
    document.body.appendChild(root);
    const dismiss = function () { tipDismissCurrent(); };
    root.querySelector('#tipDismiss').onclick = dismiss;
    root.querySelector('#tipGotIt').onclick = dismiss;
    return root;
  }
  function tipHide(opts) {
    tipClearAutoHide();
    const root = document.getElementById('tipRoot');
    if (root) {
      root.hidden = true;
      root.classList.remove('tip-on');
    }
    if (!(opts && opts.keepId)) tipVisibleId = null;
  }
  function tipDismissCurrent() {
    const id = tipVisibleId;
    tipHide();
    if (id) markTipDismissed(id);
    feedback('select');
  }
  function tipPickForPage(pageKey) {
    const dismissed = new Set(readTipDismissed());
    const easy = isEasy();
    let pool = buildTipCatalog().filter(function (t) {
      return t.page === pageKey && !dismissed.has(t.id);
    });
    if (easy) pool = pool.filter(function (t) { return !t.proOnly; });
    if (!pool.length) return null;
    if (easy) return pool[0];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  function tipShow(tip) {
    if (!tip || tipBusyBlocking()) return false;
    if (!paidiaCoachGapOk()) return false;
    const root = tipEnsureRoot();
    const s = state();
    const de = !(s && s.lang === 'el');
    tipVisibleId = tip.id;
    tipSessionPages.add(tip.page);
    paidiaMarkCoachShown();
    root.querySelector('#tipKicker').textContent = de ? 'Tipp' : 'Συμβουλή';
    root.querySelector('#tipTitle').textContent = tip.title();
    root.querySelector('#tipBody').textContent = tip.body();
    root.querySelector('#tipGotIt').textContent = de ? 'Verstanden' : 'Το κατάλαβα';
    root.querySelector('#tipDismiss').setAttribute('aria-label', de ? 'Schließen' : 'Κλείσιμο');
    root.hidden = false;
    const reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) root.classList.add('tip-on');
    else requestAnimationFrame(function () { root.classList.add('tip-on'); });
    tipClearAutoHide();
    tipHideTimer = setTimeout(tipDismissCurrent, TIP_AUTO_HIDE_MS);
    return true;
  }
  function tipTryShow() {
    tipTimer = null;
    if (tipBusyBlocking()) {
      tipTimer = setTimeout(tipTryShow, TIP_COACH_GAP_MS);
      return;
    }
    if (!paidiaCoachGapOk()) {
      const wait = Math.max(4000, TIP_COACH_GAP_MS - (Date.now() - paidiaLastCoachAt()));
      tipTimer = setTimeout(tipTryShow, wait);
      return;
    }
    const pageKey = tipPageKey();
    if (tipSessionPages.has(pageKey)) return;
    if (tipVisibleId) return;
    const tip = tipPickForPage(pageKey);
    if (!tip) return;
    tipShow(tip);
  }
  function tipScheduleForCurrentPage() {
    tipCancelSchedule();
    const s = state();
    if (!s || tipGateBlocking() || s.tourActive) return;
    if (!s.user && s.mode !== 'child') return;
    if (s.mode === 'child' && !s.child) return;
    const pageKey = tipPageKey();
    if (tipSessionPages.has(pageKey)) return;
    if (!tipPickForPage(pageKey)) return;
    const span = TIP_DELAY_MAX_MS - TIP_DELAY_MIN_MS;
    const delay = TIP_DELAY_MIN_MS + Math.floor(Math.random() * Math.max(1, span + 1));
    tipTimer = setTimeout(tipTryShow, delay);
  }
  function tipNotifyPageChange() {
    const pageKey = tipPageKey();
    if (pageKey === tipPageWatchKey) {
      if (tipBusyBlocking()) tipHide({ keepId: true });
      return;
    }
    tipPageWatchKey = pageKey;
    tipHide();
    tipScheduleForCurrentPage();
  }

  global.PaidiaPageTips = {
    bind: function (deps) { api = deps || null; },
    notifyPageChange: tipNotifyPageChange,
    cancel: tipCancelSchedule,
    hide: tipHide,
    isVisible: function () { return !!tipVisibleId; },
  };
})(typeof window !== 'undefined' ? window : globalThis);
