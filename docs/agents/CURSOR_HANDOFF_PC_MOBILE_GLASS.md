# Handoff — PC Desktop + Mobile UX (v106–v109)

**For:** Cursor / Claude Code / any coding agent picking this up  
**Repo:** `/Users/aggelosdadalis/paidia` — Armonia Thassos / PAIDIA  
**Live:** https://armonia-thassos.vercel.app  
**Written:** 2026-08-23  
**Previous pushed HEAD (upstream `ANGUELdad/paidia`):** `5f44593` — **v108**  
**This handoff accompanies v109** (flat mobile UX reset and five-item navigation).

Read [AGENTS.md](../../AGENTS.md) and [CLAUDE.md](../../CLAUDE.md) first.  
Related older handoffs: [CURSOR_HANDOFF.md](CURSOR_HANDOFF.md), [CURSOR_HANDOFF_STAFF_SCREENS.md](CURSOR_HANDOFF_STAFF_SCREENS.md).  
Push rules: [PUSH_ORIGIN.md](PUSH_ORIGIN.md) — deploy via **`upstream`** as **`ANGUELdad`**, not `origin`/`anguel0z`.

---

## 0. One-sentence status

Staff PWA got a **real PC shell** (v106), **readable buttons / 44px targets** (v107), a **Figma Mobile Glass 2026 system** + **light frosted mobile header** (v108), then a deliberately flatter **mobile UX reset** with a five-item dock and “Mehr” sheet (v109).

---

## 1. Figma files (exact)

| File | URL | Role |
|------|-----|------|
| **Ops / PC / Mobile Glass** (this workstream) | https://www.figma.com/design/ZRF93F27ea4xtX9y9mijqJ | Pages `06` + `07` |
| Page **`06 — PC Desktop 1440`** | same file | Desktop sidebar, dense Home, Liste rail, shift start/end, notifs |
| Page **`07 — Mobile Glass 2026`** | https://www.figma.com/design/ZRF93F27ea4xtX9y9mijqJ?node-id=19-2 | WEB FIRST + iOS + Android + browser chrome |
| Design System v2 (tokens / older screens) | https://www.figma.com/design/chWjXFxyCaFzFC6438lk4N | Foundations — do not invent new purple glass |

### Page 07 contents (already built in Figma)

- Cover + principles (WEB FIRST 390×844, pine/stone, Fraunces + Outfit, ≥44px)
- **WEB FIRST Home** frames: Chrome, Safari, Firefox, Samsung Internet, Brave
- **Native:** iOS 26 Liquid Glass shell, Android 16 Material glass shell
- **Depth:** Plan, Lager, Liste
- **Sheets:** Schichtstart, Schichtende / Übergabe, Mitteilungen
- **SPEC** board: blur/saturate tokens, browser chrome notes, `prefers-reduced-transparency`

**Direction:** liquid glass over stone gradient — blur ~22–28, white fill ~40–55%, hairline rim, pine primary, amber ≤~3%. Never Inter / purple glow / decorative orbs.

---

## 2. What shipped in code

### v106 — PC desktop shell (`972d54c`)

| Area | Behavior |
|------|----------|
| Breakpoint | `body.layout-desktop` (≥900px via existing layout sync) |
| Sidebar | Fixed **220px** chrome rail: brand, labeled nav, `#dockZoAi`, `#dockWho` |
| Home | `.home-pc` + `.home-pc-rail` (notifs, kids, Schichtende) — rail **docked**, not floating |
| Shift end | `sheetShiftEnd()` checklist |
| Notifications | `#btnNotifs` + `sheetNotifCenter()` / `staffInboxItems()` |
| Liste / Lager | Docked `.shop-command` / `.stock-command` on desktop |

### v107 — Button / hit-target fix (`54807ab`)

**Bug:** Desktop header went light glass, but `.topbtn` stayed light-on-dark → white-on-white / weak hits.

**Fix:** Ink-on-glass `.topbtn` under `body.layout-desktop:not(.mode-child)`; min **44×44**; dock `pointer-events:auto`; rail width locked `--rail-w:220px`; nav labels `flex-direction:row`.

### v108 — Mobile light header (`5f44593`)

Mobile/tablet staff header matches Figma 07: frosted light chrome + ink topbar chips (bell / DE / profile). Desktop rules from v107 kept. Cache `paidia-v108`.

### v109 — Mobile UX reset

Flat warm gate, five-item dock + “Mehr” sheet, tighter mobile Home and solid work surfaces. Decorative glass and the floating Zo-Ai bubble were removed on phones; Zo-Ai remains available from “Mehr”.

---

## 3. Exact local paths

```
/Users/aggelosdadalis/paidia
```

