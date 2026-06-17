#!/bin/bash

set -e

PROJECT_NAME="${COMPOSE_PROJECT_NAME:-$(basename "$(pwd)")}"
NETWORK="${PROJECT_NAME}_sqs-network"

echo "Stopping Docker Compose services..."
docker compose down --remove-orphans 2>/dev/null || true

if docker network inspect "$NETWORK" >/dev/null 2>&1; then
  echo "Cleaning up lingering network attachments..."
  docker network inspect "$NETWORK" --format '{{range .Containers}}{{.Name}} {{end}}' 2>/dev/null | \
    xargs -r -n1 docker stop 2>/dev/null || true
  docker network rm "$NETWORK" 2>/dev/null || true
fi

echo ""
echo "✓ Services stopped successfully!"