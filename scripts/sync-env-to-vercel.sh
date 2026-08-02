#!/usr/bin/env bash
# Sync .env.local variables to Vercel (production, preview, development).
# Usage: ./scripts/sync-env-to-vercel.sh [.env.local]
set -euo pipefail

ENV_FILE="${1:-.env.local}"
PRODUCTION_APP_URL="https://juicy-prop-firms.vercel.app"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — copy .env.example and fill in values first."
  exit 1
fi

# Keys required for a healthy production deploy
REQUIRED_KEYS=(
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  DATABASE_URL
  DIRECT_URL
)

add_env() {
  local key="$1"
  local value="$2"
  local sensitive="${3:-false}"

  if [[ -z "$value" ]]; then
    echo "Skipping empty $key"
    return
  fi

  local args=(env add "$key" production,preview --value "$value" --yes --force)
  if [[ "$sensitive" == "true" ]]; then
    args+=(--sensitive)
  else
    args+=(--no-sensitive)
  fi

  echo "Setting $key..."
  vercel "${args[@]}"
}

# Override app URL for all environments (public)
add_env NEXT_PUBLIC_APP_URL "$PRODUCTION_APP_URL" false
vercel env add NEXT_PUBLIC_APP_URL development --value "$PRODUCTION_APP_URL" --no-sensitive --yes --force 2>/dev/null || true

while IFS= read -r line || [[ -n "$line" ]]; do
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  [[ -z "${line// }" ]] && continue

  key="${line%%=*}"
  value="${line#*=}"
  key="${key// /}"
  value="${value#\"}"
  value="${value%\"}"

  case "$key" in
    NEXT_PUBLIC_APP_URL) continue ;;
    DATABASE_URL|DIRECT_URL|SUPABASE_SERVICE_ROLE_KEY|OPENAI_API_KEY|STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|CRON_SECRET|RESEND_API_KEY)
      add_env "$key" "$value" true
      ;;
    *)
      add_env "$key" "$value" false
      ;;
  esac
done < "$ENV_FILE"

echo ""
echo "Done. Redeploy with: vercel deploy --prod --yes"
echo "Health check: curl https://juicy-prop-firms.vercel.app/api/health"
