# Apple HIG × Paidia — where to apply

Skill source: [dickwu/apple-design-skill](https://github.com/dickwu/apple-design-skill)  
Installed at: `.cursor/skills/apple-design/` (also `~/.agents/skills/apple-design/`)

**Rule:** HIG principles are the interaction/a11y bar. **Armonia** (pine, Fraunces/Outfit, glass 2026) stays the visual brand. Never replace brand with stock iOS chrome.

## Apply strongly (every UI change)

| HIG topic | Paidia mapping | Already / gap |
|-----------|----------------|---------------|
| **Layout / safe area** | `--safe-t` / `--safe-b`, dock, sheets | Mostly done; keep sheet footers + Zo FAB clear of home indicator |
| **Gestures / tap ≥44** | Dock, chips, attendance, Liste steppers | Hard floor in stress suite; keep fixing P1s |
| **Accessibility** | Zoom unlocked (v179), labels on icon buttons, contrast on pine | Continue aria on icon-only; avoid `user-scalable=no` |
| **Modality** | Sheets, tips, tour, contact gate, PIN | One primary sheet; Escape/Skip; don’t trap without exit |
| **Motion** | `prefers-reduced-motion`, pine-settle | Extend reduce to sheets/tour when adding motion |
| **Feedback** | Toasts, stock draft, Friday confirm | Keep short; clear on route change (iOS P0 history) |
| **Focus** | Desktop sidebar + matrix | `:focus-visible` on interactive controls |
| **Liquid Glass** | `ui-v110` glass / PC-mobile glass | Restraint — glass for chrome, not every data row |
| **Onboarding** | Tour + tips + first-login contact | Tour must not hijack nav after done (`tourSeen`) |
| **Typography** | Fraunces display / Outfit UI | Scalable text; don’t lock font-size on body for a11y |
| **Writing** | DE/EL copy in `T` | Clear verbs; avoid jargon in Easy |
| **Generative AI** | Zo-Ai confirmable actions | Never auto-apply; Confirm (+ PIN for schedule) |
| **Privacy** | PINs, Face ID, no secrets in commits | Biometrics docs; no live phones in repo |

## Apply lightly / situational

| Topic | When |
|-------|------|
| Dark mode | Only if we add a real theme — don’t half-ship |
| Search | Talk / gallery / stock search patterns |
| Drag-drop | Plan matrix, gallery — keep optional |
| Game controls | Child games only |
| Branding | Prefer Armonia over Apple product look |

## Do not apply blindly

- SF Pro / system blue / pure white iOS sheets
- Tab bar that fights existing dock + Mehr model
- Extra glassmorphism on Liste/Lager dense tables
- macOS menu-bar patterns on mobile staff shift UX

## Agent workflow

1. Load skill `SKILL.md` + `hig-lookup.md`
2. Pull 3–8 relevant `references/hig/*.md`
3. Propose fixes in vanilla CSS/JS matching Armonia tokens
4. Re-check tap/safe-area with Playwright stress suite when touching chrome

## Install locations

- Project: `.cursor/skills/apple-design/`
- Cursor rule: `.cursor/rules/apple-design.mdc`
- User: `~/.agents/skills/apple-design/` and `~/.cursor/skills/apple-design/`
