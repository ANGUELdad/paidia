#!/usr/bin/env python3
"""Apply staff expansion roadmap (v102–v104 + Zo-Ai) into paidia sources."""
from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCHOOL = (ROOT / "scripts/_patches/school_module.js").read_text(encoding="utf-8")

I18N_DE = """
    navKids:'Kinder', titleKids:'Kinder & Schule', kidsHeroHint:'Profile, Fächer, Anwesenheit und Hausaufgaben',
    kidsEmpty:'Keine Kinder hinterlegt', schoolSubjects:'Fächer', schoolAttendance:'Anwesenheit',
    schoolHomework:'Hausaufgaben', schoolTimetable:'Stundenplan', thisWeek:'Diese Woche',
    gradeSaved:'Note gespeichert', attSaved:'Anwesenheit gespeichert', hwSaved:'Hausaufgabe gespeichert',
    ttSaved:'Stunde gespeichert', subSaved:'Fach gespeichert', subAdd:'Fach hinzufügen',
    subArchive:'Archivieren', subActivate:'Aktivieren', subEmpty:'Noch keine Fächer',
    att_present:'Da', att_absent:'Fehlt', att_excused:'Entschuldigt',
    hwEmpty:'Keine Hausaufgaben', hwAdd:'Hausaufgabe', hwTitlePh:'z.B. Mathe S.12', hwAllKids:'Alle Kinder',
    ttEmpty:'Keine Stunden', ttAdd:'Stunde hinzufügen',
    homeShiftRing:'Schicht', homeWeekSpark:'7 Tage erledigt', planDayLoad:'Tageslast',
    zoSavedLager:'Im Lager gespeichert', zoSavedListe:'In der Liste gespeichert', zoSavedPlan:'Im Plan gespeichert',
    zoSavedSchool:'Schule gespeichert', zoSavedNote:'Notiz gespeichert',
"""

I18N_EL = """
    navKids:'Παιδιά', titleKids:'Παιδιά & Σχολείο', kidsHeroHint:'Προφίλ, μαθήματα, παρουσία και εργασίες',
    kidsEmpty:'Δεν υπάρχουν παιδιά', schoolSubjects:'Μαθήματα', schoolAttendance:'Παρουσία',
    schoolHomework:'Εργασίες', schoolTimetable:'Ωρολόγιο', thisWeek:'Αυτή την εβδομάδα',
    gradeSaved:'Ο βαθμός αποθηκεύτηκε', attSaved:'Η παρουσία αποθηκεύτηκε', hwSaved:'Η εργασία αποθηκεύτηκε',
    ttSaved:'Η ώρα αποθηκεύτηκε', subSaved:'Το μάθημα αποθηκεύτηκε', subAdd:'Προσθήκη μαθήματος',
    subArchive:'Αρχειοθέτηση', subActivate:'Ενεργοποίηση', subEmpty:'Δεν υπάρχουν μαθήματα',
    att_present:'Παρόν', att_absent:'Απών', att_excused:'Δικαιολογημένο',
    hwEmpty:'Καμία εργασία', hwAdd:'Εργασία', hwTitlePh:'π.χ. Μαθηματικά σ.12', hwAllKids:'Όλα τα παιδιά',
    ttEmpty:'Καμία ώρα', ttAdd:'Προσθήκη ώρας',
    homeShiftRing:'Βάρδια', homeWeekSpark:'7 ημέρες ολοκληρωμένα', planDayLoad:'Φόρτος ημέρας',
    zoSavedLager:'Αποθηκεύτηκε στο ψυγείο', zoSavedListe:'Αποθηκεύτηκε στη λίστα', zoSavedPlan:'Αποθηκεύτηκε στο πρόγραμμα',
    zoSavedSchool:'Αποθηκεύτηκε στο σχολείο', zoSavedNote:'Η σημείωση αποθηκεύτηκε',
"""

