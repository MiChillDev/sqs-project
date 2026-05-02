#!/bin/bash

set -e

echo "Building backend image..."
docker build -t sqs-project:latest ./backend

echo "Building frontend image..."
docker build -t sqs-frontend:latest ./frontend

echo "Starting Docker Compose..."
docker compose up -d --build

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
echo ""
echo "To rebuild after dependency changes:"
echo "  docker compose up -d --build frontend"
