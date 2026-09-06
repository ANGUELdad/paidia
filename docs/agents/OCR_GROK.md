# OCR via xAI Grok

Staff shopping / stock image OCR goes through **`POST /api/ai-shopping`**.
Week-plan screenshot OCR goes through **`POST /api/ai-schedule`** (`sourceType: "image"`).
Images prefer **Grok (xAI)**; text AI parse still uses Groq (client has a local text fallback for schedule notes).

## Env

| Variable | Required | Notes |
|----------|----------|--------|
| `XAI_API_KEY` or `GROK_API_KEY` | For Grok OCR | Same key from console.x.ai — either name works |
| `XAI_OCR_MODEL` / `GROK_OCR_MODEL` | No | Default `grok-2-vision-1212` |
| `XAI_BASE_URL` / `GROK_BASE_URL` | No | Default `https://api.x.ai/v1` |
| `PAIDIA_OCR_PROVIDER` | No | `auto` (default) · `xai` · `groq` |
| `GROQ_API_KEY` | Fallback / text | Used when `auto` and no xAI key, or `provider=groq`; also text schedule parse |
| `GROQ_OCR_MODEL` | No | Groq vision fallback |
| `PAIDIA_OCR_MAX_REQUESTS` | No | Default `12` / window |
| `PAIDIA_OCR_WINDOW_SECONDS` | No | Default `600` |
| `PAIDIA_OCR_MAX_IMAGE_CHARS` | No | Default `2800000` data-URL chars |

Without a usable OCR key, the API returns **`503`** with `code: configuration` — no fake success.

## Endpoints

### Shopping — `POST /api/ai-shopping`

- Body: `{ sourceType: "image"|"text", content, purpose?, locale? }`
- `purpose`: `list` · `receipt` · `stock` · `request`
- Image OCR for `list` / `receipt` / `stock` = **staff only**
- `purpose=request` = staff **or child** (Anfrage / αίτημα form)
- Light rate limit per profile+IP; image size capped

### Schedule — `POST /api/ai-schedule`

- Body: `{ sourceType: "image"|"text", content|text, weekStart, weekDates, occupied?, fillMode?, locale?, catalogues… }`
- Image = staff-only week planner / matrix screenshot → draft entries
- Client defaults to **Nur Lücken** (skip occupied slots on apply); PIN confirm required
- Same OCR provider stack as shopping for images; Groq chat for text

## UI entry points (`app.js`)

| Surface | Function | purpose / mode |
|---------|----------|----------------|
| Liste → Liste hinzufügen | `sheetImportList` | `list` |
| Liste → Beleg scannen | `sheetReceipt` | `receipt` |
| Lager → Schnell hinzufügen | `sheetStockQuickAdd` Foto lesen | `stock` |
| Liste → Anfrage / αίτημα | `sheetCreateListRequest` OCR | `request` |
| Plan → Woche → **Foto → Woche** | `sheetAiSchedule({preferPhoto})` | schedule image / gaps |
| Plan → Woche → Mit Text füllen | `sheetAiSchedule` | schedule text |

## Health

`GET /api/health` → `ocrConfigured`, `ocrProvider`, `ocrModel`, `ocrGrokModel`.

## Vercel

Set `XAI_API_KEY` (or `GROK_API_KEY`) in project env; redeploy. `api/index.py` shares `run_shopping` / `run_schedule_parse`.