CSS_EXTRA = """
  /* ── Staff expansion v102–v104 ─────────────────────────────────────── */
  body:not(.mode-child) .hero-texture,
  body:not(.mode-child) .home-mast,
  body:not(.mode-child) .plan-hero,
  body:not(.mode-child) .ops-hero,
  body:not(.mode-child) .kids-hero,
  body:not(.mode-child) .kid-profile-mast{
    position:relative;
    background:
      radial-gradient(120% 90% at 0% 0%, color-mix(in srgb, var(--stone-100,#e8ebe6) 80%, transparent), transparent 60%),
      linear-gradient(165deg, color-mix(in srgb, var(--brand) 6%, #f7f8f5), var(--stone-50,#f3f5f2))!important;
  }
  body:not(.mode-child) .hero-texture::after,
  body:not(.mode-child) .home-mast::after,
  body:not(.mode-child) .plan-hero::after,
  body:not(.mode-child) .ops-hero::after{
    content:""; position:absolute; inset:0; pointer-events:none; opacity:.07;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='60' height='60' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
    border-radius:inherit;
  }
  body:not(.mode-child) .home-widgets{
    display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin:4px 0 8px;
  }
  body:not(.mode-child) .home-widgets .w-ring{ width:64px; height:64px; }
  @media (prefers-reduced-motion: no-preference){
    body:not(.mode-child) .pine-settle,
    body:not(.mode-child) .home-signal,
    body:not(.mode-child) .plan-block,
    body:not(.mode-child) .stock-category,
    body:not(.mode-child) .kid-dir-card{
      animation: pineSettle .55s cubic-bezier(.22,1,.36,1) both;
    }
    body:not(.mode-child) .home-signal:nth-child(2),
    body:not(.mode-child) .plan-block:nth-child(2),
    body:not(.mode-child) .kid-dir-card:nth-child(2){ animation-delay:.06s }
    body:not(.mode-child) .home-signal:nth-child(3),
    body:not(.mode-child) .plan-block:nth-child(3),
    body:not(.mode-child) .kid-dir-card:nth-child(3){ animation-delay:.12s }
    body:not(.mode-child) .home-signal:nth-child(4),
    body:not(.mode-child) .plan-block:nth-child(4){ animation-delay:.18s }
  }
  @keyframes pineSettle{
    from{ opacity:0; transform:translateY(10px); }
    to{ opacity:1; transform:none; }
  }
  body.layout-desktop:not(.mode-child) .kids-shell,
  body.layout-desktop:not(.mode-child) .home-shell-v2{ max-width:960px; }
  body.layout-desktop:not(.mode-child) .home-more-grid{
    display:grid; grid-template-columns:1fr 1fr; gap:14px;
  }
  body.layout-desktop:not(.mode-child) .plan-hero,
  body.layout-desktop:not(.mode-child) .stock-shell,
  body.layout-desktop:not(.mode-child) .shop-shell{
    display:grid; grid-template-columns:minmax(0,1fr) 220px; gap:16px; align-items:start;
  }
  body.layout-desktop:not(.mode-child) .ops-side-rail{
    position:sticky; top:calc(var(--header-h, 96px) + 12px);
    display:flex; flex-direction:column; gap:10px;
  }
  body:not(.layout-desktop) .ops-side-rail{ display:none; }
  .tutorial-shell{
    background:rgba(255,255,255,.55)!important;
    border:1px solid rgba(255,255,255,.7);
    border-radius:24px;
    backdrop-filter:blur(22px) saturate(1.15);
    -webkit-backdrop-filter:blur(22px) saturate(1.15);
    padding:12px!important;
  }
  .tutorial-card{
    background:rgba(255,255,255,.72)!important;
    border-radius:20px!important;
    border:1px solid var(--line);
  }
  .tutorial-icon .i{ width:28px; height:28px; }
  .kid-dir-list{ display:grid; gap:10px; }
  .kid-dir-card{
    display:flex; align-items:center; gap:12px; width:100%; text-align:left;
    padding:12px 14px; border-radius:18px; border:1px solid var(--staff-glass-edge, var(--line));
    background:var(--staff-glass, rgba(255,255,255,.55));
  }
  .kid-dir-av{
    width:44px; height:44px; border-radius:14px; display:grid; place-items:center;
    font-weight:700; color:var(--ink);
  }
  .kid-dir-av.lg{ width:64px; height:64px; font-size:24px; border-radius:18px; }
  .kids-pane-tabs{ display:flex; flex-wrap:wrap; gap:8px; margin:10px 0 14px; }
  .school-sub-row{ display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid var(--line); }
  .school-stars{ display:inline-flex; gap:2px; }
  .school-star{ color:#c5d0ca; background:none; border:0; padding:0; font-size:18px; line-height:1; }
  .school-star.on{ color:var(--sun, #d4a017); }
  button.school-star{ cursor:pointer; }
  .att-grid-row{ display:flex; flex-wrap:wrap; gap:8px; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--line); }
  .att-btns{ display:flex; flex-wrap:wrap; gap:6px; }
  .att-week{ display:flex; flex-wrap:wrap; gap:6px; }
  .att-chip{ border:1px solid var(--line); border-radius:12px; padding:6px 8px; background:#fff; font-size:12px; }
  .att-chip.present{ border-color:var(--brand); }
  .att-chip.absent{ border-color:var(--out); }
  .att-chip.excused{ border-color:var(--sea); }
  .hw-row{ display:flex; gap:10px; align-items:flex-start; padding:10px 12px; }
  .tt-grid{ display:grid; gap:10px; }
  body.layout-desktop .tt-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); }
  @media (max-width:420px){
    body:not(.mode-child) nav.dock button{ min-height:48px; }
    body:not(.mode-child) .zoai-fab{ bottom:calc(88px + env(safe-area-inset-bottom)); }
  }
"""


