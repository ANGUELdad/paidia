# Kids games (OSS, offline)

Self-contained HTML5 games for the Armonia Kids **Spiele** hub. Served from
`/kids-games/<id>/index.html`, launched in a sandboxed iframe from `app.js`.

## Catalogue

| Folder | Title (DE) | Genre | License | Notes |
|--------|------------|-------|---------|-------|
| `merge2048/` | 2048 | Puzzle | MIT (this tree) | Inspired by Cirulli 2048 (MIT); original code |
| `snake/` | Schlange | Arcade | MIT | Touch D-pad + swipe |
| `breakout/` | Breakout | Arcade | MIT | Tap / drag paddle |
| `puzzle15/` | 15-Puzzle | Puzzle | MIT | Sliding tiles |
| `hop/` | Himmel-Hüpfer | Arcade | MIT | Tap to flap (no commercial art) |

All titles: no accounts, no network calls, no analytics, works in mobile WebView/PWA.

## Score bridge

Each game may post to the parent:

```js
parent.postMessage({ type: 'paidia-score', gameId: 'osssnake', score: 12 }, '*');
```

The hub records best scores via existing `gameStats` / `writeGameBest`.

## Local serve

Static allowlist in `server.py` and `api/index.py` must include `kids-games/`.
Do not open via `file://` — use `python3 server.py`.
