# Dev runbook — overhaul QA

## Local harness (required)

```bash
# Disposable PINs — do not use plain server.py for QA auth
python3 docs/marketing/.local-auth/run_server.py
# → http://127.0.0.1:5173

node docs/marketing/.local-auth/qa_multi_os_stress.mjs
# subset: PAIDIA_QA_DEVICES=iphone,desktop node docs/marketing/.local-auth/qa_multi_os_stress.mjs
```

Outputs:
- `docs/marketing/.local-auth/qa_multi_os_stress_results.json`
- `docs/marketing/.local-auth/qa_overhaul_page_catalog.json`
- `docs/agents/QA_MULTI_OS_STRESS_REPORT.md`
- Screenshots under `docs/marketing/.local-auth/qa_multi_os_screenshots/`

## Preflight baked into suite

- Tour done: `paidia.tourSeen:{profile}:{mode}:3` `{done:true}`
- Contact local: `paidia-contact:{profile}:staff`
- Onboarding flags v3
- Overlays dismissed: tour skip, sheet close, Escape

Without tour preflight, `tourPlaceStep` hijacks Kids dock clicks → Schedule.

## Cache-bust (every client ship)

1. `build.json`
2. `gate.js` `APP_BUILD`
3. `app.js` `APP_BUILD` + SW `||N` fallback
4. `sw.js` `CACHE = paidia-vN`
5. `index.html` `?v=N` on css/js
6. `CHANGELOG.md`

## Known flaky surfaces

- First-login contact sheet if contact local missing
- Mandatory tour if tourSeen missing
- `#shop/store` empty when no pending Friday rows (suite still audits shell)
