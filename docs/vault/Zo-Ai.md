---
tags: [ai]
---
# Zo-Ai

In-app assistant. Three role prompts: child / staff / admin.

## What it may change
Emits a fenced ```paidia-action``` block. **Never applies anything itself** —
the app shows a confirmation, and schedule/template changes additionally
require a PIN.

| role | may propose |
|---|---|
| child | nothing — must refuse and defer to a caregiver |
| staff | stock, list |
| admin | stock, list, schedule, template, broadcast |

## Voice
`SpeechRecognition` / `webkitSpeechRecognition`, disabled outside a secure
context (localhost exempted).

## Open
- No response variety — see [[Zo-Ai · Variety]]
- No preference learning from history

Related: [[Vorrat]], [[Plan]], [[Sicherheit]]
