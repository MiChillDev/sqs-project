#!/bin/bash

set -e

# Auto-detect container runtime
if command -v docker &>/dev/null; then
    COMPOSE="docker compose"
    RUNTIME="Docker"
elif command -v podman &>/dev/null; then
    COMPOSE="podman compose"
    RUNTIME="Podman"
else
    echo "Error: Neither Docker nor Podman found. Please install one of them."
    exit 1
fi

echo "Detected runtime: ${RUNTIME}"
echo ""
echo "Building and starting SQS Project..."
$COMPOSE up -d --build

echo ""
echo "✓ Services started successfully!"
echo ""
echo "Frontend:     http://localhost:5173"
echo "Backend API:  http://localhost:8080"
echo "PostgreSQL:   localhost:5432"
echo ""
echo "To view logs:"
echo "  ${COMPOSE} logs -f"
echo "  ${COMPOSE} logs -f frontend  # frontend only"
echo "  ${COMPOSE} logs -f app       # backend only"
echo ""
echo "To stop services:"
echo "  ${COMPOSE} down"
echo ""
echo "To rebuild after dependency changes:"
echo "  ${COMPOSE} up -d --build frontend"
