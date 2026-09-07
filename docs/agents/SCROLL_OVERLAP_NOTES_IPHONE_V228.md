# Scroll collision notes — IPHONE

Stamp: 2026-09-07T13-46-24 · Base: http://127.0.0.1:5173

## Summary
```json
{
  "surface": "iphone",
  "pages": 41,
  "pageErrors": 0,
  "collisions": 567,
  "bySev": {
    "P0": 546,
    "P1": 21,
    "P2": 0
  },
  "byKind": {
    "banner-stack": 12,
    "under-dock": 124,
    "under-chrome": 235,
    "covered-point": 160,
    "fixed-collide": 27,
    "under-fab": 9
  },
  "shots": 143
}
```

## Severity rollup
- **under-chrome**: 235
- **covered-point**: 160
- **under-dock**: 124
- **fixed-collide**: 27
- **banner-stack**: 12
- **under-fab**: 9

## Top collisions (deduped)
- [P1] `admin-m/home` @y=0 **banner-stack**: 3 banners/alerts visible at once
  - A: `DIV.home-shift-step ` “Anwesenheit
Ich bin da”
  - B: `DIV.home-shift-step ` “Lagercheck Kalyvia
Check starten”
- [P0] `admin-m/home` @y=167 **under-dock**: control obscured by dock (2645px²)
  - A: `BUTTON.ui-fit-text` “Zum Plan”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/home` @y=167 **under-dock**: control obscured by dock (2875px²)
  - A: `BUTTON.ui-fit-text ui-fit-tight ui-fit-wrap` “Buch & Schicht”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/home` @y=167 **under-dock**: control obscured by dock (2645px²)
  - A: `BUTTON.ui-fit-text` “Kinder”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/home` @y=477 **under-chrome**: control obscured by top chrome (4500px²)
  - A: `BUTTON.home-shift-step-cta primary ui-fit-text` “Ich bin da”
  - B: `HEADER.app-chrome` “A
Home

🔔
5
DE

A”
- [P0] `admin-m/home` @y=477 **under-dock**: control obscured by dock (23104px²)
  - A: `BUTTON.page-act ghost ui-fit-text` “”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/home` @y=477 **covered-point**: elementFromPoint hits DIV.topbar-core over control
  - A: `BUTTON.home-shift-step-cta primary ui-fit-text` “Ich bin da”
  - B: `DIV.topbar-core` “🔔
5
DE

A”
- [P0] `admin-m/home` @y=477 **covered-point**: elementFromPoint hits BUTTON. over control
  - A: `BUTTON.page-act ghost ui-fit-text` “”
  - B: `BUTTON.` “Lager”
- [P0] `admin-m/schedule` @y=0 **under-dock**: control obscured by dock (2888px²)
  - A: `BUTTON.btn sec week-ai-clear ui-fit-text` “Zo-Ai-Einträge leeren”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/schedule` @y=0 **under-dock**: control obscured by dock (17328px²)
  - A: `BUTTON.btn sm sec pro-only mode-pro-block ui-fit-text` “Woche importieren”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/schedule` @y=0 **covered-point**: elementFromPoint hits BUTTON. over control
  - A: `BUTTON.btn sm sec pro-only mode-pro-block ui-fit-text` “Woche importieren”
  - B: `BUTTON.` “Lager”
- [P0] `admin-m/schedule` @y=1719 **under-chrome**: control obscured by top chrome (475px²)
  - A: `BUTTON.` “Tag”
  - B: `HEADER.app-chrome` “A
Plan

🔔
5
DE

A”
- [P0] `admin-m/schedule` @y=1719 **under-chrome**: control obscured by top chrome (475px²)
  - A: `BUTTON.on` “Woche”
  - B: `HEADER.app-chrome` “A
Plan

🔔
5
DE

A”
- [P0] `admin-m/schedule` @y=1719 **under-chrome**: control obscured by top chrome (475px²)
  - A: `BUTTON.` “Kal”
  - B: `HEADER.app-chrome` “A
Plan

🔔
5
DE