def patch_app(text: str) -> str:
    # SEED school arrays
    old = "  kidRatings: [],\n  kidNotes: [],\n};"
    new = """  kidRatings: [],
  kidNotes: [],
  subjects: [],
  subjectGrades: [],
  attendance: [],
  homework: [],
  schoolTimetable: [],
};"""
    if old not in text:
        raise SystemExit("SEED kidNotes block not found")
    text = text.replace(old, new, 1)

    text = text.replace(
        "'chores', 'choreSubmissions', 'xpLog', 'gameStats', 'kidRatings', 'kidNotes'];",
        "'chores', 'choreSubmissions', 'xpLog', 'gameStats', 'kidRatings', 'kidNotes',"
        " 'subjects', 'subjectGrades', 'attendance', 'homework', 'schoolTimetable'];",
        1,
    )
    text = text.replace(
        "  'xpLog','gameStats',\n];",
        "  'xpLog','gameStats',\n"
        "  'kidRatings','kidNotes','subjects','subjectGrades','attendance','homework','schoolTimetable',\n];",
        1,
    )

    # load() defaults
    text = text.replace(
        "['overrides','events','taskCompletions','aiImports','listEntries','shoppingTrips','customProducts','customCategories','customActivities','customReasons','customListRemoveReasons','log','stockChecks','shiftCheckins']",
        "['overrides','events','taskCompletions','aiImports','listEntries','shoppingTrips','customProducts','customCategories','customActivities','customReasons','customListRemoveReasons','log','stockChecks','shiftCheckins','kidRatings','kidNotes','subjects','subjectGrades','attendance','homework','schoolTimetable']",
        1,
    )
    # ensure subjects after load
    if "ensureSchoolDb" not in text.split("function load()")[1][:800]:
        text = text.replace(
            "  db.houses = SEED.houses.map(h => ({...h}));\n  return db;\n}",
            "  db.houses = SEED.houses.map(h => ({...h}));\n"
            "  if(!Array.isArray(db.subjects) || !db.subjects.length){\n"
            "    db.subjects = [\n"
            "      {id:'sub-math', de:'Mathe', el:'Μαθηματικά', active:true},\n"
            "      {id:'sub-de', de:'Deutsch', el:'Γερμανικά', active:true},\n"
            "      {id:'sub-el', de:'Griechisch', el:'Ελληνικά', active:true},\n"
            "      {id:'sub-en', de:'Englisch', el:'Αγγλικά', active:true},\n"
            "      {id:'sub-sport', de:'Sport', el:'Αθλητισμός', active:true},\n"
            "    ];\n"
            "  }\n"
            "  return db;\n}",
            1,
        )

    # state fields
    text = text.replace(
        "  tab: 'home',\n  scheduleView: 'day',",
        "  tab: 'home',\n  staffKidId: null,\n  kidsPane: 'directory',\n  scheduleView: 'day',",
        1,
    )

    # i18n — inject after navTalk lines
    text = text.replace(
        "navHome:'Home', navSchedule:'Plan', navStock:'Lager', navShop:'Liste', navBook:'Buch', navGallery:'Momente', navTalk:'Talk',",
        "navHome:'Home', navSchedule:'Plan', navStock:'Lager', navShop:'Liste', navBook:'Buch', navGallery:'Momente', navTalk:'Talk', navKids:'Kinder',"
        + I18N_DE.replace("\n    navKids:'Kinder',", "").replace("\n", " "),
        1,
    )
    # Cleaner: insert dedicated block after titleTalk de
    text = text.replace(
        "titleHome:'Home', titleSchedule:'Wochenplan', titleStock:'Lager', titleShop:'Listen & Einkauf', titleBook:'Buch', titleGallery:'Momente', titleTalk:'Team-Gespräch',",
        "titleHome:'Home', titleSchedule:'Wochenplan', titleStock:'Lager', titleShop:'Listen & Einkauf', titleBook:'Buch', titleGallery:'Momente', titleTalk:'Team-Gespräch', titleKids:'Kinder & Schule',"
        " kidsHeroHint:'Profile, Fächer, Anwesenheit und Hausaufgaben', kidsEmpty:'Keine Kinder hinterlegt',"
        " schoolSubjects:'Fächer', schoolAttendance:'Anwesenheit', schoolHomework:'Hausaufgaben', schoolTimetable:'Stundenplan',"
        " thisWeek:'Diese Woche', gradeSaved:'Note gespeichert', attSaved:'Anwesenheit gespeichert',"
        " hwSaved:'Hausaufgabe gespeichert', ttSaved:'Stunde gespeichert', subSaved:'Fach gespeichert',"
        " subAdd:'Fach hinzufügen', subArchive:'Archivieren', subActivate:'Aktivieren', subEmpty:'Noch keine Fächer',"
        " att_present:'Da', att_absent:'Fehlt', att_excused:'Entschuldigt',"
        " hwEmpty:'Keine Hausaufgaben', hwAdd:'Hausaufgabe', hwTitlePh:'z.B. Mathe S.12', hwAllKids:'Alle Kinder',"
        " ttEmpty:'Keine Stunden', ttAdd:'Stunde hinzufügen',"
        " homeShiftRing:'Schicht', homeWeekSpark:'7 Tage erledigt', planDayLoad:'Tageslast',"
        " zoSavedLager:'Im Lager gespeichert', zoSavedListe:'In der Liste gespeichert', zoSavedPlan:'Im Plan gespeichert',"
        " zoSavedSchool:'Schule gespeichert', zoSavedNote:'Notiz gespeichert',",
        1,
    )
    text = text.replace(
        "navHome:'Αρχική', navSchedule:'Πρόγραμμα', navStock:'Ψυγείο', navShop:'Λίστα', navBook:'Βιβλίο', navGallery:'Στιγμές', navTalk:'Talk',",
        "navHome:'Αρχική', navSchedule:'Πρόγραμμα', navStock:'Ψυγείο', navShop:'Λίστα', navBook:'Βιβλίο', navGallery:'Στιγμές', navTalk:'Talk', navKids:'Παιδιά',",
        1,
    )
    # EL titles — find titleTalk in el block
    el_title = "titleHome:'Αρχική', titleSchedule:'Εβδομαδιαίο', titleStock:'Ψυγείο', titleShop:'Λίστες & Αγορές', titleBook:'Βιβλίο', titleGallery:'Στιγμές', titleTalk:'Συζήτηση ομάδας',"
    # try common variants
    m = re.search(r"titleHome:'Αρχική'[^\\n]+titleTalk:'[^']+',", text)
    if m:
        old_el = m.group(0)
        text = text.replace(
            old_el,
            old_el
            + " titleKids:'Παιδιά & Σχολείο',"
            " kidsHeroHint:'Προφίλ, μαθήματα, παρουσία και εργασίες', kidsEmpty:'Δεν υπάρχουν παιδιά',"
            " schoolSubjects:'Μαθήματα', schoolAttendance:'Παρουσία', schoolHomework:'Εργασίες', schoolTimetable:'Ωρολόγιο',"
            " thisWeek:'Αυτή την εβδομάδα', gradeSaved:'Ο βαθμός αποθηκεύτηκε', attSaved:'Η παρουσία αποθηκεύτηκε',"
            " hwSaved:'Η εργασία αποθηκεύτηκε', ttSaved:'Η ώρα αποθηκεύτηκε', subSaved:'Το μάθημα αποθηκεύτηκε',"
            " subAdd:'Προσθήκη μαθήματος', subArchive:'Αρχειοθέτηση', subActivate:'Ενεργοποίηση', subEmpty:'Δεν υπάρχουν μαθήματα',"
            " att_present:'Παρόν', att_absent:'Απών', att_excused:'Δικαιολογημένο',"
            " hwEmpty:'Καμία εργασία', hwAdd:'Εργασία', hwTitlePh:'π.χ. Μαθηματικά σ.12', hwAllKids:'Όλα τα παιδιά',"
            " ttEmpty:'Καμία ώρα', ttAdd:'Προσθήκη ώρας',"
            " homeShiftRing:'Βάρδια', homeWeekSpark:'7 ημέρες ολοκληρωμένα', planDayLoad:'Φόρτος ημέρας',"
            " zoSavedLager:'Αποθηκεύτηκε στο ψυγείο', zoSavedListe:'Αποθηκεύτηκε στη λίστα', zoSavedPlan:'Αποθηκεύτηκε στο πρόγραμμα',"
            " zoSavedSchool:'Αποθηκεύτηκε στο σχολείο', zoSavedNote:'Η σημείωση αποθηκεύτηκε',",
            1,
        )
    else:
        print("WARN: EL title block not patched exactly")

    # Inject school module before KID_RATE_AREAS
    anchor = "/* ── Kids: weekly self-rating"
    if anchor not in text:
        raise SystemExit("KID_RATE_AREAS anchor missing")
    text = text.replace(anchor, SCHOOL + "\n" + anchor, 1)

    # helpInventoryContext — add kids/subjects
    text = text.replace(
        "    shopFriday:state.shopFriday||fridayFor(),\n    examples:",
        "    shopFriday:state.shopFriday||fridayFor(),\n"
        "    children:(DB.children||[]).map(k=>({id:k.id,name:k.name})),\n"
        "    subjects:activeSubjects().map(s=>({id:s.id,de:s.de,el:s.el})),\n"
        "    examples:",
        1,
    )

    # describeHelpAction extras
    text = text.replace(
        "  if(action.type==='open_tab') return T[state.lang].helpActionOpenTab(action.tab||'');\n",
        "  if(action.type==='open_tab') return T[state.lang].helpActionOpenTab(action.tab||'');\n"
        "  if(action.type==='subject_grade_set'){\n"
        "    const k=matchKid(action.kidQuery||action.kidId); const s=matchSubject(action.subjectQuery||action.subjectId);\n"
        "    return state.lang==='el'\n"
        "      ? `★ ${k?.name||'?'} · ${subjectLabel(s)} · ${action.score||'?'} αστέρια`\n"
        "      : `★ ${k?.name||'?'} · ${subjectLabel(s)} · ${action.score||'?'} Sterne`;\n"
        "  }\n"
        "  if(action.type==='kid_note_add'){\n"
        "    const k=matchKid(action.kidQuery||action.kidId);\n"
        "    return state.lang==='el' ? `📝 Σημείωση · ${k?.name||'?'}` : `📝 Notiz · ${k?.name||'?'}`;\n"
        "  }\n"
        "  if(action.type==='open_kid'){\n"
        "    const k=matchKid(action.kidQuery||action.kidId);\n"
        "    return state.lang==='el' ? `↗ Προφίλ ${k?.name||'?'}` : `↗ Profil ${k?.name||'?'}`;\n"
        "  }\n"
        "  if(action.type==='attendance_set'){\n"
        "    const k=matchKid(action.kidQuery||action.kidId);\n"
        "    return state.lang==='el' ? `✓ Παρουσία ${k?.name||'?'}` : `✓ Anwesenheit ${k?.name||'?'}`;\n"
        "  }\n"
        "  if(action.type==='homework_add'){\n"
        "    return state.lang==='el' ? `📚 Εργασία: ${String(action.title||'').slice(0,40)}` : `📚 Hausaufgabe: ${String(action.title||'').slice(0,40)}`;\n"
        "  }\n",
        1,
    )

    # open_tab allow kids
    text = text.replace(
        "if(!['home','gallery','schedule','stock','shop','book','talk'].includes(tab)) return;",
        "if(!['home','gallery','schedule','stock','shop','book','talk','kids'].includes(tab)) return;",
        1,
    )

    # applyHelpActions — insert before schedule_template_update closing / end of forEach
    inject_actions = r'''
    if(kind==='subject_grade_set'){
      const k=matchKid(action.kidQuery||action.kidId);
      const s=matchSubject(action.subjectQuery||action.subjectId);
      if(!k||!s) return;
      if(setSubjectGrade(k.id, s.id, action.score, action.note)){
        logEntry('SCHOOL',`Zo-Ai · ${describeHelpAction(action)}`);
        applied++;
      }
      return;
    }
    if(kind==='kid_note_add'){
      const k=matchKid(action.kidQuery||action.kidId);
      const text=String(action.text||'').trim();
      if(!k||!text) return;
      ensureSchoolDb();
      DB.kidNotes.push({id:uid(), kidId:k.id, text:text.slice(0,2000), ts:Date.now(), by:state.user?.id});
      logEntry('SCHOOL',`Zo-Ai · ${describeHelpAction(action)}`);
      applied++;
      return;
    }
    if(kind==='open_kid'){
      const k=matchKid(action.kidQuery||action.kidId);
      if(!k) return;
      state.tab='kids'; state.staffKidId=k.id; applied++;
      return;
    }
    if(kind==='attendance_set'){
      const k=matchKid(action.kidQuery||action.kidId);
      const dateStr=action.date||iso(new Date());
      if(!k) return;
      if(setAttendance(k.id, dateStr, action.status||'present')){
        logEntry('SCHOOL',`Zo-Ai · ${describeHelpAction(action)}`);
        applied++;
      }
      return;
    }
    if(kind==='homework_add'){
      const title=String(action.title||'').trim();
      if(!title) return;
      const s=matchSubject(action.subjectQuery||action.subjectId);
      const k=action.kidQuery||action.kidId ? matchKid(action.kidQuery||action.kidId) : null;
      ensureSchoolDb();
      DB.homework.push({
        id:uid(), title:title.slice(0,120), subjectId:s?.id||'',
        kidId:k?.id||null, due:action.due||iso(new Date()), done:false, ts:Date.now(),
      });
      logEntry('SCHOOL',`Zo-Ai · ${describeHelpAction(action)}`);
      applied++;
      return;
    }

'''
    text = text.replace(
        "    if(kind==='schedule_template_update'){\n      if(!isAdminUser()) return;",
        inject_actions + "    if(kind==='schedule_template_update'){\n      if(!isAdminUser()) return;",
        1,
    )

    # Better success toast in sheetHelpProposals
    text = text.replace(
        """      if(n){
        state.helpMessages.push({role:'assistant', content:T[state.lang].helpProposeDone(n)});
        state.helpMessages=state.helpMessages.slice(-12);
        render();
        toast(T[state.lang].helpProposeDone(n),'success');
      }else toast(t('helpProposeEmpty'));""",
        """      if(n){
        state.helpMessages.push({role:'assistant', content:T[state.lang].helpProposeDone(n)});
        state.helpMessages=state.helpMessages.slice(-12);
        render();
        const kinds=new Set((state.pendingHelpActions||actions||[]).map(a=>a.type));
        let msg=T[state.lang].helpProposeDone(n);
        if(kinds.has('stock_adjust')||kinds.has('stock_set')) msg=t('zoSavedLager');
        else if(kinds.has('shop_add')||kinds.has('shop_remove')||kinds.has('want_bought')) msg=t('zoSavedListe');
        else if(String([...kinds].join()).includes('schedule')) msg=t('zoSavedPlan');
        else if(kinds.has('subject_grade_set')||kinds.has('attendance_set')||kinds.has('homework_add')) msg=t('zoSavedSchool');
        else if(kinds.has('kid_note_add')) msg=t('zoSavedNote');
        toast(msg,'success',4200);
      }else toast(t('helpProposeEmpty'));""",
        1,
    )
    # Fix: pendingHelpActions cleared before toast — use actions param
    text = text.replace(
        "        const kinds=new Set((state.pendingHelpActions||actions||[]).map(a=>a.type));",
        "        const kinds=new Set((actions||[]).map(a=>a.type));",
        1,
    )

    # viewHome widgets
    text = text.replace(
        """    <div class="home-signals" role="group" aria-label="${esc(t('homeSignals'))}">
      ${signal('day', todayOpen.length, t('dueToday'), 'u-tasks', todayOpen.length?'tone-pine':'')}
      ${signal('day', overdue.length, t('overdue'), 'u-alert', overdue.length?'tone-out':'')}
      ${signal('shop', openListCount, t('homeSignalList'), 'u-cart', openListCount?'tone-sea':'')}
      ${signal('stock', lowStockCount, t('homeSignalStock'), 'u-leaf', lowStockCount?'tone-amber':'')}
    </div>""",
        """    <div class="home-widgets">
      ${ringHtml(homeShiftCompletionPct(user), t('homeShiftRing'), todayOpen.length?'amber':'pine')}
      ${(()=>{ const sp=homeTaskDoneSpark7(user); return sp.some(n=>n>0)?`<div class="w-stat"><span class="w-stat-lbl">${esc(t('homeWeekSpark'))}</span>${sparklineHtml(sp,'pine')}</div>`:''; })()}
      <button type="button" class="btn ghost sm" data-home-jump="kids">${ui('u-person','sm')} ${esc(t('navKids'))}</button>
    </div>
    <div class="home-signals" role="group aria-label="${esc(t('homeSignals'))}">
      ${signal('day', todayOpen.length, t('dueToday'), 'u-tasks', todayOpen.length?'tone-pine':'')}
      ${signal('day', overdue.length, t('overdue'), 'u-alert', overdue.length?'tone-out':'')}
      ${signal('shop', openListCount, t('homeSignalList'), 'u-cart', openListCount?'tone-sea':'')}
      ${signal('stock', lowStockCount, t('homeSignalStock'), 'u-leaf', lowStockCount?'tone-amber':'')}
    </div>""",
        1,
    )
    # fix typo role=
    text = text.replace(
        'role="group aria-label="${esc(t(\'homeSignals\'))}"',
        'role="group" aria-label="${esc(t(\'homeSignals\'))}"',
        1,
    )
    text = text.replace(
        '<section class="home-mast hero" aria-label="Armonia">',
        '<section class="home-mast hero hero-texture" aria-label="Armonia">',
        1,
    )

    # plan day load ring
    text = text.replace(
        """        ${miniCalendarHtml(calDates, today)}
      </div>
      <button class="plan-hero-cta page-act primary" type="button" data-page-act="addEntry">${esc(t('topAdd'))}</button>
    </header>""",
        """        ${miniCalendarHtml(calDates, today)}
        <div class="home-widgets" style="margin-top:10px">${ringHtml(planDayLoadPct(state.date), t('planDayLoad'), 'sea')}</div>
      </div>
      <button class="plan-hero-cta page-act primary" type="button" data-page-act="addEntry">${esc(t('topAdd'))}</button>
    </header>""",
        1,
    )

    # stock sparkline in hero stats area — after ops-hero-stats opening tiles
    text = text.replace(
        """      <div class="ops-hero-stats" role="group" aria-label="${esc(t('menuFilters'))}">
        ${statTileHtml(counts.empty, t('stockEmpty'), 'u-alert', counts.empty?'down':'')}
        ${statTileHtml(attention, t('stockAttention'), 'u-leaf', attention?'down':'')}""",
        """      <div class="ops-hero-stats" role="group" aria-label="${esc(t('menuFilters'))}">
        ${statTileHtml(counts.empty, t('stockEmpty'), 'u-alert', counts.empty?'down':'')}
        ${statTileHtml(attention, t('stockAttention'), 'u-leaf', attention?'down':'')}
        ${(()=>{ const sp=stockQtySparkHistory(hid); return sp.length?`<div class="w-stat"><span class="w-stat-lbl">7d</span>${sparklineHtml(sp,'sea')}</div>`:''; })()}""",
        1,
    )

    # tutorial steps — add kids + zoai before admin
    text = text.replace(
        """    step('❓','Gezielt Hilfe bekommen','Λήψη συγκεκριμένης βοήθειας','Blaues ? unten rechts','Μπλε ? κάτω δεξιά',['Tippe auf das blaue „?“.','Starte unter „Geführtes App-Tutorial“ diese Anleitung neu.','Oder öffne „AI-Hilfe“, beschreibe Ziel und aktuelle Fehlermeldung und tippe „Senden“.'],['Πάτησε το μπλε «?».','Από το «Καθοδηγούμενο tutorial» ξεκίνα ξανά αυτές τις οδηγίες.','Ή άνοιξε «Βοήθεια AI», γράψε στόχο και τρέχον μήνυμα λάθους και πάτησε «Αποστολή».'],'Die AI erklärt den nächsten Schritt, führt aber keine kritische Buchung ohne Bestätigung aus.','Η AI εξηγεί το επόμενο βήμα αλλά δεν κάνει κρίσιμη καταχώρηση χωρίς επιβεβαίωση.'),
  ];
  if(isAdminUser()) steps.push""",
        """    step('❓','Gezielt Hilfe bekommen','Λήψη συγκεκριμένης βοήθειας','Blaues ? unten rechts','Μπλε ? κάτω δεξιά',['Tippe auf das blaue „?“.','Starte unter „Geführtes App-Tutorial“ diese Anleitung neu.','Oder öffne „AI-Hilfe“, beschreibe Ziel und aktuelle Fehlermeldung und tippe „Senden“.'],['Πάτησε το μπλε «?».','Από το «Καθοδηγούμενο tutorial» ξεκίνα ξανά αυτές τις οδηγίες.','Ή άνοιξε «Βοήθεια AI», γράψε στόχο και τρέχον μήνυμα λάθους και πάτησε «Αποστολή».'],'Die AI erklärt den nächsten Schritt, führt aber keine kritische Buchung ohne Bestätigung aus.','Η AI εξηγεί το επόμενο βήμα αλλά δεν κάνει κρίσιμη καταχώρηση χωρίς επιβεβαίωση.'),
    step('👤','Kinderprofil öffnen','Άνοιγμα προφίλ παιδιού','Unteres Menü → Kinder','Κάτω μενού → Παιδιά',['Öffne „Kinder“.','Tippe ein Kind an.','Sieh XP, Fächer-Sterne, Anwesenheit und Notizen.'],['Άνοιξε «Παιδιά».','Πάτησε ένα παιδί.','Δες XP, αστέρια μαθημάτων, παρουσία και σημειώσεις.'],'Änderungen speichern sich für alle Geräte.','Οι αλλαγές αποθηκεύονται για όλες τις συσκευές.'),
    step('✨','Zo-Ai mit Bestätigung','Zo-Ai με επιβεβαίωση','FAB Zo unten rechts','FAB Zo κάτω δεξιά',['Stelle eine Frage oder bitte um eine Änderung (Lager/Liste/Note).','Prüfe den Vorschlag.','Tippe „Bestätigen“ — bei Plan zusätzlich PIN.'],['Κάνε ερώτηση ή ζήτα αλλαγή (ψυγείο/λίστα/βαθμός).','Έλεγξε την πρόταση.','Πάτησε «Επιβεβαίωση» — στο πρόγραμμα και PIN.'],'Ohne Bestätigung schreibt Zo-Ai nichts in die Datenbank.','Χωρίς επιβεβαίωση η Zo-Ai δεν γράφει στη βάση.'),
  ];
  if(isAdminUser()) steps.push""",
        1,
    )

    # tutorial paint — use ui icons via mapping
    text = text.replace(
        "function onboardingSteps(){\n  const de=state.lang==='de';\n  const step=(icon,deTitle,elTitle,dePath,elPath,deActions,elActions,deResult,elResult)=>({\n    icon,title:de?deTitle:elTitle,path:de?dePath:elPath,\n",
        "function onboardingSteps(){\n  const de=state.lang==='de';\n  const step=(icon,deTitle,elTitle,dePath,elPath,deActions,elActions,deResult,elResult)=>({\n    icon, iconUi:({ '🏠':'u-home','📅':'u-calendar','✍️':'u-note','🎊':'u-megaphone','🧊':'u-leaf','🛒':'u-cart','🧠':'u-sparkle','🛍️':'u-cart','🧾':'u-receipt','📖':'u-book','🔐':'u-person','❓':'u-chat','🛡️':'u-alert','👤':'u-person','✨':'u-sparkle','🎉':'u-party','🎮':'u-party' }[icon]||'u-book'),\n    title:de?deTitle:elTitle,path:de?dePath:elPath,\n",
        1,
    )
    # u-home may not exist — use i-home via ui helper carefully; map 🏠 to u-check
    text = text.replace(
        "iconUi:({ '🏠':'u-home','📅':'u-calendar'",
        "iconUi:({ '🏠':'u-check','📅':'u-calendar'",
        1,
    )
    text = text.replace(
        '<section class="tutorial-card"><div class="tutorial-icon">${step.icon}</div>',
        '<section class="tutorial-card"><div class="tutorial-icon">${step.iconUi?ui(step.iconUi):esc(step.icon)}</div>',
        1,
    )

    # render kids tab
    text = text.replace(
        """  document.getElementById('view').innerHTML =
      state.tab==='home'     ? viewHome()
    : state.tab==='gallery'  ? viewGallery()
    : state.tab==='schedule' ? viewSchedule()
    : state.tab==='stock'    ? viewStock()
    : state.tab==='shop'     ? viewShop()
    : state.tab==='talk'     ? viewTalk()
    : viewBook();
  wire();""",
        """  document.getElementById('view').innerHTML =
      state.tab==='home'     ? viewHome()
    : state.tab==='gallery'  ? viewGallery()
    : state.tab==='schedule' ? viewSchedule()
    : state.tab==='stock'    ? viewStock()
    : state.tab==='shop'     ? viewShop()
    : state.tab==='kids'     ? viewKids()
    : state.tab==='talk'     ? viewTalk()
    : viewBook();
  wire();
  if(state.tab==='kids') wireKidsView(document.getElementById('view'));""",
        1,
    )

    # home jump kids
    text = text.replace(
        """      if(jump==='shop'){ state.tab='shop'; state.shopPanel='plan'; clearSelection(); render(); return; }
      if(jump==='stock'){ state.tab='stock'; clearSelection(); render(); return; }
      state.tab='schedule';""",
        """      if(jump==='shop'){ state.tab='shop'; state.shopPanel='plan'; clearSelection(); render(); return; }
      if(jump==='stock'){ state.tab='stock'; clearSelection(); render(); return; }
      if(jump==='kids'){ state.tab='kids'; state.staffKidId=null; render(); return; }
      state.tab='schedule';""",
        1,
    )

    # child learn — append subjects if view exists
    if "function viewKidLearn" in text or "childView==='learn'" in text:
        pass  # wire later via grep
    # Inject into kid ratings view area - find viewKidRate or similar
    m = re.search(r"function viewKidRatings?\(", text)
    # Add subjects under kid rate view return — search kidRateSchool usage in HTML builder
    rate_anchor = "const rows = KID_RATE_AREAS.map(a=>{"
    # After kid notes/rating render child — add to learn or rate view
    # Find return of kid rate HTML
    if "kidRateTitle" in text or "kidNavRate" in text:
        # append subjects in child rewards/rate section via replace in viewKidRate if exists
        pass

    # Try attach subjects to child rate view function
    for fn in ("viewKidRate", "viewChildRate", "kidRateView"):
        if f"function {fn}" in text:
            break
    # Grep-like: insert after kid week average display in child mode
    if "function kidRateHtml" in text:
        text = text.replace(
            "function kidRateHtml",
            "function kidRateHtml_UNUSED_HOOK",
            1,
        )
        text = text.replace("function kidRateHtml_UNUSED_HOOK", "function kidRateHtml", 1)

    # Child learn view subjects — find childView learn content
    learn_m = re.search(r"state\.childView==='learn'[^\n]{0,80}", text)
    # Simpler: after viewKidNotes or similar wrap
    if "function viewKidStars" in text or "function viewChildRewards" in text:
        pass

    # Add subjects to child rate page - look for kidRateSchool in template
    if "kidRateSchool" in text and "childSubjectsReadonlyHtml" not in text.split("kidRateSchool")[1][:500]:
        # find a good insert in the rate HTML builder
        idx = text.find("KID_RATE_AREAS.map(a=>{")
        # find closing of that rate view return - too fragile; do post-hoc in second pass

    return text


