#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v pnpm &>/dev/null; then
  echo "Error: pnpm not found. Install pnpm first: npm install -g pnpm" >&2
  exit 1
fi

pnpm install --frozen-lockfile 2>/dev/null || pnpm install
pnpm run spell-check
