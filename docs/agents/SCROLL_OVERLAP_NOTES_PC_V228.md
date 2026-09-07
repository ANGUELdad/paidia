# Scroll collision notes — PC

Stamp: 2026-09-07T13-46-25 · Base: http://127.0.0.1:5173

## Summary
```json
{
  "surface": "pc",
  "pages": 41,
  "pageErrors": 0,
  "collisions": 389,
  "bySev": {
    "P0": 362,
    "P1": 27,
    "P2": 0
  },
  "byKind": {
    "under-fab": 15,
    "banner-stack": 12,
    "under-chrome": 230,
    "covered-point": 132
  },
  "shots": 146
}
```

## Severity rollup
- **under-chrome**: 230
- **covered-point**: 132
- **under-fab**: 15
- **banner-stack**: 12

## Top collisions (deduped)
- [P1] `admin-desk/home` @y=0 **under-fab**: control under Zo FAB (1914px²)
  - A: `BUTTON.home-rail-kid ui-fit-text` “V
Vincent”
  - B: `BUTTON.zoai-fab ui-fit-text` “Zo-Ai”
- [P1] `admin-desk/home` @y=0 **banner-stack**: 3 banners/alerts visible at once
  - A: `DIV.home-shift-step ` “Anwesenheit
Ich bin da”
  - B: `DIV.home-shift-step ` “Lagercheck Kalyvia
Check starten”
- [P0] `admin-desk/home` @y=179 **under-chrome**: control obscured by top chrome (738px²)
  - A: `BUTTON.` “”
  - B: `HEADER.app-chrome` “A
Armonia · Home
Angelos · Betreuer
ADMI”
- [P0] `admin-desk/home` @y=179 **under-chrome**: control obscured by top chrome (18979px²)
  - A: `BUTTON.home-signal home-pulse-item tone-out ui-fit-text ui-fit-tight ui-fit-w` “1
Überfällig”
  - B: `HEADER.app-chrome` “A
Armonia · Home
Angelos · Betreuer
ADMI”
- [P0] `admin-desk/home` @y=179 **covered-point**: elementFromPoint hits HEADER.app-chrome over control
  - A: `BUTTON.` “”
  - B: `HEADER.app-chrome` “A
Armonia · Home
Angelos · Betreuer
ADMI”
- [P0] `admin-desk/home` @y=358 **under-chrome**: control obscured by top chrome (3473px²)
  - A: `BUTTON.home-primary ui-fit-text` “Jetzt melden”
  - B: `HEADER.app-chrome` “A
Armonia · Home
Angelos · Betreuer
ADMI”
- [P0] `admin-desk/home` @y=358 **under-chrome**: control obscured by top chrome (3976px²)
  - A: `BUTTON.home-secondary ghost ui-fit-text ui-fit-tight ui-fit-wrap` “Buch & Schicht”
  - B: `HEADER.app-chrome` “A
Armonia · Home
Angelos · Betreuer
ADMI”
- [P0] `admin-desk/home` @y=358 **covered-point**: elementFromPoint hits DIV.topbar-row over control
  - A: `BUTTON.home-primary ui-fit-text` “Jetzt melden”
  - B: `DIV.topbar-row` “A
Armonia · Home
Angelos · Betreuer
ADMI”
- [P0] `admin-desk/home` @y=358 **covered-point**: elementFromPoint hits DIV.topbar-row over control
  - A: `BUTTON.home-secondary ghost ui-fit-text ui-fit-tight ui-fit-wrap` “Buch & Schicht”
  - B: `DIV.topbar-row` “A
Armonia · Home
Angelos · Betreuer
ADMI”
- [P0] `admin-desk/schedule` @y=499 **under-chrome**: control obscured by top chrome (212px²)
  - A: `BUTTON.btn sm sec` “‹”
  - B: `HEADER.app-chrome` “A
Plan · Woche
Angelos · Betreuer
ADMIN
”
- [P0] `admin-desk/schedule` @y=499 **under-chrome**: control obscured by top chrome (473px²)
  - A: `BUTTON.btn sm sec week-today-btn on ui-fit-text` “Diese Woche”
  - B: `HEADER.app-chrome` “A
Plan · Woche
Angelos · Betreuer
ADMIN
”
- [P0] `admin-desk/schedule` @y=499 **under-chrome**: control obscured by top chrome (6908px²)
  - A: `INPUT.week-pick` “”
  - B: `HEADER.app-chrome` “A
