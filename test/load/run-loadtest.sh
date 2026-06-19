#!/bin/bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

if [[ $# -ne 1 ]]; then
  echo "Usage: ./run-loadtest.sh tests/baseline-test.js" >&2
  exit 1
fi

TEST_SCRIPT="$1"

ADMIN_USERNAME_SECRET="../../.secrets/app_seed_admin_username"
ADMIN_PASSWORD_SECRET="../../.secrets/app_seed_admin_password"

if [[ ! -f "$ADMIN_USERNAME_SECRET" ]]; then
  echo "Error: Missing secret file: $ADMIN_USERNAME_SECRET" >&2
  echo "Start the backend stack first: ./start-application.sh --backend-only --yes" >&2
  exit 2
fi

if [[ ! -f "$ADMIN_PASSWORD_SECRET" ]]; then
  echo "Error: Missing secret file: $ADMIN_PASSWORD_SECRET" >&2
  echo "Start the backend stack first: ./start-application.sh --backend-only --yes" >&2
  exit 2
fi

K6_APP_SEED_ADMIN_USERNAME="$(tr -d '\r\n' < "$ADMIN_USERNAME_SECRET")"
K6_APP_SEED_ADMIN_PASSWORD="$(tr -d '\r\n' < "$ADMIN_PASSWORD_SECRET")"

if [[ -z "$K6_APP_SEED_ADMIN_USERNAME" ]]; then
  echo "Error: Seed admin username secret is empty." >&2
  exit 3
fi

if [[ -z "$K6_APP_SEED_ADMIN_PASSWORD" ]]; then
  echo "Error: Seed admin password secret is empty." >&2
  exit 3
fi

export K6_APP_SEED_ADMIN_USERNAME
export K6_APP_SEED_ADMIN_PASSWORD

if [[ "${CI:-}" == "true" ]]; then
  echo "::add-mask::$K6_APP_SEED_ADMIN_USERNAME"
  echo "::add-mask::$K6_APP_SEED_ADMIN_PASSWORD"
fi

docker compose --profile loadtest run --rm \
  -e K6_APP_SEED_ADMIN_USERNAME \
  -e K6_APP_SEED_ADMIN_PASSWORD \
  k6 run "$TEST_SCRIPT"