A”
- [P0] `admin-m/schedule` @y=1719 **under-chrome**: control obscured by top chrome (240px²)
  - A: `BUTTON.planner-more-toggle pro-only mode-pro-block` “···”
  - B: `HEADER.app-chrome` “A
Plan

🔔
5
DE

A”
- [P0] `admin-m/schedule` @y=1719 **under-chrome**: control obscured by top chrome (1071px²)
  - A: `BUTTON.week-agenda-head ui-fit-text` “Dienstag
8.9.2026
3”
  - B: `HEADER.app-chrome` “A
Plan

🔔
5
DE

A”
- [P0] `admin-m/schedule` @y=1719 **under-chrome**: control obscured by top chrome (1470px²)
  - A: `BUTTON.agenda-entry-main ui-fit-text` “👩‍🍳 Kochkurs
Löhri · Kalyvia · Julian ”
  - B: `HEADER.app-chrome` “A
Plan

🔔
5
DE

A”
- [P0] `admin-m/schedule` @y=1719 **under-dock**: control obscured by dock (7105px²)
  - A: `BUTTON.agenda-entry-main ui-fit-text` “🍪 Backen
Dora · Kombiniert
Plätzchen ba”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/schedule` @y=1719 **under-dock**: control obscured by dock (770px²)
  - A: `BUTTON.agenda-entry-remove` “×”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/schedule` @y=1719 **under-dock**: control obscured by dock (8575px²)
  - A: `BUTTON.agenda-entry-main ui-fit-text` “🧸 Spielen