Plan · Woche
Angelos · Betreuer
ADMIN
”
- [P0] `admin-desk/schedule` @y=499 **under-chrome**: control obscured by top chrome (1760px²)
  - A: `BUTTON.btn sm sec` “›”
  - B: `HEADER.app-chrome` “A
Plan · Woche
Angelos · Betreuer
ADMIN
”
- [P0] `admin-desk/schedule` @y=499 **under-chrome**: control obscured by top chrome (612px²)
  - A: `BUTTON.plan-hero-cta page-act primary` “＋ Eintrag”
  - B: `HEADER.app-chrome` “A
Plan · Woche
Angelos · Betreuer
ADMIN
”
- [P0] `admin-desk/schedule` @y=499 **covered-point**: elementFromPoint hits SPAN. over control
  - A: `INPUT.week-pick` “”
  - B: `SPAN.` “Pro”
- [P0] `admin-desk/schedule` @y=499 **covered-point**: elementFromPoint hits BUTTON.topbtn ui-fit-text over control
  - A: `BUTTON.btn sm sec` “›”
  - B: `BUTTON.topbtn ui-fit-text` “DE”
- [P0] `admin-desk/schedule` @y=997 **under-chrome**: control obscured by top chrome (1646px²)
  - A: `BUTTON.matrix-fs-btn ui-fit-text` “⛶ Vollbild”
  - B: `HEADER.app-chrome` “A
Plan · Woche
Angelos · Betreuer
ADMIN
”
- [P0] `admin-desk/schedule` @y=1425 **under-chrome**: control obscured by top chrome (815px²)
  - A: `BUTTON.cellitem-x` “×”
  - B: `HEADER.app-chrome` “A
Plan · Woche
Angelos · Betreuer
ADMIN
”
- [P0] `admin-desk/stock` @y=132 **under-chrome**: control obscured by top chrome (619px²)
  - A: `BUTTON.on` “Kalyvia”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=132 **under-chrome**: control obscured by top chrome (728px²)
  - A: `BUTTON.` “Limenaria”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=132 **under-chrome**: control obscured by top chrome (765px²)
  - A: `BUTTON.` “Julian groß”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=132 **under-chrome**: control obscured by top chrome (806px²)
  - A: `BUTTON.` “Valeria+Lea”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=132 **under-chrome**: control obscured by top chrome (669px²)
  - A: `BUTTON.` “Alle Häuser”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=132 **under-chrome**: control obscured by top chrome (12515px²)
  - A: `INPUT.` “”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=132 **under-chrome**: control obscured by top chrome (5010px²)
  - A: `BUTTON.btn stock-primary-action stock-quick-add-btn pine-settle ui-fit-text u` “Hinzufügen”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=132 **covered-point**: elementFromPoint hits DIV.who over control
  - A: `INPUT.` “”
  - B: `DIV.who` “Angelos · Betreuer
ADMIN”
- [P0] `admin-desk/stock` @y=132 **covered-point**: elementFromPoint hits DIV.topbar-core over control
  - A: `BUTTON.btn stock-primary-action stock-quick-add-btn pine-settle ui-fit-text u` “Hinzufügen”
  - B: `DIV.topbar-core` “Einfach
Pro
🔔
5
DE
A”
- [P0] `admin-desk/stock` @y=263 **under-chrome**: control obscured by top chrome (232px²)
  - A: `BUTTON.stock-more-action ui-fit-text ui-fit-tight ui-fit-wrap` “”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=263 **under-chrome**: control obscured by top chrome (9064px²)
  - A: `BUTTON.stock-more-action ui-fit-text ui-fit-tight ui-fit-wrap` “”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=263 **under-chrome**: control obscured by top chrome (4712px²)
  - A: `BUTTON.stock-more-action ui-fit-text ui-fit-tight ui-fit-wrap` “”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=263 **covered-point**: elementFromPoint hits BUTTON.topbtn topbtn-bell ui-fit-text over control
  - A: `BUTTON.stock-more-action ui-fit-text ui-fit-tight ui-fit-wrap` “”
  - B: `BUTTON.topbtn topbtn-bell ui-fit-text` “🔔
5”
- [P0] `admin-desk/stock` @y=263 **covered-point**: elementFromPoint hits HEADER.app-chrome over control
  - A: `BUTTON.stock-more-action ui-fit-text ui-fit-tight ui-fit-wrap` “”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=376 **under-chrome**: control obscured by top chrome (10194px²)
  - A: `BUTTON.on ui-fit-text` “0
Achtung
0 Leer · 0 Wenig”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=376 **under-chrome**: control obscured by top chrome (10194px²)
  - A: `BUTTON.ui-fit-text` “0
