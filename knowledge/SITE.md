---
tags: [site, routes, layout]
---

# SITE — PWA layout map

Mobile-first bilingual (DE/EL) care-ops PWA. **No bundler:** `index.html` + `app.js` + `gate.js` + `sw.js` + Python API.

## Architecture (one screen)
```
gate.js (login) → app shell
  header.app-chrome (title · Easy/Pro · bell · lang · avatar)
  #view (staffViewHtml / renderChild)
  nav.dock (staff) / kid-dock (child)
  Zo-Ai FAB / Mehr sheet
```

## Routes / tabs
| Route | Screen | Entry | Role |
|-------|--------|-------|------|
| `#home` | Home | `viewHome` | staff |
| `#schedule` | Plan / Wochenplan | `viewSchedule` | staff |
| `#stock` | Lager | `viewStock` | staff |
| `#shop` | Liste / Einkauf | `viewShop` | staff |
| `#book` | Buch / Übergabe | `viewBook` | staff |
| `#gallery` | Momente | `viewGallery` | staff |
| `#talk` | Talk | `viewTalk` | staff |
| `#kids` | Kinder & Schule | `viewKids` | staff |
| `#pocket` | Taschengeld | `viewPocket` | staff |
| `#admin` | Admin Ops | `viewAdminOps` | admin |
| `child today` | Kid Start | `childStartView` | child |
| `child plan` | Kid Stundenplan | `childStundenplanView` | child |
| `child aufgaben` | Kid Aufgaben | `childAufgabenView` | child |
| `child rate` | Kid Bewertungen | `childBewertungenView` | child |
| `child pocket` | Kid Taschengeld | `childPocketView` | child |
| `child games` | Kid Spiele | `childGamesView` | child |
| `gate` | Login gate | `renderEntrance / renderPin` | public |

## File roles (edit size)
| File | Role | Edit size |
|------|------|-----------|
| `index.html` | Shell + CSS | snippets |
| `ui-v110.css` | Layout / desktop | rules |
| `app.js` | Almost all UI | **function only** |
| `gate.js` | Cold login | PIN / Face ID |
| `sw.js` | Cache + notif click | CACHE name |
| `server.py` | Local API helpers | named `def` |
| `api/index.py` | Vercel adapter | thin |
| `db.py` | Durable KV | KEY_* |

## Design
- Tokens / motion: `design/VISUAL_MOTION_SYSTEM.md`
- Living style guide: `design/system-preview.html`

## Related
- [[Home]] · [[MEMORY]] · [[topics/gate]] · [[topics/child]] · [[topics/tokens]]
