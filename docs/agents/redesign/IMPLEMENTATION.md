# Desktop, mobile and operations redesign — implementation record

Build 239 is the latest local implementation checkpoint in this task. Newer concurrent work through v238 was preserved. **The complete redesign is not release-ready.** No production publishing was performed in this implementation run.

## Implemented command contracts

| Command | Contract | Coverage |
|---|---|---|
| `state.commit` | Compatibility snapshot, expected revision, persisted operation receipt, transactional write; protected collections and immutable financial records | Reducer, SQLite concurrency/restart, immutable audit, rejected unknown collections, browser full-snapshot request |
| `pocket.post` | Session actor, known child, integer cents, required description, durable success | Browser delayed duplicate tap, offline draft, HTTP replay; reducer amount/reversal tests |
| `pocket.reverse` | Compensating record; original remains; second reversal rejected | Reducer and browser |
| `stock.adjust` | Atomic selected changes, known catalog references, finite nonnegative balances, reason, revision | Reducer validation and rollback; draft UI migrated |
| `stock.record` | Explicit first measured quantity, including zero; refuses already-recorded stock | Reducer; initial-count form |
| `shopping.confirm` | Pending entries in one house, units, outcomes, initial counts; trip/stock/requests/audit committed together | Reducer replay, duplicate processing and linked rollback; confirmation preview migrated |

Local and hosted HTTP adapters call the same reducer. SQLite uses an immediate transaction, Postgres a row lock, and Redis compare-and-set. **Postgres and Redis have not been integration-tested against hosted services.** Operation receipts persist in the operational document. A command replay returns the original operation revision and current document revision separately.

The compatibility snapshot remains a migration bridge. Some legacy stock, homework, journal and administration actions still use it; they are not certified to the full action contract. Server-side game reward verification is still outstanding. Child `xpLog` remains a legacy write path and requires migration before release.

## Page review sheets

| Surface | Desktop / mobile composition | Actions and state coverage | Remaining release work |
|---|---|---|---|
| Login and profiles | Explicit `/desk/` and `/m/` stay selected; login retains destination | Warm-session browser checks; account cache boundary added | Cold login, recovery, passkeys, software keyboards and device security matrix |
| Home | Existing overview / focused mobile shell | Render audit, both languages | Verify every metric's exact filter and every shortcut |
| Inventory | Existing desktop working list / larger mobile controls | Draft atomic save; first-count form; failed drafts retained | Quick add, OCR, stock checks, metadata/bulk editors and safe reversal migration |
| Shopping | Existing planning/store views; confirmation preview with house, quantities and required initial counts | Atomic receipt command and per-entry validation | Editable OCR preview; complete substitution/skipped UI; receipt history drill-down |
| Pocket money | Existing ledger / focused entry form | Presets, form, allowances and reversal await durable confirmation; offline form retained | Bulk payment preview; settings save migration; reconciliation/export |
| Attendance | Roster with explicit unrecorded state; mobile controls stack in two columns | Single/bulk commands, date and eligibility preview, durable confirmation, retained selection on error | Full timeout/concurrency UI matrix and assistive-technology checks |
| Plan and shifts | Existing week/day layouts | Render audit | Recurrence/override conflicts, DST, overnight shifts, import and presence action matrix |
| Journal | Existing archive/editor surfaces | Render audit | Revisioned corrections, acknowledgments, editor drafts and every bulk action |
| Children and school | Directory and existing school panes | Render audit, cache separation | Submissions, attachments, broader bulk assignments and reference archiving |
| Talk | Existing list/thread and compose fixes from v225 | Render audit | Delivery, pagination, offline retries and duplicate-send testing |
| Gallery | Existing feed/viewer | Render audit | Camera, media failure/retry, moderation, thumbnail and batch checks |
| Rules | Existing reading/editor views | Render audit | Publishing history, audience and ownership action checks |
| Notifications, feedback, AI, help | Existing dialogs/workflows | Shared modal focus containment, Escape and return focus | Full dialog/action/role coverage; validated AI commands and communication deliveries |
| Admin overview/team | Working overview and team detail | Ten-section browser render/navigation coverage | Workload/conflict previews and complete queue semantics |
| Admin supplies/finance/audit | House comparison, balances and activity rows; focused mobile lists | Addressable sections, known-zero distinction, integer-cent balances, activity search | Server pagination/filter totals, detailed record inspector and authorized export |
| Admin school/review/communications | Focused links to existing management workflows | Section rendering | Full triage/bulk decisions and delivery-result management |
| Admin automations/system | Device-rule list and reported sync state | No fabricated central run history or service-health claims | Central rules, run logs, integration status and per-operation recovery inbox |
| Child pages | Existing Today, plan, tasks, learning, rewards, ratings, money, notes, events, gallery, rules | Render audit; staff cache cleared before child rendering | Every ownership, upload, submission, reward, save and recovery case |
| All 18 registered games | Existing games in both shells | 144 start/render/exit-control-presence checks; active iframe source validation | Actual play/restart/result tests, replay validation, server-authorized rewards and physical controls |