Leer
Leer”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=376 **under-chrome**: control obscured by top chrome (10195px²)
  - A: `BUTTON.pro-only mode-pro-block ui-fit-text` “62
Regale
Regale nach Kategorie”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=376 **under-chrome**: control obscured by top chrome (1938px²)
  - A: `BUTTON.btn sm ui-fit-text` “Ich bin da”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=376 **covered-point**: elementFromPoint hits HEADER.app-chrome over control
  - A: `BUTTON.on ui-fit-text` “0
Achtung
0 Leer · 0 Wenig”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=376 **covered-point**: elementFromPoint hits HEADER.app-chrome over control
  - A: `BUTTON.ui-fit-text` “0
Leer
Leer”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=376 **covered-point**: elementFromPoint hits HEADER.app-chrome over control
  - A: `BUTTON.pro-only mode-pro-block ui-fit-text` “62
Regale
Regale nach Kategorie”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/stock` @y=376 **covered-point**: elementFromPoint hits HEADER.app-chrome over control
  - A: `BUTTON.btn sm ui-fit-text` “Ich bin da”
  - B: `HEADER.app-chrome` “A
Lager · Kalyvia
Angelos · Betreuer
ADM”
- [P0] `admin-desk/shop` @y=81 **under-chrome**: control obscured by top chrome (880px²)
  - A: `BUTTON.` “”
  - B: `HEADER.app-chrome` “A
Einkauf · Kalyvia
Angelos · Betreuer
A”
- [P0] `admin-desk/shop` @y=81 **covered-point**: elementFromPoint hits HEADER.app-chrome over control
  - A: `BUTTON.` “”
  - B: `HEADER.app-chrome` “A
Einkauf · Kalyvia
Angelos · Betreuer
A”
- [P1] `admin-desk/book` @y=0 **under-fab**: control under Zo FAB (1320px²)
  - A: `BUTTON.btn shift-check-open-btn ui-fit-text` “Jetzt prüfen”
  - B: `BUTTON.zoai-fab ui-fit-text` “Zo-Ai”
- [P0] `admin-desk/book` @y=267 **under-chrome**: control obscured by top chrome (886px²)
  - A: `BUTTON.book-pane-btn on ui-fit-text` “Übergabe”
  - B: `HEADER.app-chrome` “A
Buch & Schicht
Angelos · Betreuer
ADMI”
- [P0] `admin-desk/book` @y=267 **under-chrome**: control obscured by top chrome (718px²)
  - A: `BUTTON.book-pane-btn pro-only mode-pro-block ui-fit-text` “Verlauf”
  - B: `HEADER.app-chrome` “A
Buch & Schicht
Angelos · Betreuer
ADMI”
- [P0] `admin-desk/book` @y=267 **under-chrome**: control obscured by top chrome (844px²)
  - A: `BUTTON.book-pane-btn pro-only mode-pro-block ui-fit-text` “Personen”
  - B: `HEADER.app-chrome` “A
Buch & Schicht
Angelos · Betreuer
ADMI”
- [P0] `admin-desk/book` @y=533 **under-chrome**: control obscured by top chrome (18027px²)
  - A: `BUTTON.btn sm sec ui-fit-text` “Verstanden”
  - B: `HEADER.app-chrome` “A
Buch & Schicht
Angelos · Betreuer
ADMI”
- [P1] `admin-desk/book` @y=533 **under-fab**: control under Zo FAB (1586px²)
  - A: `BUTTON.book-secondary-toggle handoff-more-toggle ui-fit-text` “Mehr Abschnitte”
  - B: `BUTTON.zoai-fab ui-fit-text` “Zo-Ai”
- [P0] `admin-desk/talk` @y=75 **under-chrome**: control obscured by top chrome (846px²)
  - A: `BUTTON.` “”
  - B: `HEADER.app-chrome` “A
Team-Gespräch
Angelos · Betreuer
ADMIN”
- [P0] `admin-desk/talk` @y=75 **covered-point**: elementFromPoint hits HEADER.app-chrome over control
  - A: `BUTTON.` “”
  - B: `HEADER.app-chrome` “A
Team-Gespräch
Angelos · Betreuer
ADMIN”
- [P0] `admin-desk/kids` @y=222 **under-chrome**: control obscured by top chrome (1147px²)
  - A: `BUTTON.btn ui-fit-text ui-fit-tight ui-fit-wrap` “Kind hinzufügen”
  - B: `HEADER.app-chrome` “A
Kinder & Schule
Angelos · Betreuer
ADM”
- [P0] `admin-desk/kids` @y=443 **under-chrome**: control obscured by top chrome (47740px²)
  - A: `BUTTON.kid-dir-card pine-settle ui-fit-text` “K
Kai
·
—
Notenschnitt
—
Anwesenheit
0
H”
  - B: `HEADER.app-chrome` “A
Kinder & Schule
Angelos · Betreuer
ADM”
- [P0] `admin-desk/kids` @y=443 **under-chrome**: control obscured by top chrome (4048px²)
  - A: `BUTTON.btn sm sec ui-fit-text` “Kind bearbeiten”
  - B: `HEADER.app-chrome` “A
Kinder & Schule
Angelos · Betreuer
ADM”
- [P0] `admin-desk/kids` @y=443 **under-chrome**: control obscured by top chrome (2070px²)
  - A: `BUTTON.btn sm ghost kid-dir-remove ui-fit-text` “Kind entfernen”
  - B: `HEADER.app-chrome` “A
Kinder & Schule
Angelos · Betreuer
ADM”
- [P0] `admin-desk/kids` @y=443 **covered-point**: elementFromPoint hits DIV.who over control
  - A: `BUTTON.kid-dir-card pine-settle ui-fit-text` “K
Kai
·
—
Notenschnitt
—
Anwesenheit
0
H”
  - B: `DIV.who` “Angelos · Betreuer
ADMIN”
- [P0] `admin-desk/kids` @y=443 **covered-point**: elementFromPoint hits BUTTON.ui-mode-btn over control
  - A: `BUTTON.btn sm sec ui-fit-text` “Kind bearbeiten”
  - B: `BUTTON.ui-mode-btn` “Einfach”
- [P0] `admin-desk/kids` @y=443 **covered-point**: elementFromPoint hits HEADER.app-chrome over control
  - A: `BUTTON.btn sm ghost kid-dir-remove ui-fit-text` “Kind entfernen”
  - B: `HEADER.app-chrome` “A
Kinder & Schule
Angelos · Betreuer
ADM”
- [P0] `admin-desk/kids` @y=633 **under-chrome**: control obscured by top chrome (49415px²)
  - A: `BUTTON.kid-dir-card pine-settle ui-fit-text` “J
Julian klein
·
—
Notenschnitt
—
Anwese”
  - B: `HEADER.app-chrome` “A
Kinder & Schule
Angelos · Betreuer
ADM”
- [P0] `admin-desk/kids` @y=633 **covered-point**: elementFromPoint hits DIV.who over control
  - A: `BUTTON.kid-dir-card pine-settle ui-fit-text` “J
Julian klein
·
—
Notenschnitt
—
Anwese”
  - B: `DIV.who` “Angelos · Betreuer
ADMIN”
- [P0] `admin-desk/pocket` @y=434 **under-chrome**: control obscured by top chrome (1770px²)
  - A: `BUTTON.cal-cell ui-fit-text` “28”
  - B: `HEADER.app-chrome` “A
Taschengeld
Angelos · Betreuer
ADMIN
E”
- [P0] `admin-desk/pocket` @y=434 **under-chrome**: control obscured by top chrome (1771px²)
  - A: `BUTTON.cal-cell ui-fit-text` “29”
  - B: `HEADER.app-chrome` “A
Taschengeld
Angelos · Betreuer
ADMIN
E”
- [P0] `admin-desk/pocket` @y=434 **under-chrome**: control obscured by top chrome (1771px²)
  - A: `BUTTON.cal-cell ui-fit-text` “30”
  - B: `HEADER.app-chrome` “A
Taschengeld
Angelos · Betreuer
ADMIN
E”
- [P0] `admin-desk/pocket` @y=434 **covered-point**: elementFromPoint hits H1. over control
  - A: `BUTTON.cal-cell ui-fit-text` “28”
  - B: `H1.` “Taschengeld”
- [P0] `admin-desk/pocket` @y=434 **covered-point**: elementFromPoint hits H1. over control
  - A: `BUTTON.cal-cell ui-fit-text` “29”
  - B: `H1.` “Taschengeld”
- [P0] `admin-desk/pocket` @y=434 **covered-point**: elementFromPoint hits BUTTON.ui-mode-btn over control
  - A: `BUTTON.cal-cell ui-fit-text` “30”
  - B: `BUTTON.ui-mode-btn` “Einfach”
- [P0] `admin-desk/pocket` @y=868 **under-chrome**: control obscured by top chrome (1724px²)
  - A: `BUTTON.pocket-preset out ui-fit-text` “−1”
  - B: `HEADER.app-chrome` “A
Taschengeld
Angelos · Betreuer
ADMIN
E”
- [P0] `admin-desk/pocket` @y=868 **under-chrome**: control obscured by top chrome (1838px²)
  - A: `BUTTON.pocket-preset out ui-fit-text` “−2”
  - B: `HEADER.app-chrome` “A
Taschengeld
Angelos · Betreuer
ADMIN
E”
- [P0] `admin-desk/pocket` @y=868 **under-chrome**: control obscured by top chrome (1836px²)
  - A: `BUTTON.pocket-preset out ui-fit-text` “−5”
  - B: `HEADER.app-chrome` “A
Taschengeld
Angelos · Betreuer
ADMIN
E”
- [P0] `admin-desk/pocket` @y=868 **under-chrome**: control obscured by top chrome (2134px²)
  - A: `BUTTON.pocket-preset out ui-fit-text` “−10”
  - B: `HEADER.app-chrome` “A
Taschengeld
Angelos · Betreuer
ADMIN
E”
- [P0] `admin-desk/pocket` @y=868 **under-chrome**: control obscured by top chrome (2249px²)
  - A: `BUTTON.pocket-preset out ui-fit-text` “−20”
  - B: `HEADER.app-chrome` “A
Taschengeld
Angelos · Betreuer
ADMIN
E”
- [P0] `admin-desk/pocket` @y=868 **under-chrome**: control obscured by top chrome (2246px²)
  - A: `BUTTON.pocket-preset out ui-fit-text` “−50”
  - B: `HEADER.app-chrome` “A
Taschengeld
Angelos · Betreuer
ADMIN
E”
- [P0] `admin-desk/pocket` @y=868 **covered-point**: elementFromPoint hits H1. over control
  - A: `BUTTON.pocket-preset out ui-fit-text` “−1”
  - B: `H1.` “Taschengeld”
- [P0] `admin-desk/pocket` @y=868 **covered-point**: elementFromPoint hits H1. over control
  - A: `BUTTON.pocket-preset out ui-fit-text` “−2”
  - B: `H1.` “Taschengeld”
- [P0] `admin-desk/pocket` @y=868 **covered-point**: elementFromPoint hits H1. over control
  - A: `BUTTON.pocket-preset out ui-fit-text` “−5”
  - B: `H1.` “Taschengeld”
- [P0] `admin-desk/pocket` @y=868 **covered-point**: elementFromPoint hits H1. over control
  - A: `BUTTON.pocket-preset out ui-fit-text` “−10”
  - B: `H1.` “Taschengeld”
- [P0] `admin-desk/pocket` @y=868 **covered-point**: elementFromPoint hits H1. over control
  - A: `BUTTON.pocket-preset out ui-fit-text` “−20”
  - B: `H1.` “Taschengeld”
- [P0] `admin-desk/pocket` @y=868 **covered-point**: elementFromPoint hits H1. over control
  - A: `BUTTON.pocket-preset out ui-fit-text` “−50”
  - B: `H1.` “Taschengeld”
- [P0] `admin-desk/pocket` @y=1240 **under-chrome**: control obscured by top chrome (13678px²)
  - A: `BUTTON.pocket-kid-card on` “S
Simon
0,21 €”
  - B: `HEADER.app-chrome` “A
Taschengeld
Angelos · Betreuer
ADMIN
E”
- [P0] `admin-desk/pocket` @y=1240 **under-chrome**: control obscured by top chrome (740px²)
  - A: `BUTTON.btn ghost sm pocket-txn-del` “×”
  - B: `HEADER.app-chrome` “A
Taschengeld
Angelos · Betreuer
ADMIN
E”
- [P0] `admin-desk/pocket` @y=1240 **covered-point**: elementFromPoint hits SPAN.admin-badge over control
  - A: `BUTTON.pocket-kid-card on` “S
Simon
0,21 €”
  - B: `SPAN.admin-badge` “ADMIN”

## Pages with most hits
- **stock**: 44
- **pocket**: 42
- **kid-today**: 34
- **home**: 31
- **kid-notes**: 31
- **kid-games**: 29
- **admin**: 27
- **schedule**: 22
- **schedule-week**: 22
- **kid-stars**: 21
- **kid-rate**: 18
- **kids**: 17
- **book**: 12
- **talk**: 12
- **admin-ops**: 10
- **shop**: 8
- **kid-bonus**: 4
- **kid-gallery**: 3
- **admin-review**: 1
- **admin-finance**: 1