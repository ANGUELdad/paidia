#!/usr/bin/env bash
# Point Moments photo storage at Google Drive, so images stop consuming
# Vercel bandwidth and Postgres rows.
#
#   ./scripts/setup-drive-storage.sh
#
# What already exists in this repo (no code changes needed):
#   drive_gallery.py                  upload / download / delete against Drive
#   server.py  gallery_media_response route /api/gallery/media/<fileId>
#   api/index.py                      same route on Vercel
#   graceful fallback                 if Drive upload fails, the photo stays inline
#
# All that is missing are four credentials. This script runs the OAuth flow,
# writes them to .env, pushes them to Vercel, redeploys and verifies.
#
# You do two things by hand, because neither can be automated for you:
#   1. create the Google Cloud OAuth client (your Google account)
#   2. click "Allow" in the browser
# The refresh token goes from Google straight into .env and Vercel. It is never
# echoed, never passed on a command line, and never leaves your machine except
# to Vercel's encrypted env store.

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
VC="$(command -v vercel || echo "$HOME/.local/bin/vercel")"
SITE="https://armonia-thassos.vercel.app"

say(){ printf '\n\033[1m==> %s\033[0m\n' "$*"; }
die(){ printf '\n\033[31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

cat <<'PRE'

┌──────────────────────────────────────────────────────────────────┐
│ BEFORE RUNNING — one-time Google Cloud setup (~3 minutes)        │
├──────────────────────────────────────────────────────────────────┤
│ 1. console.cloud.google.com → new project (e.g. "armonia")       │
│ 2. APIs & Services → Library → enable "Google Drive API"         │
│ 3. Credentials → Create credentials → OAuth client ID            │
│      Application type: Desktop app                               │
│      → copy the Client ID and Client secret                      │
│ 4. drive.google.com → new folder "Armonia Moments"               │
│      open it → copy the ID from the URL:                         │
│      drive.google.com/drive/folders/<THIS-PART>                  │
└──────────────────────────────────────────────────────────────────┘

Scope requested is drive.file — access ONLY to files this app creates.
It cannot read the rest of your Drive.

PRE
read -r -p "Ready? [y/N] " go
[ "${go:-n}" = "y" ] || { echo "Aborted."; exit 0; }

say "1/5  OAuth — a browser window will open for you to approve"
OUT="$(python3 scripts/google_drive_auth.py)" || die "OAuth helper failed"

CID="$(printf '%s' "$OUT"    | grep '^GOOGLE_DRIVE_CLIENT_ID='     | cut -d= -f2-)"
CSEC="$(printf '%s' "$OUT"   | grep '^GOOGLE_DRIVE_CLIENT_SECRET=' | cut -d= -f2-)"
REFRESH="$(printf '%s' "$OUT"| grep '^GOOGLE_DRIVE_REFRESH_TOKEN=' | cut -d= -f2-)"
FOLDER="$(printf '%s' "$OUT" | grep '^GOOGLE_DRIVE_FOLDER_ID='     | cut -d= -f2-)"
[ -n "$CID" ] && [ -n "$CSEC" ] && [ -n "$REFRESH" ] && [ -n "$FOLDER" ] \
  || die "OAuth did not return all four values — see output above"
echo "    got all four (refresh token length ${#REFRESH})"

say "2/5  Writing to .env"
cp .env .env.bak-before-drive 2>/dev/null
for kv in "GOOGLE_DRIVE_CLIENT_ID=$CID" "GOOGLE_DRIVE_CLIENT_SECRET=$CSEC" \
          "GOOGLE_DRIVE_REFRESH_TOKEN=$REFRESH" "GOOGLE_DRIVE_FOLDER_ID=$FOLDER"; do
  k="${kv%%=*}"
  if grep -qE "^${k}=" .env 2>/dev/null; then
    python3 - "$k" "${kv#*=}" <<'PY'
import sys
k,v=sys.argv[1],sys.argv[2]
lines=open('.env').read().split('\n')
out=[(f"{k}={v}" if l.startswith(k+"=") else l) for l in lines]
open('.env','w').write('\n'.join(out))
PY
  else
    printf '%s\n' "$kv" >> .env
  fi
  echo "    $k written"
done

say "3/5  Pushing to Vercel (values piped on stdin, never in argv)"
for k in GOOGLE_DRIVE_CLIENT_ID GOOGLE_DRIVE_CLIENT_SECRET \
         GOOGLE_DRIVE_REFRESH_TOKEN GOOGLE_DRIVE_FOLDER_ID; do
  case "$k" in
    GOOGLE_DRIVE_CLIENT_ID) v="$CID";;
    GOOGLE_DRIVE_CLIENT_SECRET) v="$CSEC";;
    GOOGLE_DRIVE_REFRESH_TOKEN) v="$REFRESH";;
    GOOGLE_DRIVE_FOLDER_ID) v="$FOLDER";;
  esac
  for env in production preview development; do
    "$VC" env rm "$k" "$env" --yes >/dev/null 2>&1
    printf '%s' "$v" | "$VC" env add "$k" "$env" >/dev/null 2>&1 \
      && echo "    $k → $env" || echo "    WARN: $k → $env failed"
  done
done

say "4/5  Redeploying production"
"$VC" --prod --yes >/dev/null 2>&1 || die "deploy failed"
echo "    deployed"

say "5/5  Verifying"
for i in 1 2 3 4 5 6; do
  d="$(curl -s "$SITE/api/health" | sed -n 's/.*"driveConfigured":\([a-z]*\).*/\1/p')"
  if [ "$d" = "true" ]; then
    printf '\n\033[32m✓ Moments photos now store in Google Drive\033[0m\n'
    echo "    New photos upload to your Drive folder and are served through"
    echo "    /api/gallery/media/<fileId> instead of living in Postgres."
    echo "    Existing inline photos stay as they are — nothing is migrated."
    exit 0
  fi
  echo "    attempt $i: driveConfigured=${d:-unknown} — waiting…"
  sleep 10
done
die "deployed but /api/health still reports driveConfigured=false. Check: $VC env ls"