All pages share the target lifecycle: loading → ready/empty → editing → saving → saved/failed/conflicted. Only the migrated commands have evidence for durable confirmation. **A render pass does not establish action correctness.**

## Verification evidence

- 31 Python tests pass (24 operations/persistence/projection tests and 7 child-AI security tests); 5 JavaScript reconciliation/selection tests pass. The full JavaScript suite has 55 passes and 5 legacy design-scale failures.
- 4 server snapshot tests and 4 client operations-filter tests.
- 240 admin section renders: Chromium, Firefox and WebKit; explicit desktop/mobile shells at 320, 393, 834 and 1440 px. No reported page overflow or render fallback; dialog focus and Escape passed.
- 192 staff/child page renders: Chromium; both languages at 320, 393, 834 and 1440 px. No reported page overflow or render fallback.
- 3,060 route renders in the expanded v236 run: all three engines, both languages and every requested width, including account, school and gallery subpages. No reported errors/fallback/overflow. This run preceded the final attendance/privacy changes and later concurrent v237/v238 edits; it is not a release certificate.
- 144 game renders: 18 registered games, both languages, four widths. No page errors or reported page overflow; exit controls were clicked and game sessions cleared. This is not a gameplay certification.
- Process-restart test reopens SQLite in a fresh Python process and replays the same operation without a second stock movement.
- Payment browser tests: one write from a delayed double tap, compensating reversal, offline form retention without an optimistic transaction, persisted HTTP replay. The browser suite also verifies stock adjustment plus shopping receipt, bulk attendance selection/preview/confirmation, and a same-browser account switch with an actual other-child ledger fixture.
- JavaScript syntax and Python compilation checks pass for edited runtime files.

Raw browser reports and screenshots are under `.qa-screens/implementation-baseline/`; broad page audit uses `.qa-screens/v212/page-audit.json` (legacy directory name; the report records the running build).

The QA launcher's database-import ordering initially directed three identifiable QA transactions to the local default SQLite database. A SQLite backup was made before cleanup. Those three QA-only records and associated command audit/receipts were removed; the isolated tests were rerun successfully. Production was not used. The tracked launcher below prevents this configuration-order error.

## Reproduce safely

Use the existing disposable fixture at `docs/marketing/.local-auth/marketing.env` and `pins.json`. Do not substitute production credentials.

```sh
python3 scripts/run-local-qa.py
node scripts/qa-domain-workflows.mjs
node scripts/qa-operation-workspace.mjs
node scripts/qa-games-layout.mjs
python3 -m unittest discover -s tests -p test_operations.py
node --test tests/workspace.test.mjs tests/operations-filter.test.mjs
python3 tests/ops-snapshot.test.py
```

Generated sources:

```sh
node scripts/build-domain-catalog.mjs
node scripts/build-redesign-inventory.mjs
python3 scripts/build-shell-sites.py
python3 scripts/build-style-guide.py
python3 scripts/build-knowledge-vault.py
```

`inventory.json` lists 126 named rendering/editor/action entry points. It is a static inventory, not an exhaustive dynamic-action registry. Each remains unreviewed until its complete action matrix is covered.

## Open release gates

Full-page screenshot review, all requested widths in every interactive state, Easy/Pro combinations, every role and action, 200% zoom, screen reader, real-device camera/keyboard/install/biometrics, large datasets and latency measurements, hosted persistence integration, and end-to-end game reward validation remain open. Do not publish this checkpoint as a completed redesign.
