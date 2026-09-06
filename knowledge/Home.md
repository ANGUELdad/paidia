---
tags: [moc, hub]
---

# Armonia Thassos — Knowledge Hub

Obsidian vault for **humans + coding agents**. Goal: answer “where is X?” in **<1k tokens**, not by loading `app.js`.

## Start (AI — read in order)
1. [[AGENT_START]]
2. [[TOKEN_REDUCE]]
3. [[MEMORY]]
4. [[SITE]]
5. Keyword → topic note under `topics/`

## Canonical coding maps (also in repo)
- `docs/agents/SUMMARY.md`
- `docs/agents/map.json` (machine index this vault mirrors)
- `docs/agents/KNOWLEDGE_MAP.md`
- `docs/agents/MEMORY_MAP.md`

## Topics
- [[topics/tour]] — Spotlight coach-marks: buildTourSteps, openTutorial, data-tour targets, tourSeen v3, Easy/
- [[topics/page-tips]] — Contextual page tips with spotlight hole/arrow on data-tour; human DE/EL; PaidiaPageTips.r
- [[topics/zoai-tips]] — Zo-Ai FAB tips spotlight nav-zoai; PaidiaZoAiTips.refreshLang; stagger paidiaMarkCoachShow
- [[topics/nav-menu]] — Kids website menu v169: mobile hamburger openKidSiteMenu (kid-site-menu sheet); desktop da
- [[topics/feedback]] — sheetFeedbackHub/Compose/Inbox; OPS key feedbackReports; kid-ops merge locks triage; Pro i
- [[topics/auth]] — Cold gate.js + app.js PIN/WebAuthn. Server /api/auth/passkey/* + PAIDIA_WEBAUTHN_ORIGIN/RP
- [[topics/gate]] — Login shows build.json version + changed.de/el. Mobile keyboard: body[data-gate-kb] + visu
- [[topics/book]] — viewBook Übergabe: structured sections + ack. writeShiftJournalPage/ackShiftHandoff. Calen
- [[topics/shop]] — viewShop Friday list + requests; store checkbox mode (done sink+strikethrough); DE→EL tran
- [[topics/admin-ops]] — #admin Ops cockpit + Lego; kids admin add/remove (/api/auth/admin/child); profile photo he
- [[topics/stock]] — viewStock pantry walk; immediate ± + undo toast; sheetStockQuickAdd; OUT reason dock; shif
- [[topics/schedule]] — Week: portrait day-focus (sticky Mo–So chips); landscape/desktop matrix; Import Woche; Zo-
- [[topics/calendar]] — sheetCalendar buildIcs VALARM; googleCalUrl outlookCalUrl per person.
- [[topics/presence]] — sheetShiftPresence; shiftCheckins ops; SW notif actions → ?presence=1.
- [[topics/email]] — email_shell + bilingual broadcast. sheetBroadcastEmail + optional in-app banner via profil
- [[topics/notif]] — Local Notification API + platform matrix. Optional VAPID subscribe when keys set. See NOTI
- [[topics/zoai]] — llm_completion for chat/learn/quiz/caption. Keyword zoai knowledge. Confirmable actions.
- [[topics/talk]] — viewTalk + /api/talk staff-only messaging.
- [[topics/gallery]] — /api/gallery posts; optional Google Drive; caption helper.
- [[topics/db]] — db.py keys; OPS_STATE; durableStorage on health.
- [[topics/deploy]] — Push upstream ANGUELdad/paidia → Vercel → armonia-thassos.vercel.app. Read DEPLOY_WIRING.m
- [[topics/pocket]] — Staff #pocket tab + kid pocket view; pocketMoneyTxns + pocketMoneySettings ops.
- [[topics/child]] — renderChild tabs; install/how-to; event notifs; Zo-Ai read-only.
- [[topics/tokens]] — Vault-first: knowledge/AGENT_START + topics/* + map.json; Graphify MCP; never full app.js/

## Zo-Ai runtime (in-app chat — not coding maps)
- [[zoai/overview]]
- `docs/zoai/`

## Graphify / MCP
- Graph output: `graphify-out/` (query via MCP `query_graph` / `get_neighbors`)
- Lightweight map graph: `knowledge/graph/agent-map.json`
- Setup: [[MCP_SETUP]]

## How to refresh
```bash
python3 scripts/build-knowledge-vault.py
graphify update docs knowledge --no-cluster   # AST-only, no LLM
# or full: graphify update . --no-cluster
```
