# Agent entry (Cursor / Claude Code / other LLM)

**Before** opening large source files, read:

1. [docs/agents/SUMMARY.md](docs/agents/SUMMARY.md)
2. [docs/agents/TOKEN_REDUCE.md](docs/agents/TOKEN_REDUCE.md)
3. [docs/agents/KNOWLEDGE_MAP.md](docs/agents/KNOWLEDGE_MAP.md)
4. [docs/agents/MEMORY_MAP.md](docs/agents/MEMORY_MAP.md)
5. [docs/agents/map.json](docs/agents/map.json) — keyword → files/snippet
6. [docs/agents/BIOMETRICS.md](docs/agents/BIOMETRICS.md) — Face ID / Android fingerprint
7. [docs/agents/TOUR_SYSTEM.md](docs/agents/TOUR_SYSTEM.md) — spotlight tour / `data-tour` QA
8. [docs/agents/TIPS_SYSTEM.md](docs/agents/TIPS_SYSTEM.md) — contextual page tip popups
9. [docs/agents/FEEDBACK_SYSTEM.md](docs/agents/FEEDBACK_SYSTEM.md) — bug / change / addition reports
9. [docs/agents/OCR_GROK.md](docs/agents/OCR_GROK.md) — Liste/Lager OCR via xAI Grok

**Never** paste full `app.js` or `server.py` into context.

**Zo-Ai (in-app assistant) runtime knowledge:** [docs/zoai/KNOWLEDGE_MAP.md](docs/zoai/KNOWLEDGE_MAP.md)

**Design system:** [design/VISUAL_MOTION_SYSTEM.md](design/VISUAL_MOTION_SYSTEM.md) is the
authority; the Figma build of it is [Armonia Thassos — Design System v2](https://www.figma.com/design/chWjXFxyCaFzFC6438lk4N)
(Cover / Foundations / Material / Widgets / Screens / Kids / Motion). It is implemented in the `:root` + design-system layer at the end of the
`<style>` block in `index.html`. Living style guide: `design/system-preview.html`
(regenerate with `python3 scripts/build-style-guide.py` after any CSS change).

**Handoff to another agent (Cursor etc.):** [docs/agents/CURSOR_HANDOFF.md](docs/agents/CURSOR_HANDOFF.md)
— token reference, the Kids/widgets build spec, real `app.js` anchors, ship checklist, guardrails.

**PC + Mobile Glass 2026 (v106–v108):** [docs/agents/CURSOR_HANDOFF_PC_MOBILE_GLASS.md](docs/agents/CURSOR_HANDOFF_PC_MOBILE_GLASS.md)
— desktop sidebar, button fixes, Figma page 07, cache-bust, next steps.

**Staff screens (v100):** [docs/agents/CURSOR_HANDOFF_STAFF_SCREENS.md](docs/agents/CURSOR_HANDOFF_STAFF_SCREENS.md)

**Claude Code extras:** [CLAUDE.md](CLAUDE.md), [docs/claude-code-setup.md](docs/claude-code-setup.md)

**Notifications matrix (OS × browser):** [docs/agents/NOTIFICATIONS_MATRIX.md](docs/agents/NOTIFICATIONS_MATRIX.md)

**Web Push (VAPID partial):** [docs/agents/WEB_PUSH_LATER.md](docs/agents/WEB_PUSH_LATER.md)

**Git push to origin:** [docs/agents/PUSH_ORIGIN.md](docs/agents/PUSH_ORIGIN.md) — use `ANGUELdad` (not `anguel0z`) or push fails with 403.

**Deploy wiring (GitHub → Vercel → live URL):** [docs/agents/DEPLOY_WIRING.md](docs/agents/DEPLOY_WIRING.md)
