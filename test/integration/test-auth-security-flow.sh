#!/bin/bash
set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'    # No Colour

# ── Paths ─────────────────────────────────────────────────────────────────────
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

SECRETS_DIR=".secrets"
ADMIN_USERNAME_SECRET="$SECRETS_DIR/app_seed_admin_username"
ADMIN_PASSWORD_SECRET="$SECRETS_DIR/app_seed_admin_password"

BASE_URL="http://localhost:8080/api/v1"
HEALTH_URL="$BASE_URL/health"
LOGIN_URL="$BASE_URL/auth/login"
JOKES_URL="$BASE_URL/jokes"
SOURCE_JOKE_URL="$BASE_URL/source-joke"

# ── Counters ──────────────────────────────────────────────────────────────────
PASS=0
FAIL=0

# ── Helpers ───────────────────────────────────────────────────────────────────
pass() {
  echo -e "${GREEN}PASS${NC}: $1"
  PASS=$((PASS + 1))
}

fail() {
  echo -e "${RED}FAIL${NC}: $1"
  FAIL=$((FAIL + 1))
}

read_secret() {
  local file="$1"
  tr -d '\r\n' < "$file"
}

# ── Cleanup ───────────────────────────────────────────────────────────────────
cleanup() {
  echo ""
  echo "Cleaning up..."
  ./stop-application.sh --reset --yes 2>/dev/null || true
}
trap cleanup EXIT

# ── Stage 0: Prerequisites ────────────────────────────────────────────────────
echo "── Stage 0: Checking prerequisites ──"

for cmd in docker curl; do
  if command -v "$cmd" >/dev/null 2>&1; then
    pass "Command '$cmd' is available"
  else
    fail "Command '$cmd' is not installed or not available in PATH"
  fi
done

if docker compose version >/dev/null 2>&1; then
  pass "Docker Compose plugin is available (docker compose)"
else
  fail "Docker Compose plugin is not available (docker compose)"
fi

if [[ $FAIL -gt 0 ]]; then
  echo ""
  echo "Prerequisites not met — aborting."
  exit 1
fi

# ── Stage 1: Start backend stack ──────────────────────────────────────────────
echo ""
echo "── Stage 1: Starting backend stack ──"

if ./start-application.sh --reset --backend-only --yes; then
  pass "Backend stack started successfully"
else
  fail "Backend stack failed to start"
  exit 1
fi

# ── Stage 2: Read secrets ─────────────────────────────────────────────────────
echo ""
echo "── Stage 2: Reading admin credentials from secrets ──"

if [[ ! -f "$ADMIN_USERNAME_SECRET" ]]; then
  fail "Secret file missing: $ADMIN_USERNAME_SECRET"
  exit 1
fi
if [[ ! -f "$ADMIN_PASSWORD_SECRET" ]]; then
  fail "Secret file missing: $ADMIN_PASSWORD_SECRET"
  exit 1
fi

ADMIN_USERNAME="$(read_secret "$ADMIN_USERNAME_SECRET")"
ADMIN_PASSWORD="$(read_secret "$ADMIN_PASSWORD_SECRET")"

if [[ -z "$ADMIN_USERNAME" ]]; then
  fail "Admin username secret is empty"
  exit 1
fi
pass "Admin username secret loaded"

if [[ -z "$ADMIN_PASSWORD" ]]; then
  fail "Admin password secret is empty"
  exit 1
fi
pass "Admin password secret loaded"

# ── Stage 3: Healthcheck ──────────────────────────────────────────────────────
echo ""
echo "── Stage 3: Waiting for health endpoint ──"

MAX_RETRIES=30
RETRY_INTERVAL=2
HEALTH_OK=false

for i in $(seq 1 $MAX_RETRIES); do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")

  if [[ "$HTTP_CODE" == "200" ]]; then
    HEALTH_OK=true
    break
  fi

  echo "  Attempt $i/$MAX_RETRIES — HTTP $HTTP_CODE — retrying in ${RETRY_INTERVAL}s..."
  sleep "$RETRY_INTERVAL"
done

if [[ "$HEALTH_OK" == "true" ]]; then
  pass "Health endpoint responded with HTTP 200 after $i attempts"
else
  fail "Health endpoint did not respond with HTTP 200 after $MAX_RETRIES attempts"
  exit 1
fi

# ── Stage 4: Correct login ────────────────────────────────────────────────────
echo ""
echo "── Stage 4: Correct login with seed admin credentials ──"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USERNAME\",\"password\":\"$ADMIN_PASSWORD\"}" 2>/dev/null)

HTTP_BODY=$(echo "$LOGIN_RESPONSE" | sed '$ d')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n 1)

if [[ "$HTTP_CODE" == "200" ]]; then
  pass "Correct login returned HTTP 200"
else
  fail "Correct login returned HTTP $HTTP_CODE (expected 200)"
fi

# Verify the response body contains a token
if echo "$HTTP_BODY" | grep -q '"token"'; then
  pass "Login response body contains 'token' field"
else
  fail "Login response body does not contain 'token' field"
fi

TOKEN="$(echo "$HTTP_BODY" | sed -n 's/.*"token"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"

if [[ -n "$TOKEN" ]]; then
  pass "Login token extracted"
