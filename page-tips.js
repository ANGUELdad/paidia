/**
 * Contextual page tips — dismissible help for the current page.
 * Daily-first “Hilfe!!” with screenshots + random mid-session nudges.
 * Not the spotlight tour; not Zo-Ai FAB capability nags.
 * Docs: docs/agents/TIPS_SYSTEM.md
 *
 * App binds deps via PaidiaPageTips.bind({ getState, isEasy, feedback, getGateEl }).
 */
(function (global) {
  'use strict';

  const TIP_DISMISS_KEY = 'paidia.tipsDismissed';
  const TIP_DAILY_KEY = 'paidia.helpDaily';
  const TIP_DELAY_MIN_MS = 25000;
  const TIP_DELAY_MAX_MS = 90000;
  const TIP_DAILY_MIN_MS = 6000;
  const TIP_DAILY_MAX_MS = 18000;
  const TIP_AUTO_HIDE_MS = 16000;
  const TIP_COACH_GAP_MS = 28000;
  const TIP_MAX_PER_PAGE_SESSION = 2;

  const tipSessionCount = Object.create(null);
  let tipTimer = null;
  let tipHideTimer = null;
  let tipPageWatchKey = '';
  let tipVisibleId = null;
  let tipPendingDaily = false;
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

  function todayIso() {
    try { return new Date().toISOString().slice(0, 10); } catch (_) { return ''; }
  }
  function readDailyHelp() {
    const day = todayIso();
    try {
      const raw = JSON.parse(localStorage.getItem(TIP_DAILY_KEY) || '{}');
      if (!raw || raw.day !== day) return { day: day, pages: [] };
      return { day: day, pages: Array.isArray(raw.pages) ? raw.pages.map(String) : [] };
    } catch (_) { return { day: day, pages: [] }; }
  }
  function markDailyHelp(pageKey) {
    if (!pageKey) return;
    const cur = readDailyHelp();
    if (!cur.pages.includes(pageKey)) cur.pages.push(pageKey);
    try {
      localStorage.setItem(TIP_DAILY_KEY, JSON.stringify({ day: cur.day, pages: cur.pages.slice(-80) }));
    } catch (_) {}
  }
  function dailyHelpPending(pageKey) {
    return !!(pageKey && !readDailyHelp().pages.includes(pageKey));
  }

  /** Page-UI only — no Zo-Ai capability spam (FAB sibling owns those). */
  function buildTipCatalog() {
    const mk = (id, page, deTitle, elTitle, deBody, elBody, opts) => ({
      id, page,
      title: () => tipCopy(deTitle, elTitle),
      body: () => tipCopy(deBody, elBody),
      proOnly: !!(opts && opts.proOnly),
      shot: (opts && opts.shot) || null,
      daily: !!(opts && opts.daily),
      helpAd: !(opts && opts.helpAd === false),
    });
    return [
      mk('staff-home-daily', 'staff:home',
        'Dein Start heute', 'Η αρχή σου σήμερα',
        'Signale und Aufgaben oben — tippe eine Karte. Hilfe!! erscheint auch zufällig auf jeder Seite.',
        'Σήματα και εργασίες επάνω — πάτα μια κάρτα. Η Βοήθεια!! εμφανίζεται και τυχαία σε κάθε σελίδα.',
        { daily: true, shot: 'help/home.png' }),
      mk('staff-home-tasks', 'staff:home',
        'Heutige Aufgaben', 'Σημερινές εργασίες',
        'Oben siehst du, was heute ansteht — tippe eine Karte, um direkt dorthin zu springen.',
        'Επάνω βλέπεις τι πρέπει σήμερα — πάτα μια κάρτα για να μεταβείς κατευθείαν.'),
      mk('staff-home-signals', 'staff:home',
        'Signale', 'Σήματα',
        'Rote/gelbe Hinweise bedeuten Aufmerksamkeit (Lager, Liste, Plan).',
        'Κόκκινα/κίτρινα σήματα ζητούν προσοχή (αποθήκη, λίστα, πρόγραμμα).'),
      mk('staff-home-mode', 'staff:home',
        'Easy oder Pro', 'Easy ή Pro',
        'Oben kannst du Easy (weniger) und Pro (mehr Werkzeuge) umschalten.',
        'Επάνω αλλάζεις Easy (λιγότερα) και Pro (περισσότερα εργαλεία).',
        { proOnly: true }),

      mk('staff-plan-daily', 'staff:schedule',
        'Plan der Woche', 'Πρόγραμμα εβδομάδας',
        'Tag / Woche wechseln. In Easy: Agenda; in Pro auch Tabelle.',
        'Άλλαξε Ημέρα / Εβδομάδα. Στο Easy: Agenda· στο Pro και πίνακας.',
        { daily: true, shot: 'help/plan.png' }),
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

      mk('staff-stock-daily', 'staff:stock',
        'Lager im Blick', 'Αποθήκη με μια ματιά',
        'Haus wählen, ± tippen. Foto lesen füllt Mengen — Rückgängig im Toast.',
        'Διάλεξε σπίτι, πάτα ±. Η φωτό γεμίζει ποσότητες — Αναίρεση στο toast.',
        { daily: true, shot: 'help/lager.png' }),
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

      mk('staff-shop-daily', 'staff:shop',
        'Liste: Foto rein!', 'Λίστα: βάλε φωτό!',
        'Sende ein Foto oder Bildschirmfoto — Produkte landen in der Freitagsliste. Nach Einfügen: Rückgängig im Toast.',
        'Στείλε φωτογραφία ή στιγμιότυπο — τα προϊόντα μπαίνουν στη λίστα Παρασκευής. Μετά: Αναίρεση στο toast.',
        { daily: true, shot: 'help/shop-plan.png' }),
      mk('staff-shop-friday', 'staff:shop',
        'Freitag prüfen', 'Έλεγξε Παρασκευή',
        'Prüfe Freitag und Haus, dann Artikel in den Warenkorb legen — oder Foto → Liste.',
        'Έλεγξε Παρασκευή και σπίτι, μετά βάλε στο καλάθι — ή Φωτο → λίστα.'),
      mk('staff-shop-photo', 'staff:shop',
        'Foto → Liste', 'Φωτο → λίστα',
        'Hilfe!! Tippe „Foto → Liste“ oder importiere ein Bild — Text und Mengen werden gelesen.',
        'Βοήθεια!! Πάτα «Φωτο → λίστα» ή εισήγαγε εικόνα — διαβάζονται κείμενο και ποσότητες.'),
      mk('staff-shop-requests', 'staff:shop',
        'Anfragen', 'Αιτήματα',
        'Offene Anfragen von Kindern oder Team erscheinen als eigene Liste.',
        'Ανοιχτά αιτήματα παιδιών ή ομάδας φαίνονται ως ξεχωριστή λίστα.'),
      mk('staff-shop-easy-lager', 'staff:shop',
        'Aus Lager füllen', 'Γέμισμα από αποθήκη',
        'Easy: Aus Lager füllen → Einkauf starten → im Laden bestätigen → Bestand steigt.',
        'Easy: γέμισμα από αποθήκη → έναρξη → επιβεβαίωση στο μαγαζί → ανεβαίνει το απόθεμα.'),
      mk('staff-shop-pro', 'staff:shop',
        'Foto & Historie', 'Φωτό & ιστορικό',
        'Pro: Foto lesen, Mehrfachauswahl und Einkaufshistorie über •••.',
        'Pro: ανάγνωση φωτό, μαζική επιλογή και ιστορικό αγορών από •••.',
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

      mk('staff-kids-daily', 'staff:kids',
        'Kinder & Schule', 'Παιδιά & σχολείο',
        'Material, Anwesenheit, Hausaufgaben, Verlauf — in Easy ohne Stundenplan-Admin.',
        'Υλικό, παρουσία, εργασίες, ιστορικό — στο Easy χωρίς ωρολόγιο-admin.',
        { daily: true, shot: 'help/kids.png' }),
      mk('staff-kids-dir', 'staff:kids',
        'Kinderverzeichnis', 'Κατάλογος παιδιών',
        'Wähle ein Kind für Schule, Noten und Profil.',
        'Διάλεξε παιδί για σχολείο, βαθμούς και προφίλ.'),
      mk('staff-kids-materials', 'staff:kids',
        'Material & Verlauf', 'Υλικό & ιστορικό',
        'Checkliste + Foto (braucht/dabei/fehlt). Verlauf speichert Noten und Material.',
        'Λίστα + φωτο (χρειάζεται/το έχει/λείπει). Το ιστορικό κρατά βαθμούς και υλικό.'),
      mk('staff-kids-school', 'staff:kids',
        'Schule', 'Σχολείο',
        'Anwesenheit, Hausaufgaben, Material und Verlauf liegen in den Panes — auch in Easy.',
        'Παρουσίες, εργασίες, υλικό και ιστορικό είναι στα πάνελ — και στο Easy.'),

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

      mk('kid-today-daily', 'child:today',
        'Dein Tag', 'Η μέρα σου',
        'XP, nächste Aktivität und Schnellwege — tippe die Karten.',
        'XP, επόμενη δραστηριότητα και συντομεύσεις — πάτα τις κάρτες.',
        { daily: true, shot: 'help/child-today.png' }),
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
      mk('kid-pocket-view', 'child:pocket',
        'Taschengeld', 'Χαρτζιλίκι',
        'Dein Guthaben und der ganze Verlauf — nur ansehen.',
        'Το υπόλοιπό σου και όλο το ιστορικό — μόνο θέα.'),
      mk('staff-pocket-tab', 'staff:pocket',
        'Taschengeld führen', 'Διαχείριση χαρτζιλικιού',
        'Kind wählen, ± buchen, Verlauf filtern, Regeln und Kategorien unter Einstellungen.',
        'Διάλεξε παιδί, ± καταχώριση, φίλτρο ιστορικού, κανόνες και κατηγορίες στις Ρυθμίσεις.'),
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
      + '<img class="tip-shot" id="tipShot" alt="" hidden>'
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
      const card = root.querySelector('#tipCard');
      if (card) card.classList.remove('is-daily');
      const shot = root.querySelector('#tipShot');
      if (shot) {
        shot.hidden = true;
        shot.removeAttribute('src');
      }
      const kick = root.querySelector('#tipKicker');
      if (kick) kick.classList.remove('is-help');
    }
    if (!(opts && opts.keepId)) tipVisibleId = null;
  }
  function tipDismissCurrent() {
    const id = tipVisibleId;
    tipHide();
    if (id) markTipDismissed(id);
    feedback('select');
  }
  function tipSessionOk(pageKey) {
    return (tipSessionCount[pageKey] || 0) < TIP_MAX_PER_PAGE_SESSION;
  }
  function tipBumpSession(pageKey) {
    tipSessionCount[pageKey] = (tipSessionCount[pageKey] || 0) + 1;
  }
  function tipPickForPage(pageKey, preferDaily) {
    const dismissed = new Set(readTipDismissed());
    const easy = isEasy();
    let pool = buildTipCatalog().filter(function (t) {
      return t.page === pageKey && !dismissed.has(t.id);
    });
    if (easy) pool = pool.filter(function (t) { return !t.proOnly; });
    if (!pool.length) return null;
    if (preferDaily) {
      const daily = pool.filter(function (t) { return t.daily; });
      if (daily.length) return daily[0];
      const withShot = pool.filter(function (t) { return t.shot; });
      if (withShot.length) return withShot[0];
    }
    const ads = pool.filter(function (t) { return t.helpAd !== false && !t.daily; });
    const use = ads.length ? ads : pool;
    if (easy) return use[0];
    return use[Math.floor(Math.random() * use.length)];
  }
  function tipShow(tip, opts) {
    if (!tip || tipBusyBlocking()) return false;
    if (!paidiaCoachGapOk()) return false;
    const root = tipEnsureRoot();
    const s = state();
    const de = !(s && s.lang === 'el');
    const isDaily = !!(opts && opts.daily) || !!tip.daily;
    tipVisibleId = tip.id;
    tipBumpSession(tip.page);
    if (isDaily) markDailyHelp(tip.page);
    paidiaMarkCoachShown();
    const kicker = root.querySelector('#tipKicker');
    kicker.textContent = de ? 'Hilfe!!' : 'Βοήθεια!!';
    kicker.classList.toggle('is-help', true);
    root.querySelector('#tipTitle').textContent = tip.title();
    root.querySelector('#tipBody').textContent = tip.body();
    root.querySelector('#tipGotIt').textContent = de ? 'Verstanden' : 'Το κατάλαβα';
    root.querySelector('#tipDismiss').setAttribute('aria-label', de ? 'Schließen' : 'Κλείσιμο');
    const card = root.querySelector('#tipCard');
    if (card) card.classList.toggle('is-daily', isDaily);
    const shot = root.querySelector('#tipShot');
    if (shot) {
      if (tip.shot) {
        shot.hidden = false;
        shot.alt = tip.title();
        shot.onerror = function () { shot.hidden = true; };
        shot.src = tip.shot + (tip.shot.indexOf('?') >= 0 ? '&' : '?') + 'v=184';
      } else {
        shot.hidden = true;
        shot.removeAttribute('src');
      }
    }
    root.hidden = false;
    const reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) root.classList.add('tip-on');
    else requestAnimationFrame(function () { root.classList.add('tip-on'); });
    tipClearAutoHide();
    tipHideTimer = setTimeout(tipDismissCurrent, isDaily ? TIP_AUTO_HIDE_MS + 4000 : TIP_AUTO_HIDE_MS);
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
    if (!tipSessionOk(pageKey)) return;
    if (tipVisibleId) return;
    const wantDaily = tipPendingDaily && dailyHelpPending(pageKey);
    const tip = tipPickForPage(pageKey, wantDaily);
    if (!tip) return;
    tipPendingDaily = false;
    tipShow(tip, { daily: wantDaily || tip.daily });
  }
  function tipScheduleForCurrentPage() {
    tipCancelSchedule();
    const s = state();
    if (!s || tipGateBlocking() || s.tourActive) return;
    if (!s.user && s.mode !== 'child') return;
    if (s.mode === 'child' && !s.child) return;
    const pageKey = tipPageKey();
    if (!tipSessionOk(pageKey)) return;
    if (!tipPickForPage(pageKey, true) && !tipPickForPage(pageKey, false)) return;
    tipPendingDaily = dailyHelpPending(pageKey);
    let delay;
    if (tipPendingDaily) {
      const span = TIP_DAILY_MAX_MS - TIP_DAILY_MIN_MS;
      delay = TIP_DAILY_MIN_MS + Math.floor(Math.random() * Math.max(1, span + 1));
    } else {
      const span = TIP_DELAY_MAX_MS - TIP_DELAY_MIN_MS;
      delay = TIP_DELAY_MIN_MS + Math.floor(Math.random() * Math.max(1, span + 1));
    }
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
