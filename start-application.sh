#!/bin/bash

set -e

echo "Building SQS Project Docker image..."
docker build -t sqs-project:latest ./backend

echo "Starting Docker Compose..."
docker-compose up -d

echo ""
echo "✓ Services started successfully!"
echo ""
echo "Application URL: http://localhost:8080"
echo "PostgreSQL: localhost:5432"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose down"
