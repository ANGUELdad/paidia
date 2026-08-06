#!/usr/bin/env bash
# One command to put paidia's durable state on Postgres.
#
#   ./scripts/setup-vercel-db.sh
#
# Step 1 below is interactive: Vercel shows you Neon's marketplace legal terms
# and you confirm them yourself. There is no flag to skip it and nothing else
# can accept them on your behalf. Every step after that runs unattended.
#
# What it does:
#   1. accept Neon's terms          (you confirm)
#   2. provision Neon Postgres      Free plan, eu-central (Frankfurt)
#   3. connect it to the project    injects DATABASE_URL into all environments
#   4. redeploy production
#   5. verify /api/health flips from sqlite -> postgres

set -uo pipefail

PROJECT="paidia"
SCOPE="anguel2"
SITE="https://armonia-thassos.vercel.app"
PLAN="free_v3"
REGION="fra1"          # Frankfurt: keeps children's and caregivers' data in the EU
VC="$(command -v vercel || echo /opt/homebrew/bin/vercel)"

say(){ printf '\n\033[1m==> %s\033[0m\n' "$*"; }
die(){ printf '\n\033[31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

[ -x "$VC" ] || die "vercel CLI not found"
"$VC" whoami >/dev/null 2>&1 || die "not logged in — run: vercel login"

say "1/5  Neon marketplace terms (interactive — read and confirm)"
if "$VC" integration installations 2>/dev/null | grep -qi neon; then
  echo "    already accepted, skipping"
else
  "$VC" integration accept-terms neon || die "terms not accepted — nothing was provisioned"
fi

say "2/5  Provisioning Neon Postgres ($PLAN, region $REGION)"
if "$VC" integration list 2>/dev/null | grep -qi neon; then
  echo "    a Neon resource already exists, skipping provisioning"
else
  "$VC" integration add neon \
    --plan "$PLAN" \
    -m region="$REGION" \
    -m auth=false \
    -e production -e preview -e development \
    --no-claim \
    || die "provisioning failed"
fi

say "3/5  Checking DATABASE_URL landed"
if "$VC" env ls 2>/dev/null | grep -qiE "DATABASE_URL|POSTGRES_URL"; then
  "$VC" env ls 2>/dev/null | grep -iE "DATABASE_URL|POSTGRES_URL" | sed 's/^/    /'
else
  die "no DATABASE_URL/POSTGRES_URL found after provisioning — check the Vercel dashboard"
fi

say "4/5  Redeploying production (env vars only apply to new deployments)"
"$VC" --prod --yes || die "deploy failed"

say "5/5  Verifying the live database backend"
for i in 1 2 3 4 5 6; do
  body="$(curl -s "$SITE/api/health" 2>/dev/null)"
  backend="$(printf '%s' "$body" | sed -n 's/.*"backend":"\([a-z]*\)".*/\1/p')"
  if [ "$backend" = "postgres" ]; then
    printf '\n\033[32m✓ LIVE ON POSTGRES\033[0m\n'
    printf '%s\n' "$body" | sed 's/^/    /'
    echo
    echo "Data now survives deploys and cold starts."
    echo "Next: open Profil in the app and save any stock/list change once,"
    echo "so this device seeds the database."
    exit 0
  fi
  echo "    attempt $i: backend=${backend:-unknown} — waiting for the deploy to go live…"
  sleep 10
done

die "still not reporting postgres. Check: curl $SITE/api/health"