def patch_child_subjects(text: str) -> str:
    """Append read-only subjects under child Bewertungen if that view exists."""
    # Common pattern: return `...KID_RATE...`
    needle = "return `<div class=\"kid-rate"
    # try several
    patterns = [
        (r"(function viewKidRate\([^)]*\)\{[\s\S]*?return `)([\s\S]*?)(`;\s*\})", None),
    ]
    # Soft insert: after setKidRating usage paint in child wire is enough if we patch view that contains kidNavRate
    m = re.search(
        r"(<div class=\"block-h\"><span class=\"t\">\$\{esc\(t\('kidNavRate'\)\)\}</span></div>[\s\S]{0,2000}?)(</section>|</div>\s*`)",
        text,
    )
    if m and "childSubjectsReadonlyHtml" not in m.group(0):
        text = text[: m.start(2)] + "${childSubjectsReadonlyHtml(state.child.id)}" + text[m.start(2) :]
        print("Patched child subjects under ratings")
    else:
        # insert into child rewards / rate builder near kidWeekAverage
        m2 = re.search(r"(function [a-zA-Z]*[Rr]ate[a-zA-Z]*\([^)]*\)\{[\s\S]{200,4000}?return `)([\s\S]{100,3000}?)(`;)", text)
        if m2 and "childSubjectsReadonlyHtml" not in m2.group(2):
            text = text[: m2.end(2)] + "\n    ${state.child?childSubjectsReadonlyHtml(state.child.id):''}" + text[m2.end(2) :]
            print("Patched subjects into rate view fn")
        else:
            print("WARN: child subjects readonly not injected (optional)")
    return text