Karin · Kombiniert · Vincent
”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/schedule` @y=1719 **covered-point**: elementFromPoint hits NAV.dock over control
  - A: `BUTTON.agenda-entry-main ui-fit-text` “🧸 Spielen
Karin · Kombiniert · Vincent
”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/schedule` @y=1719 **covered-point**: elementFromPoint hits NAV.dock over control
  - A: `BUTTON.agenda-entry-remove` “×”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/schedule` @y=3438 **under-chrome**: control obscured by top chrome (6403px²)
  - A: `BUTTON.schedule-agenda-empty compact ui-fit-text` “＋
Noch nichts geplant”
  - B: `HEADER.app-chrome` “A
Plan

🔔
5
DE

A”
- [P0] `admin-m/schedule` @y=3438 **under-dock**: control obscured by dock (8088px²)
  - A: `BUTTON.schedule-agenda-empty compact ui-fit-text` “＋
Noch nichts geplant”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/schedule` @y=3438 **under-dock**: control obscured by dock (3126px²)
  - A: `BUTTON.week-agenda-add ui-fit-text` “+ Eintrag”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/schedule` @y=3438 **under-dock**: control obscured by dock (3126px²)
  - A: `BUTTON.week-open-day` “Tag öffnen”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/stock` @y=0 **under-dock**: control obscured by dock (2581px²)
  - A: `BUTTON.btn sm ui-fit-text` “Ich bin da”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/stock` @y=781 **under-chrome**: control obscured by top chrome (1236px²)
  - A: `BUTTON.stock-more-action ui-fit-text ui-fit-tight ui-fit-wrap` “”
  - B: `HEADER.app-chrome` “A
Lager

🔔
5
DE

A”
- [P0] `admin-m/stock` @y=781 **under-chrome**: control obscured by top chrome (3017px²)
  - A: `BUTTON.btn sm ui-fit-text` “Ich bin da”
  - B: `HEADER.app-chrome` “A
Lager

🔔
5
DE

A”
- [P0] `admin-m/shop` @y=157 **under-dock**: control obscured by dock (14542px²)
  - A: `BUTTON.btn ui-fit-text` “Erstes Produkt hinzufügen”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/shop` @y=157 **under-dock**: control obscured by dock (3546px²)
  - A: `BUTTON.btn sec ui-fit-text` “🪄 Liste einlesen”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/shop` @y=157 **covered-point**: elementFromPoint hits BUTTON. over control
  - A: `BUTTON.btn ui-fit-text` “Erstes Produkt hinzufügen”
  - B: `BUTTON.` “Lager”
- [P0] `admin-m/shop` @y=314 **under-chrome**: control obscured by top chrome (272px²)
  - A: `BUTTON.on` “Kalyvia”
  - B: `HEADER.app-chrome` “A
Liste

🔔
5
DE

A”
- [P0] `admin-m/shop` @y=314 **under-chrome**: control obscured by top chrome (318px²)
  - A: `BUTTON.` “Limenaria”
  - B: `HEADER.app-chrome` “A
Liste

🔔
5
DE

A”
- [P0] `admin-m/shop` @y=314 **under-chrome**: control obscured by top chrome (334px²)
  - A: `BUTTON.` “Julian groß”
  - B: `HEADER.app-chrome` “A
Liste

🔔
5
DE

A”
- [P0] `admin-m/shop` @y=314 **under-chrome**: control obscured by top chrome (1760px²)
  - A: `BUTTON.` “‹”
  - B: `HEADER.app-chrome` “A
Liste

🔔
5
DE

A”
- [P0] `admin-m/shop` @y=314 **under-chrome**: control obscured by top chrome (1760px²)
  - A: `BUTTON.` “›”
  - B: `HEADER.app-chrome` “A
Liste

🔔
5
DE

A”
- [P0] `admin-m/shop` @y=314 **covered-point**: elementFromPoint hits DIV.chrome-brand grow over control
  - A: `BUTTON.` “‹”
  - B: `DIV.chrome-brand grow` “A
Liste”
- [P0] `admin-m/shop` @y=314 **covered-point**: elementFromPoint hits SPAN.top-avatar over control
  - A: `BUTTON.` “›”
  - B: `SPAN.top-avatar` “A”
- [P0] `admin-m/shop` @y=449 **under-chrome**: control obscured by top chrome (9272px²)
  - A: `BUTTON.shop-more-action ui-fit-text` “”
  - B: `HEADER.app-chrome` “A
Liste

🔔
5
DE

A”
- [P0] `admin-m/shop` @y=449 **under-chrome**: control obscured by top chrome (3660px²)
  - A: `BUTTON.shop-more-action ui-fit-text ui-fit-tight ui-fit-wrap` “”
  - B: `HEADER.app-chrome` “A
Liste

🔔
5
DE

A”
- [P0] `admin-m/shop` @y=449 **under-chrome**: control obscured by top chrome (9137px²)
  - A: `BUTTON.btn sec sm ui-fit-text ui-fit-tight ui-fit-wrap` “Fehlendes aus Lager”
  - B: `HEADER.app-chrome` “A
Liste

🔔
5
DE

A”
- [P0] `admin-m/shop` @y=449 **under-chrome**: control obscured by top chrome (6366px²)
  - A: `BUTTON.btn sm sec ui-fit-text ui-fit-tight ui-fit-wrap` “Foto → Liste”
  - B: `HEADER.app-chrome` “A
Liste

🔔
5
DE

A”
- [P0] `admin-m/shop` @y=449 **covered-point**: elementFromPoint hits BUTTON.topbtn topbtn-bell ui-fit-text ui-fit-ti over control
  - A: `BUTTON.shop-more-action ui-fit-text` “”
  - B: `BUTTON.topbtn topbtn-bell ui-fit-text ui-fit-tight ui-fit-wrap` “🔔
5”
- [P0] `admin-m/shop` @y=449 **covered-point**: elementFromPoint hits H1. over control
  - A: `BUTTON.btn sec sm ui-fit-text ui-fit-tight ui-fit-wrap` “Fehlendes aus Lager”
  - B: `H1.` “Liste”
- [P0] `admin-m/shop` @y=449 **covered-point**: elementFromPoint hits BUTTON.topbtn ui-fit-text over control
  - A: `BUTTON.btn sm sec ui-fit-text ui-fit-tight ui-fit-wrap` “Foto → Liste”
  - B: `BUTTON.topbtn ui-fit-text` “DE”
- [P0] `admin-m/book` @y=242 **under-dock**: control obscured by dock (13020px²)
  - A: `BUTTON.book-secondary-toggle handoff-more-toggle ui-fit-text` “Mehr Abschnitte”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/book` @y=242 **covered-point**: elementFromPoint hits BUTTON. over control
  - A: `BUTTON.book-secondary-toggle handoff-more-toggle ui-fit-text` “Mehr Abschnitte”
  - B: `BUTTON.` “Liste”