else
  fail "Could not extract login token from response body"
  exit 1
fi

# ── Stage 5: Wrong password ───────────────────────────────────────────────────
echo ""
echo "── Stage 5: Wrong password login attempt ──"

WRONG_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USERNAME\",\"password\":\"wrong-password-123\"}" 2>/dev/null)

WRONG_BODY=$(echo "$WRONG_RESPONSE" | sed '$ d')
WRONG_CODE=$(echo "$WRONG_RESPONSE" | tail -n 1)

if [[ "$WRONG_CODE" == "404" ]]; then
  pass "Wrong password returned HTTP 404 as expected"
else
  fail "Wrong password returned HTTP $WRONG_CODE (expected 404)"
fi

# ── Stage 6: Public endpoint access ───────────────────────────────────────────
echo ""
echo "── Stage 6: Public endpoint access ──"

PUBLIC_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X GET "$JOKES_URL" 2>/dev/null)

PUBLIC_CODE=$(echo "$PUBLIC_RESPONSE" | tail -n 1)

if [[ "$PUBLIC_CODE" == "200" ]]; then
  pass "GET /jokes without authentication returned HTTP 200"
else
  fail "GET /jokes without authentication returned HTTP $PUBLIC_CODE (expected 200)"
fi

# ── Stage 7: Penetration test - protected endpoint without token ──────────────
echo ""
echo "── Stage 7: Penetration test - protected endpoint without token ──"

NO_AUTH_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "$JOKES_URL" \
  -H "Content-Type: application/json" \
  -d '{"content":"Security test joke","externalId":"security-no-auth"}' 2>/dev/null)

NO_AUTH_CODE=$(echo "$NO_AUTH_RESPONSE" | tail -n 1)

if [[ "$NO_AUTH_CODE" == "401" ]]; then
  pass "POST /jokes without Authorization header returned HTTP 401"
else
  fail "POST /jokes without Authorization header returned HTTP $NO_AUTH_CODE (expected 401)"
fi

# ── Stage 8: Penetration test - malformed Authorization header ────────────────
echo ""
echo "── Stage 8: Penetration test - malformed Authorization header ──"

MALFORMED_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "$JOKES_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: not-a-bearer-token" \
  -d '{"content":"Security test joke","externalId":"security-malformed-auth"}' 2>/dev/null)

MALFORMED_CODE=$(echo "$MALFORMED_RESPONSE" | tail -n 1)

if [[ "$MALFORMED_CODE" == "401" || "$MALFORMED_CODE" == "400" ]]; then
  pass "POST /jokes with malformed Authorization header returned HTTP $MALFORMED_CODE"
else
  fail "POST /jokes with malformed Authorization header returned HTTP $MALFORMED_CODE (expected 401 or 400)"
fi

# ── Stage 9: Penetration test - unknown Bearer token ──────────────────────────
echo ""
echo "── Stage 9: Penetration test - unknown Bearer token ──"

INVALID_TOKEN_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "$JOKES_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer definitely-invalid-token" \
  -d '{"content":"Security test joke","externalId":"security-invalid-token"}' 2>/dev/null)

INVALID_TOKEN_CODE=$(echo "$INVALID_TOKEN_RESPONSE" | tail -n 1)

if [[ "$INVALID_TOKEN_CODE" == "401" ]]; then
  pass "POST /jokes with unknown Bearer token returned HTTP 401"
else
  fail "POST /jokes with unknown Bearer token returned HTTP $INVALID_TOKEN_CODE (expected 401)"
fi

# ── Stage 10: Penetration test - protected endpoint with valid token ──────────
echo ""
echo "── Stage 10: Penetration test - protected endpoint with valid token ──"

VALID_TOKEN_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "$JOKES_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"content":"Security test joke from protected endpoint test","externalId":"security-valid-token"}' 2>/dev/null)

VALID_TOKEN_CODE=$(echo "$VALID_TOKEN_RESPONSE" | tail -n 1)

if [[ "$VALID_TOKEN_CODE" == "200" || "$VALID_TOKEN_CODE" == "201" ]]; then
  pass "POST /jokes with valid token returned HTTP $VALID_TOKEN_CODE"
else
  fail "POST /jokes with valid token returned HTTP $VALID_TOKEN_CODE (expected 200 or 201)"
fi

# ── Stage 11: Penetration test - source joke without token ────────────────────
echo ""
echo "── Stage 11: Penetration test - source joke endpoint without token ──"

SOURCE_NO_AUTH_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X GET "$SOURCE_JOKE_URL" 2>/dev/null)

SOURCE_NO_AUTH_CODE=$(echo "$SOURCE_NO_AUTH_RESPONSE" | tail -n 1)

if [[ "$SOURCE_NO_AUTH_CODE" == "401" ]]; then
  pass "GET /source-joke without Authorization header returned HTTP 401"
else
  fail "GET /source-joke without Authorization header returned HTTP $SOURCE_NO_AUTH_CODE (expected 401)"
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "────────────────────────────────────────────"
echo -e "Results: ${GREEN}$PASS passed${NC}, ${RED}$FAIL failed${NC}"
echo "────────────────────────────────────────────"

if [[ $FAIL -gt 0 ]]; then
  exit 1
fi

exit 0

