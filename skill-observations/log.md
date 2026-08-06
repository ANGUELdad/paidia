# Skill Observations Log

<!-- Append-only. Agents: add entries; do not rewrite history. -->


## 2026-08-06 — Explore games / gallery / Zo-Ai inventory

- **Trigger:** User asked for thorough codebase state of child games, gallery, Zo-Ai (read-only exploration).
- **Insight:** Feature surface for kids (11 games + gallery + Zo-Ai) is concentrated in three files (`app.js`, `index.html` CSS, `server.py`) with docs lagging (`docs/zoai/child.md` still lists only Memory/XO/catch). When extending games or feed UX, update Zo-Ai knowledge docs in the same change or child prompts stay stale.
- **Reusable pattern:** Inventory reports should enumerate IDs + API actions + cache `?v=` + SW cache name together; cache-bust versions diverge easily (`gate/app ?v=58` vs `sw.js paidia-v19`).
- **Skill candidates:** none new this pass (exploration only).

## [2026-08-05T23:05:47Z] exploration — schedule/program codebase map

- **Trigger:** user asked for thorough schedule UX/data exploration (paste WhatsApp program gaps)
- **Signal:** structured domain map request; reusable as "codebase domain reconnaissance" skill pattern — key paths + line ranges + data shapes + explicit gaps
- **Skill implication:** none yet (read-only); observation logged for future domain-map skill if repeated
- **Evidence:** app.js SEED.template/overrides/weeks, entriesFor, sheetEntry scope, shopping-only OCR