- [P0] `admin-m/talk` @y=0 **under-dock**: control obscured by dock (1936px²)
  - A: `BUTTON.chat-mic` “●”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/talk` @y=0 **under-dock**: control obscured by dock (3937px²)
  - A: `BUTTON.btn ui-fit-text` “Senden”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/talk` @y=0 **covered-point**: elementFromPoint hits BUTTON. over control
  - A: `BUTTON.chat-mic` “●”
  - B: `BUTTON.` “Liste”
- [P0] `admin-m/talk` @y=0 **covered-point**: elementFromPoint hits BUTTON.dock-more on over control
  - A: `BUTTON.btn ui-fit-text` “Senden”
  - B: `BUTTON.dock-more on` “···
Mehr”
- [P0] `admin-m/kids` @y=0 **under-dock**: control obscured by dock (14726px²)
  - A: `BUTTON.kid-dir-card pine-settle ui-fit-text` “J
Julian klein
·
—
Notenschnitt
0
Hausau”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/kids` @y=0 **covered-point**: elementFromPoint hits NAV.dock over control
  - A: `BUTTON.kid-dir-card pine-settle ui-fit-text` “J
Julian klein
·
—
Notenschnitt
0
Hausau”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/kids` @y=547 **under-chrome**: control obscured by top chrome (3341px²)
  - A: `BUTTON.kid-dir-card pine-settle ui-fit-text` “K
Kai
·
—
Notenschnitt
0
Hausaufgaben
—
”
  - B: `HEADER.app-chrome` “A
Kinder

🔔
5
DE

A”
- [P0] `admin-m/kids` @y=547 **under-chrome**: control obscured by top chrome (7402px²)
  - A: `BUTTON.btn sm sec ui-fit-text` “Kind bearbeiten”
  - B: `HEADER.app-chrome` “A
Kinder

🔔
5
DE

A”
- [P0] `admin-m/kids` @y=547 **under-chrome**: control obscured by top chrome (7402px²)
  - A: `BUTTON.btn sm ghost kid-dir-remove ui-fit-text` “Kind entfernen”
  - B: `HEADER.app-chrome` “A
Kinder

🔔
5
DE

A”
- [P0] `admin-m/kids` @y=547 **under-dock**: control obscured by dock (8472px²)
  - A: `BUTTON.btn sm sec ui-fit-text` “Kind bearbeiten”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/kids` @y=547 **under-dock**: control obscured by dock (8472px²)
  - A: `BUTTON.btn sm ghost kid-dir-remove ui-fit-text` “Kind entfernen”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/kids` @y=547 **covered-point**: elementFromPoint hits DIV.chrome-brand grow over control
  - A: `BUTTON.btn sm sec ui-fit-text` “Kind bearbeiten”
  - B: `DIV.chrome-brand grow` “A
Kinder”
- [P0] `admin-m/kids` @y=547 **covered-point**: elementFromPoint hits BUTTON.topbtn ui-fit-text over control
  - A: `BUTTON.btn sm ghost kid-dir-remove ui-fit-text` “Kind entfernen”
  - B: `BUTTON.topbtn ui-fit-text` “DE”
- [P0] `admin-m/kids` @y=547 **covered-point**: elementFromPoint hits svg.[object SVGAnimatedString] over control
  - A: `BUTTON.btn sm sec ui-fit-text` “Kind bearbeiten”
  - B: `svg.[object SVGAnimatedString]` “”
- [P0] `admin-m/kids` @y=547 **covered-point**: elementFromPoint hits SPAN.nav-ico dock-more-glyph over control
  - A: `BUTTON.btn sm ghost kid-dir-remove ui-fit-text` “Kind entfernen”
  - B: `SPAN.nav-ico dock-more-glyph` “···”
- [P0] `admin-m/kids` @y=1093 **under-chrome**: control obscured by top chrome (15884px²)
  - A: `BUTTON.kid-dir-card pine-settle ui-fit-text` “L
