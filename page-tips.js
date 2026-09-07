/**
 * Contextual page tips — dismissible help for the current page.
 * Spotlight hole + arrow over data-tour targets; human DE/EL copy.
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
  let tipVisibleTip = null;
  let tipPendingDaily = false;
  let tipLiveEl = null;
  let tipPaintBound = false;
  let api = null;

  function state() { return api && api.getState ? api.getState() : null; }
  function isEasy() { return api && api.isEasy ? !!api.isEasy() : true; }
  function feedback(kind) { try { if (api && api.feedback) api.feedback(kind); } catch (_) {} }
  function gateEl() { return api && api.getGateEl ? api.getGateEl() : null; }

  function tipLang() {
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
  function tipCopy(de, el) {
    return tipLang() === 'el' ? el : de;
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
      deTitle: deTitle, elTitle: elTitle, deBody: deBody, elBody: elBody,
      title: () => tipCopy(deTitle, elTitle),
      body: () => tipCopy(deBody, elBody),
      proOnly: !!(opts && opts.proOnly),
      shot: (opts && opts.shot) || null,
      daily: !!(opts && opts.daily),
      helpAd: !(opts && opts.helpAd === false),
      target: (opts && opts.target) || null,
    });
    return [
      mk('staff-home-daily', 'staff:home',
        'Dein Start heute', 'Η αρχή σου σήμερα',
        'Hier siehst du, was heute wichtig ist. Tippe eine Karte, um dorthin zu springen.',
        'Εδώ βλέπεις τι μετράει σήμερα. Πάτα μια κάρτα για να πας κατευθείαν εκεί.',
        { daily: true, target: 'home-main' }),
      mk('staff-home-tasks', 'staff:home',
        'Heutige Aufgaben', 'Σημερινές εργασίες',
        'Die hervorgehobenen Karten zeigen deine nächsten Schritte. Tippe eine an.',
        'Οι τονισμένες κάρτες δείχνουν τα επόμενα βήματα. Πάτα μία.',
        { target: 'home-main' }),
      mk('staff-home-signals', 'staff:home',
        'Wichtige Hinweise', 'Σημαντικές ειδοποιήσεις',
        'Rote oder gelbe Hinweise bedeuten: etwas braucht Aufmerksamkeit in der App.',
        'Κόκκινες ή κίτρινες ειδοποιήσεις σημαίνουν ότι κάτι χρειάζεται προσοχή.',
        { target: 'home-main' }),
      mk('staff-home-mode', 'staff:home',
        'Einfach oder Pro', 'Απλό ή Pro',
        'Oben kannst du „Einfach“ (weniger Buttons) und „Pro“ (mehr Werkzeuge) wechseln.',
        'Επάνω αλλάζεις «Απλό» (λιγότερα κουμπιά) και «Pro» (περισσότερα εργαλεία).',
        { proOnly: true, target: 'home-main' }),

      mk('staff-plan-daily', 'staff:schedule',
        'Wochenplan', 'Εβδομαδιαίο πρόγραμμα',
        'Wechsle oben zwischen Tag und Woche. So siehst du den Plan klarer.',
        'Άλλαξε επάνω μεταξύ ημέρας και εβδομάδας. Έτσι βλέπεις το πρόγραμμα καθαρά.',
        { daily: true, target: 'plan-views' }),
      mk('staff-plan-views', 'staff:schedule',
        'Tag und Woche', 'Ημέρα και εβδομάδα',
        'Diese Schalter wechseln die Ansicht. Mit dem Hausfilter siehst du nur ein Haus.',
        'Αυτοί οι διακόπτες αλλάζουν την όψη. Με το φίλτρο σπιτιού βλέπεις μόνο ένα σπίτι.',
        { target: 'plan-views' }),
      mk('staff-plan-add', 'staff:schedule',
        'Aktivität hinzufügen', 'Προσθήκη δραστηριότητας',
        'Tippe auf ＋, um eine neue Aktivität einzutragen. In Einfach bleibt das Formular kurz.',
        'Πάτα το ＋ για νέα δραστηριότητα. Στο Απλό η φόρμα μένει σύντομη.',
        { target: 'plan-views' }),
      mk('staff-plan-pro', 'staff:schedule',
        'Mehr Plan-Werkzeuge', 'Περισσότερα εργαλεία προγράμματος',
        'In Pro findest du unter Mehr Import, Kalender und Wochennotizen.',
        'Στο Pro, στο μενού Άλλα, βρίσκεις εισαγωγή, ημερολόγιο και σημειώσεις εβδομάδας.',
        { proOnly: true, target: 'plan-views' }),

      mk('staff-stock-daily', 'staff:stock',
        'Vorräte prüfen', 'Έλεγχος αποθέματος',
        'Zuerst ein Haus wählen, dann mit − und ＋ die Mengen ändern. Eine kurze Meldung lässt dich rückgängig machen.',
        'Πρώτα διάλεξε σπίτι, μετά άλλαξε ποσότητες με − και ＋. Ένα σύντομο μήνυμα σου επιτρέπει αναίρεση.',
        { daily: true, target: 'stock-command' }),
      mk('staff-stock-house', 'staff:stock',
        'Haus wählen', 'Διάλεξε σπίτι',
        'Tippe oben auf ein Haus. Danach kannst du suchen und Mengen anpassen.',
        'Πάτα επάνω ένα σπίτι. Μετά μπορείς να ψάξεις και να αλλάξεις ποσότητες.',
        { target: 'stock-command' }),
      mk('staff-stock-add', 'staff:stock',
        'Neues Produkt', 'Νέο προϊόν',
        'Mit „Hinzufügen“ legst du ein Produkt an. Danach kannst du sofort − und ＋ nutzen.',
        'Με «Προσθήκη» δημιουργείς προϊόν. Μετά μπορείς αμέσως να χρησιμοποιήσεις − και ＋.',
        { target: 'stock-command' }),
      mk('staff-stock-pro', 'staff:stock',
        'Regale und Foto', 'Ράφια και φωτογραφία',
        'In Pro siehst du Regale, Mehrfachauswahl und das Einlesen von Mengen aus einem Foto.',
        'Στο Pro βλέπεις ράφια, μαζική επιλογή και ανάγνωση ποσοτήτων από φωτογραφία.',
        { proOnly: true, target: 'stock-command' }),

      mk('staff-shop-daily', 'staff:shop',
        'Einkaufsliste mit Foto', 'Λίστα αγορών με φωτογραφία',
        'Schick ein Foto der Liste. Die App liest Produkte für Freitag. Du kannst danach rückgängig machen.',
        'Στείλε φωτογραφία της λίστας. Η εφαρμογή διαβάζει προϊόντα για την Παρασκευή. Μετά μπορείς να αναιρέσεις.',
        { daily: true, target: 'shop-command' }),
      mk('staff-shop-friday', 'staff:shop',
        'Freitag und Haus', 'Παρασκευή και σπίτι',
        'Prüfe zuerst Freitag und Haus. Dann lege Artikel in den Warenkorb.',
        'Έλεγξε πρώτα Παρασκευή και σπίτι. Μετά βάλε προϊόντα στο καλάθι.',
        { target: 'shop-command' }),
      mk('staff-shop-photo', 'staff:shop',
        'Foto zur Liste', 'Φωτογραφία στη λίστα',
        'Tippe „Foto → Liste“. Die App liest Text und Mengen — du prüfst das Ergebnis.',
        'Πάτα «Φωτο → λίστα». Η εφαρμογή διαβάζει κείμενο και ποσότητες — εσύ ελέγχεις το αποτέλεσμα.',
        { target: 'shop-command' }),
      mk('staff-shop-requests', 'staff:shop',
        'Offene Anfragen', 'Ανοιχτά αιτήματα',
        'Hier erscheinen Wünsche von Kindern oder vom Team als eigene Liste.',
        'Εδώ φαίνονται επιθυμίες παιδιών ή της ομάδας ως ξεχωριστή λίστα.',
        { target: 'shop-command' }),
      mk('staff-shop-easy-lager', 'staff:shop',
        'Aus dem Lager füllen', 'Γέμισμα από την αποθήκη',
        'In Einfach: aus dem Lager füllen, Einkauf starten, im Laden bestätigen — dann steigt der Bestand.',
        'Στο Απλό: γέμισμα από την αποθήκη, έναρξη αγοράς, επιβεβαίωση στο μαγαζί — μετά ανεβαίνει το απόθεμα.',
        { target: 'shop-command' }),
      mk('staff-shop-pro', 'staff:shop',
        'Foto und Verlauf', 'Φωτογραφία και ιστορικό',
        'In Pro findest du Foto lesen, Mehrfachauswahl und die Einkaufshistorie unter •••.',
        'Στο Pro βρίσκεις ανάγνωση φωτογραφίας, μαζική επιλογή και ιστορικό αγορών στο •••.',
        { proOnly: true, target: 'shop-command' }),

      mk('staff-talk-chat', 'staff:talk',
        'Team-Chat', 'Συνομιλία ομάδας',
        'Schreibe hier kurze Absprachen. Längere Themen speicherst du für die Besprechung.',
        'Γράψε εδώ σύντομες συνεννοήσεις. Μεγαλύτερα θέματα κράτα για τη σύσκεψη.',
        { target: 'talk-chat' }),
      mk('staff-talk-topics', 'staff:talk',
        'Besprechungsthemen', 'Θέματα σύσκεψης',
        'Themen halten die Besprechung geordnet. Tippe eines an, um es zu öffnen.',
        'Τα θέματα κρατούν τη σύσκεψη σε τάξη. Πάτα ένα για να το ανοίξεις.',
        { proOnly: true, target: 'talk-chat' }),

      mk('staff-kids-daily', 'staff:kids',
        'Kinder und Schule', 'Παιδιά και σχολείο',
        'Hier findest du Material, Anwesenheit, Hausaufgaben und den Verlauf.',
        'Εδώ βρίσκεις υλικό, παρουσία, εργασίες και το ιστορικό.',
        { daily: true, target: 'kids-main' }),
      mk('staff-kids-dir', 'staff:kids',
        'Kind wählen', 'Διάλεξε παιδί',
        'Tippe ein Kind an, um Schule, Noten und Profil zu öffnen.',
        'Πάτα ένα παιδί για σχολείο, βαθμούς και προφίλ.',
        { target: 'kids-main' }),
      mk('staff-kids-materials', 'staff:kids',
        'Material und Verlauf', 'Υλικό και ιστορικό',
        'Checkliste mit Foto: braucht, dabei oder fehlt. Der Verlauf speichert Noten und Material.',
        'Λίστα με φωτογραφία: χρειάζεται, το έχει ή λείπει. Το ιστορικό κρατά βαθμούς και υλικό.',
        { target: 'kids-main' }),
      mk('staff-kids-school', 'staff:kids',
        'Schul-Übersicht', 'Επισκόπηση σχολείου',
        'Anwesenheit, Hausaufgaben, Material und Verlauf findest du in den Bereichen oben.',
        'Παρουσία, εργασίες, υλικό και ιστορικό βρίσκονται στις ενότητες επάνω.',
        { target: 'kids-main' }),

      mk('staff-gallery-share', 'staff:gallery',
        'Momente teilen', 'Μοίρασε στιγμές',
        'Teile Fotos vom Haus — freundlich und nur, was dazu gehört.',
        'Μοίρασε φωτογραφίες του σπιτιού — φιλικά και μόνο ό,τι ανήκει εδώ.',
        { target: 'gallery-main' }),
      mk('staff-gallery-refresh', 'staff:gallery',
        'Neu laden', 'Ανανέωση',
        'Zieh nach unten oder tippe Aktualisieren, wenn neue Fotos da sind.',
        'Τράβηξε προς τα κάτω ή πάτα Ανανέωση όταν υπάρχουν νέες φωτογραφίες.',
        { proOnly: true, target: 'gallery-main' }),

      mk('staff-book-shift', 'staff:book',
        'Schicht-Übergabe', 'Παράδοση βάρδιας',
        'Schreibe in Abschnitten, was die nächste Schicht wissen muss. Sie tippt danach „Gelesen“.',
        'Γράψε σε ενότητες τι πρέπει να ξέρει η επόμενη βάρδια. Μετά πατά «Διαβάστηκε».',
        { target: 'book-main' }),
      mk('staff-book-log', 'staff:book',
        'Änderungsprotokoll', 'Πρωτόκολλο αλλαγών',
        'Im Protokoll siehst du Korrekturen und wichtige Änderungen.',
        'Στο πρωτόκολλο βλέπεις διορθώσεις και σημαντικές αλλαγές.',
        { proOnly: true, target: 'book-main' }),

      mk('kid-today-daily', 'child:today',
        'Dein Tag', 'Η μέρα σου',
        'Hier siehst du Punkte, was als Nächstes kommt und schnelle Wege. Tippe eine Karte.',
        'Εδώ βλέπεις πόντους, τι ακολουθεί και γρήγορες διαδρομές. Πάτα μια κάρτα.',
        { daily: true, target: 'kid-start' }),
      mk('kid-today-xp', 'child:today',
        'Punkte und nächste Schritte', 'Πόντοι και επόμενα βήματα',
        'Oben siehst du deine Punkte und die nächste Aktivität.',
        'Επάνω βλέπεις τους πόντους σου και την επόμενη δραστηριότητα.',
        { target: 'kid-start' }),
      mk('kid-today-dock', 'child:today',
        'Menü unten', 'Μενού κάτω',
        'Unten erreichst du Spiele, Bewertungen, Bonus und Notizen.',
        'Κάτω βρίσκεις παιχνίδια, αξιολογήσεις, μπόνους και σημειώσεις.',
        { target: 'kid-nav-games' }),
      mk('kid-today-chores', 'child:today',
        'Aufgaben erledigen', 'Ολοκλήρωση εργασιών',
        'Wenn du eine Aufgabe erledigst, bekommst du Punkte. Tippe die Karte zum Einreichen.',
        'Όταν τελειώνεις μια εργασία, παίρνεις πόντους. Πάτα την κάρτα για υποβολή.',
        { proOnly: true, target: 'kid-start' }),
      mk('kid-games-pick', 'child:games',
        'Spiel wählen', 'Διάλεξε παιχνίδι',
        'Tippe ein Spiel zum Starten. „Alle Spiele“ bringt dich zurück zur Übersicht.',
        'Πάτα ένα παιχνίδι για να ξεκινήσεις. Το «Όλα τα παιχνίδια» σε γυρίζει πίσω.',
        { target: 'kid-games' }),
      mk('kid-games-best', 'child:games',
        'Dein Bestwert', 'Το καλύτερό σου σκορ',
        'Dein bester Stand bleibt auf diesem Gerät gespeichert.',
        'Το καλύτερό σου αποτέλεσμα μένει αποθηκευμένο σε αυτή τη συσκευή.',
        { proOnly: true, target: 'kid-games' }),
      mk('kid-rate-stars', 'child:rate',
        'Sterne geben', 'Βάλε αστέρια',
        'Tippe die Sterne für Leben und Schule — ehrlich und kurz.',
        'Πάτα τα αστέρια για ζωή και σχολείο — ειλικρινά και σύντομα.',
        { target: 'kid-rate' }),
      mk('kid-rate-staff', 'child:rate',
        'Wie das Team bewertet', 'Πώς αξιολογεί η ομάδα',
        'Unten siehst du, wie die Betreuerinnen und Betreuer die Woche einschätzen.',
        'Κάτω βλέπεις πώς αξιολογούν οι φροντιστές την εβδομάδα.',
        { proOnly: true, target: 'kid-rate' }),
      mk('kid-bonus-view', 'child:bonus',
        'Dein Bonus', 'Το μπόνους σου',
        'Hier siehst du den Bonus aus Serie und Aufgaben — nur anschauen.',
        'Εδώ βλέπεις το μπόνους από σερί και εργασίες — μόνο για θέα.',
        { target: 'kid-bonus' }),
      mk('kid-pocket-view', 'child:pocket',
        'Taschengeld', 'Χαρτζιλίκι',
        'Hier siehst du dein Guthaben und den ganzen Verlauf — nur anschauen.',
        'Εδώ βλέπεις το υπόλοιπό σου και όλο το ιστορικό — μόνο για θέα.',
        { target: 'kid-pocket' }),
      mk('staff-pocket-tab', 'staff:pocket',
        'Taschengeld führen', 'Διαχείριση χαρτζιλικιού',
        'Wähle ein Kind, buche mit − und ＋, filtere den Verlauf. Regeln findest du unter Einstellungen.',
        'Διάλεξε παιδί, καταχώρισε με − και ＋, φίλτραρε το ιστορικό. Οι κανόνες είναι στις Ρυθμίσεις.',
        { target: 'pocket-main' }),
      mk('kid-notes-private', 'child:notes',
        'Deine Notizen', 'Οι σημειώσεις σου',
        'Notizen bleiben auf diesem Gerät. Das ganze Team sieht sie nicht.',
        'Οι σημειώσεις μένουν σε αυτή τη συσκευή. Δεν τις βλέπει όλη η ομάδα.',
        { target: 'kid-notes' }),
      mk('kid-notes-save', 'child:notes',
        'Speichern nicht vergessen', 'Μην ξεχάσεις Αποθήκευση',
        'Schreibe kurz und tippe Speichern. Sonst geht der Text verloren.',
        'Γράψε σύντομα και πάτα Αποθήκευση. Αλλιώς χάνεται το κείμενο.',
        { proOnly: true, target: 'kid-notes' }),
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

  function tipClearSpotlight() {
    if (tipLiveEl) {
      try { tipLiveEl.classList.remove('tip-target-live'); } catch (_) {}
      tipLiveEl = null;
    }
    const root = document.getElementById('tipRoot');
    if (!root) return;
    root.classList.remove('tip-anchored');
    const hole = root.querySelector('#tipHole');
    const arrow = root.querySelector('#tipArrow');
    if (hole) hole.hidden = true;
    if (arrow) arrow.hidden = true;
    const card = root.querySelector('#tipCard');
    if (card) {
      card.style.top = '';
      card.style.left = '';
      card.style.bottom = '';
      card.style.right = '';
      card.removeAttribute('data-placement');
    }
  }

  function tipFindTarget(sel) {
    if (!sel) return null;
    return document.querySelector('[data-tour="' + sel + '"]');
  }

  function tipIsMobile(){
    try{
      if(document.body?.classList.contains('shell-m')) return true;
      if(document.body?.classList.contains('layout-mobile')) return true;
    }catch(_){}
    return window.innerWidth < 720;
  }

  function tipPaint() {
    const root = document.getElementById('tipRoot');
    const tip = tipVisibleTip;
    if (!root || !tip || root.hidden) return;
    const hole = root.querySelector('#tipHole');
    const arrow = root.querySelector('#tipArrow');
    const card = root.querySelector('#tipCard');
    if (!hole || !arrow || !card) return;

    const el = tipFindTarget(tip.target);
    if (tipLiveEl && tipLiveEl !== el) {
      try { tipLiveEl.classList.remove('tip-target-live'); } catch (_) {}
      tipLiveEl = null;
    }
    if (!el) {
      tipClearSpotlight();
      root.classList.remove('tip-anchored');
      return;
    }

    tipLiveEl = el;
    el.classList.add('tip-target-live');

    const mobile = tipIsMobile();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const r = el.getBoundingClientRect();
    const pad = mobile ? 8 : 8;
    let top = Math.max(6, r.top - pad);
    let left = Math.max(6, r.left - pad);
    let width = Math.min(vw - left - 6, r.width + pad * 2);
    let height = Math.min(vh - top - 6, r.height + pad * 2);

    if (mobile) {
      const maxH = Math.min(Math.floor(vh * 0.34), 260);
      width = Math.min(Math.max(40, width), vw - 16);
      height = Math.min(Math.max(40, height), maxH);
      if (r.height > maxH) top = Math.max(56, Math.min(r.top + (r.height - maxH) / 2, vh - maxH - 90));
      left = Math.min(Math.max(6, left), Math.max(6, vw - width - 6));
    }

    hole.hidden = false;
    hole.style.top = top + 'px';
    hole.style.left = left + 'px';
    hole.style.width = Math.max(40, width) + 'px';
    hole.style.height = Math.max(40, height) + 'px';

    root.classList.add('tip-anchored');
    const cardH = card.offsetHeight || 150;
    if (mobile) {
      const holeMid = top + height / 2;
      const pinTop = holeMid > vh * 0.42;
      card.style.left = '12px';
      card.style.right = '12px';
      card.style.width = 'auto';
      if (pinTop) {
        card.style.top = '64px';
        card.style.bottom = 'auto';
        card.dataset.placement = 'top-sheet';
      } else {
        card.style.top = 'auto';
        card.style.bottom = 'calc(72px + env(safe-area-inset-bottom, 0px))';
        card.dataset.placement = 'bottom-sheet';
      }
      arrow.hidden = true;
      return;
    }

    const cardW = Math.min(340, vw - 24);
    const spaceBelow = vh - (top + height);
    const preferBelow = spaceBelow > cardH + 28;
    const cardTop = preferBelow
      ? Math.min(vh - cardH - 12, top + height + 16)
      : Math.max(12, top - cardH - 16);
    const cardLeft = Math.min(
      Math.max(12, left + width / 2 - cardW / 2),
      vw - cardW - 12
    );
    card.style.top = cardTop + 'px';
    card.style.left = cardLeft + 'px';
    card.style.bottom = 'auto';
    card.style.right = 'auto';
    card.style.width = cardW + 'px';
    card.dataset.placement = preferBelow ? 'below' : 'above';

    arrow.hidden = false;
    const ax = Math.min(Math.max(cardLeft + 28, left + width / 2 - 8), cardLeft + cardW - 36);
    if (preferBelow) {
      arrow.style.top = (cardTop - 8) + 'px';
      arrow.dataset.dir = 'up';
    } else {
      arrow.style.top = (cardTop + cardH - 2) + 'px';
      arrow.dataset.dir = 'down';
    }
    arrow.style.left = ax + 'px';
  }

  function tipEnsurePaintListeners() {
    if (tipPaintBound) return;
    tipPaintBound = true;
    const paint = function () { if (tipVisibleId) tipPaint(); };
    window.addEventListener('resize', paint, { passive: true });
    window.addEventListener('scroll', paint, { passive: true, capture: true });
  }

  function tipEnsureRoot() {
    let root = document.getElementById('tipRoot');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'tipRoot';
    root.className = 'tip-root';
    root.hidden = true;
    root.innerHTML =
      '<div class="tip-hole" id="tipHole" hidden aria-hidden="true"></div>'
      + '<div class="tip-arrow" id="tipArrow" hidden aria-hidden="true"></div>'
      + '<aside class="tip-card" id="tipCard" role="status" aria-live="polite">'
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
    tipEnsurePaintListeners();
    return root;
  }

  function tipApplyCopy(tip) {
    const root = document.getElementById('tipRoot');
    if (!root || !tip) return;
    const de = tipLang() !== 'el';
    const kicker = root.querySelector('#tipKicker');
    if (kicker) {
      kicker.textContent = de ? 'Hilfe!!' : 'Βοήθεια!!';
      kicker.classList.add('is-help');
    }
    const title = root.querySelector('#tipTitle');
    const body = root.querySelector('#tipBody');
    const got = root.querySelector('#tipGotIt');
    const dismiss = root.querySelector('#tipDismiss');
    if (title) title.textContent = tip.title();
    if (body) body.textContent = tip.body();
    if (got) got.textContent = de ? 'Verstanden' : 'Το κατάλαβα';
    if (dismiss) dismiss.setAttribute('aria-label', de ? 'Schließen' : 'Κλείσιμο');
  }

  function tipHide(opts) {
    tipClearAutoHide();
    tipClearSpotlight();
    const root = document.getElementById('tipRoot');
    if (root) {
      root.hidden = true;
      root.classList.remove('tip-on', 'tip-anchored');
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
    if (!(opts && opts.keepId)) {
      tipVisibleId = null;
      tipVisibleTip = null;
    }
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
    const isDaily = !!(opts && opts.daily) || !!tip.daily;
    tipVisibleId = tip.id;
    tipVisibleTip = tip;
    tipBumpSession(tip.page);
    if (isDaily) markDailyHelp(tip.page);
    paidiaMarkCoachShown();
    tipApplyCopy(tip);
    const card = root.querySelector('#tipCard');
    if (card) card.classList.toggle('is-daily', isDaily);
    const shot = root.querySelector('#tipShot');
    if (shot) {
      // Prefer spotlight over screenshots when a target exists.
      if (tip.shot && !tip.target) {
        shot.hidden = false;
        shot.alt = tip.title();
        shot.onerror = function () { shot.hidden = true; };
        shot.src = tip.shot + (tip.shot.indexOf('?') >= 0 ? '&' : '?') + 'v=198';
      } else {
        shot.hidden = true;
        shot.removeAttribute('src');
      }
    }
    root.hidden = false;
    const reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) root.classList.add('tip-on');
    else requestAnimationFrame(function () { root.classList.add('tip-on'); });
    requestAnimationFrame(function () { tipPaint(); });
    tipClearAutoHide();
    tipHideTimer = setTimeout(tipDismissCurrent, isDaily ? TIP_AUTO_HIDE_MS + 4000 : TIP_AUTO_HIDE_MS);
    return true;
  }
  function tipRefreshLang() {
    if (!tipVisibleId || !tipVisibleTip) return;
    tipApplyCopy(tipVisibleTip);
    tipPaint();
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
      else if (tipVisibleId) tipPaint();
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
    refreshLang: tipRefreshLang,
    isVisible: function () { return !!tipVisibleId; },
  };
})(typeof window !== 'undefined' ? window : globalThis);