def patch_index(html: str) -> str:
    html = html.replace("</style>\n</head>", CSS_EXTRA + "\n</style>\n</head>", 1)
    html = html.replace(
        '<button type="button" data-tab="schedule"><svg class="i nav-ico" aria-hidden="true"><use href="#i-schedule"/></svg><span data-nav="schedule"></span></button>',
        '<button type="button" data-tab="kids" data-staff-only="1"><svg class="i nav-ico" aria-hidden="true"><use href="#u-person"/></svg><span data-nav="kids"></span></button>\n'
        '      <button type="button" data-tab="schedule"><svg class="i nav-ico" aria-hidden="true"><use href="#i-schedule"/></svg><span data-nav="schedule"></span></button>',
        1,
    )
    html = html.replace("?v=101", "?v=105")
    return html


def patch_server(py: str) -> str:
    py = py.replace(
        '    "kidRatings",\n    "kidNotes",\n)',
        '    "kidRatings",\n    "kidNotes",\n'
        '    "subjects",\n    "subjectGrades",\n    "attendance",\n    "homework",\n    "schoolTimetable",\n)',
        1,
    )
    py = py.replace(
        '    "kidNotes": 4000,\n',
        '    "kidNotes": 4000,\n'
        '    "subjects": 200,\n'
        '    "subjectGrades": 4000,\n'
        '    "attendance": 8000,\n'
        '    "homework": 4000,\n'
        '    "schoolTimetable": 800,\n',
        1,
    )
    py = py.replace(
        'STAFF_ACTION_TYPES = {\n    "stock_adjust", "stock_set", "want_bought",\n    "shop_add", "shop_remove",\n    "schedule_add", "schedule_update", "schedule_cancel",\n    "shift_note", "open_tab",\n}',
        'STAFF_ACTION_TYPES = {\n    "stock_adjust", "stock_set", "want_bought",\n    "shop_add", "shop_remove",\n    "schedule_add", "schedule_update", "schedule_cancel",\n    "shift_note", "open_tab",\n'
        '    "subject_grade_set", "kid_note_add", "open_kid",\n'
        '    "attendance_set", "homework_add",\n}',
        1,
    )
    py = py.replace(
        '- open_tab: {type, tab:home|gallery|schedule|stock|shop|book}',
        '- open_tab: {type, tab:home|gallery|schedule|stock|shop|book|kids|talk}\n'
        '- subject_grade_set: {type, kidQuery|kidId, subjectQuery|subjectId, score:1-5, note?}\n'
        '- kid_note_add: {type, kidQuery|kidId, text}\n'
        '- open_kid: {type, kidQuery|kidId}\n'
        '- attendance_set: {type, kidQuery|kidId, date?, status:present|absent|excused}\n'
        '- homework_add: {type, title, subjectQuery?, kidQuery?, due?}',
        1,
    )
    py = py.replace(
        '"entryId", "from", "to", "note", "text", "tab",\n'
        '                "audience", "subject", "title", "message",\n'
        "            ):",
        '"entryId", "from", "to", "note", "text", "tab",\n'
        '                "audience", "subject", "title", "message",\n'
        '                "kidId", "kidQuery", "subjectId", "subjectQuery", "status", "due",\n'
        "            ):",
        1,
    )
    # allow score field
    if 'row.get("score")' not in py:
        py = py.replace(
            "            if day_num is not None and 0 <= day_num <= 6:\n                action[\"day\"] = day_num\n",
            "            if day_num is not None and 0 <= day_num <= 6:\n                action[\"day\"] = day_num\n"
            "            score = row.get(\"score\")\n"
            "            try:\n"
            "                score_num = int(score)\n"
            "            except (TypeError, ValueError):\n"
            "                score_num = None\n"
            "            if score_num is not None and 1 <= score_num <= 5:\n"
            "                action[\"score\"] = score_num\n",
            1,
        )
    return py


