# QA — Multi-OS stress / UI / CSS / button-fail

**At:** 2026-09-06T16:07:50.968Z
**Build:** v212
**Base:** http://127.0.0.1:5173
**Devices:** iPhone 14 Pro · iOS Safari · Pixel 7 · Android Chrome · iPad Pro 11 · iPadOS Safari · Desktop Chrome 1440×900 · Galaxy S9+ landscape · Android

**Totals:** 30 issues — P0=0 P1=0 P2=30

## Rules enforced

- Tap targets ≥44 mobile / ≥36 desktop (Pixel soft Material ideal 48 as P2)
- No horizontal overflow; dock visible; `#view` not empty
- Easy must not show `.pro-only` / Regale
- Week Agenda|Tabelle switch present; layout matches body.dataset.weekLayout
- Easy Liste: `#shopAutoFill` visible
- Easy Kids: materials/attendance/homework/activity chips; no timetable/subjects leak
- Kids `#kids/materials` pane stickiness (no Easy normalize reset)
- Button probe: no pageerror on dock/primary clicks
- Rapid tab stress must not collapse `#view`
- Viewport must not disable zoom; design fonts Fraunces/Outfit; no purple canvas cliché

## Top issues

_No P0/P1 issues._

## Device matrix

| iPhone 14 Pro · iOS Safari | iphone-14-pro | issues=0 |
| Pixel 7 · Android Chrome | pixel-7 | issues=30 |
| iPad Pro 11 · iPadOS Safari | ipad-pro-11 | issues=0 |
| Desktop Chrome 1440×900 | desktop-chrome | issues=0 |
| Galaxy S9+ landscape · Android | galaxy-s9-landscape | issues=0 |

## How to re-run

```bash
python3 docs/marketing/.local-auth/run_server.py
node docs/marketing/.local-auth/qa_multi_os_stress.mjs
# subset: PAIDIA_QA_DEVICES=iphone,desktop node docs/marketing/.local-auth/qa_multi_os_stress.mjs
```
