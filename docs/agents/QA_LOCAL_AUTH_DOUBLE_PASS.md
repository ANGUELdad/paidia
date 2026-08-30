# QA — Local authenticated double-pass

**Target:** http://127.0.0.1:5173 (marketing local-auth harness)  
**Build under test:** **v149**  
**Date:** 2026-08-30  
**Auth:** **local test profile available** — disposable staff `e5` + child `k1` via gitignored `docs/marketing/.local-auth/` (PINs never printed, committed, or logged).  
**Method:** Playwright double-pass (`docs/marketing/.local-auth/qa_double_pass.mjs`) — each critical path **twice** (P1 / P2). Feedback opened then **cancelled** (no pollute). Lager ± clicked then reversed where possible.

## Verdict

| Scope | Readiness | Notes |
|-------|-----------|--------|
| Local authenticated staff + child critical paths | **100%** (26/26) | Home, Plan week, Lager ±, Liste/Αιτήματα, Zo-Ai title, Tour start+skip, Feedback open, Mitteilungen, Kids Start/Spiele/Notizen |
| Production authenticated paths | **0% verified** | Still no documented non-secret prod test PIN — see [`QA_PROD_DOUBLE_PASS.md`](QA_PROD_DOUBLE_PASS.md) (~52% overall) |
| **Local readiness (honest)** | **~100%** for listed critical paths on this harness | Does **not** certify Vercel live auth |

### Explicit production caveat

**Prod remains unverified for authenticated staff/kids UI** until a human or dedicated test account exists on Vercel. This report only covers local authenticated QA.

---

## Pass / fail table (two-pass)

Legend: **P1** / **P2** = confirmation runs.

### Staff (`e5`)

| Area | Critical path | P1 | P2 | Notes |
|------|---------------|----|----|-------|
| Staff | Home light mast / session | PASS | PASS | `data-tour=home-main` |
| Staff | Plan week | PASS | PASS | `plan-views` / week chrome |
| Staff | Lager ± | PASS | PASS | IN/OUT steppers present; ± exercised |
| Staff | Liste plan + Αιτήματα/requests | PASS | PASS | `#shop/plan` + `#shop/requests` |
| Staff | Zo-Ai panel title icon | PASS | PASS | dock open → title with sparkle/icon |
| Staff | Spotlight tour start + skip | PASS | PASS | Help → tour → Überspringen |
| Staff | Feedback compose open → cancel | PASS | PASS | no submit |
| Staff | Mitteilungen settings | PASS | PASS | Profil → `#securityNotifs` / enable card |

### Child (`k1`)

| Area | Critical path | P1 | P2 | Notes |
|------|---------------|----|----|-------|
| Child | Start denser dashboard + dock/nav | PASS | PASS | |
| Child | Spiele hub → game → back | PASS | PASS | hub + game surface |
| Child | Notizen UI | PASS | PASS | notes surface present (persist timing soft) |
| Child | Feedback via Mehr → cancel | PASS | PASS | |
| Child | Mitteilungen settings | PASS | PASS | bell → prefs; local/SW honest copy |

---

## How local auth was enabled (no secrets)

1. Reused existing **gitignored** harness: `docs/marketing/.local-auth/` (already in `.gitignore`).
2. Disposable test profiles for staff **`e5`** and child **`k1`** — **local test profile available**.
3. Server: `python3 docs/marketing/.local-auth/run_server.py` → http://127.0.0.1:5173 with isolated auth users JSON (not production PINs).
4. QA runner reads PINs only from gitignored `pins.json`; results JSON has **no** PIN values.

Do **not** copy local disposable PINs to Vercel or into agent-safe docs.

---

## Evidence

- Results artifact (gitignored): `docs/marketing/.local-auth/qa_double_pass_results.json` — 26/26 PASS, build v149.
- No PINs, API keys, VAPID secrets, or caregiver phones in this report.

## Follow-up for prod green auth pass

1. Add a **documented non-secret prod test account** (or ephemeral QA profile) on Vercel — separate from local disposable pins.
2. Re-run section D of [`QA_PROD_DOUBLE_PASS.md`](QA_PROD_DOUBLE_PASS.md) ×2 on https://armonia-thassos.vercel.app after hard refresh.