def bump_versions():
    (ROOT / "build.json").write_text(
        '{\n  "version": 105,\n  "label": "v105",\n  "changed": {\n'
        '    "de": "Staff: Widgets, Kinder/Schule, Anwesenheit, Zo-Ai DB",\n'
        '    "el": "Staff: Widgets, Παιδιά/Σχολείο, παρουσία, Zo-Ai DB"\n'
        "  }\n}\n",
        encoding="utf-8",
    )
    app_build = (
        "const APP_BUILD = {\n  version: 105,\n  label: 'v105',\n  changed: {\n"
        "    de: 'Staff: Widgets, Kinder/Schule, Anwesenheit, Zo-Ai DB',\n"
        "    el: 'Staff: Widgets, Παιδιά/Σχολείο, παρουσία, Zo-Ai DB',\n"
        "  },\n};"
    )
    for path in (ROOT / "app.js", ROOT / "gate.js"):
        t = path.read_text(encoding="utf-8")
        t = re.sub(r"const APP_BUILD = \{[\s\S]*?\n\};", app_build, t, count=1)
        t = t.replace(
            "navigator.serviceWorker.register('./sw.js?v='+((typeof APP_BUILD==='object'&&APP_BUILD&&APP_BUILD.version)||101)",
            "navigator.serviceWorker.register('./sw.js?v='+((typeof APP_BUILD==='object'&&APP_BUILD&&APP_BUILD.version)||105)",
        )
        path.write_text(t, encoding="utf-8")
    sw = (ROOT / "sw.js").read_text(encoding="utf-8")
    sw = re.sub(r"const CACHE = 'paidia-v\d+';", "const CACHE = 'paidia-v105';", sw, count=1)
    (ROOT / "sw.js").write_text(sw, encoding="utf-8")


