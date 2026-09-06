# QA notes — v185 feature pack (agents)

**Date:** 2026-09-05  
**Build:** `paidia-v185`  
**Suite:** `docs/marketing/.local-auth/qa_multi_os_stress.mjs`  
**Base:** `http://127.0.0.1:5173`

## Scope shipped

| Area | Status |
|------|--------|
| Plan month calendar Easy+Pro, titles, Heute, house filter | Done |
| Per-kid rating month calendar (staff + child) | Done |
| Child Meine Anfragen + badge | Done |
| Taschengeld / Χαρτζιλίκι (`pocketMoneyTxns`) | Done |
| Momente organize (day/week/month/category/Betreuer) | Done |
| Liste responsibility ack (start + confirm) | Done |
| Lager board (richer rows, shelf rail, scroll pane) | Done |
| Apple HIG: ≥44px taps on rating cal nav | Fixed after first suite |

## Playwright results

### Full 5-device (after tap fix)

- **P0:** 0  
- **P1:** 0  
- **P2:** 42 — Pixel Material soft floor only (`tap-below-material` 44–47), accepted from prior overhaul  

See `qa_multi_os_stress_results.json` / `QA_MULTI_OS_STRESS_REPORT.md`.

### First full run (pre-fix)

- **P0:** 0  
- **P1:** 20 — all `child/rate` small-tap-target (`‹`/`›` 38×44; day nums ~22×48)  
- **P2:** 42 — Pixel Material soft floor 44–47 (accepted pattern from prior overhaul)

### Fix applied

- Rating cal prev/next use `calPrev`/`calNext` text + `min-height/width: 44px`
- Day cells padded; `.cal-n` larger

### iPhone + Desktop subset (post-fix)

- **P0=0 P1=0 P2=0**

## Manual / agent spot checks

- Staff Easy → Plan → Kalender visible and navigable  
- Liste Plan: responsibility button required before Einkauf starten  
- Kids profile: Taschengeld ± sheet  
- Child Bonus: balance visible; Anfrage chip opens Meine Anfragen  
- Momente: org bar groups without Pro gate  
- Lager Pro: shelf rail + richer meta on rows  

## Apple HIG notes (applied)

- Tap targets ≥44pt on new controls  
- Sticky command / board pane reduces endless page scroll (Lager)  
- Progressive disclosure: week focus on rating month; calendar day → day agenda  
- Brand stays Armonia (not iOS skin)

## Follow-ups (non-blocking)

- Pixel soft-48 P2s on dock/seg chips (known)  
- Hour-grid calendar / kids editing pocket money still out of scope  
