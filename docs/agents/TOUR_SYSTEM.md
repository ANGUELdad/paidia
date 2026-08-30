# Spotlight tour system (QA map)

Real-app coach-marks — **not** a Next/Next sheet carousel. Dim overlay + hole over a live `data-tour` target; tooltip DE/EL; advance by tapping the highlight **or** **Got it** (navigates to the next page’s first highlight). Skip always available; resume from saved index.

## Entry points

| Trigger | Function | Notes |
|---------|----------|--------|
| First login | `ensureOnboarding` → `openMandatoryTutorial` | Resumes unfinished `tourSeen` |
| Hilfe / ? | `sheetHelpCenter` → `#helpTutorial` → `openAppTutorial` | Fresh start (`resume:false`) |
| Kids “So geht’s” | `sheetChildHowTo` → `#childHowToTour` | Same as replay |
| Profile / top tutorial | `onTopAction('tutorial')` / `data-page-act="tutorial"` | `openAppTutorial` |

Core: `buildTourSteps`, `tourPaintCurrent`, `tourAdvance`, `tourFinish` in `app.js`. Overlay host `#tourRoot`.

## Persistence

| Key | Where | Shape |
|-----|--------|--------|
| `paidia.tourSeen:{profileId}:{mode}:3` | localStorage | `{version:3, mode, index, done, skipped, density, at}` |
| `paidia-onboarding:{profileId}:{mode}:3` | localStorage | `'1'` when finished (same as prior onboarding) |
| `profilePrefs._tourSeen[profileId]` | ops / Easy staff | Mirror of tourSeen when Easy |
| Server | `ONBOARDING_VERSION = 3` | `/api/auth/onboarding/complete` |

`TOUR_VERSION` / client `state.onboardingVersion` = **3**.

Related: lightweight **page tips** (not tour) — [TIPS_SYSTEM.md](TIPS_SYSTEM.md). Zo-Ai capability tips stay on the FAB sibling.

## Easy vs Pro

- **Easy:** shorter path — one (or few) highlights per major page; `proOnly` steps skipped.
- **Pro:** adds Kids, Gallery, Buch (staff) and Mehr hint (kids).

Density is read from `isEasy()` / `isPro()` at tour start.

## Staff pages (targets)

| Step id | `data-tour` | Navigates to |
|---------|-------------|--------------|
| `staff-home` | `home-main` | `tab=home` |
| `staff-plan` | `plan-views` | `tab=schedule` |
| `staff-stock` | `stock-command` | `tab=stock` |
| `staff-shop` | `shop-command` | `tab=shop` |
| `staff-talk` | `talk-chat` | `tab=talk` |
| `staff-kids` *(Pro)* | `kids-main` | `tab=kids` |
| `staff-gallery` *(Pro)* | `gallery-main` | `tab=gallery` |
| `staff-book` *(Pro)* | `book-main` | `tab=book` |
| `staff-zoai` | `nav-zoai` | `tab=home` (no auto-open chat) |

Dock anchors (also available): `nav-home`, `nav-schedule`, `nav-stock`, `nav-shop`, `nav-talk`, `nav-kids`, `nav-gallery`, `nav-book`, `nav-zoai` (`#dockZoAi` + `#navChat`).

## Kids pages (targets)

| Step id | `data-tour` | Navigates to |
|---------|-------------|--------------|
| `kid-start` | `kid-start` | `childView=today` |
| `kid-nav-games` | `kid-nav-games` | `games` |
| `kid-games` | `kid-games` | `games` |
| `kid-nav-rate` | `kid-nav-rate` | `rate` |
| `kid-rate` | `kid-rate` | `rate` |
| `kid-bonus` | `kid-bonus` | `bonus` |
| `kid-notes` | `kid-notes` | `notes` |
| `kid-nav-more` *(Pro)* | `kid-nav-more` | stays / hint |
| `kid-zoai` | `nav-zoai` | `today` |

Dock: `kid-nav-today|games|rate|bonus|notes|more`.

## QA checklist

1. Staff Easy login → spotlight on Home → Got it walks Plan → Lager → Liste → Talk → Zo-Ai → done.
2. Staff Pro → also Kids, Momente, Buch.
3. Tap highlighted control advances (nav targets may click through).
4. Skip marks complete locally + syncs onboarding v3; does not re-trap next login.
5. Kill mid-tour → next login resumes index.
6. Kids path: Start → Spiele → Bewertungen → Bonus → Notizen → Zo-Ai.
7. Lang DE/EL on card; Easy shorter than Pro.
8. Existing dock nav still works with tour closed (`body.tour-open` absent).

## CSS

`index.html`: `.tour-root`, `.tour-hole`, `.tour-hit`, `.tour-card`, `.tour-target-live`. Prefer `prefers-reduced-motion`.
