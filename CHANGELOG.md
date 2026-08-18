# Changelog

## v74 — 2026-08-19

- Momente tab paints immediately (skeleton) then refreshes in the background
- Groq chat remaps retired `llama-3.3-70b-versatile` → `openai/gpt-oss-120b`; OCR stays `qwen/qwen3.6-27b`
- `/api/health` reports per-model Groq catalog status and refuses direct (IPv6) Postgres hosts
- Cache `paidia-v74`

## v69 — 2026-08-06

- UX Phase 1: Home one composition (mast + shift + signals + today; rest under “Mehr”)
- Plan/matrix day headers show full dates; mobile day chips include year
- Stock drafting pine (not blue); tutorial/help/import off indigo
- Talk stays a dedicated dock tab (label “Talk”)
- Admin Automationen panel for local notification rules (shift / stock / late / banner)
- Cache `paidia-v69`

## v68 — 2026-08-06

- Expanded agent knowledge / memory / token-reduce maps for all major code areas
- `docs/agents/BIOMETRICS.md` — iPhone Face ID + Android fingerprint setup
- Cold-boot `gate.js` Face ID / fingerprint login (primary CTA) + version chip on PIN
- Login always shows version + what changed (DE/EL)

## v67 — 2026-08-06

- Agent knowledge / memory / token-reduce maps (`docs/agents/`, `AGENTS.md`)
- Login screen shows app version + what changed (`build.json`)
- Biometrics-first gate CTA + WebAuthn env docs
- Admin broadcast HTML preview + bilingual email bodies
- Stronger notifications UX; child portal Mitteilungen + install/how-to instructions
- Admin broadcast optional in-app banner for online staff/kids; WebAuthn origin soft warning
- Zo-Ai Omni/knowledge tighten; learn/quiz/caption via same LLM helper; admin broadcast/event drafts
- Web Push deferred — see `docs/agents/WEB_PUSH_LATER.md`

## v66 — 2026-08-06

- Schichtbuch journal (append ink, duty banners)
- Home shift-start checklist + presence panel / notifications
- Per-person calendar (Apple .ics, Google, Outlook) with 30‑min alarms
