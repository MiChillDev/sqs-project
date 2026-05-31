#!/bin/bash

set -e

MODE="dev"
if [[ "${1:-}" == "--prod" ]]; then
  MODE="prod"
fi

if docker compose ps -q 2>/dev/null | grep -q .; then
  echo "Stopping existing containers..."
  docker compose --profile prod down 2>/dev/null || true
  docker compose down 2>/dev/null || true
fi

echo "Building Docker images..."
if [[ "$MODE" == "prod" ]]; then
  docker compose --profile prod build frontend app postgres
else
  docker compose build
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
echo "  docker compose logs -f frontend      # production frontend"
echo "  docker compose logs -f frontend-dev  # dev frontend"
echo "  docker compose logs -f app           # backend only"
echo ""
echo "To stop services:"
echo "  docker compose down"
echo "  ./stop-application.sh"
