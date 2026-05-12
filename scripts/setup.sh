#!/usr/bin/env bash
# BeyondPrompt — one-shot setup script
# Usage: bash scripts/setup.sh
set -euo pipefail

# ── helpers ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓  $*${NC}"; }
warn() { echo -e "${YELLOW}⚠  $*${NC}"; }
die()  { echo -e "${RED}✗  $*${NC}"; exit 1; }
step() { echo -e "\n${BOLD}── $* ──${NC}"; }

# Ensure we always run from the repo root
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo -e "\n${BOLD}BeyondPrompt Setup${NC}"
echo "================================"

# ── 1. Prerequisites ──────────────────────────────────────────────────────────
step "1. Checking prerequisites"
command -v node  >/dev/null || die "Node.js not found — install from https://nodejs.org"
command -v npm   >/dev/null || die "npm not found"
ok "Node $(node -v) · npm $(npm -v)"

# ── 2. Environment (.env.local) ───────────────────────────────────────────────
step "2. Environment configuration"
ENV_FILE="apps/web/.env.local"

if [[ -f "$ENV_FILE" ]]; then
  ok "$ENV_FILE already exists — skipping credential prompts"
  # Load for DATABASE_URL usage below
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE" 2>/dev/null || true
  set +a
else
  echo ""
  echo "  Find these at: Supabase Dashboard → Your Project → Settings → API"
  echo ""
  read -rp  "  NEXT_PUBLIC_SUPABASE_URL        : " NEXT_PUBLIC_SUPABASE_URL
  read -rp  "  NEXT_PUBLIC_SUPABASE_ANON_KEY   : " NEXT_PUBLIC_SUPABASE_ANON_KEY
  read -rsp "  SUPABASE_SERVICE_ROLE_KEY       : " SUPABASE_SERVICE_ROLE_KEY
  echo ""
  echo ""
  echo "  Find this at: Settings → Database → Connection string → URI"
  echo "  (Use the direct connection, not the pooler)"
  read -rsp "  DATABASE_URL (postgres://...)    : " DATABASE_URL
  echo ""

  cat > "$ENV_FILE" <<EOF
NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
DATABASE_URL=${DATABASE_URL}
EOF
  ok "Created $ENV_FILE"
fi

# ── 3. Install dependencies ───────────────────────────────────────────────────
step "3. Installing dependencies"
npm ci
ok "Dependencies installed"

# ── 4. Database — migrations + seed ──────────────────────────────────────────
step "4. Database setup"
DB_URL="${DATABASE_URL:-}"

run_sql() {
  local label="$1" file="$2"
  echo "    → $label"
  psql "$DB_URL" --single-transaction -f "$file" -q 2>&1 \
    | grep -v "^$" \
    | sed 's/^/      /' \
    || die "Failed to apply $file — check your DATABASE_URL and try again"
}

if [[ -z "$DB_URL" ]]; then
  warn "DATABASE_URL not set — skipping automated DB setup"
  warn "Apply manually:"
  warn "  1. Open the Supabase SQL editor (Dashboard → SQL Editor)"
  warn "  2. Run each file in supabase/migrations/ in alphabetical order"
  warn "  3. Then run supabase/seed.sql"
elif command -v psql >/dev/null; then
  echo "  Applying migrations..."
  for f in supabase/migrations/*.sql; do
    run_sql "$(basename "$f")" "$f"
  done
  ok "Migrations applied"

  echo "  Seeding initial content..."
  run_sql "seed.sql" supabase/seed.sql
  ok "Database seeded"
else
  warn "psql not found — install PostgreSQL client tools to automate DB setup"
  warn "  macOS : brew install libpq && brew link --force libpq"
  warn "  Ubuntu: sudo apt install postgresql-client"
  warn ""
  warn "Or apply the SQL manually in the Supabase Dashboard SQL editor:"
  warn "  supabase/migrations/0001_initial_schema.sql"
  warn "  supabase/migrations/0002_rls_policies.sql"
  warn "  supabase/seed.sql"
fi

# ── 5. Verify build ───────────────────────────────────────────────────────────
step "5. Type-checking"
cd apps/web
npx tsc --noEmit
ok "No type errors"

# ── 6. Start dev server ───────────────────────────────────────────────────────
step "6. Starting dev server"
echo ""
echo -e "  ${GREEN}http://localhost:3000${NC}"
echo ""
npm run dev
