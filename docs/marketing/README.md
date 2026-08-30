# Marketing screenshots

Product UI captures for Armonia Thassos (staff + kids), plus the earlier gate / role screens.

Profile names were replaced with **Demo** in logged-in shots. Captured from a **local** `python3 server.py` instance with an isolated SQLite + seed auth (gitignored under `docs/marketing/.local-auth/`). No PINs or passwords are stored in this folder or in filenames.

## Gate (pre-login)

| File | Viewport | Screen |
|------|----------|--------|
| `screenshots/web-login.png` | 1440×900 @2x | Role chooser (Personal / Kinder) |
| `screenshots/web-staff.png` | 1440×900 @2x | Staff profile picker (names redacted) |
| `screenshots/web-kids.png` | 1440×900 @2x | Kids profile picker (names redacted) |
| `screenshots/mobile-login.png` | 390×844 @3x | Role chooser |
| `screenshots/mobile-staff.png` | 390×844 @3x | Staff profile picker (names redacted) |
| `screenshots/mobile-kids.png` | 390×844 @3x | Kids profile picker (names redacted) |

## Staff (logged-in)

| File | Viewport | Screen |
|------|----------|--------|
| `screenshots/web-staff-home.png` | 1440×900 @2x | Home |
| `screenshots/web-staff-plan-week.png` | 1440×900 @2x | Plan · Woche |
| `screenshots/web-staff-plan-day.png` | 1440×900 @2x | Plan · Tag |
| `screenshots/web-staff-plan-shift.png` | 1440×900 @2x | Plan · Schicht |
| `screenshots/web-staff-plan-events.png` | 1440×900 @2x | Plan · Events |
| `screenshots/web-staff-plan-calendar.png` | 1440×900 @2x | Plan · Kalender |
| `screenshots/web-staff-lager.png` | 1440×900 @2x | Lager |
| `screenshots/web-staff-liste-plan.png` | 1440×900 @2x | Liste · Plan |
| `screenshots/web-staff-liste-requests.png` | 1440×900 @2x | Liste · Αιτήματα / Anfragen |
| `screenshots/web-staff-talk.png` | 1440×900 @2x | Talk |
| `screenshots/web-staff-zoai.png` | 1440×900 @2x | Zo-Ai panel open |
| `screenshots/web-staff-buch.png` | 1440×900 @2x | Buch / Übergabe |
| `screenshots/web-staff-galerie.png` | 1440×900 @2x | Galerie / Momente |
| `screenshots/web-staff-kids.png` | 1440×900 @2x | Kids (staff view) |
| `screenshots/web-staff-profile.png` | 1440×900 @2x | Profile sheet |
| `screenshots/web-staff-easy-pro.png` | 1440×900 @2x | Home with Easy/Pro chrome |
| `screenshots/mobile-staff-home.png` | 390×844 @3x | Home |
| `screenshots/mobile-staff-plan-week.png` | 390×844 @3x | Plan · Woche |
| `screenshots/mobile-staff-plan-day.png` | 390×844 @3x | Plan · Tag |
| `screenshots/mobile-staff-plan-shift.png` | 390×844 @3x | Plan · Schicht |
| `screenshots/mobile-staff-plan-events.png` | 390×844 @3x | Plan · Events |
| `screenshots/mobile-staff-plan-calendar.png` | 390×844 @3x | Plan · Kalender |
| `screenshots/mobile-staff-lager.png` | 390×844 @3x | Lager |
| `screenshots/mobile-staff-liste-plan.png` | 390×844 @3x | Liste · Plan |
| `screenshots/mobile-staff-liste-requests.png` | 390×844 @3x | Liste · Anfragen |
| `screenshots/mobile-staff-talk.png` | 390×844 @3x | Talk |
| `screenshots/mobile-staff-zoai.png` | 390×844 @3x | Zo-Ai panel open |
| `screenshots/mobile-staff-buch.png` | 390×844 @3x | Buch |
| `screenshots/mobile-staff-galerie.png` | 390×844 @3x | Galerie / Momente |
| `screenshots/mobile-staff-kids.png` | 390×844 @3x | Kids (staff view) |
| `screenshots/mobile-staff-profile.png` | 390×844 @3x | Profile |
| `screenshots/mobile-staff-easy-pro.png` | 390×844 @3x | Home Easy/Pro chrome |

## Kids (logged-in)

| File | Viewport | Screen |
|------|----------|--------|
| `screenshots/web-kid-start.png` | 1440×900 @2x | Start / Αρχική |
| `screenshots/web-kid-spiele.png` | 1440×900 @2x | Spiele hub |
| `screenshots/web-kid-spiele-game.png` | 1440×900 @2x | Spiele · one game frame |
| `screenshots/web-kid-bewertungen.png` | 1440×900 @2x | Bewertungen |
| `screenshots/web-kid-bonus.png` | 1440×900 @2x | Bonus |
| `screenshots/web-kid-notizen.png` | 1440×900 @2x | Notizen |
| `screenshots/web-kid-mehr.png` | 1440×900 @2x | Mehr sheet |
| `screenshots/web-kid-plan.png` | 1440×900 @2x | Mehr → Plan |
| `screenshots/web-kid-lernen.png` | 1440×900 @2x | Mehr → Lernen |
| `screenshots/mobile-kid-start.png` | 390×844 @3x | Start |
| `screenshots/mobile-kid-spiele.png` | 390×844 @3x | Spiele hub |
| `screenshots/mobile-kid-spiele-game.png` | 390×844 @3x | Spiele · game frame |
| `screenshots/mobile-kid-bewertungen.png` | 390×844 @3x | Bewertungen |
| `screenshots/mobile-kid-bonus.png` | 390×844 @3x | Bonus |
| `screenshots/mobile-kid-notizen.png` | 390×844 @3x | Notizen |
| `screenshots/mobile-kid-mehr.png` | 390×844 @3x | Mehr sheet |
| `screenshots/mobile-kid-plan.png` | 390×844 @3x | Mehr → Plan |
| `screenshots/mobile-kid-lernen.png` | 390×844 @3x | Mehr → Lernen |

## Meta

- **Source:** local `http://127.0.0.1:5173` (isolated marketing DB; not production)
- **Captured:** 2026-08-30
- **Build:** v149 (`build.json` — “Mitteilungen: Plattform-Matrix + VAPID-Subscribe”)
- **Locale:** Deutsch
- **Tool:** Playwright Chromium (headless), deviceScaleFactor 2 (web) / 3 (mobile)
- **Count:** 56 PNGs under `screenshots/` (6 gate + 50 product)

Also fixed a syntax error in `app.js` (`registerPaidiaServiceWorker` missing `)`) that blocked app boot after login — required for these captures.
