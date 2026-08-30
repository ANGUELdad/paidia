# OCR via xAI Grok

Staff shopping / stock image OCR goes through **`POST /api/ai-shopping`**.
Images prefer **Grok (xAI)**; text AI parse still uses Groq (client has a local text fallback).

## Env

| Variable | Required | Notes |
|----------|----------|--------|
| `XAI_API_KEY` or `GROK_API_KEY` | For Grok OCR | Same key from console.x.ai — either name works |
| `XAI_OCR_MODEL` / `GROK_OCR_MODEL` | No | Default `grok-2-vision-1212` |
| `XAI_BASE_URL` / `GROK_BASE_URL` | No | Default `https://api.x.ai/v1` |
| `PAIDIA_OCR_PROVIDER` | No | `auto` (default) · `xai` · `groq` |
| `GROQ_API_KEY` | Fallback / text | Used when `auto` and no xAI key, or `provider=groq` |
| `GROQ_OCR_MODEL` | No | Groq vision fallback |
| `PAIDIA_OCR_MAX_REQUESTS` | No | Default `12` / window |
| `PAIDIA_OCR_WINDOW_SECONDS` | No | Default `600` |
| `PAIDIA_OCR_MAX_IMAGE_CHARS` | No | Default `2800000` data-URL chars |

Without a usable OCR key, the API returns **`503`** with `code: configuration` — no fake success.

## Endpoint

- **`POST /api/ai-shopping`** (auth session required)
- Body: `{ sourceType: "image"|"text", content, purpose?, locale? }`
- `purpose`: `list` · `receipt` · `stock` · `request`
- Image OCR for `list` / `receipt` / `stock` = **staff only**
- `purpose=request` = staff **or child** (Anfrage / αίτημα form)
- Light rate limit per profile+IP; image size capped

## UI entry points (`app.js`)

| Surface | Function | purpose |
|---------|----------|---------|
| Liste → Liste hinzufügen | `sheetImportList` | `list` |
| Liste → Beleg scannen | `sheetReceipt` | `receipt` |
| Lager → Schnell hinzufügen | `sheetStockQuickAdd` OCR | `stock` |
| Liste → Anfrage / αίτημα | `sheetCreateListRequest` OCR | `request` |

## Health

`GET /api/health` → `ocrConfigured`, `ocrProvider`, `ocrModel`, `ocrGrokModel`.

## Vercel

Set `XAI_API_KEY` (or `GROK_API_KEY`) in project env; redeploy. `api/index.py` shares `run_shopping`.
