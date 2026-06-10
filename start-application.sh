#!/bin/bash

set -e

MODE="dev"
case "${1:-}" in
  --prod) MODE="prod" ;;
  --dev)  MODE="dev"  ;;
  "")     MODE="dev"  ;;
  *)
    echo "Usage: $0 [--dev|--prod]"
    echo "  --dev   Development mode (default) — Vite dev server with hot reload"
    echo "  --prod  Production mode — nginx serving optimized static build"
    exit 1
    ;;
esac

if docker compose ps -q 2>/dev/null | grep -q .; then
  echo "Stopping existing containers..."
  docker compose --profile prod down 2>/dev/null || true
  docker compose down 2>/dev/null || true
fi

echo "Building Docker images ($MODE mode)..."
if [[ "$MODE" == "prod" ]]; then
  docker compose --profile prod build frontend app postgres
else
  docker compose build frontend-dev app postgres
fi

echo "Starting Docker Compose ($MODE mode)..."
if [[ "$MODE" == "prod" ]]; then
  docker compose --profile prod up -d --wait postgres app frontend
else
  docker compose up -d --wait
fi

echo ""
echo "✓ Services started successfully! ($MODE mode)"
echo ""
echo "Frontend:     http://localhost:5173"
echo "Backend API:  http://localhost:8080"
echo "PostgreSQL:   localhost:5432"
echo ""
echo "To view logs:"
echo "  docker compose logs -f"
if [[ "$MODE" == "prod" ]]; then
  echo "  docker compose logs -f frontend      # production frontend (nginx)"
else
  echo "  docker compose logs -f frontend-dev  # dev frontend (Vite HMR)"
fi
echo "  docker compose logs -f app           # backend only"
echo ""
echo "To stop services:"
echo "  docker compose down"
echo "  ./stop-application.sh"