Lea
·
—
Notenschnitt
0
Hausaufgaben
—
”
  - B: `HEADER.app-chrome` “A
Kinder

🔔
5
DE

A”
- [P0] `admin-m/kids` @y=1093 **under-dock**: control obscured by dock (21299px²)
  - A: `BUTTON.kid-dir-card pine-settle ui-fit-text` “Z
Zoitsa
·
—
Notenschnitt
0
Hausaufgaben”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/kids` @y=1093 **covered-point**: elementFromPoint hits HEADER.app-chrome over control
  - A: `BUTTON.kid-dir-card pine-settle ui-fit-text` “L
Lea
·
—
Notenschnitt
0
Hausaufgaben
—
”
  - B: `HEADER.app-chrome` “A
Kinder

🔔
5
DE

A”
- [P0] `admin-m/kids` @y=1093 **covered-point**: elementFromPoint hits BUTTON. over control
  - A: `BUTTON.kid-dir-card pine-settle ui-fit-text` “Z
Zoitsa
·
—
Notenschnitt
0
Hausaufgaben”
  - B: `BUTTON.` “Lager”
- [P0] `admin-m/kids` @y=1562 **under-chrome**: control obscured by top chrome (16245px²)
  - A: `BUTTON.kid-dir-card pine-settle ui-fit-text` “S
Samantha
·
—
Notenschnitt
0
Hausaufgab”
  - B: `HEADER.app-chrome` “A
Kinder

🔔
5
DE

A”
- [P0] `admin-m/kids` @y=1562 **covered-point**: elementFromPoint hits DIV.topbar-row over control
  - A: `BUTTON.kid-dir-card pine-settle ui-fit-text` “S
Samantha
·
—
Notenschnitt
0
Hausaufgab”
  - B: `DIV.topbar-row` “A
Kinder

🔔
5
DE

A”
- [P0] `admin-m/pocket` @y=0 **under-dock**: control obscured by dock (639px²)
  - A: `BUTTON.cal-cell ui-fit-text` “14”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/pocket` @y=0 **under-dock**: control obscured by dock (639px²)
  - A: `BUTTON.cal-cell ui-fit-text` “15”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/pocket` @y=0 **under-dock**: control obscured by dock (640px²)
  - A: `BUTTON.cal-cell ui-fit-text` “16”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/pocket` @y=0 **under-dock**: control obscured by dock (639px²)
  - A: `BUTTON.cal-cell ui-fit-text` “17”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/pocket` @y=0 **under-dock**: control obscured by dock (640px²)
  - A: `BUTTON.cal-cell ui-fit-text` “18”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/pocket` @y=0 **under-dock**: control obscured by dock (639px²)
  - A: `BUTTON.cal-cell ui-fit-text` “19”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/pocket` @y=0 **under-dock**: control obscured by dock (640px²)
  - A: `BUTTON.cal-cell ui-fit-text` “20”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/pocket` @y=0 **under-dock**: control obscured by dock (2155px²)
  - A: `BUTTON.cal-cell ui-fit-text` “21”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/pocket` @y=0 **under-dock**: control obscured by dock (2155px²)
  - A: `BUTTON.cal-cell ui-fit-text` “22”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/pocket` @y=0 **under-dock**: control obscured by dock (2156px²)
  - A: `BUTTON.cal-cell ui-fit-text` “23”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”
- [P0] `admin-m/pocket` @y=0 **under-dock**: control obscured by dock (2155px²)
  - A: `BUTTON.cal-cell ui-fit-text` “24”
  - B: `NAV.dock` “Home

Plan

Lager

Liste

···
Mehr”

## Pages with most hits
- **pocket**: 128
- **schedule**: 56
- **schedule-week**: 56
- **kid-notes**: 55
- **kid-today**: 39
- **shop**: 34
- **kid-rate**: 34
- **kids**: 29
- **home**: 28
- **kid-stars**: 26
- **admin**: 16
- **kid-games**: 14
- **admin-team**: 10
- **talk**: 8
- **admin-finance**: 8
- **stock**: 6
- **kid-bonus**: 6
- **book**: 4
- **admin-school**: 3
- **admin-supplies**: 2