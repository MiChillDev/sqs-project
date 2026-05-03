#!/bin/bash

set -e

echo "Building Docker images..."
docker compose build

echo "Starting Docker Compose..."
docker compose up -d

echo ""
echo "✓ Services started successfully!"
echo ""
echo "Frontend:     http://localhost:5173"
echo "Backend API:  http://localhost:8080"
echo "PostgreSQL:   localhost:5432"
echo ""
echo "To view logs:"
echo "  docker compose logs -f"
echo "  docker compose logs -f frontend  # frontend only"
echo "  docker compose logs -f app       # backend only"
echo ""
echo "To stop services:"
echo "  docker compose down"