| What | Path |
|------|------|
| This handoff | `/Users/aggelosdadalis/paidia/docs/agents/CURSOR_HANDOFF_PC_MOBILE_GLASS.md` |
| CSS (staff glass + PC + mobile header) | `/Users/aggelosdadalis/paidia/index.html` (end of `<style>`) |
| Logic (Home rail, notifs, shift end, binds) | `/Users/aggelosdadalis/paidia/app.js` |
| Login / SW register / first-paint version | `/Users/aggelosdadalis/paidia/gate.js` |
| Version banner | `/Users/aggelosdadalis/paidia/build.json` |
| SW cache name | `/Users/aggelosdadalis/paidia/sw.js` → `CACHE = 'paidia-vNNN'` |
| Changelog | `/Users/aggelosdadalis/paidia/CHANGELOG.md` |
| Visual system authority | `/Users/aggelosdadalis/paidia/design/VISUAL_MOTION_SYSTEM.md` |
| Deploy wiring | `/Users/aggelosdadalis/paidia/docs/agents/DEPLOY_WIRING.md` |

---

## 4. Code anchors (do not paste whole files)

Search these symbols in `app.js` / `index.html`:

| Symbol / selector | Purpose |
|-------------------|---------|
| `staffInboxItems` | Staff inbox list for bell + Home rail |
| `homePcRailHtml` | Desktop Home right rail HTML |
| `sheetNotifCenter` | Notifications sheet |
| `sheetShiftEnd` | Schichtende / Übergabe sheet |
| `paintNotifBadge` | `#notifBadge` count |
| `viewHome` / `home-pc` / `home-pc-rail` | Dense PC Home layout |
| `#btnNotifs` | Topbar bell (always in DOM) |
| `#dockZoAi` | Desktop sidebar Zo-Ai button |
| `.dock-brand` / `.dock-who` | Desktop-only sidebar chrome (`display:none` on mobile) |
| `body.layout-desktop:not(.mode-child)` | PC shell CSS block (~“PC DESKTOP 1440”) |
| `/* Mobile Glass 2026` | Light frosted mobile header override |
| `STAFF LIQUID GLASS 2026` | Earlier staff glass card/dock treatment |

Bindings (near bottom of `app.js`): `#btnNotifs` → `sheetNotifCenter`; `#dockZoAi` → `openZoAi`; `[data-home-jump]` / `#homeShiftEnd` rebound inside Home bind path after `render`.

---

## 5. Cache-bust checklist (every client ship)

1. `build.json` — `version`, `label`, `changed.de` + `changed.el`  
2. `gate.js` — `APP_BUILD` fallback (first-paint banner)  
3. `app.js` — `APP_BUILD` + SW register `||NNN` fallback  
4. `sw.js` — `CACHE = 'paidia-vNNN'`  
5. `index.html` — `?v=NNN` on `gate.js` / `notifications.js`  
6. `CHANGELOG.md` — short section  

Then: `git push upstream HEAD:main` as **ANGUELdad**. Expect `origin` (`anguel0z`) push to fail with 403 — that is OK.

---

## 6. Known issues / product notes

1. **Mandatory login tutorial** can sit over Home and feel like “buttons don’t work.” Advance/finish tutorial or test with a profile that already completed it.  
2. **Desktop vs mobile:** ≥900px → sidebar; below → floating dock. Do not stretch the phone dock as a tall left rail without the v106 labeled chrome.  
3. **Glass vs solid:** Design system allows glass for hierarchy; v109 WIP may lean more solid on mobile — if both are present, prefer one coherent story before shipping more glass.  
4. **Child mode** (`body.mode-child`) keeps its own dock; PC 220px rail is staff-only (`:not(.mode-child)`).  
5. **No Code Connect** in this vanilla repo — implement from tokens + Figma screenshots, not generated React.

---

## 7. Suggested next work (pick one)

1. **Real-device QA for v109** — Chrome, Safari, Firefox, Samsung and Brave; confirm dock, “Mehr”, bell, Home signals and Liste CTAs.  
2. **Extend the flat v109 hierarchy** — bring Plan / Lager / Liste into the same restrained mobile language without reintroducing decorative glass.  
3. **Button QA matrix** — real device: Chrome, Safari, Firefox, Samsung, Brave; confirm dock, bell, Home signals, Schichtende, Liste CTAs.  
4. **Tutorial vs UI** — optional skip for replay-only, or ensure `sheet-open` does not leave stale pointer traps after close.

---

## 8. Guardrails (unchanged)

- No bundler / no React — static `index.html` + `app.js` + `gate.js` + Python API  
- Never paste full `app.js` / `server.py` into context — use `docs/agents/` maps  
- Every new string: `T.de` **and** `T.el`  
- Never commit `.env`, PINs, WhatsApp tokens, live phones  
- Small diffs; pine/stone/Fraunces/Outfit only  

---

## 9. Quick verify

```bash
cd /Users/aggelosdadalis/paidia
git log -3 --oneline
curl -sL https://armonia-thassos.vercel.app/build.json
# expect version 109 after the deployment completes
```

Hard-refresh or reopen PWA after a version bump so `paidia-vNNN` replaces the old SW cache.