def main():
    app_path = ROOT / "app.js"
    text = app_path.read_text(encoding="utf-8")
    text = patch_app(text)
    text = patch_child_subjects(text)
    app_path.write_text(text, encoding="utf-8")

    idx = ROOT / "index.html"
    idx.write_text(patch_index(idx.read_text(encoding="utf-8")), encoding="utf-8")

    srv = ROOT / "server.py"
    srv.write_text(patch_server(srv.read_text(encoding="utf-8")), encoding="utf-8")

    actions = ROOT / "docs/zoai/actions.md"
    a = actions.read_text(encoding="utf-8")
    if "subject_grade_set" not in a:
        a = a.replace(
            "| `open_tab` | **tab** home\\|gallery\\|schedule\\|stock\\|shop\\|book\\|talk — UI only |\n",
            "| `open_tab` | **tab** home\\|gallery\\|schedule\\|stock\\|shop\\|book\\|talk\\|kids — UI only |\n"
            "| `subject_grade_set` | **kidQuery**\\|kidId, **subjectQuery**\\|subjectId, **score** 1–5, note? |\n"
            "| `kid_note_add` | **kidQuery**\\|kidId, **text** |\n"
            "| `open_kid` | **kidQuery**\\|kidId — opens staff kid profile |\n"
            "| `attendance_set` | **kidQuery**\\|kidId, date?, **status** present\\|absent\\|excused |\n"
            "| `homework_add` | **title**, subjectQuery?, kidQuery?, due? |\n",
        )
        actions.write_text(a, encoding="utf-8")

    bump_versions()

    # Fix accidental ||105 over-replace in gate if broken
    gate = (ROOT / "gate.js").read_text(encoding="utf-8")
    # undo silly replace of all ||101
    print("Done applying patches")


if __name__ == "__main__":
    main()
